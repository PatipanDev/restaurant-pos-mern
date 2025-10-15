import React, { useState, useEffect } from 'react';
import { 
  TextField, Typography, Grid, Card, CardContent, CardMedia, 
  Tabs, Tab
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

import FoodDetail from './FoodDetail';
import DrinkDetail from './DrinkDetail';

const API_URL = import.meta.env.VITE_API_URL;

// Define types
interface FoodItem {
  _id: string;
  food_Name: string;
  food_Price: number;
  food_Image: string;
}

interface DrinkItem {
  _id: string;
  drink_Name: string;
  drink_Price: number;
  drink_Image: string;
}

const Listfood: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>(''); 
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]); 
  const [drinkItems, setDrinkItems] = useState<DrinkItem[]>([]); 
  const [tabIndex, setTabIndex] = useState(0); // แท็บที่เลือก
  const navigate = useNavigate();
  const location = useLocation(); // ใช้ useLocation เพื่อดึงข้อมูลจาก URL

  // ใช้ในการเปิดหน้าใหม่
  const [selectedFoodId, setSelectedFoodId] = useState<string | null>(null);
  const [selectedDrinkId, setSelectedDrinkId] = useState<string | null>(null);

  useEffect(() => {
    // ตรวจสอบค่าใน URL และตั้งค่า tabIndex ให้ตรง
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    if (tab === 'food') {
      setTabIndex(0); // ถ้า tab เป็น food
    } else if (tab === 'drink') {
      setTabIndex(1); // ถ้า tab เป็น drink
    }

    axios.get(`${API_URL}/api/food/getfoods`)
      .then(response => setFoodItems(response.data))
      .catch(error => console.error('Error fetching food data:', error));

    axios.get(`${API_URL}/api/food/getdrinks`)
      .then(response => setDrinkItems(response.data))
      .catch(error => console.error('Error fetching drink data:', error));
  }, [location]); // ใช้ location ใน useEffect เพื่อให้ค่า tabIndex อัพเดตตาม URL

  // Filter items based on search term
  const filteredFood = foodItems.filter(item =>
    item.food_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.food_Price.toString().includes(searchTerm)
  );

  const filteredDrinks = drinkItems.filter(item =>
    item.drink_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.drink_Price.toString().includes(searchTerm)
  );

  // Handle click to navigate
  const handleFoodClick = (foodId: string) => {
    setSelectedFoodId(foodId); // เปิด Modal พร้อมส่งค่า
  };

  const closeFoodDetail = () => {
    setSelectedFoodId(null); // ปิด Modal
  };

  const handleDrinkClick = (drinkId: string) => {
    setSelectedDrinkId(drinkId); // เปิด Modal พร้อมส่งค่า
  };

  const closeDrinkDetail = () => {
    setSelectedDrinkId(null); // ปิด Modal
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    // อัปเดต URL ให้ตรงกับ tab ที่เลือก
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('tab', newValue === 0 ? 'food' : 'drink');
    navigate({ search: searchParams.toString() }); // เปลี่ยน URL แต่ไม่ reload หน้า
  };

  return (
    <div>
      {/* Render food/drink details modals only when needed */}
      {selectedFoodId || selectedDrinkId ? (
        <div> 
          {selectedFoodId && <FoodDetail _id={selectedFoodId} onClose={closeFoodDetail} />}
          {selectedDrinkId && <DrinkDetail _id={selectedDrinkId} onClose={closeDrinkDetail} />}
        </div>
      ) : (
        <>
          <Typography variant="h4" gutterBottom>เมนูอาหารและเครื่องดื่ม</Typography>

          {/* Tabs */}
          <Tabs value={tabIndex} onChange={handleTabChange}>
            <Tab label="อาหาร" />
            <Tab label="เครื่องดื่ม" />
          </Tabs>

          {/* Search input */}
          <TextField
            label="ค้นหาสินค้า"
            variant="outlined"
            fullWidth
            margin="normal"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* แสดงผลตามแท็บที่เลือก */}
          {tabIndex === 0 ? (
            <Grid container spacing={2}>
              {filteredFood.map((item) => (
                <Grid item xs={6} sm={6} md={4} key={item._id}>
                  <Card sx={{ height: '100%' }} onClick={() => handleFoodClick(item._id)}>
                    <CardMedia
                      component="img"
                      sx={{ width: '100%', height: 'auto', aspectRatio: '1' }}
                      image={item.food_Image ? `${API_URL}/images/${item.food_Image}` : 'https://via.placeholder.com/150'}
                      alt={item.food_Name}
                    />
                    <CardContent>
                      <Typography variant="h6">{item.food_Name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        ราคา: {item.food_Price} บาท
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid container spacing={2}>
              {filteredDrinks.map((item) => (
                <Grid item xs={6} sm={6} md={4} key={item._id}>
                  <Card sx={{ height: '100%' }} onClick={() => handleDrinkClick(item._id)}>
                    <CardMedia
                      component="img"
                      sx={{ width: '100%', height: 'auto', aspectRatio: '1' }}
                      image={item.drink_Image ? `${API_URL}/imagesdrink/${item.drink_Image}` : 'https://via.placeholder.com/150'}
                      alt={item.drink_Name}
                    />
                    <CardContent>
                      <Typography variant="h6">{item.drink_Name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        ราคา: {item.drink_Price} บาท
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </div>
  );
};

export default Listfood;
