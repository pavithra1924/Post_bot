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
  const [appSecret, setAppSecret] = useState('');
  const [showPermanentHelper, setShowPermanentHelper] = useState(false);
  const [isExtending, setIsExtending] = useState(false);
  const [verifiedAccount, setVerifiedAccount] = useState<{ username: string } | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  // Exchange short-lived token for Permanent (Never-Expiring) Page Token
  const handleExtendToken = async () => {
    if (!accessToken.trim()) {
      setStatusMessage({ type: 'error', text: 'Please paste your current Access Token first.' });
      return;
    }
    if (!appSecret.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Please enter your Meta App Secret (from Meta Dashboard > App Settings > Basic).',
      });
      return;
    }
    setIsExtending(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/instagram/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'extend',
          accessToken: accessToken.trim(),
          appId: '874796342388798',
          appSecret: appSecret.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.permanentToken) {
        setAccessToken(data.permanentToken);
        localStorage.setItem('ig_access_token', data.permanentToken);
        setStatusMessage({
          type: 'success',
          text: `🎉 Permanent Token Activated! (${data.expires || 'Never Expires'}). Saved for future posts.`,
        });
        setShowPermanentHelper(false);
      } else {
        setStatusMessage({
          type: 'error',
          text: data.error || 'Failed to exchange token with Meta.',
        });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Token exchange failed.' });
    } finally {
      setIsExtending(false);
    }
  };

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
    if (!accessToken.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter your Meta Graph API Access Token.' });
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
        localStorage.setItem('ig_access_token', accessToken.trim());
        if (igUserId) localStorage.setItem('ig_user_id', igUserId.trim());

        setStatusMessage({
          type: 'success',
          text: `🎉 Post published successfully to @_sparkwithin_hub_! (Post ID: ${data.postId})`,
        });
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#F43F5E', '#8B5CF6', '#10B981'],
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto space-y-5 text-slate-900">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-500 text-white shadow-md shadow-rose-500/20">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Post to Instagram</h3>
            <p className="text-xs text-slate-500">Publish posts & reels directly to @_sparkwithin_hub_</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-100 border border-slate-200">
          <button
            onClick={() => setActiveTab('fast')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'fast'
                ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>⚡ 1-Click Fast Post (Free)</span>
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'api'
                ? 'bg-gradient-to-r from-indigo-600 to-rose-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>🤖 Meta API (Direct)</span>
          </button>
        </div>

        {/* TAB 1: 1-Click Fast Post Workflow (Zero Setup, 100% Reliable) */}
        {activeTab === 'fast' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-rose-50 to-indigo-50 border border-rose-200/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-700 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-rose-500" />
                  Easiest Creator Workflow (Takes 15s)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                  Zero Token Setup
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Click the button below to automatically copy your viral caption and open Instagram ready to post!
              </p>

              {/* Action: Open & Post on Instagram */}
              <button
                onClick={handleFastShare}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-rose-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>🚀 Open & Post to Instagram Now</span>
              </button>
            </div>

            {/* Quick Caption Box */}
            <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-semibold">Ready Caption & Hashtags:</span>
                <button
                  onClick={handleCopyCaption}
                  className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-bold cursor-pointer"
                >
                  {copiedCaption ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCaption ? 'Copied to Clipboard!' : 'Copy Caption'}</span>
                </button>
              </div>
              <textarea
                rows={4}
                readOnly
                value={currentCaption}
                className="w-full bg-transparent border-0 text-xs text-slate-800 leading-relaxed resize-none focus:outline-none scrollbar-none select-all"
              />
            </div>
          </div>
        )}

        {/* TAB 2: Meta Graph API Auto-Publish */}
        {activeTab === 'api' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                Meta Graph API Direct Publishing
              </p>
              <p className="text-slate-500 text-[11px]">
                Requires a Meta Developer Business App with <code className="text-rose-600 font-mono">instagram_content_publish</code> permissions.
              </p>
            </div>

            {/* Input Fields */}
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Meta Graph API Access Token</label>
                <input
                  type="password"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  placeholder="Paste your EAAP... token here"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Auto-Detect Account ID Button */}
              <button
                type="button"
                onClick={handleAutoDiscover}
                disabled={isDiscovering || !accessToken.trim()}
                className="w-full py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-xs font-bold text-amber-900 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
              >
                {isDiscovering ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" /> : <Sparkles className="w-3.5 h-3.5 text-amber-600" />}
                <span>{isDiscovering ? 'Detecting your Instagram page...' : '✨ Auto-Detect My Instagram Account ID'}</span>
              </button>

              {/* Permanent Token Extender Tool (Never Expire) */}
              <div className="pt-0.5">
                <button
                  type="button"
                  onClick={() => setShowPermanentHelper(!showPermanentHelper)}
                  className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-indigo-500" />
                  <span>{showPermanentHelper ? '▲ Hide Permanent Token Tool' : '⚡ Make Token Never Expire (Permanent)'}</span>
                </button>

                {showPermanentHelper && (
                  <div className="mt-2 p-3 rounded-2xl bg-indigo-50/80 border border-indigo-200/90 space-y-2.5 text-xs">
                    <p className="text-[11px] text-slate-700 leading-snug">
                      Graph API Explorer creates 1-hour temporary tokens. Paste your <strong>Meta App Secret</strong> below to instantly generate a <strong>Permanent Page Token (Never Expires)</strong>!
                    </p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span className="font-semibold text-slate-700">Meta App Secret:</span>
                        <a
                          href="https://developers.facebook.com/apps/874796342388798/settings/basic/"
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-600 hover:underline flex items-center gap-0.5 font-medium"
                        >
                          Find in Meta Dashboard <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                      <input
                        type="password"
                        value={appSecret}
                        onChange={(e) => setAppSecret(e.target.value)}
                        placeholder="Paste App Secret here"
                        className="w-full bg-white border border-indigo-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleExtendToken}
                      disabled={isExtending || !accessToken.trim() || !appSecret.trim()}
                      className="w-full py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-rose-600 hover:opacity-95 text-white font-bold text-xs transition-opacity flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 shadow-sm"
                    >
                      {isExtending ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                      <span>{isExtending ? 'Generating Permanent Token...' : 'Convert to Permanent Token (Never Expires)'}</span>
                    </button>
                    <p className="text-[10px] text-slate-500 text-center">
                      Or extend it for free in 1 click at{' '}
                      <a
                        href="https://developers.facebook.com/tools/debug/accesstoken/"
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 underline font-medium"
                      >
                        Meta Token Debugger
                      </a>
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Instagram Account ID</label>
                <input
                  type="text"
                  value={igUserId}
                  onChange={(e) => setIgUserId(e.target.value)}
                  placeholder="e.g. 17841400000000000"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <button
                onClick={handleVerify}
                disabled={isVerifying || !accessToken.trim()}
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isVerifying ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-600" /> : null}
                <span>{verifiedAccount ? `✓ Connected: @${verifiedAccount.username}` : 'Test Connection & Verify'}</span>
              </button>

              {/* Direct Publish Button */}
              <button
                onClick={handlePublish}
                disabled={isPublishing || !accessToken.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-rose-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isPublishing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>{isPublishing ? 'Publishing to Instagram...' : 'Publish Directly to Instagram Now'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Status Message */}
        {statusMessage && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
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
