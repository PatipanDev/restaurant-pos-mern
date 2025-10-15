const API_URL = import.meta.env.VITE_API_URL;

import React, { useState } from "react";
import { Button, Box, Typography} from "@mui/material";
import UploadIcon from '@mui/icons-material/Upload'; // ใช้ไอคอนจาก MUI
import axios from "axios";
import SuccessAlert from "../../../components/AlertSuccess";

interface UploadIconButtonProps {
  onFileChange: (file: File) => void;
}

const UploadIconWeb: React.FC<UploadIconButtonProps> = ({ onFileChange }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [alertSuccess, setAlertSuccess] = useState<React.ReactNode | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileChange(file);

      const formData = new FormData();
      formData.append('icon', file); // ชื่อ 'icon' ต้องตรงกับที่ Node.js รอรับ

      axios.post(`${API_URL}/api/setting/postImageIcon`, formData)
        .then(res => {
          console.log('อัปโหลดสำเร็จ:', res.data);

        })
        .catch(err => {
          console.error('อัปโหลดล้มเหลว:', err);
        });

      setAlertSuccess(<div>อัปโหลดสำเร็จ</div>)
    }
  };

  return (
    <Box sx={{ textAlign: "center", my: 2 }}>
      <input
        type="file"
        accept="image/*" // หรือกำหนดประเภทไฟล์ที่ต้องการให้เลือก
        style={{ display: "none" }}
        id="upload-icon-button"
        onChange={handleFileChange}
      />
      <label htmlFor="upload-icon-button">
        <Button
          variant="contained"
          color="primary"
          component="span"
          startIcon={<UploadIcon />}
        >
          อัพโหลดไอคอน
        </Button>
      </label>

      {/* แสดงชื่อไฟล์ที่เลือก */}
      {selectedFile && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          ไฟล์ที่เลือก: {selectedFile.name}
        </Typography>
      )}
      <SuccessAlert successalert={alertSuccess} />
    </Box>
  );
};

export default UploadIconWeb;
