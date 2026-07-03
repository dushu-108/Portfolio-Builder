import React from 'react';
import { X } from 'lucide-react';
import Button from './Button';

export default function Modal({ isOpen, onClose, title, children, footer }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-[1000] p-4">
      <div className="bg-white border border-hairline rounded-lg w-[500px] max-w-full shadow-level-5 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6 border-b border-hairline flex items-center justify-between">
          <h3 className="font-sans text-xl font-semibold text-ink">
            {title}
          </h3>
          <button 
            className="text-neutral-400 hover:text-ink cursor-pointer transition-colors duration-150"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          {children}
        </div>

        {footer && (
          <div className="px-6 py-4 border-t border-hairline flex justify-end gap-3 bg-canvas-soft">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
