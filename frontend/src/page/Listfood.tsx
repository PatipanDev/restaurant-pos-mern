const API_URL = import.meta.env.VITE_API_URL;

import React, { useState, useEffect } from 'react';
import { TextField, Typography, Grid, Card, CardContent, CardMedia } from '@mui/material';
import axios from 'axios';

// Define a type for the food items
interface FoodItem {
  food_Name: string;
  food_Price: number;
  food_Image: string;
}

const Listfood: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>(''); // Search term state
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]); // Food items state

  useEffect(() => {
    // Fetch data from API
    axios.get(`${API_URL}/api/food/getfoods`)
      .then(response => {
        setFoodItems(response.data); // Set the data to foodItems state
      })
      .catch(error => {
        console.error('Error fetching food data:', error);
      });
  }, []);

  // Filter food items based on search term
  const filteredFood = foodItems.filter(item =>
    item.food_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.food_Price.toString().includes(searchTerm)
  );

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        รายการอาหาร
      </Typography>

      {/* Search input */}
      <TextField
        label="ค้นหาอาหารหรือราคา"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Food items list */}
      <Grid container spacing={2}>
        {/* Show actual food items when loaded */}
        {filteredFood.map((item, index) => (
          <Grid item xs={6} sm={6} md={4} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                height="140"
                image={`${API_URL}/images/${item.food_Image}` || 'https://via.placeholder.com/150'}
                alt={item.food_Name}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {item.food_Name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ราคา: {item.food_Price} บาท
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
