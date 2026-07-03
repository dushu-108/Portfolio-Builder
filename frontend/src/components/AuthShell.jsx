import React from 'react';

export default function AuthShell({ title, subtitle, toggleText, toggleLink, onToggle, onBack, children }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-canvas-soft p-6 relative">
      <div className="mesh-gradient-container">
        <div className="mesh-gradient-backdrop"></div>
      </div>

      <div className="w-[420px] max-w-full bg-white border border-hairline rounded-lg p-8 shadow-level-5 flex flex-col gap-6 z-10">
        <div className="text-center flex flex-col gap-2">
          <h2 className="font-sans text-2xl font-semibold tracking-[-0.96px] text-ink">
            {title}
          </h2>
          <p className="font-sans text-sm text-neutral-500">
            {subtitle}{' '}
            <span 
              onClick={onToggle}
              className="text-link-blue hover:text-link-deep cursor-pointer hover:underline"
            >
              {toggleLink}
            </span>
          </p>
        </div>

        {children}
      </div>

      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onBack();
        }}
        className="mt-6 font-sans text-sm font-medium text-neutral-400 hover:text-ink transition-colors duration-150"
      >
        &larr; Back to Landing Page
      </a>
    </div>
  );
}
