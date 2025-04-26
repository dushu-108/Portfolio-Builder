import axios from 'axios';

// Function to determine the API URL based on the environment
const getApiUrl = () => {
    // For production (bundled frontend/backend), use relative URL with /api prefix
    if (window.location.hostname.includes('onrender.com')) {
        return '/api';  // Use relative path with the /api prefix
    }
    
    // Use environment variable if available
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    
    // Default for development
    return 'http://localhost:3000/api';
};

const instance = axios.create({
    baseURL: getApiUrl(),
    withCredentials: true,
    timeout: 300000, // 5 minutes
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
