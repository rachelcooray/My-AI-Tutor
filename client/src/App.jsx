import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import FileUpload from './components/FileUpload';
import ChatInterface from './components/ChatInterface';

function App() {
  const [subject, setSubject] = useState('E1');
  const [mode, setMode] = useState('EXPLAIN');
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleUploadComplete = (fileName) => {
    setUploadedFile(fileName);
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar - Subject & Mode Selection */}
      <Sidebar
        subject={subject}
        setSubject={setSubject}
        mode={mode}
        setMode={setMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col p-6 h-screen overflow-hidden">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {subject === 'E1' ? 'E1: Managing Finance in a Digital World' :
                subject === 'P1' ? 'P1: Management Accounting' :
                  'F1: Financial Reporting'}
            </h2>
            <p className="text-slate-500">
              Mode: <span className="font-medium text-blue-600">{mode === 'EXPLAIN' ? 'Explain Material' : 'Solve Questions'}</span>
            </p>
          </div>

          {uploadedFile && (
            <div className="bg-white px-4 py-2 rounded-full border border-slate-200 text-sm font-medium text-slate-600 shadow-sm">
              Active Material: <span className="text-blue-600">{uploadedFile}</span>
            </div>
          )}
        </header>

        {/* Content Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
          {/* Left Column: Upload & Context */}
          <div className="lg:col-span-1 space-y-6 overflow-y-auto pr-2">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-semibold text-slate-700 mb-4">Study Material</h3>
              <FileUpload onUploadComplete={handleUploadComplete} />

              <div className="mt-6 text-xs text-slate-500 space-y-2">
                <p><strong>Strict Syllabus adherence:</strong></p>
                <p>The AI will prioritize the uploaded content and official syllabus rules.</p>
                <p className="text-amber-600">Note: Reasoning beyond syllabus will be explicitly flagged.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Chat Interface */}
          <div className="lg:col-span-3 h-full min-h-0">
            <ChatInterface subject={subject} mode={mode} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
