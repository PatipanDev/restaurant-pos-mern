const API_URL = import.meta.env.VITE_API_URL;

import * as React from 'react';
import { useState } from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import { Box, Fab, CssBaseline, Avatar } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import WarningAlert from "../../components/AlertDivWarn";
import SuccessAlert from '../../components/AlertSuccess';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import axios from 'axios';
import LoginReminder from '../../components/LoginReminder';


import useProtectedPage from '../../ProtectedPage';
import { getUserRole } from '../../utils/userUtils';

export default function Profile() {
  const [openCollapse, setOpenCollapse] = React.useState(true); // เปลี่ยนชื่อให้แตกต่างจาก Dialog
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState<React.ReactNode | null>(null);
  const [succesMessage, setSuccAlertMessage] = useState<React.ReactNode | null>(null);
  const [openDialog, setOpenDialog] = React.useState(false);

  // const protection = useProtectedPage(getUserRole());  // เรียกใช้งานฟังก์ชัน
  // console.log('ระดับผู้ใช้',getUserRole())
  // if (protection === false) return <LoginReminder/>;  // ถ้าไม่ได้รับการอนุญาตจะถูก redirect ไปหน้า login

  // เปิด/ปิดลิสต์เมนู
  const handleClick = () => {
    setOpenCollapse(!openCollapse);
  };

  // ฟังก์ชันล็อกเอาท์
  const handleLogout = () => {
    handleClickOpen(); // เปิด Dialog แจ้งเตือน
    // ลบข้อมูลการล็อกอินจาก localStorage
  };

  // เปิด Dialog
  const handleClickOpen = () => {
     setOpenDialog(true);
  };

  // ปิด Dialog
  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleConfirm = async () => {
    try {
      await axios.post(`${API_URL}/api/logout`, {}, { withCredentials: true });
      localStorage.removeItem('user'); // ลบข้อมูลผู้ใช้
      setSuccAlertMessage(<div>ล็อกเอาท์ออกจากระบบเรียบร้อย</div>);
      setOpenDialog(false);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error("Logout failed", error);
    }
    
  };

  return (
    <React.Fragment>
      <CssBaseline >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 200,
            width: '100%'
          }}
        >
          <Avatar sx={{ width: 150, height: 150 }} alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
        </Box>
        <List
          sx={{
            width: '100%',
            height: '100%',
            bgcolor: 'background.paper',
            overflowY: 'auto',
          }}
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Menu Setting
            </ListSubheader>
          }
        >
          <ListItemButton>
            <ListItemIcon>
              <SendIcon />
            </ListItemIcon>
            <ListItemText primary="Sent mail" />
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <DraftsIcon />
            </ListItemIcon>
            <ListItemText primary="Drafts" />
          </ListItemButton>
          <ListItemButton onClick={handleClick}>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="Inbox" />
            {openCollapse ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openCollapse} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <StarBorder />
                </ListItemIcon>
                <ListItemText primary="Starred" />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
        <Box
          sx={{
            position: 'fixed',
            bottom: 100,
            right: 45,
            zIndex: 1000,
          }}
        >
          <Fab color="primary" aria-label="logout" onClick={handleLogout}>
            <LogoutIcon />
          </Fab>
        </Box>

        {/* Dialog for Logout Confirmation */}
        <Dialog
          open={openDialog}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>คุณต้องการออกจากระบบใช่หรือไม่</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              {alertMessage}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>ยกเลิก</Button>
            <Button onClick={handleConfirm}>ใช่</Button>
          </DialogActions>
        </Dialog>

        {/* Warning Alert */}
        <WarningAlert messagealert={alertMessage} />
        <SuccessAlert successalert={succesMessage}/>
        
      </CssBaseline>
    </React.Fragment>
  );
}
