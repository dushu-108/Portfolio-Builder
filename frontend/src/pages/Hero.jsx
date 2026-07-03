import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { useSelector } from 'react-redux';

export default function Hero() {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col justify-center">
      <div className="mesh-gradient-container">
        <div className="mesh-gradient-backdrop"></div>
      </div>

      <div className="flex flex-col items-center justify-center text-center px-6 py-28 max-w-[800px] mx-auto z-10">
        <span className="font-mono text-xs font-medium text-ink tracking-widest uppercase bg-link-soft px-3 py-1 rounded-pill mb-6">
          AUTOMATED PORTFOLIO GENERATION FOR DEVELOPERS.
        </span>
        <h1 className="font-sans text-5xl font-semibold tracking-[-2.4px] leading-tight text-ink mb-6">
          From raw resume to a live deployment in seconds.
        </h1>
        <p className="font-sans text-lg font-normal leading-7 text-neutral-600 max-w-[600px] mb-9">
          Ditch manual frontend coding. Upload your CV or prompt our Mistral AI engine to render, customize, and compile beautiful portfolios on the fly.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Button variant="primary" onClick={() => navigate(isAuthenticated ? '/dashboard' : '/signup')}>
            {isAuthenticated ? 'Go to Dashboard' : 'Get Started for Free'}
            <ArrowRight size={16} />
          </Button>
          {!isAuthenticated && <Button variant="secondary" onClick={() => navigate('/login')}>
            View Examples
          </Button>}
        </div>
      </div>

      <div className="max-w-[1000px] w-full mx-auto mb-20 px-6 z-10">
        <div className="bg-white rounded-lg border border-hairline shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="h-10 bg-canvas-soft border-b border-hairline flex items-center px-4 gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#ff5f56]" />
            <div className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
            <div className="w-2 h-2 rounded-full bg-[#27c93f]" />
            <div className="bg-white border border-hairline rounded-sm text-[11px] px-8 py-0.5 mx-auto font-mono text-neutral-400">
              portfolio-builder.vercel.app/studio
            </div>
          </div>
          
          <div className="grid grid-cols-[300px_1fr] h-[420px] max-md:grid-cols-1">
            <div className="border-r border-hairline p-4 text-left flex flex-col justify-between bg-white max-md:hidden">
              <div className="flex flex-col gap-3">
                <div className="p-3 bg-canvas-soft2 rounded-md text-xs">
                  <strong className="block text-[10px] text-neutral-400 mb-1">You</strong>
                  Change the background style to dark polarity.
                </div>
                <div className="p-3 border border-hairline rounded-md text-xs">
                  <strong className="block text-[10px] text-link-blue mb-1">Mistral AI</strong>
                  Modifying root variables, compiling code blocks...
                </div>
              </div>
              <div className="border border-hairline rounded-md p-2 flex justify-between items-center bg-canvas-soft text-xs text-neutral-400">
                <span>Prompt compiler...</span>
                <div className="w-5 h-5 bg-ink rounded-sm flex items-center justify-center text-white text-[10px] font-bold">^</div>
              </div>
            </div>

            <div className="bg-canvas-soft p-6 flex items-center justify-center">
              <div className="w-full h-full bg-ink text-white rounded-md border border-neutral-800 shadow-xl p-6 flex flex-col justify-center text-left">
                <span className="text-[10px] text-purple-400 font-semibold tracking-wider uppercase">Preview Workspace</span>
                <h2 className="text-3xl text-white font-semibold mt-1 mb-1 tracking-[-1.28px]">John Doe</h2>
                <p className="text-sm text-neutral-400 mt-1 mb-4">Senior Full-Stack Engineer</p>
                <div className="flex gap-1.5 flex-wrap">
                  <span className="text-[11px] bg-neutral-800 px-2 py-0.5 rounded-sm">React.js</span>
                  <span className="text-[11px] bg-neutral-800 px-2 py-0.5 rounded-sm">Node.js</span>
                  <span className="text-[11px] bg-neutral-800 px-2 py-0.5 rounded-sm">TypeScript</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
