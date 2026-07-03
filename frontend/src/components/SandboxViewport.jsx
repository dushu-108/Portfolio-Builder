import React, { useState } from 'react';
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
} from "@codesandbox/sandpack-react";

export default function SandboxViewport({ srcDoc, activeTab, setActiveTab }) {

  return (
    <div className="flex-1 h-full flex flex-col overflow-hidden">
      <div className="w-full h-full bg-white overflow-hidden flex flex-col">
        <div className="h-10 border-b border-hairline bg-canvas-soft flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
          </div>
          
          <div className="flex bg-neutral-100 p-0.5 rounded-md border border-neutral-200">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-0.5 rounded-sm text-[11px] font-medium cursor-pointer transition-all duration-150 ${
                activeTab === 'preview'
                  ? 'bg-white text-ink shadow-sm'
                  : 'text-neutral-500 hover:text-ink'
              }`}
            >
              Preview
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-3 py-0.5 rounded-sm text-[11px] font-medium cursor-pointer transition-all duration-150 ${
                activeTab === 'code'
                  ? 'bg-white text-ink shadow-sm'
                  : 'text-neutral-500 hover:text-ink'
              }`}
            >
              Code Editor
            </button>
          </div>

          <div className="w-[64px] max-sm:hidden"></div>
        </div>
        
        <div className="flex-1 w-full overflow-hidden flex flex-col min-h-0">
          {activeTab === 'preview' ? (
            <iframe
              title="Portfolio Preview"
              className="w-full h-full border-none bg-white flex-1"
              srcDoc={srcDoc}
            />
          ) : (
            <SandpackProvider 
              key={srcDoc}
              theme={'dark'}
              template="static"
              files={{
                "/index.html": srcDoc || "<h1>Loading...</h1>"
              }}
              options={{
                classes: {
                  "sp-wrapper": "h-full flex-1 flex flex-col min-h-0",
                  "sp-layout": "h-full flex-1 flex min-h-0"
                }
              }}
              style={{ height: "100%", display: "flex", flexDirection: "column", minHeight: 0 }}
            >
              <SandpackLayout style={{ height: "100%", flex: 1, border: "none", borderRadius: 0, minHeight: 0 }}>
                <SandpackCodeEditor style={{ height: "100%" }} showTabs={false} showLineNumbers={true} />
              </SandpackLayout>
            </SandpackProvider>
          )}
        </div>
      </div>
    </div>
  );
}
