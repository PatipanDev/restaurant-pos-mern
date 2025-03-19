import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Slide, Typography, Card, CardContent, CardMedia, Button, IconButton, Box } from '@mui/material';
import { Add, Remove, ShoppingCart, Close } from '@mui/icons-material';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

interface DrinkDetailProps {
  _id: string | null;  
  onClose: () => void;  // เพิ่มฟังก์ชันปิด
}

const DrinkDetail: React.FC<DrinkDetailProps> = ({ _id, onClose }) => {
  const [drinkDetails, setDrinkDetails] = useState<any>(null);
  const [error, setError] = useState<string>(''); // State to handle error messages
  const [quantity, setQuantity] = useState(1); // State for item quantity
  const [slideIn, setSlideIn] = useState(true); // State to control the slide animation
  const navigate = useNavigate(); // ✅ ใช้ navigate เพื่อเปลี่ยนหน้า

  useEffect(() => {
    if (!_id) {
      setError('ไม่พบข้อมูลเครื่องดื่ม'); // Handle the case where _id is not available
      return;
    }

    axios.get(`${API_URL}/api/food/getDrinkById/${_id}`)
      .then(response => {
        setDrinkDetails(response.data);
      })
      .catch(error => {
        setError('ไม่สามารถโหลดข้อมูลเครื่องดื่มได้');
        console.error('Error fetching drink details:', error);
      });
  }, [_id]);

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', padding: 2 }}>
        <Typography variant="h6" color="error">{error}</Typography>
      </Box>
    ); // Display error message in a user-friendly manner
  }

  if (!drinkDetails) {
    return <div>กำลังโหลด...</div>; // Loading state
  }

  // Functions to handle quantity changes
  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleClose = () => {
    setSlideIn(false);
    setTimeout(() => {
      onClose(); // เรียกฟังก์ชันที่ส่งมาจาก props
    }, 250);
  };

  return (
    <Slide direction="left" in={slideIn} mountOnEnter unmountOnExit>
      <div>
        <Card sx={{ width: '100%', height: '100vh', margin: 0, position: 'relative' }}>
          <CardMedia
            component="img"
            image={drinkDetails.drink_Image ? `${API_URL}/imagesdrink/${drinkDetails.drink_Image}` : 'https://via.placeholder.com/150'}
            alt={drinkDetails.drink_Name}
            sx={{ height: '50%', objectFit: 'cover' }}
          />
          <CardContent>
            <Typography variant="h4">{drinkDetails.drink_Name}</Typography>
            <Typography variant="h5">ราคา: {drinkDetails.drink_Price} บาท</Typography>
            <Typography variant="body1">{drinkDetails.description || 'ไม่มีรายละเอียดเพิ่มเติม'}</Typography>
          </CardContent>

          <Box sx={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            padding: 3,
            backgroundColor: 'white',
            boxShadow: 3,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', marginLeft: 1, width: '40%' }}>
                <IconButton onClick={handleDecrease} color="primary" sx={{ backgroundColor: '#f0f0f0', borderRadius: '50%' }}>
                  <Remove />
                </IconButton>
                <Typography variant="h6">{quantity}</Typography>
                <IconButton onClick={handleIncrease} color="primary" sx={{ backgroundColor: '#f0f0f0', borderRadius: '50%' }}>
                  <Add />
                </IconButton>
              </Box>
              <Typography variant="h6">{quantity * drinkDetails.drink_Price}฿</Typography>
              <Button variant="contained" color="primary" sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', marginRight: 1, padding: 2, borderRadius: '5%' }} onClick={() => alert('Add to Cart')}>
                <ShoppingCart sx={{ marginRight: 2 }} />ใส่ตะกร้า
              </Button>
            </Box>
          </Box>

          <IconButton
            sx={{
              position: 'absolute',
              top: 10,
              left: 10,
              zIndex: 10,
              backgroundColor: '#ffffff'
            }}
            onClick={handleClose}
            color="primary"
          >
            <Close />
          </IconButton>
        </Card>
      </div>
    </Slide>
  );
};

export default DrinkDetail;
