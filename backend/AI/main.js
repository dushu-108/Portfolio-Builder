import { configDotenv } from "dotenv";
import { MistralAIEmbeddings, ChatMistralAI } from "@langchain/mistralai";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { Workspace } from "../models/workspace.js";
import connectDB from "../connect.js";
import mongoose from "mongoose";
import readline from "readline";

configDotenv();

export function extractHtml(text) {
  if (!text) return "";
  
  const htmlMatch = text.match(/```\s*(?:html|xml)?\s*([\s\S]*?)\s*```/i);
  if (htmlMatch && htmlMatch[1].trim()) {
    return htmlMatch[1].trim();
  }
  
  const docTypeIdx = text.toLowerCase().indexOf("<!doctype");
  const htmlStartIdx = text.toLowerCase().indexOf("<html");
  
  let startIdx = -1;
  if (docTypeIdx !== -1 && htmlStartIdx !== -1) {
    startIdx = Math.min(docTypeIdx, htmlStartIdx);
  } else {
    startIdx = docTypeIdx !== -1 ? docTypeIdx : htmlStartIdx;
  }
  
  if (startIdx !== -1) {
    const htmlEndIdx = text.toLowerCase().lastIndexOf("</html>");
    if (htmlEndIdx !== -1) {
      return text.substring(startIdx, htmlEndIdx + 7).trim();
    }
    return text.substring(startIdx).trim();
  }
  
  if (text.includes("<html") || text.includes("<!DOCTYPE") || text.includes("<body>")) {
    return text.trim();
  }
  
  return "";
}

export const templateHandlers = {
  minimalist: {
    systemPrompt: `Format the output as a beautiful, highly premium MINIMALIST single-page portfolio website.
Style Rules:
- Background: Pure white (#ffffff) or ultra-soft gray (#fafafa) canvas.
- Typography: Inter, system-ui, sans-serif. Use high-contrast ink-black text (#171717).
- Layout: Clean vertical single-column layout, generous padding/margins, minimal thin borders (#eaeaea).
- Sections: Minimal header with developer name & title, short professional bio/intro, work experience list (styled as a clean timeline), project list with links, categorized list of skills, and simple contact details.`
  },
  bento: {
    systemPrompt: `Format the output as a modern, premium BENTO GRID portfolio website.
Style Rules:
- Background: Elegant soft gray (#f3f4f6).
- Typography: Outfit, system-ui, sans-serif.
- Layout: CSS Grid layout with different sized grid "cards" (Bento Box style).
- Cards Styling: Rounded corners (16px), white background (#ffffff), subtle borders (#e5e7eb), light shadows (0 4px 6px -1px rgba(0,0,0,0.05)), hover transitions (scale up slightly).
- Cards to include: Profile Card, About Bio Card, Skill Badges Grid Card, Featured Projects Grid, and a Contact Card.`
  },
  terminal: {
    systemPrompt: `Format the output as a developer-themed interactive CLI TERMINAL portfolio website.
Style Rules:
- Background: Deep black (#0a0a0a) or terminal dark (#121214).
- Typography: Monospace ('Fira Code', 'JetBrains Mono', Courier New, monospace).
- Colors: Command prompts in neon green (#00ff66) or cyan (#00f0ff), text in clean light gray (#e5e7eb), and comments in muted gray (#6b7280).
- Layout: Simulate a terminal console wrapper. Header includes system boot up stats. Sections represent shell command inputs and outputs (e.g. \`$ cat bio.md\`, \`$ ./skills.sh\`).`
  },
  creative: {
    systemPrompt: `Format the output as a colorful, modern CREATIVE portfolio website.
Style Rules:
- Background: Soft, modern colorful gradient backgrounds (e.g., linear gradient from deep violet to soft pink or indigo).
- Typography: Plus Jakarta Sans, system-ui, sans-serif.
- Styling: Glassmorphism elements using card overlays with backdrop-filter blur (e.g., background: rgba(255,255,255,0.7); backdrop-filter: blur(10px)).
- Layout: Fluid asymmetric layouts, soft shadows, vibrant badges, and engaging typography sizes.`
  }
};

export async function generateInitialPortfolio(workspaceId) {
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) throw new Error("Workspace not found");

  const embeddingModel = new MistralAIEmbeddings({
    apiKey: process.env.MISTRAL_API_KEY,
    model: "mistral-embed"
  });

  const collection = mongoose.connection.db.collection("vector_resumes");

  const vectorStore = new MongoDBAtlasVectorSearch(embeddingModel, {
    collection: collection,
    indexName: process.env.MONGODB_VECTOR_INDEX || "vector_index",
    textKey: "text",
    embeddingKey: "embedding"
  });

  const retriever = vectorStore.asRetriever({
    searchType: "similarity",
    k: 6,
    filter: {
      preFilter: {
        "workspaceId": { $eq: String(workspaceId) }
      }
    }
  });

  const docs = await retriever.invoke("skills education work experience projects profile summary contact");
  console.log(`[RAG DEBUG] Retrieved ${docs.length} context documents for workspace ${workspaceId}`);
  const context = docs.map((doc) => doc.pageContent).join("\n\n");

  const templateId = workspace.lockedTemplateId || "minimalist";
  const handler = templateHandlers[templateId] || templateHandlers.minimalist;

  const systemPrompt = `You are a professional web developer and designer AI.
Your goal is to build a premium single-page portfolio website using the user's resume context.
You must output a complete, valid, self-contained HTML page containing all structural tags, layout structure, and styling inside a single markdown code block starting with \`\`\`html and ending with \`\`\`.
Do not output any introductory, explanatory, or concluding text. Just return the single HTML code block.

Design Theme/Format choice: ${workspace.resumeFormat || 'Monochrome'}
Layout Style requirements:
${handler.systemPrompt}
`;

  const humanPrompt = `Create a beautiful, fully complete portfolio website based on the following resume context:
---
${context}
---
`;

  const llm = new ChatMistralAI({
    apiKey: process.env.MISTRAL_API_KEY,
    model: "mistral-small-2603",
    temperature: 0.2
  });

  const response = await llm.invoke([
    ["system", systemPrompt],
    ["human", humanPrompt]
  ]);
  const aiText = response.content;

  const htmlCode = extractHtml(aiText);

  if (htmlCode) {
    workspace.generatedHtml = htmlCode;
    workspace.messages.push({
      role: "assistant",
      text: `I've successfully created the initial HTML mockup of your portfolio page using the "${workspace.lockedTemplateId}" design layout. You can preview it in the sandbox frame!`
    });
    await workspace.save();
  }

  return workspace;
}

export async function updatePortfolioWithChat(workspaceId, userMessageText) {
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) throw new Error("Workspace not found");

  const embeddingModel = new MistralAIEmbeddings({
    apiKey: process.env.MISTRAL_API_KEY,
    model: "mistral-embed"
  });

  const collection = mongoose.connection.db.collection("vector_resumes");

  const vectorStore = new MongoDBAtlasVectorSearch(embeddingModel, {
    collection: collection,
    indexName: process.env.MONGODB_VECTOR_INDEX || "vector_index",
    textKey: "text",
    embeddingKey: "embedding"
  });

  const retriever = vectorStore.asRetriever({
    searchType: "similarity",
    k: 4,
    filter: {
      preFilter: {
        "workspaceId": { $eq: String(workspaceId) }
      }
    }
  });

  const docs = await retriever.invoke(userMessageText);
  console.log(`[RAG DEBUG] Retrieved ${docs.length} context documents during chat for workspace ${workspaceId}`);
  const context = docs.map((doc) => doc.pageContent).join("\n\n");

  const templateId = workspace.lockedTemplateId || "minimalist";
  const handler = templateHandlers[templateId] || templateHandlers.minimalist;

  const historicalMessages = workspace.messages.slice(-10);

  const codeSystemPrompt = `You are a professional web developer and designer AI.
Your ONLY task is to write and update the portfolio website's HTML/CSS code based on the user's instructions.
You must output a complete, valid, self-contained HTML page containing all structural tags and styling inside a single markdown code block starting with \`\`\`html and ending with \`\`\`. Do not include any explanations, greetings, or commentary outside of the code block.

Design Theme/Format choice: ${workspace.resumeFormat || 'Monochrome'}
Layout Style requirements:
${handler.systemPrompt}
`;

  const codeMessages = [
    ["system", codeSystemPrompt]
  ];

  for (const msg of historicalMessages) {
    if (msg.role === 'user') {
      codeMessages.push(["human", msg.text]);
    } else if (msg.role === 'assistant') {
      codeMessages.push(["ai", msg.text || "Updated the portfolio code based on instructions."]);
    }
  }

  const codeHumanPrompt = `Update the website based on my request: "${userMessageText}"
Use the relevant context from my resume if needed:
---
${context}
---

Current Portfolio HTML Code to update:
\`\`\`html
${workspace.generatedHtml || ""}
\`\`\`
`;
  codeMessages.push(["human", codeHumanPrompt]);

  const codeLlm = new ChatMistralAI({
    apiKey: process.env.MISTRAL_API_KEY,
    model: "mistral-small-2603",
    temperature: 0.2
  });

  const codeResponse = await codeLlm.invoke(codeMessages);
  const codeText = codeResponse.content;

  const htmlCode = extractHtml(codeText);

  const mistralSystemPrompt = `You are a friendly, professional developer companion AI.
Your goal is to reply to the user's request conversationally, explaining what changes were made.
Keep your response concise, helpful, and natural (1-3 sentences). Confirm that the layout/styles have been compiled.

Design Theme/Format choice: ${workspace.resumeFormat || 'Monochrome'}
`;

  const mistralMessages = [
    ["system", mistralSystemPrompt]
  ];

  for (const msg of historicalMessages) {
    if (msg.role === 'user') {
      mistralMessages.push(["human", msg.text]);
    } else if (msg.role === 'assistant') {
      mistralMessages.push(["ai", msg.text]);
    }
  }

  const mistralHumanPrompt = `The user requested: "${userMessageText}"
Confirm that you have updated the code in the workspace and explain the changes briefly.`;
  mistralMessages.push(["human", mistralHumanPrompt]);

  let aiExplanation = "I have successfully updated your portfolio's layout, styles, and content based on your request. Check the updated preview in the sandbox viewport.";
  try {
    const mistralLlm = new ChatMistralAI({
      apiKey: process.env.MISTRAL_API_KEY,
      model: "mistral-small-latest",
      temperature: 0.7
    });

    const mistralResponse = await mistralLlm.invoke(mistralMessages);
    if (mistralResponse && mistralResponse.content) {
      aiExplanation = mistralResponse.content.trim();
    }
  } catch (err) {
    console.error("Mistral AI chat completion failed, using fallback explanation:", err);
  }

  workspace.messages.push({
    role: "user",
    text: userMessageText
  });

  workspace.messages.push({
    role: "assistant",
    text: aiExplanation
  });

  if (htmlCode) {
    workspace.generatedHtml = htmlCode;
  }

  await workspace.save();
  return workspace;
}

async function runRAGPipeline() {
  await connectDB();
  
  const workspace = await Workspace.findOne().sort({ updatedAt: -1 });
  if (!workspace) {
    console.log("No workspaces found in MongoDB database. Please create one in the app first.");
    process.exit(0);
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const askQuestion = () => {
    rl.question("\nYou: ", async (query) => {
      if (query.trim().toLowerCase() === "exit") {
        rl.close();
        process.exit(0);
      }

      try {
        console.log("Processing chat prompt and updating portfolio...");
        const updated = await updatePortfolioWithChat(workspace._id, query);
        const lastAiMsg = updated.messages[updated.messages.length - 1];
        console.log(`\nAI: ${lastAiMsg.text}`);
        console.log(`[HTML updated: ${updated.generatedHtml.length} bytes]`);
      } catch (error) {
        console.error("An error occurred during retrieval/generation:", error);
      }

      askQuestion();
    });
  };
  askQuestion();
}

if (process.argv[1] && process.argv[1].endsWith("main.js")) {
  runRAGPipeline().catch(console.error);
}
