import React, { useState, useEffect } from 'react';
import AuthShell from '../components/AuthShell';
import InputField from '../components/ui/InputField';
import Button from '../components/ui/Button';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login as loginAction } from '../app/reducers/authReducers';
import axios from 'axios';

export default function Login({ onNavigate }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const [loginPayload, setLoginPayload] = useState(null);
  const [googlePayload, setGooglePayload] = useState(null);

  const onLoginSuccess = (user, token) => {
    dispatch(loginAction({ user, token }));
    navigate('/dashboard');
  };

  useEffect(() => {
    if (!loginPayload) return;

    const performLogin = async () => {
      setError(null);
      try {
        const response = await axios.post('http://localhost:3000/api/auth/login', loginPayload);
        const { accessToken, user } = response.data;
        localStorage.setItem('token', accessToken);
        localStorage.setItem('user', JSON.stringify(user));
        onLoginSuccess(user, accessToken);        
      } catch (err) {
        setError(err.response?.data?.message || err.response?.data?.error || "Login failed");
      }
    };

    performLogin();
  }, [loginPayload]);

  useEffect(() => {
    if (!googlePayload) return;

    const verifyGoogleToken = async () => {
      setError(null);
      try {
        const response = await axios.post('http://localhost:3000/api/auth/google/callback', { idToken: googlePayload });
        
        if (response.data.success) {
          const { accessToken, user } = response.data;
          localStorage.setItem('token', accessToken);
          localStorage.setItem('user', JSON.stringify(user));
          onLoginSuccess(user, accessToken);
        }
      } catch (err) {
        console.error("Login verification failed:", err);
        setError(err.response?.data?.error || "Google login failed");
      }
    };

    verifyGoogleToken();
  }, [googlePayload]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginPayload({ email, password });
  };

  const handleGoogleSuccess = (credentialResponse) => {
    setGooglePayload(credentialResponse.credential);
  };

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Don't have an account?"
      toggleLink="Sign up"
      onToggle={() => onNavigate('/signup')}
      onBack={() => onNavigate('/')}
    >
      <div className="flex justify-center w-full mb-4">
        <GoogleLogin 
          onSuccess={handleGoogleSuccess} 
          onError={() => {
            setError("Google sign-in was unsuccessful.");
          }}
        />
      </div>

      <div className="flex items-center text-center font-sans text-xs text-neutral-400 my-2 before:content-[''] before:flex-1 before:border-b before:border-hairline before:mr-3 after:content-[''] after:flex-1 after:border-b after:border-hairline after:ml-3">
        or continue with email
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 border border-red-100 rounded-sm p-3 text-xs font-sans mb-3 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
        <InputField 
          label="Email Address"
          id="login-email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <InputField 
          label="Password"
          id="login-password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" variant="primary" className="w-full mt-2">
          Sign In with Email
        </Button>
      </form>
    </AuthShell>
  );
}
