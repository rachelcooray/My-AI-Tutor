import React, { useState } from 'react';
import { Upload, File, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import clsx from 'clsx';

export default function FileUpload({ onUploadComplete }) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [fileStatus, setFileStatus] = useState(null); // null | 'success' | 'error'
    const [errorMessage, setErrorMessage] = useState('');

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    };

    const uploadFile = async (file) => {
        setIsUploading(true);
        setFileStatus(null);
        setErrorMessage('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await api.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setFileStatus('success');
            onUploadComplete(file.name);
        } catch (err) {
            console.error(err);
            setFileStatus('error');
            const msg = err.response?.data?.error
                || err.message
                || JSON.stringify(err);
            setErrorMessage(`Error: ${msg} (Target: ${api.defaults.baseURL})`);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            uploadFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            uploadFile(e.target.files[0]);
        }
    };

    return (
        <div className="mb-6">
            <div
                className={clsx(
                    "relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer group",
                    isDragging ? "border-blue-500 bg-blue-50/50" : "border-slate-200 hover:border-blue-400 hover:bg-slate-50",
                    fileStatus === 'success' && "border-green-500 bg-green-50/30"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload').click()}
            >
                <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".pdf"
                    onChange={handleChange}
                />

                <div className="flex flex-col items-center justify-center space-y-3">
                    {isUploading ? (
                        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                    ) : fileStatus === 'success' ? (
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    ) : fileStatus === 'error' ? (
                        <AlertCircle className="w-10 h-10 text-red-500" />
                    ) : (
                        <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                            <Upload className="w-6 h-6 text-blue-600" />
                        </div>
                    )}

                    <div className="text-sm">
                        {isUploading ? (
                            <span className="text-slate-500 font-medium">Uploading material...</span>
                        ) : fileStatus === 'success' ? (
                            <span className="text-green-600 font-medium">Material loaded successfully</span>
                        ) : fileStatus === 'error' ? (
                            <span className="text-red-600 font-medium">{errorMessage}</span>
                        ) : (
                            <div>
                                <span className="text-slate-700 font-medium">Click to upload</span>
                                <span className="text-slate-500"> or drag PDF here</span>
                            </div>
                        )}
                    </div>
                    <p className="text-xs text-slate-400">Supported: PDF files (Max 10MB)</p>
                </div>
            </div>
        </div>
    );
}
