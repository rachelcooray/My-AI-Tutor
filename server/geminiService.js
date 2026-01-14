const { GoogleGenerativeAI } = require('@google/generative-ai');
const PROMPTS = require('./prompts'); // We will create this

if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in environment variables");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" }); // Updated to 2.0 as requested

async function generateResponse({ message, subject, mode, vectorStore }) {
    // 1. Retrieve Context
    let context = "";
    if (vectorStore) {
        // Basic retrieval logic
        // We need to implement vectorStore search. 
        // Assuming vectorStore is a simple object with a search method for now, 
        // or we pass the raw store and use LangChain methods.
        // Let's stick to LangChain interface in ragService and pass "retrieved docs" here?
        // Actually, passing vectorStore here is flexible.
        try {
            const results = await vectorStore.similaritySearch(message, 3); // Top 3 chunks
            context = results.map(doc => doc.pageContent).join("\n\n");
        } catch (e) {
            console.error("Context retrieval failed:", e);
        }
    }

    // 2. Select System Prompt
    const systemPrompt = PROMPTS[subject] || PROMPTS.DEFAULT;

    // 3. Construct Final Prompt
    const finalPrompt = `
SYSTEM:
${systemPrompt}

AUTHORITATIVE MATERIAL FROM UPLOAD:
${context || "No material uploaded."}

USER INSTRUCTION (${mode}):
${mode === 'EXPLAIN' ? PROMPTS.MODE_EXPLAIN : PROMPTS.MODE_SOLVE}

USER QUERY:
${message}

RULES:
- Prioritise provided material
- Use reasoning only if required
- Do not hallucinate
- If reasoning beyond syllabus, state: "This explanation uses general business logic to support understanding; the examinable rule remains as defined by CIMA."
`;

    // 4. Call Gemini
    try {
        const result = await model.generateContent(finalPrompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
}

module.exports = { generateResponse };
