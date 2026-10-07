'use client';

import React, { useState, useEffect } from 'react';
import { X, Globe, Copy, Check, Smartphone, Laptop, Cloud, ShieldCheck } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const [copiedLan, setCopiedLan] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [lanUrl, setLanUrl] = useState('http://192.168.0.105:3000');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const port = window.location.port ? `:${window.location.port}` : '';
      if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
        setLanUrl(`http://${hostname}${port}`);
      } else {
        setLanUrl('http://192.168.0.105:3000');
      }
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-studio-900 border border-white/15 rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-5">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Multi-User Access & Sharing</h3>
            <p className="text-xs text-white/50">Allow multiple people and phones to use InstaQuote AI</p>
          </div>
        </div>

        {/* Method 1: Local Network (Same Wi-Fi) */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-cyan-400" />
              1. Instant Same-Wi-Fi Access (Phones & Laptops)
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
              Zero Setup
            </span>
          </div>
          <p className="text-xs text-white/60 leading-relaxed">
            Anyone connected to the same Wi-Fi network (your mobile phone, colleagues, or friends) can open this URL directly in their browser:
          </p>

          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-black/60 border border-white/10">
            <code className="text-xs text-cyan-300 font-mono flex-1 select-all">{lanUrl}</code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(lanUrl);
                setCopiedLan(true);
                setTimeout(() => setCopiedLan(false), 2000);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold transition-all cursor-pointer shrink-0"
            >
              {copiedLan ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLan ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* Method 2: Global 1-Click Free Public Deployment */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Cloud className="w-4 h-4 text-purple-400" />
              2. Permanent Public Internet Link ($0 Free on Vercel)
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
              Global 24/7
            </span>
          </div>
          <p className="text-xs text-white/60 leading-relaxed">
            To share this app with anyone around the world (permanent public <code className="text-purple-300">.vercel.app</code> domain), run this single command in the project folder:
          </p>

          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-black/60 border border-white/10">
            <code className="text-xs text-purple-300 font-mono flex-1 select-all">npx vercel --prod</code>
            <button
              onClick={() => {
                navigator.clipboard.writeText('npx vercel --prod');
                setCopiedCmd(true);
                setTimeout(() => setCopiedCmd(false), 2000);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs font-bold transition-all cursor-pointer shrink-0"
            >
              {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCmd ? 'Copied!' : 'Copy Command'}</span>
            </button>
          </div>
        </div>

        {/* Multi-User Privacy & Security */}
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-2.5 text-xs text-emerald-300 leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p>
            <strong>100% Client-Side Privacy:</strong> Each person who opens the site has their own independent browser session. Quotes, custom watermarks, and Instagram tokens are stored locally on their device and are never shared or mixed with other users.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-colors cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
};
