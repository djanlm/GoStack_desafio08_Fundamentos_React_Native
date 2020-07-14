import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://10.0.2.2:3333', // android studio
  // baseURL: 'http://10.0.3.2:3333', // genymotion
  baseURL: 'http://localhost:3333', // ios
  // baseURL: 'http://ip_da_rede:3333', // via usb
});

export default api;
