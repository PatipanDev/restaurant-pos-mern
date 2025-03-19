import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Slide, Typography, Card, CardContent, CardMedia, Button, IconButton, Box } from '@mui/material';
import { Add, Remove, ShoppingCart, Close } from '@mui/icons-material';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

interface FoodDetailProps {
  _id: string;  
  onClose: () => void;  // เพิ่มฟังก์ชันปิด
}

const FoodDetail: React.FC<FoodDetailProps> = ({ _id, onClose }) => {
  const [foodDetails, setFoodDetails] = useState<any>(null);
  const [error, setError] = useState<string>(''); 
  const [quantity, setQuantity] = useState(1); 
  const [slideIn, setSlideIn] = useState(true);
  const navigate = useNavigate(); 

  useEffect(() => {
    if (!_id) {
      setError('ไม่พบข้อมูลอาหาร'); 
      return;
    }

    axios.get(`${API_URL}/api/food/getFoodById/${_id}`)
      .then(response => {
        setFoodDetails(response.data);
      })
      .catch(error => {
        setError('ไม่สามารถโหลดข้อมูลอาหารได้');
        console.error('Error fetching food details:', error);
      });
  }, [_id]);

  if (error) return <div>{error}</div>; 
  if (!foodDetails) return <div>กำลังโหลด...</div>; 

  const handleIncrease = () => setQuantity(quantity + 1);
  const handleDecrease = () => quantity > 1 && setQuantity(quantity - 1);


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
            image={foodDetails.food_Image ? `${API_URL}/images/${foodDetails.food_Image}` : 'https://via.placeholder.com/150'}
            alt={foodDetails.food_Name}
            sx={{ height: '50%', objectFit: 'cover' }}
          />
          <CardContent>
            <Typography variant="h4">{foodDetails.food_Name}</Typography>
            <Typography variant="h5">ราคา: {foodDetails.food_Price} บาท</Typography>
            <Typography variant="body1">{foodDetails.description || 'ไม่มีรายละเอียดเพิ่มเติม'}</Typography>
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
              <Typography variant="h6">{quantity * foodDetails.food_Price}฿</Typography>
              <Button variant="contained" color="primary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', marginRight: 1, padding: 2, borderRadius: '5%' }} onClick={() => alert('Add to Cart')}>
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

export default FoodDetail;
