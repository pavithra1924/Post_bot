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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-studio-900 border border-white/15 rounded-2xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Google Gemini API Key</h3>
            <p className="text-xs text-white/50">Optional: For live Gemini 3.8 Flash analysis</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white/70 space-y-2">
            <p className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              100% Free & Stored Locally in Browser
            </p>
            <p>
              InstaQuote AI operates seamlessly with zero keys using its built-in sentiment engine and free Pollinations generative backgrounds. If you want direct Gemini 3.8 Flash intelligence, enter your free Google AI Studio key below.
            </p>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-rose-400 hover:underline"
            >
              Get free Gemini API Key <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-white/70 font-medium">Your API Key</label>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-studio-950 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-rose-500 font-mono"
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button
              onClick={() => {
                setKeyInput('');
                onSaveApiKey('');
                onClose();
              }}
              className="px-3.5 py-2 rounded-xl text-xs text-white/60 hover:text-white transition-colors"
            >
              Clear Key
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white text-xs font-bold shadow-lg shadow-rose-500/20 hover:opacity-90 transition-opacity"
            >
              Save Key
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
