import React from 'react';
import { Send } from 'lucide-react';

export function ChatBubble({ message }) {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`max-w-[85%] p-3 px-4 rounded-lg flex flex-col gap-1.5 animate-in slide-in-from-bottom-2 duration-150 ${
      isUser 
        ? 'self-end bg-canvas-soft2 text-ink rounded-br-xs' 
        : 'self-start bg-white text-ink border border-hairline rounded-bl-xs shadow-xs'
    }`}>
      <span className="font-mono text-[11px] text-neutral-400 uppercase">
        {isUser ? 'You' : 'Mistral AI'} &middot; {message.time}
      </span>
      <p className="font-sans text-[15px] leading-relaxed">{message.text}</p>
      {message.code && (
        <pre className="font-mono text-xs bg-canvas-soft2 p-2 px-3 rounded border border-hairline mt-2 overflow-x-auto whitespace-pre-wrap">
          <code>{message.code}</code>
        </pre>
      )}
    </div>
  );
}

export default function ChatSidebar({ 
  messages, 
  inputText, 
  setInputText, 
  isTyping, 
  onSubmit, 
  chatEndRef 
}) {
  return (
    <div className="w-[400px] shrink-0 border-r border-hairline bg-white flex flex-col h-full max-lg:w-full">
      <div className="p-3 px-4 border-b border-hairline bg-canvas-soft flex items-center justify-between">
        <span className="font-mono text-[11px] font-semibold bg-link-soft text-link-deep px-2 py-0.5 rounded-sm">
          MISTRAL_AI_ACTIVE
        </span>
        <span className="font-mono text-[11px] text-neutral-400">
          Resume Parsed
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
        {messages.map((m, idx) => (
          <ChatBubble key={idx} message={m} />
        ))}

        {isTyping && (
          <div className="max-w-[85%] p-3 px-4 rounded-lg flex flex-col gap-1.5 self-start bg-white text-ink border border-hairline rounded-bl-xs shadow-xs animate-pulse">
            <span className="font-mono text-[11px] text-neutral-400 uppercase">Mistral AI</span>
            <p className="font-sans text-xs italic text-neutral-400">
              Analyzing instruction and transforming code blocks...
            </p>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={onSubmit} className="p-4 border-t border-hairline bg-white">
        <div className="relative flex items-center">
          <input
            type="text"
            className="w-full h-11 py-3 pl-4 pr-11 bg-canvas-soft2 border border-hairline rounded-sm font-sans text-sm leading-5 outline-none transition-all duration-150 focus:border-ink focus:bg-white"
            placeholder="Modify styles, add elements, change layouts..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isTyping}
          />
          <button 
            type="submit" 
            className="absolute right-2 w-7 h-7 rounded-sm bg-ink text-white border-none cursor-pointer flex items-center justify-center transition-opacity hover:opacity-90 disabled:bg-neutral-400 disabled:cursor-not-allowed"
            disabled={isTyping || !inputText.trim()}
          >
            <Send size={14} />
          </button>
        </div>
        
        <div className="mt-2 flex gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setInputText('Change primary theme color to violet')}
            className="font-mono text-[10px] px-2 py-0.5 rounded border border-hairline bg-canvas-soft2 text-neutral-600 hover:border-hairline-strong hover:bg-neutral-200 cursor-pointer"
          >
            color: violet
          </button>
          <button
            type="button"
            onClick={() => setInputText('Change background to dark theme')}
            className="font-mono text-[10px] px-2 py-0.5 rounded border border-hairline bg-canvas-soft2 text-neutral-600 hover:border-hairline-strong hover:bg-neutral-200 cursor-pointer"
          >
            dark bg
          </button>
          <button
            type="button"
            onClick={() => setInputText('Add TypeScript and Next.js skills')}
            className="font-mono text-[10px] px-2 py-0.5 rounded border border-hairline bg-canvas-soft2 text-neutral-600 hover:border-hairline-strong hover:bg-neutral-200 cursor-pointer"
          >
            + skills
          </button>
        </div>
      </form>
    </div>
  );
}
