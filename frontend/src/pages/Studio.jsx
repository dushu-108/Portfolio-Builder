import React, { useState, useEffect, useRef } from 'react';
import { Download, CloudLightning, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import Button from '../components/ui/Button';
import ChatSidebar from '../components/ChatSidebar';
import SandboxViewport from '../components/SandboxViewport';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { SandpackProvider, UnstyledOpenInCodeSandboxButton } from "@codesandbox/sandpack-react";

export default function Studio({ workspace, onBackToDashboard }) {
  const token = useSelector((state) => state.auth.token);
  const { id } = useParams();

  const mapBackendMessages = (backMsgs, projectName) => {
    if (!backMsgs || backMsgs.length === 0) {
      return [
        {
          sender: 'system',
          text: `Hello! I've successfully initialized your "${projectName || 'Portfolio'}" workspace. Ready to help you compile code or make style adjustments.`,
          time: '12:00 PM'
        }
      ];
    }
    return backMsgs.map(msg => ({
      sender: msg.role === 'user' ? 'user' : 'system',
      text: msg.text,
      time: msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '12:00 PM'
    }));
  };

  const [currentWorkspace, setCurrentWorkspace] = useState(workspace || null);
  const [messages, setMessages] = useState([]);
  const [generatedHtml, setGeneratedHtml] = useState("");
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('preview');
  
  const chatEndRef = useRef(null);

  useEffect(() => {
    const loadWorkspace = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const response = await axios.get(`/api/workspaces/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const ws = response.data;
        setCurrentWorkspace(ws);
        setMessages(mapBackendMessages(ws.messages, ws.projectTitle));
        setGeneratedHtml(ws.generatedHtml || "");
      } catch (error) {
        console.error("Error loading workspace:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!currentWorkspace || (currentWorkspace._id !== id && currentWorkspace.id !== id)) {
      loadWorkspace();
    } else {
      setMessages(mapBackendMessages(currentWorkspace.messages, currentWorkspace.projectTitle || currentWorkspace.name));
      setGeneratedHtml(currentWorkspace.generatedHtml || "");
      setLoading(false);
    }
  }, [id, token]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendPrompt = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = {
      sender: 'user',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const textToSend = inputText;
    setInputText('');
    setIsTyping(true);

    try {
      const response = await axios.post(`/api/workspaces/${id}/chat`, 
        { text: textToSend },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      const updated = response.data;
      setMessages(mapBackendMessages(updated.messages, updated.projectTitle));
      setGeneratedHtml(updated.generatedHtml || "");
    } catch (error) {
      console.error("Error sending chat prompt:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'system',
          text: "Sorry, I ran into an error trying to process your request. Please try again.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleDeploy = () => {
    setActiveTab('code');
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });
    
    const depMsg = {
      sender: 'system',
      text: '🎉 Redirected to code editor sandbox! You can modify files directly here.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, depMsg]);
  };

  const handleDownload = () => {
    setActiveTab('code');
  };

  const generateIframeContent = () => {
    return generatedHtml || "";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-canvas-soft">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-ink"></div>
        <p className="font-sans text-sm text-neutral-500 mt-4">Loading your workspace...</p>
      </div>
    );
  }

  return (
    <SandpackProvider
      key={generatedHtml}
      theme="dark"
      template="static"
      files={{
        "/index.html": generatedHtml || "<h1>Loading...</h1>"
      }}
    >
      <div className="flex flex-col h-screen pt-16 overflow-hidden bg-canvas-soft">
        <div className="h-14 border-b border-hairline bg-white flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-2 font-sans text-sm font-medium text-neutral-500">
            <button 
              onClick={onBackToDashboard}
              className="flex items-center gap-1.5 py-1 px-2 text-neutral-500 hover:text-ink cursor-pointer transition-colors duration-150"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <span>Workspaces</span>
            <span>/</span>
            <span className="text-ink font-semibold">{currentWorkspace?.projectTitle || currentWorkspace?.name || 'Workspace'}</span>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={handleDownload}>
              <Download size={14} />
              Download ZIP
            </Button>
            <UnstyledOpenInCodeSandboxButton>
              <Button variant="primary" onClick={handleDeploy}>
                <CloudLightning size={14} />
                Deploy Project
              </Button>
            </UnstyledOpenInCodeSandboxButton>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden h-[calc(100vh-64px-56px)] max-lg:flex-col">
          <ChatSidebar 
            messages={messages}
            inputText={inputText}
            setInputText={setInputText}
            isTyping={isTyping}
            onSubmit={handleSendPrompt}
            chatEndRef={chatEndRef}
          />

          <SandboxViewport 
            srcDoc={generateIframeContent()} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
        </div>
      </div>
    </SandpackProvider>
  );
}
