import React, { useState } from "react";
import axios from "axios";
import { Box, Button, Grid, Typography } from "@mui/material";
const API_URL = import.meta.env.VITE_API_URL;


interface MultiImageUploadProps {
  onChange: (files: File[]) => void;
}

const MultiImageUpload: React.FC<MultiImageUploadProps> = ({ onChange }) => {
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setSelectedFiles(fileArray); // เก็บไว้ใช้ตอนอัปโหลด

      onChange(fileArray); // ส่งกลับไป parent

      const previews = fileArray.map(file => URL.createObjectURL(file));
      setPreviewImages(previews);
    }
  };

  const uploadImages = async () => {
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("imagesfood", file); // หรือใช้ชื่ออื่นตาม backend รองรับ
    });

    try {
      const res = await axios.post(`${API_URL}/api/setting/postImageFood`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("อัปโหลดสำเร็จ:", res.data);
    } catch (err) {
      console.error("เกิดข้อผิดพลาดในการอัปโหลด:", err);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        อัปโหลดภาพอาหารแนะนำ (หลายรูป)
      </Typography>
      <Button variant="contained" component="label">
        เลือกรูปภาพ
        <input
          hidden
          accept="image/*"
          multiple
          type="file"
          onChange={handleImageChange}
        />
      </Button>

      <Button
        onClick={uploadImages}
        variant="outlined"
        color="primary"
        sx={{ ml: 2 }}
        disabled={selectedFiles.length === 0}
      >
        อัปโหลด
      </Button>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {previewImages.map((src, index) => (
          <Grid item xs={4} key={index}>
            <img
              src={src}
              alt={`Preview ${index}`}
              style={{ width: "100%", height: "auto", borderRadius: 8 }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MultiImageUpload;
