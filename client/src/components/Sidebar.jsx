import React from 'react';
import { BookOpen, Calculator, FileText, Settings, Upload } from 'lucide-react';
import clsx from 'clsx';

const SUBJECTS = [
    { id: 'E1', name: 'E1: Managing Finance in a Digital World', color: 'bg-blue-600' },
    { id: 'P1', name: 'P1: Management Accounting', color: 'bg-green-600' },
    { id: 'F1', name: 'F1: Financial Reporting', color: 'bg-purple-600' }
];

const MODES = [
    { id: 'EXPLAIN', label: 'Explain Material', icon: BookOpen },
    { id: 'SOLVE', label: 'Solve Question', icon: Calculator }
];

export default function Sidebar({ subject, setSubject, mode, setMode }) {
    return (
        <div className="w-80 bg-slate-900 text-white h-screen flex flex-col p-6 shadow-xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-white mb-2">CIMA AI Tutor</h1>
                <p className="text-slate-400 text-sm">Your personal study assistant</p>
            </div>

            {/* Subject Selection */}
            <div className="mb-8">
                <h2 className="text-xs font-semibold uppercase text-slate-500 mb-4 tracking-wider">Select Subject</h2>
                <div className="space-y-2">
                    {SUBJECTS.map((sub) => (
                        <button
                            key={sub.id}
                            onClick={() => setSubject(sub.id)}
                            className={clsx(
                                "w-full text-left p-3 rounded-lg transition-all border border-transparent",
                                subject === sub.id
                                    ? `${sub.color} shadow-lg border-white/10 font-medium`
                                    : "hover:bg-slate-800 text-slate-300"
                            )}
                        >
                            <span className="font-bold mr-2">{sub.id}</span>
                            <span className="text-sm opacity-90 truncate">{sub.name.split(':')[1]}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Mode Selection */}
            <div>
                <h2 className="text-xs font-semibold uppercase text-slate-500 mb-4 tracking-wider">Study Mode</h2>
                <div className="grid grid-cols-1 gap-2">
                    {MODES.map((m) => {
                        const Icon = m.icon;
                        return (
                            <button
                                key={m.id}
                                onClick={() => setMode(m.id)}
                                className={clsx(
                                    "flex items-center p-3 rounded-lg transition-all border",
                                    mode === m.id
                                        ? "bg-slate-800 border-slate-600 text-white shadow-sm"
                                        : "border-transparent hover:bg-slate-800/50 text-slate-400"
                                )}
                            >
                                <Icon className="w-5 h-5 mr-3" />
                                <span className="font-medium text-sm">{m.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="mt-auto pt-6 border-t border-slate-800">
                <div className="flex items-center text-xs text-slate-500">
                    <Settings className="w-4 h-4 mr-2" />
                    <span>v1.0.0 • Operational Level</span>
                </div>
            </div>
        </div>
    );
}
