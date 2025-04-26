import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import MarkdownPortfolio from '../components/MarkdownPortfolio';

const FormBuilder = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const [portfolio, setPortfolio] = useState({
        name: '',
        title: '',
        about: '',
        skills: [],
        projects: []
    });
    const [markdown, setMarkdown] = useState('');
    const [portfolioSitePath, setPortfolioSitePath] = useState('');
    const [showPortfolioButton, setShowPortfolioButton] = useState(false);
    const [portfolioHtml, setPortfolioHtml] = useState('');
    const [portfolioStatus, setPortfolioStatus] = useState('ready');
    const backendBase = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/,'') : 'http://localhost:3000';
    const [newSkill, setNewSkill] = useState('');
    const [newProject, setNewProject] = useState({
        title: '',
        description: '',
        link: ''
    });

    useEffect(() => {
    const fetchAndMaybeGeneratePortfolio = async () => {
      try {
        const response = await axios.get('/portfolio/');
        if (response.data && response.data.portfolio) {
          setPortfolio(response.data.portfolio);
          setMarkdown(response.data.markdown);
          setPortfolioStatus(response.data.status || 'ready');
          if (response.data.html) {
            setPortfolioHtml(response.data.html);
            setShowPortfolioButton(true);
          } else {
            setShowPortfolioButton(false);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching portfolio:', error);
        if (error.response?.status !== 404) {
          toast.error('Failed to load portfolio');
        }
        setLoading(false);
      }
    };
        fetchAndMaybeGeneratePortfolio();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPortfolio(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddSkill = () => {
        if (newSkill.trim()) {
            setPortfolio(prev => ({
                ...prev,
                skills: [...prev.skills, newSkill.trim()]
            }));
            setNewSkill('');
        }
    };

    const handleRemoveSkill = (index) => {
        setPortfolio(prev => ({
            ...prev,
            skills: prev.skills.filter((_, i) => i !== index)
        }));
    };

    const handleProjectChange = (e) => {
        const { name, value } = e.target;
        setNewProject(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddProject = () => {
        if (newProject.title.trim() && newProject.description.trim()) {
            setPortfolio(prev => ({
                ...prev,
                projects: [...prev.projects, { ...newProject }]
            }));
            setNewProject({
                title: '',
                description: '',
                link: ''
            });
        }
    };

    const handleRemoveProject = (index) => {
        setPortfolio(prev => ({
            ...prev,
            projects: prev.projects.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/portfolio/save', portfolio);
            setPortfolio(response.data.portfolio);
            setMarkdown(response.data.markdown);
            setPortfolioStatus(response.data.status || 'pending');
            setIsEditMode(false);
            if (response.data.html) {
                setPortfolioHtml(response.data.html);
                setShowPortfolioButton(true);
            } else {
                setShowPortfolioButton(false);
            }
            toast.success('Portfolio saved! Regenerating website...');
            // Start polling for status
            pollPortfolioStatus();
        } catch (error) {
            console.error('Error saving portfolio:', error);
            toast.error('Failed to save portfolio');
        }
    };

    // Poll for portfolio status until ready
    const pollPortfolioStatus = async () => {
        let attempts = 0;
        const maxAttempts = 40; // ~2 minutes
        const poll = async () => {
            try {
                const response = await axios.get('/portfolio/');
                setPortfolioStatus(response.data.status || 'pending');
                if (response.data.status === 'ready') {
                    setPortfolioHtml(response.data.html);
                    setShowPortfolioButton(true);
                    toast.success('Portfolio website updated!');
                    return;
                } else if (attempts < maxAttempts) {
                    attempts++;
                    setTimeout(poll, 3000);
                } else {
                    toast.error('Portfolio generation is taking too long. Please try again later.');
                }
            } catch (error) {
                console.error('Error polling portfolio status:', error);
                toast.error('Error checking portfolio status.');
            }
        };
        poll();
    };


    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete your portfolio? This action cannot be undone.')) {
            try {
                await axios.delete('/portfolio/delete');
                toast.success('Portfolio deleted successfully!');
                navigate('/');
            } catch (error) {
                console.error('Error deleting portfolio:', error);
                toast.error('Failed to delete portfolio');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (!isEditMode && portfolio._id) {
        return (
            <>
                <MarkdownPortfolio 
                    markdown={markdown}
                    onEdit={() => setIsEditMode(true)}
                    onDelete={handleDelete}
                />
                {portfolioStatus === 'pending' && (
                    <div className="mt-4 flex items-center gap-2">
                        <span className="loading loading-spinner loading-md"></span>
                        <span>Regenerating your portfolio website...</span>
                    </div>
                )}
                <button
                    className="btn btn-success mt-4"
                    disabled={!showPortfolioButton || !portfolioHtml || portfolioStatus !== 'ready'}
                    onClick={() => {
                        if (showPortfolioButton && portfolioHtml && portfolioStatus === 'ready') {
                            const newWindow = window.open();
                            newWindow.document.write(portfolioHtml);
                            newWindow.document.close();
                        } else if (portfolioStatus === 'pending') {
                            toast.info('Please wait, your portfolio is still regenerating.');
                        } else {
                            toast.info('Please save your portfolio before viewing.');
                        }
                    }}
                >
                    View Portfolio
                </button>
            </>
        );
    }

    return (
        <div className="min-h-screen bg-base-300 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">
                    {isEditMode ? 'Edit Your Portfolio' : 'Build Your Portfolio'}
                </h1>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Name Section */}
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">Your Name</h2>
                            <input
                                type="text"
                                name="name"
                                value={portfolio.name}
                                onChange={handleInputChange}
                                placeholder="Enter your name"
                                className="input input-bordered w-full"
                                required
                            />
                        </div>
                    </div>

                    {/* Title Section */}
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">Portfolio Title</h2>
                            <input
                                type="text"
                                name="title"
                                value={portfolio.title}
                                onChange={handleInputChange}
                                placeholder="Enter your portfolio title"
                                className="input input-bordered w-full"
                                required
                            />
                        </div>
                    </div>

                    {/* About Section */}
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">About Me</h2>
                            <textarea
                                name="about"
                                value={portfolio.about}
                                onChange={handleInputChange}
                                placeholder="Tell us about yourself"
                                className="textarea textarea-bordered h-32"
                                required
                            />
                        </div>
                    </div>

                    {/* Skills Section */}
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">Skills</h2>
                            <div className="flex gap-2 mb-4">
                                <input
                                    type="text"
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    placeholder="Add a skill"
                                    className="input input-bordered flex-1"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddSkill}
                                    className="btn btn-primary"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {portfolio.skills.map((skill, index) => (
                                    <div key={index} className="badge badge-primary gap-2">
                                        {skill}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSkill(index)}
                                            className="btn btn-xs btn-circle"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Projects Section */}
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">Projects</h2>
                            <div className="space-y-4">
                                {portfolio.projects.map((project, index) => (
                                    <div key={index} className="card bg-base-200">
                                        <div className="card-body">
                                            <div className="flex justify-between items-start">
                                                <h3 className="card-title">{project.title}</h3>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveProject(index)}
                                                    className="btn btn-sm btn-error"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                            <p>{project.description}</p>
                                            {project.link && (
                                                <a
                                                    href={project.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="link link-primary"
                                                >
                                                    View Project
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="divider">Add New Project</div>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    name="title"
                                    value={newProject.title}
                                    onChange={handleProjectChange}
                                    placeholder="Project Title"
                                    className="input input-bordered w-full"
                                />
                                <textarea
                                    name="description"
                                    value={newProject.description}
                                    onChange={handleProjectChange}
                                    placeholder="Project Description"
                                    className="textarea textarea-bordered w-full"
                                />
                                <input
                                    type="text"
                                    name="link"
                                    value={newProject.link}
                                    onChange={handleProjectChange}
                                    placeholder="Project Link (optional)"
                                    className="input input-bordered w-full"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddProject}
                                    className="btn btn-primary"
                                >
                                    Add Project
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
    {loading ? 'Saving...' : 'Save Portfolio'}
</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormBuilder;