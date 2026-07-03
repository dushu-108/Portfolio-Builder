import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  role: { 
    type: String, 
    enum: ['user', 'assistant', 'system'], 
    required: true 
  },
  text: { 
    type: String, 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

const WorkspaceSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true, 
    index: true 
  },
  
  projectTitle: { 
    type: String, 
    required: true 
  },

  lockedTemplateId: { 
    type: String, 
    required: true 
  },

  resumeFormat: { 
    type: String, 
    default: 'Monochrome' 
  },

  portfolioConfig: {
    colorPalette: { 
        type: String, 
        default: 'default' 
    },
    activeFontPairing: { 
        type: String, 
        default: 'inter-geist' 
    }
  },

  cachedResumeContext: { 
    type: String, 
    required: true 
  },
  
  generatedHtml: { 
    type: String, 
    default: "" 
  },
  
  messages: [MessageSchema],
  
  deploymentUrl: { 
    type: String, 
    default: "" 
  }
}, { timestamps: true });

const Workspace = mongoose.model('Workspace', WorkspaceSchema);
export { Workspace };