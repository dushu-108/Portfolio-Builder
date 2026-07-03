import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from 'react-redux';
import { store } from './app/store';
import axios from 'axios';
import { login as loginAction, logout as logoutAction } from './app/reducers/authReducers';

axios.defaults.withCredentials = true;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      originalRequest.url &&
      !originalRequest.url.includes('/api/auth/login') &&
      !originalRequest.url.includes('/api/auth/refresh')
    ) {
      originalRequest._retry = true;
      try {
        const response = await axios.post(
          'http://localhost:3000/api/auth/refresh',
          {}
        );
        const { accessToken } = response.data;
        
        let savedUser = null;
        try {
          const userStr = localStorage.getItem('user');
          if (userStr && userStr !== "undefined") savedUser = JSON.parse(userStr);
        } catch (e) {
          console.error("Failed to parse user during token refresh:", e);
        }

        store.dispatch(loginAction({ 
          token: accessToken, 
          user: savedUser
        }));
        localStorage.setItem('token', accessToken);

        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        store.dispatch(logoutAction());
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "995769891925-rs8c8p170it8fi787bhoo62el8d0idku.apps.googleusercontent.com";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <BrowserRouter>
      <GoogleOAuthProvider clientId={googleClientId}>
        <App />
      </GoogleOAuthProvider>
    </BrowserRouter>
    </Provider>
  </StrictMode>,
)
