import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FileText, LayoutGrid, Code, Columns, Map, GraduationCap, UploadCloud, X } from 'lucide-react';
import InputField from './ui/InputField';
import Button from './ui/Button';

export default function CreateWorkspaceForm({ onSubmit, onCancel }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [template, setTemplate] = useState('minimalist');
  const [resumeFormat, setResumeFormat] = useState('Monochrome');
  const [pdfFile, setPdfFile] = useState(null);
  const token = useSelector((state) => state.auth.token);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      if (!name.trim()) {
        const cleanName = file.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[-_]/g, " ")
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        setName(cleanName + " Portfolio");
      }
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const formData = new FormData();
      formData.append('projectTitle', name);
      formData.append('description', description);
      formData.append('lockedTemplateId', template);
      formData.append('resumeFormat', resumeFormat);
      if (pdfFile) {
        formData.append('resume', pdfFile);
      }

      const response = await axios.post('http://localhost:3000/api/workspaces', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      const newWorkspace = response.data;

      const mappedWorkspace = {
        id: newWorkspace._id,
        _id: newWorkspace._id,
        name: newWorkspace.projectTitle,
        description: newWorkspace.cachedResumeContext || 'No description provided.',
        template: newWorkspace.lockedTemplateId,
        resumeFormat: newWorkspace.resumeFormat,
        generatedHtml: newWorkspace.generatedHtml,
        messages: newWorkspace.messages,
        pdfName: pdfFile ? pdfFile.name : null,
        lastModified: 'Just now',
        tech: template === 'terminal' ? ['HTML', 'CSS', 'JS', 'Bash'] : 
              template === 'bento' ? ['React', 'CSS Grid', 'Inter', 'Framer'] : 
              ['Vite', 'HTML5', 'Vanilla CSS'],
      };

      onSubmit(mappedWorkspace);
    } catch (error) {
      console.error('Error creating workspace:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
      <InputField 
        label="Portfolio Name"
        id="p-name"
        placeholder="e.g. My Developer Portfolio"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        autoFocus
      />

      <InputField 
        label="Description"
        id="p-desc"
        placeholder="e.g. Software engineering showcase with projects."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="flex flex-col gap-1">
        <label className="font-sans text-xs font-medium text-neutral-500">
          Upload PDF Resume (Optional)
        </label>
        {!pdfFile ? (
          <div className="border border-dashed border-hairline hover:border-hairline-strong rounded-sm p-3 bg-canvas-soft flex items-center justify-center gap-3 cursor-pointer relative hover:bg-canvas-soft2 transition-colors duration-150">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <UploadCloud size={18} className="text-neutral-400 shrink-0" />
            <div className="text-left">
              <span className="block font-sans text-xs font-semibold text-ink leading-none">
                Click or drag PDF resume here
              </span>
              <span className="block font-sans text-[10px] text-neutral-400 mt-1">
                PDF format only (Max 10MB)
              </span>
            </div>
          </div>
        ) : (
          <div className="border border-hairline rounded-sm p-2.5 px-3 bg-canvas-soft2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <FileText size={16} className="text-purple-500 shrink-0" />
              <div className="overflow-hidden">
                <span className="block font-sans text-xs font-semibold text-ink truncate leading-tight" title={pdfFile.name}>
                  {pdfFile.name}
                </span>
                <span className="block font-mono text-[9px] text-neutral-400 leading-none mt-0.5">
                  {(pdfFile.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPdfFile(null)}
              className="text-neutral-400 hover:text-ink p-1 rounded-full hover:bg-canvas-soft cursor-pointer transition-colors duration-150 shrink-0"
              title="Remove File"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-sans text-xs font-medium text-neutral-500">
          Select Resume Format
        </label>
        <div className="grid grid-cols-2 gap-2 mt-0.5">
          <div 
            onClick={() => setResumeFormat('Monochrome')}
            className={`p-2 border rounded-sm cursor-pointer flex items-center justify-center gap-2 transition-all duration-150 ${
              resumeFormat === 'Monochrome' 
                ? 'border-ink bg-canvas-soft2' 
                : 'border-hairline bg-white hover:bg-canvas-soft2'
            }`}
          >
            <FileText 
              size={15} 
              className={resumeFormat === 'Monochrome' ? 'text-ink' : 'text-neutral-400'} 
            />
            <span className="font-sans text-[11px] font-semibold text-ink">Monochrome</span>
          </div>

          <div 
            onClick={() => setResumeFormat('Two-Column ATS')}
            className={`p-2 border rounded-sm cursor-pointer flex items-center justify-center gap-2 transition-all duration-150 ${
              resumeFormat === 'Two-Column ATS' 
                ? 'border-ink bg-canvas-soft2' 
                : 'border-hairline bg-white hover:bg-canvas-soft2'
            }`}
          >
            <Columns 
              size={15} 
              className={resumeFormat === 'Two-Column ATS' ? 'text-ink' : 'text-neutral-400'} 
            />
            <span className="font-sans text-[11px] font-semibold text-ink">Two-Column ATS</span>
          </div>

          <div 
            onClick={() => setResumeFormat('Sydney / Stockholm')}
            className={`p-2 border rounded-sm cursor-pointer flex items-center justify-center gap-2 transition-all duration-150 ${
              resumeFormat === 'Sydney / Stockholm' 
                ? 'border-ink bg-canvas-soft2' 
                : 'border-hairline bg-white hover:bg-canvas-soft2'
            }`}
          >
            <Map 
              size={15} 
              className={resumeFormat === 'Sydney / Stockholm' ? 'text-ink' : 'text-neutral-400'} 
            />
            <span className="font-sans text-[11px] font-semibold text-ink">Sydney / Stockholm</span>
          </div>

          <div 
            onClick={() => setResumeFormat('Harvard / Minimalist')}
            className={`p-2 border rounded-sm cursor-pointer flex items-center justify-center gap-2 transition-all duration-150 ${
              resumeFormat === 'Harvard / Minimalist' 
                ? 'border-ink bg-canvas-soft2' 
                : 'border-hairline bg-white hover:bg-canvas-soft2'
            }`}
          >
            <GraduationCap 
              size={15} 
              className={resumeFormat === 'Harvard / Minimalist' ? 'text-ink' : 'text-neutral-400'} 
            />
            <span className="font-sans text-[11px] font-semibold text-ink">Harvard / Minimalist</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-sans text-xs font-medium text-neutral-500">
          Select Base Theme Layout
        </label>
        <div className="grid grid-cols-3 gap-2 mt-0.5">
          <div 
            onClick={() => setTemplate('minimalist')}
            className={`p-2 border rounded-sm cursor-pointer flex items-center justify-center gap-2 transition-all duration-150 ${
              template === 'minimalist' 
                ? 'border-ink bg-canvas-soft2' 
                : 'border-hairline bg-white hover:bg-canvas-soft2'
            }`}
          >
            <FileText 
              size={15} 
              className={template === 'minimalist' ? 'text-ink' : 'text-neutral-400'} 
            />
            <span className="font-sans text-[11px] font-semibold text-ink">Minimalist</span>
          </div>

          <div 
            onClick={() => setTemplate('bento')}
            className={`p-2 border rounded-sm cursor-pointer flex items-center justify-center gap-2 transition-all duration-150 ${
              template === 'bento' 
                ? 'border-ink bg-canvas-soft2' 
                : 'border-hairline bg-white hover:bg-canvas-soft2'
            }`}
          >
            <LayoutGrid 
              size={15} 
              className={template === 'bento' ? 'text-ink' : 'text-neutral-400'} 
            />
            <span className="font-sans text-[11px] font-semibold text-ink">Bento Box</span>
          </div>

          <div 
            onClick={() => setTemplate('terminal')}
            className={`p-2 border rounded-sm cursor-pointer flex items-center justify-center gap-2 transition-all duration-150 ${
              template === 'terminal' 
                ? 'border-ink bg-canvas-soft2' 
                : 'border-hairline bg-white hover:bg-canvas-soft2'
            }`}
          >
            <Code 
              size={15} 
              className={template === 'terminal' ? 'text-ink' : 'text-neutral-400'} 
            />
            <span className="font-sans text-[11px] font-semibold text-ink">Terminal</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-hairline pt-3 mt-1.5">
        <Button variant="primary" type="submit">
          Create Workspace
        </Button>
      </div>
    </form>
  );
}
