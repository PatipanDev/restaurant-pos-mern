import React from 'react';
import { Typography, Button } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import { useNavigate } from 'react-router-dom';
import { SyncLoader } from 'react-spinners';

const LoginReminder = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',  // Horizontally center
        alignItems: 'center',      // Vertically center
        height: '100vh',           // Full viewport height
        flexDirection: 'column',   // Stack elements vertically
        textAlign: 'center',
        padding: '20px',
      }}
    >
      {/* Use SyncLoader as loading indicator */}
      <SyncLoader size={14} color="gray" />
      
      <Typography variant="h6" color="error" style={{ marginTop: '20px' }}>
        "กรุณาทำการล็อกอิน"
      </Typography>
      
      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: '20px' }}
        onClick={() => {
          alert('Redirect to Login page');
          navigate("/login");
        }}
        startIcon={<LoginIcon />}  // Adding the icon to the button
      >
        ล็อกอิน
      </Button>
    </div>
  );
};

export default LoginReminder;
