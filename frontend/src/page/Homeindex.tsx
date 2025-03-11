import React from "react";
import { Button, Container, Grid, Typography, Card, CardContent, CardMedia,Box} from "@mui/material";
import { useNavigate } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import LoginIcon from '@mui/icons-material/Login';



const bannerImage = "/images/banner.jpg";

const foods = [
  { name: "ข้าวมันไก่", image: "/images/food1.jpg" },
  { name: "ผัดไทย", image: "/images/food2.jpg" },
  { name: "ต้มยำกุ้ง", image: "/images/food3.jpg" },
];

const Home = () => {
  const navigate = useNavigate();
  return (
    <Container>
      {/* Header */}
      <Grid container justifyContent="space-between" alignItems="center" sx={{ my: 2 }}>
        <Typography variant="h4">ร้านอาหารแนะนำ</Typography>
        <div>
          <Button variant="contained" color="primary" startIcon={<LoginIcon />} sx={{ mx: 1 }} onClick={() => navigate("/login")}>
            ล็อกอิน
          </Button>
          <Button variant="outlined" color="primary" onClick={() => navigate("/register")}>
            สมัครสมาชิก
          </Button>
        </div>
      </Grid>

  
      {/* Banner Image */}
      <Box sx={{ width: '100%', height: '300px', overflow: 'hidden' }}>
        <img 
          src={bannerImage} 
          alt="Banner" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
      </Box>

      {/* Title */}
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', marginTop: 4 }}>
        ยินดีต้อนรับสู่เว็บไซต์ของเรา
      </Typography>

      {/* Food List */}
      <Typography variant="h5" sx={{ my: 2 }}>
        เมนูยอดนิยม
      </Typography>
      <Grid container spacing={2}>
        {foods.map((food, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Card>
              <CardMedia component="img" height="140" image={food.image} alt={food.name} />
              <CardContent>
                <Typography variant="h6">{food.name}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;