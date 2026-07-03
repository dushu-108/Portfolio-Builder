import React from 'react';

export default function InputField({ label, id, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={id} className="font-sans text-xs font-medium text-neutral-500">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`bg-white text-ink font-sans text-sm tracking-[-0.28px] border border-hairline rounded-sm h-10 px-3 w-full outline-none placeholder-neutral-400 transition-all duration-150 focus:border-ink focus:shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] ${className}`}
        {...props}
      />
    </div>
  );
}
