// src/api/api.ts
import axios from 'axios';


export const registerUser = async (userData: { customer_Name: string; customer_Email: string; customer_Password: string; customer_Telnum: string }) => {
  try {
    const response = await axios.post('http://localhost:3000/api/auth/register', userData);
    return response.data;
  } catch (error: any) {
    throw new Error('Error registering user: ' + error.message);
  }
};




