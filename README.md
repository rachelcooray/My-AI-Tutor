# CIMA AI Study Assistant

A personalized, AI-powered study assistant for CIMA Operational Level (E1, P1, F1).

This application behaves like a private tutor, helping you understand study material and solve exam-style questions while strictly adhering to the CIMA syllabus. It uses **Retrieval-Augmented Generation (RAG)** to ground answers in your uploaded PDF materials.

## ✨ Features

-   **Subject Locking**: Dedicated modes for E1, P1, and F1 to prevent cross-subject confusion.
-   **RAG (Retrieval-Augmented Generation)**: Upload your own study PDFs. The AI prioritizes this content over general knowledge to ensure syllabus alignment.
-   **Two Study Modes**:
    -   **Explain Mode**: Breaks down concepts simply for learning.
    -   **Solve Mode**: Step-by-step reasoning for exam-style calculations and scenarios.
-   **Strict Guardrails**: Explicitly states when reasoning goes beyond the syllabus or if information is missing.
-   **Secure**: API keys are managed via environment variables and never exposed to the client.

## 🛠️ Tech Stack

-   **Frontend**: React (Vite), Tailwind CSS, Lucide Icons, Framer Motion
-   **Backend**: Node.js, Express
-   **AI**: Google Gemini 2.0 Flash (Experimental)
-   **RAG Pipeline**: LangChain, PDF.js, In-memory Vector Store

## 🚀 Getting Started

### Prerequisites

-   Node.js (v18 or higher)
-   Google Gemini API Key

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/rachelcooray/My-AI-Tutor.git
    cd My-AI-Tutor
    ```

2.  **Setup the Server**
    ```bash
    cd server
    npm install
    ```

3.  **Configure Credentials**
    Create a `.env` file in the `server` directory:
    ```env
    GEMINI_API_KEY=your_api_key_here
    PORT=3000
    ```

4.  **Setup the Client**
    ```bash
    cd ../client
    npm install
    ```

### Running the Application

You need to run the backend and frontend in separate terminals.

**Terminal 1: Backend**
```bash
cd server
node index.js
```

**Terminal 2: Frontend**
```bash
cd client
npm run dev
```

Open your browser to the URL shown in the frontend terminal (usually `http://localhost:5173` or `http://localhost:5174`).

## ⚠️ Security Note

This project uses a `.gitignore` file to ensure the `.env` file containing your API key is **never** committed to version control. Always keep your API keys private.

## License

This project is for educational purposes.