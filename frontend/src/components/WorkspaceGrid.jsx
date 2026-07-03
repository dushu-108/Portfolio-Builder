import React from 'react';
import { Globe, Plus, ChevronRight, Trash2 } from 'lucide-react';

export function WorkspaceCard({ workspace, onClick, onDelete }) {
  return (
    <div 
      className="bg-white border border-hairline rounded-lg p-6 shadow-level-2 cursor-pointer flex flex-col justify-between min-h-[180px] transition-all duration-200 hover:border-hairline-strong hover:shadow-level-4"
      onClick={onClick}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] font-semibold text-link-blue uppercase">
            {workspace.template} • {workspace.resumeFormat || 'Monochrome'}
          </span>
          <div className="flex items-center gap-2">
            <Globe size={14} className="text-neutral-400" />
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(workspace);
              }}
              className="text-neutral-400 hover:text-red-500 transition-colors duration-150 p-1 rounded-full hover:bg-neutral-100 cursor-pointer flex items-center justify-center shrink-0"
              title="Delete Workspace"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
        <h3 className="font-sans text-lg font-semibold text-ink leading-6">
          {workspace.name}
        </h3>
        {workspace.pdfName && (
          <div className="flex items-center gap-1 text-[11px] font-sans text-neutral-400">
            <span>📄 {workspace.pdfName}</span>
          </div>
        )}
        <p className="font-sans text-sm text-neutral-600 line-clamp-2">
          {workspace.description}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {workspace.tech.map((t, idx) => (
            <span 
              key={idx} 
              className="font-mono text-[11px] px-1.5 py-0.5 rounded-sm bg-canvas-soft2 text-neutral-600 border border-hairline"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-hairline">
        <span className="font-mono text-xs text-neutral-400">
          Modified {workspace.lastModified}
        </span>
        <div className="flex items-center gap-1 text-ink hover:translate-x-1 transition-transform duration-150">
          <span className="font-sans text-sm font-medium tracking-[-0.28px]">Open Studio</span>
          <ChevronRight size={14} />
        </div>
      </div>
    </div>
  );
}

export function CreateWorkspaceTriggerCard({ onClick }) {
  return (
    <div 
      className="bg-canvas-soft border border-dashed border-neutral-300 rounded-lg p-6 min-h-[180px] flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200 hover:border-ink hover:bg-canvas-soft2"
      onClick={onClick}
    >
      <Plus size={24} className="text-neutral-400" />
      <span className="font-mono text-xs font-semibold text-neutral-600 uppercase tracking-wider">
        CREATE_WORKSPACE_TRIGGER
      </span>
      <span className="font-mono text-[11px] text-neutral-400">
        + Create from resume / prompt
      </span>
    </div>
  );
}

export default function WorkspaceGrid({ workspaces, onSelectWorkspace, onDeleteWorkspace, onCreateClick }) {
  return (
    <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-md:grid-cols-1">
      {workspaces.map((w) => (
        <WorkspaceCard 
          key={w.id} 
          workspace={w} 
          onClick={() => onSelectWorkspace(w)} 
          onDelete={onDeleteWorkspace}
        />
      ))}
      <CreateWorkspaceTriggerCard onClick={onCreateClick} />
    </div>
  );
}
