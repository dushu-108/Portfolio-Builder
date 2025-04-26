import axios from 'axios';

// Function to determine the API URL based on the environment
const getApiUrl = () => {
    // Use localhost only in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:3000/api';
    }
    // In production (any non-localhost), always use relative /api
    return '/api';
};

const instance = axios.create({
    baseURL: getApiUrl(),
    withCredentials: true,
    timeout: 90000, // 90 seconds
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to add the token from localStorage
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default instance;
