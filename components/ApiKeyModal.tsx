'use client';

import React, { useState } from 'react';
import { X, Key, ExternalLink, ShieldCheck } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
}) => {
  const [keyInput, setKeyInput] = useState(apiKey);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveApiKey(keyInput.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 shadow-xs">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Google Gemini API Key</h3>
            <p className="text-xs text-slate-500">Optional: For direct Gemini 3.8 Flash intelligence</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
            <p className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              100% Free & Stored Locally in Browser
            </p>
            <p className="leading-relaxed text-slate-600">
              InstaQuote AI operates seamlessly with zero keys using its built-in sentiment engine and free Pollinations generative backgrounds. If you want direct Gemini 3.8 Flash intelligence, enter your free Google AI Studio key below.
            </p>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-amber-700 font-bold hover:underline"
            >
              Get free Gemini API Key <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-700 font-bold">Your API Key</label>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 font-mono transition-all"
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button
              onClick={() => {
                setKeyInput('');
                onSaveApiKey('');
                onClose();
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Clear Key
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-white text-xs font-bold shadow-md shadow-rose-500/20 hover:opacity-95 transition-opacity cursor-pointer"
            >
              Save Key
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
