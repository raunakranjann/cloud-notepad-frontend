import axios from 'axios';

const api = axios.create({
    baseURL: 'https://cloud-notepad-api.onrender.com', // Your Spring Boot URL
});

// Intercept every request to inject the JWT
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;