import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function MailPage() {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Mail Page
      </Typography>
      <Typography variant="body1">
        นี่คือหน้าจดหมาย คุณสามารถเพิ่มเนื้อหาเพิ่มเติมที่นี่
      </Typography>
    </Box>
  );
}
