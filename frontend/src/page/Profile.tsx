import * as React from 'react';
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
import { Box, Fab, CssBaseline, Avatar} from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import { Navigate, useNavigate } from 'react-router-dom';
import WarningAlert from "../components/AlertDivWarn";
export default function NestedList() {
  const [open, setOpen] = React.useState(true);
  const navigate = useNavigate();

  const handleClick = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    // ลบข้อมูลการล็อกอินจาก localStorage
    localStorage.removeItem('user');

    
    
    // นำผู้ใช้ไปที่หน้า login
    setTimeout(()=>{
      navigate('/login')
    },2000)
    
  };

  return (
    <React.Fragment>
    <CssBaseline >
    <Box
      sx={{
        display: 'flex',               // ใช้ flexbox
        justifyContent: 'center',      // จัดให้อยู่ตรงกลางในแนวนอน
        alignItems: 'center',          // จัดให้อยู่ตรงกลางในแนวตั้ง
        height: 200,        
        width: '100%'        // ใช้ความสูงเต็มหน้าจอ
      }}
    >
      <Avatar sx={{ width: 150, height: 150 }} alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
    </Box>
    <List
      sx={{ 
        width: '100%', 
        height: '100%', // ทำให้ List มีความสูงเต็มหน้าจอ
        bgcolor: 'background.paper', 
        overflowY: 'auto', // เพิ่มการเลื่อนในแนวตั้งหากเนื้อหามากเกินไป
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
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
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
        position: 'fixed', // ใช้ fixed เพื่อให้ตำแหน่งคงที่
        bottom: 100,        // ตั้งระยะห่างจากด้านล่าง 16px
        right: 45,         // ตั้งระยะห่างจากด้านขวา 16px
        zIndex: 1000,      // เพิ่ม zIndex เพื่อให้ Fab อยู่เหนือเนื้อหาของหน้า
      }}
    >
      <Fab color="primary" aria-label="logout" onClick={handleLogout}>
        <LogoutIcon />
      </Fab>
    </Box>
    </CssBaseline>
    </React.Fragment>
  );
}