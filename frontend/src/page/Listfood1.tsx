import React from 'react'
import { Box, CssBaseline, Paper, Typography, Grid, Card, CardContent } from '@mui/material';

const foodItems2 = [
    { name: 'ก๋วยเตี๋ยว', description: 'ก๋วยเตี๋ยวน้ำใส สไตล์ไทย' },
    { name: 'สลัด', description: 'สลัดสดๆ พร้อมน้ำสลัดรสเด็ด' },
    { name: 'สเต็ก', description: 'สเต็กเนื้อร้อนๆ ย่างจนหอม' },
    { name: 'ข้าวผัด', description: 'ข้าวผัดหอมๆ พร้อมไข่ดาว' },
    { name: 'ก๋วยเตี๋ยว', description: 'ก๋วยเตี๋ยวน้ำใส สไตล์ไทย' },
    { name: 'สลัด', description: 'สลัดสดๆ พร้อมน้ำสลัดรสเด็ด' },
    { name: 'สเต็ก', description: 'สเต็กเนื้อร้อนๆ ย่างจนหอม' },
    { name: 'ข้าวผัด', description: 'ข้าวผัดหอมๆ พร้อมไข่ดาว' },
    { name: 'ก๋วยเตี๋ยว', description: 'ก๋วยเตี๋ยวน้ำใส สไตล์ไทย' },
    { name: 'สลัด', description: 'สลัดสดๆ พร้อมน้ำสลัดรสเด็ด' },
    { name: 'สเต็ก', description: 'สเต็กเนื้อร้อนๆ ย่างจนหอม' },
    { name: 'ข้าวผัด', description: 'ข้าวผัดหอมๆ พร้อมไข่ดาว' },
    { name: 'ก๋วยเตี๋ยว', description: 'ก๋วยเตี๋ยวน้ำใส สไตล์ไทย' },
    { name: 'สลัด', description: 'สลัดสดๆ พร้อมน้ำสลัดรสเด็ด' },
    { name: 'สเต็ก', description: 'สเต็กเนื้อร้อนๆ ย่างจนหอม' },
    { name: 'ข้าวผัด', description: 'ข้าวผัดหอมๆ พร้อมไข่ดาว' },
    { name: 'ก๋วยเตี๋ยว', description: 'ก๋วยเตี๋ยวน้ำใส สไตล์ไทย' },
    { name: 'สลัด', description: 'สลัดสดๆ พร้อมน้ำสลัดรสเด็ด' },
    { name: 'สเต็ก', description: 'สเต็กเนื้อร้อนๆ ย่างจนหอม' },
    { name: 'ข้าวผัด', description: 'ข้าวผัดหอมๆ พร้อมไข่ดาว' },
    
    
  ];

const Listfood = () => {
    return (
      <div>
        <Typography variant="h4" gutterBottom>
        รายการอาหาร
      </Typography>
      <Typography variant="body1" paragraph>
        รายการอาหารทั้งหมด
      </Typography>

      {/* รายการอาหาร */}
      <Grid container spacing={2}>
        {foodItems2.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      </div>
    );
  };
  
  export default Listfood;