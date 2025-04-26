import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Home = () => {
  const { isAuthenticated, portfolio, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-base-300 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-base-300">
        <div className="hero min-h-screen bg-base-300">
          <div className="hero-content text-center">
            <div className="max-w-3xl">
              <h1 className="text-7xl font-bold text-primary mb-8">Welcome to<br />Portfolio Builder</h1>
              <p className="text-xl opacity-90 mb-12 max-w-2xl mx-auto">
                Create your professional portfolio with ease. Showcase your skills and projects in a beautiful, modern layout.
              </p>
              <div className="flex gap-4 justify-center">
                <Link to="/login" className="btn btn-primary btn-lg">Login</Link>
                <Link to="/register" className="btn btn-secondary btn-lg">Register</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen w-full bg-base-300">
        <div className="hero min-h-screen bg-base-300">
          <div className="hero-content text-center">
            <div className="max-w-3xl">
              <h1 className="text-6xl font-bold text-primary mb-8">Create Your Portfolio</h1>
              <p className="text-xl opacity-90 mb-12 max-w-2xl mx-auto">
                Start building your professional portfolio today. Showcase your skills and projects in a beautiful, modern layout.
              </p>
              <Link to="/builder" className="btn btn-primary btn-lg">Start Building</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-base-300">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="hero bg-base-100 rounded-box shadow-xl p-8 mb-8">
          <div className="hero-content text-center">
            <div>
              <h1 className="text-5xl font-bold">{portfolio.title}</h1>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h2 className="card-title text-2xl">About</h2>
            <p className="text-lg opacity-90">{portfolio.about}</p>
          </div>
        </div>

        {/* Skills Section */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h2 className="card-title text-2xl">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {portfolio.skills.map((skill, index) => (
                <span key={index} className="badge badge-primary badge-lg p-4 text-lg">{skill}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">Projects</h2>
            <div className="grid gap-6">
              {portfolio.projects.map((project, index) => (
                <div key={index} className="card bg-base-200 shadow-lg">
                  <div className="card-body">
                    <h3 className="card-title text-xl">{project.title}</h3>
                    <p className="opacity-90">{project.description}</p>
                    {project.link && (
                      <div className="card-actions justify-end mt-4">
                        <a 
                          href={project.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="btn btn-primary btn-outline"
                        >
                          View Project
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Edit Button */}
        <div className="flex justify-end">
          <Link to="/builder" className="btn btn-primary btn-lg">
            Edit Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home; 