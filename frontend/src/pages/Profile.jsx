import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  User, Mail, Shield, Calendar, ArrowLeft, Pencil, 
  KeyRound, Loader2, CheckCircle2, AlertTriangle, Eye, EyeOff
} from 'lucide-react';
import { updateUser } from '../app/reducers/authReducers';
import Button from '../components/ui/Button';

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const fileInputRef = useRef(null);

  // Avatar states
  const [uploading, setUploading] = useState(false);
  const [avatarError, setAvatarError] = useState(null);

  // Password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMessage, setPwMessage] = useState(null);
  const [pwError, setPwError] = useState(null);

  const defaultAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&fit=crop&q=80";

  const handleAvatarClick = () => {
    if (uploading) return;
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAvatarError('Please select a valid image file (PNG/JPEG).');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setAvatarError('Image size must be smaller than 2MB.');
      return;
    }

    setAvatarError(null);
    const formData = new FormData();
    formData.append('avatar', file);

    setUploading(true);
    try {
      const response = await axios.post('/api/auth/profile-picture', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      dispatch(updateUser({ avatar: response.data.avatar }));
    } catch (err) {
      console.error(err);
      setAvatarError(err.response?.data?.error || 'Failed to upload profile picture.');
    } finally {
      setUploading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwMessage(null);
    setPwError(null);

    if (newPassword !== confirmPassword) {
      setPwError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setPwError('Password must be at least 6 characters long.');
      return;
    }

    setPwLoading(true);
    try {
      await axios.post('/api/auth/change-password', {
        currentPassword,
        newPassword
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setPwMessage('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      setPwError(err.response?.data?.error || 'Failed to update password.');
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-canvas-soft pt-28 px-6 md:px-12 lg:px-16 pb-16 flex flex-col gap-8 relative overflow-hidden">
      <div className="mesh-gradient-container">
        <div className="mesh-gradient-backdrop"></div>
      </div>

      {/* Header back button */}
      <div className="flex items-center justify-between border-b border-hairline pb-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="font-sans text-xs font-semibold text-neutral-500 hover:text-ink flex items-center gap-1.5 bg-white border border-hairline hover:bg-canvas-soft2 rounded-sm px-3.5 py-2 transition-all duration-150 cursor-pointer shadow-level-2"
        >
          <ArrowLeft size={14} />
          Back to Dashboard
        </button>
        <span className="font-mono text-xs text-neutral-400">Settings / Account</span>
      </div>

      {/* Two column grid layout spanning full page */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
        
        {/* Left Side: Avatar Card */}
        <div className="lg:col-span-4 bg-white border border-hairline rounded-lg shadow-level-5 p-8 flex flex-col items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-teal-400"></div>

          {/* Interactive Profile Pic */}
          <div className="relative group cursor-pointer w-32 h-32" onClick={handleAvatarClick}>
            <img
              src={user?.avatar || defaultAvatar}
              alt="User Avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-level-4 bg-canvas-soft transition-transform duration-300 group-hover:scale-[1.02]"
            />
            {/* Hover overlay with pencil icon */}
            <div className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Pencil size={18} className="text-white" />
              <span className="text-[10px] font-sans text-white/90 font-medium">Update Pic</span>
            </div>

            {/* Spinner Overlay during Upload */}
            {uploading && (
              <div className="absolute inset-0 bg-black/75 rounded-full flex items-center justify-center">
                <Loader2 className="animate-spin text-white" size={24} />
              </div>
            )}
          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            accept="image/*"
            className="hidden"
          />

          {avatarError && (
            <span className="text-[11px] font-sans font-medium text-red-500 text-center max-w-[200px]">
              {avatarError}
            </span>
          )}

          {/* User Basic Info */}
          <div className="text-center w-full">
            <h2 className="font-sans text-xl font-bold tracking-tight text-ink">
              {user?.name || 'My Account'}
            </h2>
            <p className="font-sans text-xs text-neutral-400 mt-1 truncate max-w-[250px] mx-auto">
              {user?.email}
            </p>
          </div>

          <div className="bg-canvas-soft2 border border-hairline px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-bold">
            {user?.authProvider === 'google' ? 'Google Account' : 'Standard User'}
          </div>
        </div>

        {/* Right Side: Tab Panel Details */}
        <div className="lg:col-span-8 flex flex-col gap-8 w-full">
          
          {/* Section 1: Account Information */}
          <div className="bg-white border border-hairline rounded-lg shadow-level-4 p-8 flex flex-col gap-6 relative">
            <div>
              <h3 className="font-sans text-lg font-bold text-ink">Personal Information</h3>
              <p className="font-sans text-xs text-neutral-400 mt-0.5">Basic profile details registered to this account.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-hairline pt-6">
              <div className="flex items-center gap-3 bg-canvas-soft p-4 border border-hairline rounded-sm">
                <User size={18} className="text-neutral-400 flex-shrink-0" />
                <div className="min-w-0">
                  <span className="block text-[10px] font-sans text-neutral-400 uppercase tracking-wider font-semibold">Full Name</span>
                  <span className="font-sans text-sm font-semibold text-ink truncate block">{user?.name || 'N/A'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-canvas-soft p-4 border border-hairline rounded-sm">
                <Mail size={18} className="text-neutral-400 flex-shrink-0" />
                <div className="min-w-0">
                  <span className="block text-[10px] font-sans text-neutral-400 uppercase tracking-wider font-semibold">Email Address</span>
                  <span className="font-sans text-sm font-semibold text-ink truncate block">{user?.email || 'N/A'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-canvas-soft p-4 border border-hairline rounded-sm">
                <Shield size={18} className="text-neutral-400 flex-shrink-0" />
                <div className="min-w-0">
                  <span className="block text-[10px] font-sans text-neutral-400 uppercase tracking-wider font-semibold">Account Identifier</span>
                  <span className="font-mono text-[11px] text-neutral-500 truncate block select-all" title={user?.id || user?._id}>
                    {user?.id || user?._id || 'N/A'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-canvas-soft p-4 border border-hairline rounded-sm">
                <Calendar size={18} className="text-neutral-400 flex-shrink-0" />
                <div className="min-w-0">
                  <span className="block text-[10px] font-sans text-neutral-400 uppercase tracking-wider font-semibold">Authentication Method</span>
                  <span className="font-sans text-sm font-semibold text-ink capitalize truncate block">
                    {user?.authProvider || 'Email/Password'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Security & Password Management */}
          <div className="bg-white border border-hairline rounded-lg shadow-level-4 p-8 flex flex-col gap-6">
            <div>
              <h3 className="font-sans text-lg font-bold text-ink">Security & Credentials</h3>
              <p className="font-sans text-xs text-neutral-400 mt-0.5">Manage your password to secure your portfolio builder.</p>
            </div>

            {user?.authProvider === 'google' ? (
              // Alert card for Google OAuth users
              <div className="border border-amber-200/50 bg-amber-50/30 rounded-sm p-5 flex gap-4 items-start">
                <AlertTriangle className="text-amber-500 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="font-sans text-sm font-bold text-ink">Google Sign-in Enabled</h4>
                  <p className="font-sans text-xs text-neutral-500 mt-1 leading-relaxed">
                    This account is managed through Google OAuth. Your password and secure credentials can only be updated inside your Google Account settings.
                  </p>
                </div>
              </div>
            ) : (
              // Form for standard users
              <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4 border-t border-hairline pt-6">
                
                {/* Current password */}
                <div className="flex flex-col gap-1.5 relative">
                  <label className="font-sans text-xs font-semibold text-neutral-500" htmlFor="curr-pass">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      id="curr-pass"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-canvas-soft border border-hairline focus:border-ink rounded-sm px-3.5 py-2.5 font-sans text-sm outline-none transition-all duration-150 shadow-inner"
                      placeholder="Enter your current password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-ink cursor-pointer"
                    >
                      {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* New password & confirm password grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-xs font-semibold text-neutral-500" htmlFor="new-pass">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        id="new-pass"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-canvas-soft border border-hairline focus:border-ink rounded-sm px-3.5 py-2.5 font-sans text-sm outline-none transition-all duration-150 shadow-inner"
                        placeholder="Min. 6 characters"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-ink cursor-pointer"
                      >
                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-xs font-semibold text-neutral-500" htmlFor="confirm-pass">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirm-pass"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-canvas-soft border border-hairline focus:border-ink rounded-sm px-3.5 py-2.5 font-sans text-sm outline-none transition-all duration-150 shadow-inner"
                      placeholder="Repeat new password"
                      required
                    />
                  </div>
                </div>

                {/* Notifications */}
                {pwError && (
                  <div className="text-xs text-red-500 font-medium font-sans flex items-center gap-1.5">
                    <AlertTriangle size={14} />
                    {pwError}
                  </div>
                )}
                {pwMessage && (
                  <div className="text-xs text-green-600 font-medium font-sans flex items-center gap-1.5">
                    <CheckCircle2 size={14} />
                    {pwMessage}
                  </div>
                )}

                {/* Submit button */}
                <div className="flex justify-end mt-2">
                  <button
                    type="submit"
                    disabled={pwLoading}
                    className="font-sans text-xs font-bold text-white bg-ink hover:bg-ink-hover disabled:bg-neutral-400 rounded-sm px-6 py-3 transition-all duration-150 shadow-level-4 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {pwLoading ? (
                      <>
                        <Loader2 className="animate-spin" size={14} />
                        Changing Password...
                      </>
                    ) : (
                      <>
                        <KeyRound size={14} />
                        Change Password
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
