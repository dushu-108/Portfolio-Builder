import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const setAuthToken = (token) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      setAuthToken(token);
      const userResponse = await api.get('/auth/status');
      setUser(userResponse.data);
      setIsAuthenticated(true);
      
      // Fetch portfolio data if user is authenticated
      try {
        const portfolioResponse = await api.get('/portfolio/');
        setPortfolio(portfolioResponse.data.portfolio);
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error('Error fetching portfolio:', error);
        }
      }
    } catch (error) {
      console.error('Auth status check failed:', error);
      localStorage.removeItem('token');
      setAuthToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setPortfolio(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login', {
        username,
        password,
      });

      const { token, ...userData } = response.data;
      localStorage.setItem('token', token);
      setAuthToken(token);
      setUser(userData);
      setIsAuthenticated(true);

      // Fetch portfolio after successful login
      try {
        const portfolioResponse = await api.get('/portfolio/');
        setPortfolio(portfolioResponse.data.portfolio);
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error('Error fetching portfolio:', error);
        }
      }

      toast.success('Logged in successfully!');
      return true;
    } catch (error) {
      toast.error(error.response?.data || 'Login failed');
      return false;
    }
  };

  const register = async (username, name, password) => {
    try {
      const response = await api.post('/auth/signup', {
        username,
        name,
        password,
      });

      const { token, ...userData } = response.data;
      localStorage.setItem('token', token);
      setAuthToken(token);
      setUser(userData);
      setIsAuthenticated(true);
      setPortfolio(null); // Reset portfolio state for new user
      toast.success('Registered successfully!');
      return true;
    } catch (error) {
      toast.error(error.response?.data || 'Registration failed');
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('token');
      setAuthToken(null);
      setUser(null);
      setPortfolio(null);
      setIsAuthenticated(false);
      toast.success('Logged out successfully!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error logging out');
    }
  };

  const updatePortfolio = (newPortfolio) => {
    setPortfolio(newPortfolio);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        portfolio,
        login,
        register,
        logout,
        updatePortfolio
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}; 