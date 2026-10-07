'use client';

import React, { useState } from 'react';
import { X, Send, ShieldCheck, CheckCircle2, AlertCircle, ExternalLink, RefreshCw, Sparkles } from 'lucide-react';
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
          text: data.error || 'Could not auto-detect Instagram ID. See the step-by-step guide below.',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-studio-900 border border-white/15 rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white shadow-lg shadow-rose-500/20">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Instagram Direct Auto-Publish</h3>
            <p className="text-xs text-white/50">Post directly to your Instagram Creator or Business page</p>
          </div>
        </div>

        {/* Free Meta Setup Instructions */}
        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white/70 space-y-2">
          <p className="font-semibold text-white flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Meta Official Graph API ($0 Free Tier)
          </p>
          <ol className="list-decimal list-inside space-y-1 text-white/60">
            <li>Ensure your Instagram account is switched to <strong>Creator</strong> or <strong>Business</strong> (free).</li>
            <li>Link your Instagram account to a Facebook page in settings.</li>
            <li>Generate your <strong>User Token</strong> with <code className="text-rose-400 font-mono">instagram_content_publish</code> permission in <a href="https://developers.facebook.com" target="_blank" rel="noreferrer" className="text-rose-400 hover:underline inline-flex items-center gap-0.5">Meta for Developers <ExternalLink className="w-3 h-3" /></a>.</li>
          </ol>
        </div>

        {/* Input Fields */}
        <div className="space-y-3">
          {/* Access Token First */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-medium text-white/70">1. Meta Graph API Access Token</label>
              <a
                href="https://developers.facebook.com/tools/explorer/"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
              >
                <span>Get Token in Graph Explorer</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <input
              type="password"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              placeholder="Paste your EAAX... token here"
              className="w-full bg-studio-950 border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-white/30 focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Auto-Detect Account ID Button */}
          <button
            type="button"
            onClick={handleAutoDiscover}
            disabled={isDiscovering || !accessToken.trim()}
            className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-purple-500/20 hover:from-amber-500/30 hover:to-purple-500/30 border border-amber-500/40 text-xs font-bold text-amber-300 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
          >
            {isDiscovering ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" /> : <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
            <span>{isDiscovering ? 'Detecting your Instagram page...' : '✨ Auto-Detect My Instagram Account ID'}</span>
          </button>

          {/* Account ID Field */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-medium text-white/70">2. Instagram Account ID</label>
              <span className="text-[10px] text-white/40">Auto-filled or manual</span>
            </div>
            <input
              type="text"
              value={igUserId}
              onChange={(e) => setIgUserId(e.target.value)}
              placeholder="e.g. 17841400000000000"
              className="w-full bg-studio-950 border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-white/30 focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Verify / Test Button */}
          <button
            onClick={handleVerify}
            disabled={isVerifying || !igUserId || !accessToken}
            className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-semibold text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isVerifying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
            <span>{verifiedAccount ? `✓ Connected: @${verifiedAccount.username}` : 'Test Connection & Verify'}</span>
          </button>

          {/* Expandable Step-by-Step Guide Accordion */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowGuide(!showGuide)}
              className="text-[11px] text-white/60 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{showGuide ? '▼ Hide Step-by-Step Setup Guide' : '▶ Need help getting the token? Click for 2-minute guide'}</span>
            </button>

            {showGuide && (
              <div className="mt-2 p-3 rounded-xl bg-black/50 border border-white/10 text-[11px] text-white/70 space-y-2 leading-relaxed">
                <p className="font-bold text-amber-300">Quick 4-Step Setup Guide ($0 Free):</p>
                <ol className="list-decimal list-inside space-y-1.5 text-white/70">
                  <li>
                    <strong>Instagram Account:</strong> In Instagram app, ensure your account (<code className="text-rose-300 font-mono">@_sparkwithin_hub_</code>) is switched to <strong>Creator</strong> or <strong>Business</strong> (Settings → Account type).
                  </li>
                  <li>
                    <strong>Link to Facebook:</strong> Connect your Instagram account to any Facebook Page (e.g. "Spark Within Hub") in Instagram Settings.
                  </li>
                  <li>
                    <strong>Open Graph API Explorer:</strong> Visit <a href="https://developers.facebook.com/tools/explorer/" target="_blank" rel="noreferrer" className="text-amber-400 underline font-semibold">developers.facebook.com/tools/explorer <ExternalLink className="w-2.5 h-2.5 inline" /></a>.
                  </li>
                  <li>
                    <strong>Generate Token:</strong> Under <em>User or Page</em>, pick <strong>User Token</strong>. Under <em>Permissions</em>, add <code className="text-amber-300">instagram_basic</code>, <code className="text-amber-300">instagram_content_publish</code>, and <code className="text-amber-300">pages_show_list</code>. Click <strong>Generate Access Token</strong>!
                  </li>
                  <li>
                    <strong>Paste & Auto-Detect:</strong> Paste that token in box #1 above and click <strong>✨ Auto-Detect My Instagram Account ID</strong>. You're all set!
                  </li>
                </ol>
              </div>
            )}
          </div>
        </div>

        {/* Status Messages */}
        {statusMessage && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            )}
            <p className="leading-relaxed">{statusMessage.text}</p>
          </div>
        )}

        {/* Publishing Actions */}
        <div className="pt-2 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white/70 hover:text-white transition-colors"
          >
            Close
          </button>

          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:opacity-95 text-xs font-bold text-white shadow-lg shadow-rose-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isPublishing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>{isPublishing ? 'Publishing Post...' : 'Publish to Instagram Now'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
