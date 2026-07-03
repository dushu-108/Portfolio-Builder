import React from 'react';
import { LogOut, Sun, Moon } from 'lucide-react';
import Button from './Button';

export function NavLink({ active, onClick, children }) {
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`font-sans text-sm font-medium tracking-[-0.28px] text-neutral-500 hover:text-ink relative py-1 px-2 transition-colors duration-150 ${
        active ? 'text-ink' : ''
      }`}
    >
      {children}
      {active && (
        <span className="absolute bottom-[-16px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-ink" />
      )}
    </a>
  );
}

export default function NavBar({
  isAuthenticated,
  currentPath,
  onNavigate,
  onLogout,
  avatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&q=80",
  theme,
  onToggleTheme
}) {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-hairline flex items-center justify-between px-6 z-100">
      <div className="flex items-center gap-6">
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); onNavigate('/'); }} 
          className="font-sans text-lg font-bold tracking-[-0.8px] text-ink no-underline flex items-center gap-2"
        >
          ▲ PORTFOLIO BUILDER
        </a>
        
        {isAuthenticated && (
          <NavLink 
            active={currentPath === '/dashboard'} 
            onClick={() => onNavigate('/dashboard')}
          >
            Dashboard
          </NavLink>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-full border border-hairline hover:bg-canvas-soft2 text-ink transition-all duration-150 cursor-pointer flex items-center justify-center"
          aria-label="Toggle theme"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </button>

        {!isAuthenticated ? (
          <>
            <Button variant="secondary" onClick={() => onNavigate('/login')}>
              Sign In
            </Button>
            <Button variant="primary" onClick={() => onNavigate('/signup')}>
              Sign Up
            </Button>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <button
              onClick={onLogout}
              className="bg-white text-ink border border-hairline hover:bg-canvas-soft2 hover:border-hairline-strong rounded-sm h-8 px-2.5 text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer transition-colors duration-150"
            >
              <LogOut size={12} />
              Sign Out
            </button>
            <img
              onClick={() => onNavigate('/profile')}
              className="w-8 h-8 rounded-full object-cover border border-hairline cursor-pointer hover:opacity-80 active:scale-95 transition-all duration-150"
              src={avatarUrl}
              alt="Google Profile Badge"
              title="View Profile Settings"
            />
          </div>
        )}
      </div>
    </nav>
  );
}
