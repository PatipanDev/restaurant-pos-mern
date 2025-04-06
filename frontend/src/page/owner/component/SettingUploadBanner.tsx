import React, { useState } from "react";
import axios from "axios";
import { Button, Box, Typography, Card, CardMedia } from "@mui/material";
import UploadIcon from '@mui/icons-material/Upload';
import SuccessAlert from "../../../components/AlertSuccess";

interface UploadBannerProps {
  onFileChange?: (file: File) => void; // เปลี่ยนเป็น optional
}

const UploadBanner: React.FC<UploadBannerProps> = ({ onFileChange }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string>("");

  const [alertSuccess, setAlertSuccess] = useState<React.ReactNode | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
    onFileChange?.(file); // ถ้ามี onFileChange ก็เรียก

    // ส่งไฟล์ผ่าน axios
    const formData = new FormData();
    formData.append("banner", file); // ต้องตรงกับ field name ที่ backend รับ

    try {
      const response = await axios.post("/api/setting/postImageBanner", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUploadMessage("อัปโหลดสำเร็จ: " + response.data.filename);
      setAlertSuccess(<div>อัปโหลดสำเร็จ</div>)
    } catch (error: any) {
      console.error("อัปโหลดล้มเหลว:", error);
      setUploadMessage("อัปโหลดล้มเหลว: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Box sx={{ textAlign: "center", my: 2 }}>
      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        id="upload-banner"
        onChange={handleFileChange}
      />
      <label htmlFor="upload-banner">
        <Button
          variant="contained"
          color="primary"
          component="span"
          startIcon={<UploadIcon />}
        >
          อัพโหลดแบนเนอร์
        </Button>
      </label>

      {previewUrl && (
        <Card sx={{ mt: 2 }}>
          <CardMedia
            component="img"
            height="200"
            image={previewUrl}
            alt="Banner Preview"
          />
        </Card>
      )}

      {selectedFile && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          ไฟล์ที่เลือก: {selectedFile.name}
        </Typography>
      )}

      {uploadMessage && (
        <Typography variant="body2" color="secondary" sx={{ mt: 1 }}>
          {uploadMessage}
        </Typography>
      )}
      <SuccessAlert successalert={alertSuccess} />

    </Box>
  );
};

export default UploadBanner;
