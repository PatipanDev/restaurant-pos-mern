import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Slide, Typography, Card, CardContent, CardMedia, Button, IconButton, Box, TextField } from '@mui/material';
import { Add, Remove, ShoppingCart, Close } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import SuccessAlert from '../components/AlertSuccess';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import axios from 'axios';

import { getUserId } from '../utils/userUtils';
const API_URL = import.meta.env.VITE_API_URL;

interface FoodDetailProps {
  _id: string;
  onClose: () => void;  // เพิ่มฟังก์ชันปิด
}

interface FormDetail {
  orderDetail_More?: string | undefined;
}

const schema = yup.object({
  orderDetail_More: yup.string()
}).required();


const user_id: string = getUserId()


const FoodDetail: React.FC<FoodDetailProps> = ({ _id, onClose }) => {
  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormDetail>({
    resolver: yupResolver(schema),
  });
  const [foodDetails, setFoodDetails] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [slideIn, setSlideIn] = useState(true);
  const [alertSuccess, setAlertSuccess] = useState<React.ReactNode | null>(null);
  // const navigate = useNavigate(); 

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


  const onSubmit = async (data: FormDetail) => {
    try {
      const orderData = {
        customer_Id: user_id,
        ...data,
        food_Id: foodDetails._id,
        orderDetail_Quantity: quantity,
      };
      console.log()
      console.log('Order Data:', orderData);
      console.log('Form Data:', data);

      // ส่งข้อมูลไปยัง API โดยใช้ Axios
      const response = await axios.post(`${API_URL}/api/food/createOrderFoodDetail`, orderData); // แทนที่ '/api/order-details' ด้วย URL API ของคุณ


      setAlertSuccess(<div>สั่งอาหารสำเร็จ</div>)

      console.log('API Response:', response.data); // แสดงข้อมูลที่ได้รับจาก API
      setTimeout(() => {
        handleClose();
      }, 2000);
      // alert('Order Submitted Successfully!'); // แจ้งเตือนเมื่อส่งข้อมูลสำเร็จ

    } catch (error: any) {
      console.error('Error submitting order:', error);
      alert(error.response.messege); // แจ้งเตือนเมื่อเกิดข้อผิดพลาด
    }
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent>
              <Typography variant="h4">{foodDetails.food_Name}</Typography>
              <Typography variant="h5">ราคา: {foodDetails.food_Price} บาท</Typography>
              <Typography variant="body1">{foodDetails.description || 'ไม่มีรายละเอียดเพิ่มเติม'}</Typography>

              <Controller
                name="orderDetail_More"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="string"
                    label="เพิ่มเติม"
                    fullWidth
                    margin="dense"
                    error={!!errors.orderDetail_More}
                    helperText={errors.orderDetail_More?.message}
                  />
                )}
              />
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
                <Button type="submit" variant="contained" color="primary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', marginRight: 1, padding: 2, borderRadius: '5%' }}>
                  <ShoppingCart sx={{ marginRight: 2 }} />ใส่ตะกร้า
                </Button>
              </Box>
            </Box>
          </form>

          <SuccessAlert successalert={alertSuccess} />

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
