import {configDotenv} from "dotenv";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { MistralAIEmbeddings } from "@langchain/mistralai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

configDotenv();

export const initializeVectorStore = async (text, userId, workspaceId) => {
  try {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 600,
      chunkOverlap: 60,
    });
    
    const docs = await splitter.createDocuments([text]);
    const chunksWithMetadata = docs.map((doc) => {
      doc.metadata = {
        userId: String(userId),
        workspaceId: String(workspaceId)
      };
      return doc;
    });

    const embeddings = new MistralAIEmbeddings({
      apiKey: process.env.MISTRAL_API_KEY, 
      model: "mistral-embed",
    });

    await Chroma.fromDocuments(chunksWithMetadata, embeddings, {
      collectionName: "user_resumes",
      url: process.env.CHROMA_URL || "http://localhost:8000", 
    });

    console.log(`Successfully indexed vector embeddings for workspace: ${workspaceId}`);
    return true;
  } catch (error) {
    console.error("Vector Store Optimization Error:", error);
    throw new Error("Failed to generate and persist RAG vector chunks.");
  }
};

