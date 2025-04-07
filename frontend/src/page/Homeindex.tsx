import { Button, Container, Grid, Typography, Card, CardContent, CardMedia, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import LoginIcon from '@mui/icons-material/Login';
const API_URL = import.meta.env.VITE_API_URL;

import React, { Suspense, useState, useEffect } from 'react';
import axios from "axios";
import { getUserId } from "../utils/userUtils";
import Footer from "./owner/component/Footer";

const bannerImage = "/images/banner.jpg";

const foods = [
  { name: "ข้าวมันไก่", image: "/images/food1.jpg" },
  { name: "ผัดไทย", image: "/images/food2.jpg" },
  { name: "ต้มยำกุ้ง", image: "/images/food3.jpg" },
];

interface WebsiteData {
  _id: string;
  websiteName: string;
  websiteDescription: string;
  phoneNumber: string;
  eMail: string;
  facebookAccount: string;
  lineId: string;
  xAccount: string;
  instagramAccount: string;
  address: string;
  primaryColor: string;
  secondaryColor: string;
  otherContact?: string;
  bannerImage: string;
  recommendedFoods: [string];
}

const HomeIndex = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string>("");
  const [dataweb, setDataweb] = useState<WebsiteData | null>(null);

  const id = getUserId();

  useEffect(() => {
    axios.get(`${API_URL}/api/setting/getDataShow`)
      .then(response => {
        console.log("📦 Data ที่ได้จาก API:", response.data); // <--- ลอกออกมาดู
        setDataweb(response.data.settingweb);
      })
      .catch(error => console.error('Error fetching food data:', error));

  }, []); // ใช้ location ใน useEffect เพื่อให้ค่า tabIndex อัพเดตตาม URL

  console.log(dataweb?.bannerImage)


  return (

    <Container>
      {(!id) ? (
        <Grid container justifyContent="space-between" alignItems="center" sx={{ my: 2 }}>
          <Typography variant="h4">{dataweb?.websiteName}</Typography>
          <div>
            <Button variant="contained" color="primary" startIcon={<LoginIcon />} sx={{ mx: 1 }} onClick={() => navigate("/login")}>
              ล็อกอิน
            </Button>
            <Button variant="outlined" color="primary" onClick={() => navigate("/register")}>
              สมัครสมาชิก
            </Button>
          </div>
        </Grid>
      ) : null}
      {/* Header */}
      {/* Banner Image */}

      <Box sx={{ width: '100%', height: '190px', overflow: 'hidden' }}>
        <img
          src={`${API_URL}/imagesetting/${dataweb?.bannerImage}` || '/default-banner.jpg'} // ใช้ optional chaining
          alt="Banner"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Box>

      {/* Title */}
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', marginTop: 4 }}>
        ยินดีต้อนรับสู่เว็บไซต์ร้าน {dataweb?.websiteName}
      </Typography>
      <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary', maxWidth: 600, mx: 'auto', marginBottom: 4 }}>
        {dataweb?.websiteDescription}
      </Typography>

      {/* Food List */}
      <Typography variant="h5" sx={{ my: 2 }}>
        เมนูยอดนิยม
      </Typography>

      <Grid container spacing={2}>
        {dataweb?.recommendedFoods?.map((imgUrl, index) => (
          <Grid item xs={6} sm={4} key={index}> {/* ปรับ xs เป็น 6 เพื่อให้มี 2 คอลัมบนจอมือถือ */}
            <Card sx={{ position: 'relative', aspectRatio: '1/1' }}> {/* เพิ่ม aspectRatio เพื่อทำเป็นจัตุรัส */}
              <CardMedia
                component="img"
                image={`${API_URL}/imagesetting/${imgUrl}`}
                alt="อาหารแนะนำ"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Card>
          </Grid>
        ))}
      </Grid>
      <Footer dataweb={dataweb} />
    </Container>
  );
};

export default HomeIndex;