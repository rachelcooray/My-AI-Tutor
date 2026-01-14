// Polyfill for PDF.js in Node environment
if (!global.DOMMatrix) {
    global.DOMMatrix = class DOMMatrix {
        constructor() {
            this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.e = 0; this.f = 0;
        }
        toString() { return "matrix(1, 0, 0, 1, 0, 0)"; }
    };
}

const fs = require('fs');
const pdf = require('pdf-parse');
const { RecursiveCharacterTextSplitter } = require('@langchain/textsplitters');
const { GoogleGenerativeAIEmbeddings } = require('@langchain/google-genai');
const { TaskType } = require("@google/generative-ai");

// Custom Simple Vector Store to avoid dependency issues
class SimpleVectorStore {
    constructor(embeddings) {
        this.embeddings = embeddings;
        this.docs = [];
    }

    static async fromDocuments(docs, embeddings) {
        const store = new SimpleVectorStore(embeddings);
        await store.addDocuments(docs);
        return store;
    }

    async addDocuments(docs) {
        const texts = docs.map(d => d.pageContent);
        // Batch embedding (handle limits if necessary, simplified here)
        const vectors = await this.embeddings.embedDocuments(texts);

        docs.forEach((doc, i) => {
            this.docs.push({ ...doc, embedding: vectors[i] });
        });
    }

    async similaritySearch(query, k = 3) {
        const queryEmbedding = await this.embeddings.embedQuery(query);
        const results = this.docs.map(doc => ({
            doc,
            score: this.cosineSimilarity(queryEmbedding, doc.embedding)
        }));

        // Sort descending by score
        results.sort((a, b) => b.score - a.score);
        return results.slice(0, k).map(r => r.doc);
    }

    cosineSimilarity(a, b) {
        let dot = 0;
        let magA = 0;
        let magB = 0;
        for (let i = 0; i < a.length; i++) {
            dot += a[i] * b[i];
            magA += a[i] * a[i];
            magB += b[i] * b[i];
        }
        return dot / (Math.sqrt(magA) * Math.sqrt(magB));
    }
}

// Helper to extract text from PDF
async function extractTextFromPDF(filePath) {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
}

// Main RAG Process
async function processUpload(filePath) {
    console.log("Starting RAG processing for:", filePath);

    // 1. Extract Text
    const rawText = await extractTextFromPDF(filePath);
    console.log("Text extracted. Length:", rawText.length);

    // 2. Chunk Text
    // "Chunk text into ~500–1,000 token sections"
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });

    const docs = await splitter.createDocuments([rawText]);
    console.log(`Created ${docs.length} chunks.`);

    // 3. Generate Embeddings & Store
    // Using simple MemoryVectorStore for this session-based MVP
    const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GEMINI_API_KEY,
        modelName: "embedding-001",
        taskType: TaskType.RETRIEVAL_DOCUMENT,
    });

    const vectorStore = await SimpleVectorStore.fromDocuments(docs, embeddings);
    console.log("Vector store created.");

    return vectorStore;
}

module.exports = { processUpload };
