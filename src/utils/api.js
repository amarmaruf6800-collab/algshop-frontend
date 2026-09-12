import axios from 'axios';

// 1. Buat instance Axios dengan URL bawaan Laravel Anda
const api = axios.create({
    baseURL: '/api',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

// 2. Interceptor: Penjaga pintu otomatis
// Setiap kali React ingin menembak API, fungsi ini akan mengecek apakah ada Token di localStorage.
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;