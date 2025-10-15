import { Box, Typography, IconButton, Stack } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LineAxisIcon from '@mui/icons-material/Timeline'; // ใช้แทน Line


interface FooterProps {
  dataweb: any;
}

const Footer: React.FC<FooterProps> = ({ dataweb }) => {
  return (
    <Box sx={{ bgcolor: '#fffff', p: 3, mt: 4 }}>
      <Stack spacing={1}>
        <Typography variant="body1" fontWeight="bold">
          ติดต่อเรา
        </Typography>

        <Stack direction="row" alignItems="center" spacing={1}>
          <PhoneIcon fontSize="small" />
          <Typography variant="body2">{dataweb?.phoneNumber || '-'}</Typography>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1}>
          <EmailIcon fontSize="small" />
          <Typography variant="body2">{dataweb?.eMail || '-'}</Typography>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1}>
          <LocationOnIcon fontSize="small" />
          <Typography variant="body2">{dataweb?.address || '-'}</Typography>
        </Stack>

        <Stack direction="row" spacing={1} mt={1}>
          {dataweb?.facebookAccount && (
            <IconButton href={dataweb.facebookAccount} target="_blank" size="small">
              <FacebookIcon />
            </IconButton>
          )}
          {dataweb?.instagramAccount && (
            <IconButton href={dataweb.instagramAccount} target="_blank" size="small">
              <InstagramIcon />
            </IconButton>
          )}
          {dataweb?.xAccount && (
            <IconButton href={dataweb.xAccount} target="_blank" size="small">
              <XIcon />
            </IconButton>
          )}
          {dataweb?.lineId && (
            <IconButton href={`https://line.me/ti/p/~${dataweb.lineId}`} target="_blank" size="small">
              <LineAxisIcon />
            </IconButton>
          )}
        </Stack>
      </Stack>

      <Typography variant="caption" display="block" textAlign="center" mt={2} color="text.secondary">
        © {new Date().getFullYear()} {dataweb?.websiteName || 'ชื่อเว็บไซต์'}
      </Typography>
    </Box>
  );
};

export default Footer;
