import { StrictMode } from 'react';
import { createRoot} from 'react-dom/client';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

// ใช้ createRoot เพื่อติดตั้ง React component ลงใน DOM
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App/>
  </StrictMode>
);