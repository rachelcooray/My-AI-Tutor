const express = require('express');
const multer = require('multer');
const { processUpload } = require('./ragService');
const { generateResponse } = require('./geminiService');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Multer setup for PDF uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Store processed vector stores in memory (keyed by sessionId or single user for now)
// In a real app, use a proper DB or vector store
let activeVectorStore = null;

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        console.log(`File uploaded: ${req.file.path}`);
        activeVectorStore = await processUpload(req.file.path);

        // Cleanup file after processing
        fs.unlinkSync(req.file.path);

        res.json({ message: 'File processed successfully', fileName: req.file.originalname });
    } catch (error) {
        console.error('Upload processing error:', error);
        res.status(500).json({ error: error.message || 'Failed to process file' });
    }
});

router.post('/chat', async (req, res) => {
    try {
        const { message, subject, mode } = req.body;

        if (!message || !subject || !mode) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (!activeVectorStore) {
            // Allow chat without upload? Prompt says "Primary material -> Uploaded user material"
            // But maybe general questions are okay?
            // Detailed instructions imply we SHOULD utilize uploaded material.
            // For now, if no material, just warn or proceed with syllabus knowledge.
            // Let's proceed but with empty context.
            console.log("No document uploaded yet.");
        }

        const response = await generateResponse({
            message,
            subject,
            mode,
            vectorStore: activeVectorStore
        });

        res.json({ response });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: error.message || 'Failed to generate response' });
    }
});

module.exports = router;
