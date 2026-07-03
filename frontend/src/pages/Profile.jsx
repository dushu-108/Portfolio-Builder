import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield, Calendar, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

export default function Profile() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const defaultAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&fit=crop&q=80";

  return (
    <div className="max-w-[800px] mx-auto px-6 pt-24 pb-12 flex flex-col gap-8">
      <div className="mesh-gradient-container">
        <div className="mesh-gradient-backdrop"></div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/dashboard')}
          className="font-sans text-xs font-semibold text-neutral-500 hover:text-ink flex items-center gap-1 bg-white border border-hairline hover:bg-canvas-soft2 rounded-sm px-2.5 py-1.5 transition-all duration-150 cursor-pointer shadow-level-2"
        >
          <ArrowLeft size={14} />
          Back to Dashboard
        </button>
      </div>

      <div className="bg-white border border-hairline rounded-lg shadow-level-5 p-8 flex flex-col md:flex-row gap-8 items-center md:items-start relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-teal-400"></div>

        <div className="flex flex-col items-center gap-4">
          <img
            src={user?.avatar || defaultAvatar}
            alt="User Avatar"
            className="w-28 h-28 rounded-full object-cover border-2 border-hairline shadow-level-4 bg-canvas-soft"
          />
          <div className="bg-canvas-soft2 border border-hairline px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-bold">
            {user?.authProvider === 'google' ? 'Google Account' : 'Standard User'}
          </div>
        </div>

        <div className="flex-1 w-full flex flex-col gap-6">
          <div>
            <h1 className="font-sans text-2xl font-bold tracking-[-0.96px] text-ink">
              {user?.name || 'Account Settings'}
            </h1>
            <p className="font-sans text-sm text-neutral-400 mt-1">
              Manage your profile information and credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-hairline pt-6">
            <div className="flex items-center gap-3 bg-canvas-soft p-4 border border-hairline rounded-sm">
              <User size={18} className="text-neutral-400 flex-shrink-0" />
              <div>
                <span className="block text-[10px] font-sans text-neutral-400 uppercase tracking-wider font-semibold">Full Name</span>
                <span className="font-sans text-sm font-semibold text-ink">{user?.name || 'N/A'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-canvas-soft p-4 border border-hairline rounded-sm">
              <Mail size={18} className="text-neutral-400 flex-shrink-0" />
              <div>
                <span className="block text-[10px] font-sans text-neutral-400 uppercase tracking-wider font-semibold">Email Address</span>
                <span className="font-sans text-sm font-semibold text-ink">{user?.email || 'N/A'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-canvas-soft p-4 border border-hairline rounded-sm">
              <Shield size={18} className="text-neutral-400 flex-shrink-0" />
              <div>
                <span className="block text-[10px] font-sans text-neutral-400 uppercase tracking-wider font-semibold">Account Identifier</span>
                <span className="font-mono text-[11px] text-neutral-500 overflow-ellipsis overflow-hidden block max-w-[200px]" title={user?.id}>
                  {user?.id || 'N/A'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-canvas-soft p-4 border border-hairline rounded-sm">
              <Calendar size={18} className="text-neutral-400 flex-shrink-0" />
              <div>
                <span className="block text-[10px] font-sans text-neutral-400 uppercase tracking-wider font-semibold">Auth Method</span>
                <span className="font-sans text-sm font-semibold text-ink capitalize">
                  {user?.authProvider || 'Email/Password'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
