import React, { useState, useEffect } from 'react';
import AuthShell from '../components/AuthShell';
import InputField from '../components/ui/InputField';
import Button from '../components/ui/Button';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login as loginAction } from '../app/reducers/authReducers';
import axios from 'axios';

export default function Signup({ onNavigate }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [signupPayload, setSignupPayload] = useState(null);
  const [googlePayload, setGooglePayload] = useState(null);

  useEffect(() => {
    if (!signupPayload) return;

    const registerUser = async () => {
      setError(null);
      setSuccess(null);
      try {
        await axios.post('/api/auth/register', signupPayload);
        setSuccess("Account registered successfully! Redirecting to login...");
        setTimeout(() => {
          onNavigate('/login');
        }, 1500);
      } catch (err) {
        setError(err.response?.data?.message || err.response?.data?.error || "Registration failed");
      }
    };

    registerUser();
  }, [signupPayload, onNavigate]);

  useEffect(() => {
    if (!googlePayload) return;

    const verifyGoogleToken = async () => {
      setError(null);
      try {
        const response = await axios.post('/api/auth/google/callback', { idToken: googlePayload });
        
        if (response.data.success) {
          const { accessToken, user } = response.data;
          dispatch(loginAction({ user, token: accessToken }));
          navigate('/dashboard');
        }
      } catch (error) {
        console.error("Google Sign-up failed:", error);
        setError(error.response?.data?.error || "Google login failed");
      }
    };

    verifyGoogleToken();
  }, [googlePayload, dispatch, navigate]);

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setSignupPayload({ name, email, password });
  };

  const handleGoogleSuccess = (credentialResponse) => {
    setGooglePayload(credentialResponse.credential);
  };

  return (
    <AuthShell
      title="Create an account"
      subtitle="Already have an account?"
      toggleLink="Log in"
      onToggle={() => onNavigate('/login')}
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
        or sign up with email
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 border border-red-100 rounded-sm p-3 text-xs font-sans mb-3 text-center">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-600 border border-green-100 rounded-sm p-3 text-xs font-sans mb-3 text-center">
          {success}
        </div>
      )}

      <form onSubmit={handleSignupSubmit} className="flex flex-col gap-4">
        <InputField 
          label="Full Name"
          id="signup-name"
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <InputField 
          label="Email Address"
          id="signup-email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <InputField 
          label="Password"
          id="signup-password"
          type="password"
          placeholder="Create password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" variant="primary" className="w-full mt-2">
          Create Account
        </Button>
      </form>
    </AuthShell>
  );
}
