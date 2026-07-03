import mongoose from 'mongoose';
import connectDB from './connect.js';
import { Workspace } from './models/workspace.js';
import { configDotenv } from 'dotenv';

configDotenv();

async function run() {
  await connectDB();
  const workspaces = await Workspace.find().sort({ updatedAt: -1 });
  console.log(`Found ${workspaces.length} workspaces:`);
  for (const ws of workspaces) {
    console.log(`\nWorkspace: "${ws.projectTitle}" (ID: ${ws._id})`);
    console.log(`- Template: ${ws.lockedTemplateId}`);
    console.log(`- Format: ${ws.resumeFormat}`);
    console.log(`- Messages count: ${ws.messages?.length || 0}`);
    console.log(`- HTML length: ${ws.generatedHtml ? ws.generatedHtml.length : 0} characters`);
    if (ws.generatedHtml) {
      console.log(`- HTML Snippet:\n${ws.generatedHtml.substring(0, 300)}...\n`);
    } else {
      console.log(`- HTML is EMPTY!`);
    }
  }
  mongoose.connection.close();
}

run().catch(console.error);
