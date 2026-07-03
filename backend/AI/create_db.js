import {configDotenv} from "dotenv";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { MistralAIEmbeddings } from "@langchain/mistralai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import mongoose from "mongoose";

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

    const collection = mongoose.connection.db.collection("vector_resumes");

    await MongoDBAtlasVectorSearch.fromDocuments(chunksWithMetadata, embeddings, {
      collection: collection,
      indexName: process.env.MONGODB_VECTOR_INDEX || "vector_index",
      textKey: "text",
      embeddingKey: "embedding",
    });

    console.log(`Successfully indexed vector embeddings for workspace: ${workspaceId}`);
    return true;
  } catch (error) {
    console.error("Vector Store Optimization Error:", error);
    throw new Error("Failed to generate and persist RAG vector chunks.");
  }
};

