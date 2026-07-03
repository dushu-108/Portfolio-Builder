import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Plus } from 'lucide-react';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import WorkspaceGrid from '../components/WorkspaceGrid';
import CreateWorkspaceForm from '../components/CreateWorkspaceForm';
import axios from 'axios';

export default function Dashboard({ onCreateWorkspace, onSelectWorkspace }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [workspaces, setWorkspaces] = useState([]);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    async function fetchWorkspaces() {
      if (!token) return;
      try {
        const response = await axios.get('/api/workspaces', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const mappedData = response.data.map(ws => ({
          id: ws._id,
          name: ws.projectTitle,
          description: ws.cachedResumeContext || 'No description provided.',
          template: ws.lockedTemplateId,
          resumeFormat: ws.resumeFormat,
          pdfName: ws.pdfName || null,
          lastModified: ws.updatedAt ? new Date(ws.updatedAt).toLocaleDateString() : 'Recently',
          tech: ws.lockedTemplateId === 'terminal' ? ['HTML', 'CSS', 'JS', 'Bash'] : 
                ws.lockedTemplateId === 'bento' ? ['React', 'CSS Grid', 'Inter', 'Framer'] : 
                ['Vite', 'HTML5', 'Vanilla CSS'],
        }));
        setWorkspaces(mappedData);
      } catch (error) {
        console.error('Error fetching workspaces:', error);
      }
    }
    fetchWorkspaces();
  }, [token]);

  const handleSubmitWorkspace = (mappedWorkspace) => {
    setWorkspaces((prev) => [...prev, mappedWorkspace]);
    onCreateWorkspace(mappedWorkspace);
    setIsModalOpen(false);
  };

  const handleDeleteWorkspace = async (workspace) => {
    if (!window.confirm(`Are you sure you want to delete "${workspace.name}"?`)) {
      return;
    }
    try {
      await axios.delete(`/api/workspaces/${workspace.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setWorkspaces((prev) => prev.filter((w) => w.id !== workspace.id));
    } catch (error) {
      console.error("Error deleting workspace:", error);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 pt-24 pb-12 flex flex-col gap-8">
      <div className="mesh-gradient-container">
        <div className="mesh-gradient-backdrop"></div>
      </div>

      <div className="flex items-center justify-between gap-4 max-sm:flex-col max-sm:items-start">
        <div>
          <h1 className="font-sans text-3xl font-semibold tracking-[-1.28px] text-ink">
            My Portfolios
          </h1>
          <p className="font-sans text-sm text-neutral-500 mt-1">
            Manage and edit your generated web portfolio workspaces.
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} />
          New Portfolio
        </Button>
      </div>

      <WorkspaceGrid 
        workspaces={workspaces}
        onSelectWorkspace={onSelectWorkspace}
        onDeleteWorkspace={handleDeleteWorkspace}
        onCreateClick={() => setIsModalOpen(true)}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Portfolio Workspace"
      >
        <CreateWorkspaceForm
          onSubmit={handleSubmitWorkspace}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
