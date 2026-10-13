'use client';

import React, { useState } from 'react';
import {
  X,
  Send,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Sparkles,
  Copy,
  Check,
  Download,
  Smartphone,
  Share2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface InstagramPublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImageUrl: string;
  currentCaption: string;
}

export const InstagramPublishModal: React.FC<InstagramPublishModalProps> = ({
  isOpen,
  onClose,
  currentImageUrl,
  currentCaption,
}) => {
  const [activeTab, setActiveTab] = useState<'fast' | 'api'>('fast');
  const [copiedCaption, setCopiedCaption] = useState(false);

  // Meta Graph API State
  const [igUserId, setIgUserId] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('ig_user_id') || '';
    return '';
  });
  const [accessToken, setAccessToken] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('ig_access_token') || '';
    return '';
  });

  const [isVerifying, setIsVerifying] = useState(false);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [verifiedAccount, setVerifiedAccount] = useState<{ username: string } | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  // 1-Click Fast Post Handler (Native Mobile Share or Web Workflow)
  const handleFastShare = async () => {
    // 1. Copy caption to clipboard
    try {
      await navigator.clipboard.writeText(currentCaption);
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 3000);
    } catch (_) {}

    // 2. Try native Web Share API on mobile
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Spark Within Post',
          text: currentCaption,
          url: currentImageUrl || undefined,
        });
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        return;
      } catch (err) {
        // Fallback to web link
      }
    }

    // 3. Fallback: Open Instagram in new window
    window.open('https://www.instagram.com/', '_blank');
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  };

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(currentCaption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2500);
  };

  // Auto-discover Instagram Account ID from Access Token
  const handleAutoDiscover = async () => {
    if (!accessToken.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Please paste your Meta Graph API Access Token first to auto-detect your account.',
      });
      return;
    }
    setIsDiscovering(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/instagram/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'discover',
          accessToken: accessToken.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.account) {
        setIgUserId(data.account.id);
        setVerifiedAccount({ username: data.account.username });
        localStorage.setItem('ig_user_id', data.account.id);
        localStorage.setItem('ig_access_token', accessToken.trim());
        setStatusMessage({
          type: 'success',
          text: `✨ Successfully detected @${data.account.username} (Account ID: ${data.account.id})! Ready to auto-publish.`,
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: data.error || 'Could not auto-detect Instagram ID.',
        });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Auto-discovery connection failed.' });
    } finally {
      setIsDiscovering(false);
    }
  };

  const handleVerify = async () => {
    if (!igUserId.trim() || !accessToken.trim()) {
      setStatusMessage({ type: 'error', text: 'Please provide both Instagram User ID and Access Token.' });
      return;
    }
    setIsVerifying(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/instagram/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify',
          igUserId: igUserId.trim(),
          accessToken: accessToken.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.valid && data.account) {
        setVerifiedAccount({ username: data.account.username });
        localStorage.setItem('ig_user_id', igUserId.trim());
        localStorage.setItem('ig_access_token', accessToken.trim());
        setStatusMessage({
          type: 'success',
          text: `Connected to @${data.account.username}! Ready to auto-publish.`,
        });
      } else {
        setVerifiedAccount(null);
        setStatusMessage({
          type: 'error',
          text: data.error || 'Failed to verify Instagram account. Check credentials.',
        });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Connection failed.' });
    } finally {
      setIsVerifying(false);
    }
  };

  const handlePublish = async () => {
    if (!igUserId || !accessToken) {
      setStatusMessage({ type: 'error', text: 'Please connect your Instagram account first.' });
      return;
    }
    setIsPublishing(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/instagram/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          igUserId: igUserId.trim(),
          accessToken: accessToken.trim(),
          imageUrl: currentImageUrl,
          caption: currentCaption,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage({
          type: 'success',
          text: `🎉 Post published successfully to Instagram! Post ID: ${data.postId}`,
        });
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: data.error || 'Failed to publish post to Instagram.',
        });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Publishing failed.' });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-studio-900 border border-white/15 rounded-3xl p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto space-y-5">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white shadow-lg shadow-rose-500/20">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Post to Instagram</h3>
            <p className="text-xs text-white/50">Publish posts & reels directly to @_sparkwithin_hub_</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-black/40 border border-white/10">
          <button
            onClick={() => setActiveTab('fast')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'fast'
                ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>⚡ 1-Click Fast Post (Free)</span>
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'api'
                ? 'bg-gradient-to-r from-purple-600 to-rose-600 text-white shadow-md'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>🤖 Meta API (Direct)</span>
          </button>
        </div>

        {/* TAB 1: 1-Click Fast Post Workflow (Zero Setup, 100% Reliable) */}
        {activeTab === 'fast' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-purple-500/10 border border-rose-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-rose-400" />
                  Easiest Creator Workflow (Takes 15s)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  Zero Token Setup
                </span>
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                Click the button below to automatically copy your viral caption and open Instagram ready to post!
              </p>

              {/* Action: Open & Post on Instagram */}
              <button
                onClick={handleFastShare}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 via-purple-600 to-amber-500 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-rose-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>🚀 Open & Post to Instagram Now</span>
              </button>
            </div>

            {/* Quick Caption Box */}
            <div className="space-y-2 p-3.5 rounded-2xl bg-black/40 border border-white/10">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/60 font-semibold">Ready Caption & Hashtags:</span>
                <button
                  onClick={handleCopyCaption}
                  className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 font-bold cursor-pointer"
                >
                  {copiedCaption ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCaption ? 'Copied to Clipboard!' : 'Copy Caption'}</span>
                </button>
              </div>
              <textarea
                rows={4}
                readOnly
                value={currentCaption}
                className="w-full bg-transparent border-0 text-xs text-white/80 leading-relaxed resize-none focus:outline-none scrollbar-none select-all"
              />
            </div>
          </div>
        )}

        {/* TAB 2: Meta Graph API Auto-Publish */}
        {activeTab === 'api' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white/70 space-y-1">
              <p className="font-semibold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                Meta Graph API Direct Publishing
              </p>
              <p className="text-white/60 text-[11px]">
                Requires a Meta Developer Business App with <code className="text-rose-300 font-mono">instagram_content_publish</code> permissions.
              </p>
            </div>

            {/* Input Fields */}
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-white/70">Meta Graph API Access Token</label>
                <input
                  type="password"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  placeholder="Paste your EAAP... token here"
                  className="w-full bg-studio-950 border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-white/30 focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Auto-Detect Account ID Button */}
              <button
                type="button"
                onClick={handleAutoDiscover}
                disabled={isDiscovering || !accessToken.trim()}
                className="w-full py-2 rounded-xl bg-gradient-to-r from-purple-500/20 via-rose-500/20 to-amber-500/20 hover:from-purple-500/30 hover:to-amber-500/30 border border-purple-500/40 text-xs font-bold text-purple-300 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
              >
                {isDiscovering ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-400" /> : <Sparkles className="w-3.5 h-3.5 text-purple-400" />}
                <span>{isDiscovering ? 'Detecting your Instagram page...' : '✨ Auto-Detect My Instagram Account ID'}</span>
              </button>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-white/70">Instagram Account ID</label>
                <input
                  type="text"
                  value={igUserId}
                  onChange={(e) => setIgUserId(e.target.value)}
                  placeholder="e.g. 17841400000000000"
                  className="w-full bg-studio-950 border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-white/30 focus:outline-none focus:border-rose-500"
                />
              </div>

              <button
                onClick={handleVerify}
                disabled={isVerifying || !igUserId || !accessToken}
                className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-semibold text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isVerifying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>{verifiedAccount ? `✓ Connected: @${verifiedAccount.username}` : 'Test Connection & Verify'}</span>
              </button>

              {/* Direct Publish Button */}
              <button
                onClick={handlePublish}
                disabled={isPublishing || !igUserId || !accessToken}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-rose-600 to-amber-600 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isPublishing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>{isPublishing ? 'Publishing to Instagram...' : 'Publish to Instagram Now'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Status Message */}
        {statusMessage && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            )}
            <p className="leading-relaxed">{statusMessage.text}</p>
          </div>
        )}
      </div>
    </div>
  );
};
