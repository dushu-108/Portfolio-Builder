import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout as logoutAction } from './app/reducers/authReducers';
import axios from 'axios';
import NavBar from './components/ui/NavBar';
import Hero from './pages/Hero';
import Dashboard from './pages/Dashboard';
import Studio from './pages/Studio';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
   
  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleAuthSuccess = () => {
    navigate('/dashboard');
  };

  const handleLogout = () => {
    dispatch(logoutAction());
    setSelectedWorkspace(null);
    navigate('/');
  };

  const handleCreateWorkspace = (newWorkspace) => {
    setSelectedWorkspace(newWorkspace);
    navigate(`/workspace/${newWorkspace._id || newWorkspace.id}`);
  };

  const handleSelectWorkspace = async (workspace) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/workspaces/${workspace.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const ws = response.data;
      const mappedWorkspace = {
        id: ws._id,
        _id: ws._id,
        name: ws.projectTitle,
        description: ws.cachedResumeContext || 'No description provided.',
        template: ws.lockedTemplateId,
        resumeFormat: ws.resumeFormat,
        generatedHtml: ws.generatedHtml,
        messages: ws.messages,
        pdfName: ws.pdfName || null,
        lastModified: ws.updatedAt ? new Date(ws.updatedAt).toLocaleDateString() : 'Recently',
        tech: ws.lockedTemplateId === 'terminal' ? ['HTML', 'CSS', 'JS', 'Bash'] : 
              ws.lockedTemplateId === 'bento' ? ['React', 'CSS Grid', 'Inter', 'Framer'] : 
              ['Vite', 'HTML5', 'Vanilla CSS'],
      };
      setSelectedWorkspace(mappedWorkspace);
      navigate(`/workspace/${workspace.id || workspace._id}`);
    } catch (error) {
      console.error("Error fetching workspace details:", error);
    }
  };

  return (
    <>
      <NavBar 
        isAuthenticated={isAuthenticated} 
        currentPath={currentPath} 
        onNavigate={handleNavigate} 
        onLogout={handleLogout}
        avatarUrl={user?.avatar || undefined}
        theme={theme}
        onToggleTheme={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
      />

      <Routes>
        <Route path="/" element={<Hero />} />

        <Route 
          path="/login" 
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login 
                onNavigate={handleNavigate}
                onLoginSuccess={handleAuthSuccess}
              />
            )
          } 
        />

        <Route 
          path="/signup" 
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Signup 
                onNavigate={handleNavigate}
                onSignupSuccess={handleAuthSuccess}
              />
            )
          } 
        />

        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? (
              <Dashboard 
                onCreateWorkspace={handleCreateWorkspace}
                onSelectWorkspace={handleSelectWorkspace}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        <Route 
          path="/workspace/:id" 
          element={
            isAuthenticated ? (
              <Studio 
                workspace={selectedWorkspace}
                onBackToDashboard={() => navigate('/dashboard')}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        <Route 
          path="/profile" 
          element={
            isAuthenticated ? (
              <Profile />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
