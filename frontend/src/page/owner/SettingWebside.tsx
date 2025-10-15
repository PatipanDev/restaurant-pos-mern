import React, { useState } from 'react';
import { Box, Typography, Divider } from "@mui/material";
import UploadIconWeb from './component/SettingUploadIconWeb';
import UploadBanner from './component/SettingUploadBanner';
import WebsiteInfoForm from './component/SettingWebsiteInfoForm';
import MultiImageUpload from './component/SettingMultiImageUpload';


const SettingWebside: React.FC = () => {
    const [_, setImages] = useState<File[]>([]);


    const handleFileChange = (file: File) => {
        console.log("ไฟล์ที่อัพโหลด:", file);
        // ทำการส่งไฟล์ไปยังเซิร์ฟเวอร์ หรือเก็บไฟล์ไว้ใน state
    };


    return (
        <Box sx={{ width: "80vw", height: "90%", display: "flex",flexDirection: 'column'}}>
            <Typography variant="h5" sx={{ margin: 2, flex: 1, textAlign: 'left' }}>
                ตั้งค่าเว็บไซต์
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Box sx={{ margin: 2, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                <Typography variant="h6" sx={{ margin: 2, textAlign: 'left' }}>
                    อัพโหลดไอคอนเว็บไซต์
                </Typography>
                <UploadIconWeb onFileChange={handleFileChange} />
            </Box>
            <Box>
                <WebsiteInfoForm/>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ margin: 2, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                <Typography variant="h6" sx={{ margin: 2, textAlign: 'left' }}>
                    อัพโหลดแบนเนอร์
                </Typography>
                <UploadBanner onFileChange={handleFileChange} />
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ p: 3 }}>
                <MultiImageUpload onChange={setImages} />
            </Box>
        </Box>
    );
}

export default SettingWebside;