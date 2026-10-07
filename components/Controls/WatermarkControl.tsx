'use client';

import React from 'react';
import { AtSign } from 'lucide-react';

interface WatermarkControlProps {
  handle: string;
  onChangeHandle: (val: string) => void;
  showHandle: boolean;
  onToggleShowHandle: () => void;
  handlePosition: 'bottom-center' | 'bottom-right' | 'bottom-left';
  onChangePosition: (pos: 'bottom-center' | 'bottom-right' | 'bottom-left') => void;
}

export const WatermarkControl: React.FC<WatermarkControlProps> = ({
  handle,
  onChangeHandle,
  showHandle,
  onToggleShowHandle,
  handlePosition,
  onChangePosition,
}) => {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold tracking-wider text-white/70 uppercase">
          Instagram Handle / Watermark
        </label>
        <button
          onClick={onToggleShowHandle}
          className={`text-[11px] font-medium px-2 py-0.5 rounded transition-colors cursor-pointer ${
            showHandle ? 'bg-rose-500/20 text-rose-400' : 'bg-white/5 text-white/40'
          }`}
        >
          {showHandle ? 'Enabled' : 'Disabled'}
        </button>
      </div>

      {showHandle && (
        <div className="space-y-2 pt-1">
          <div className="relative">
            <AtSign className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={handle}
              onChange={(e) => onChangeHandle(e.target.value)}
              placeholder="_sparkwithin_hub_"
              className="w-full bg-studio-900 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-rose-500 transition-colors"
            />
          </div>

          <div className="flex gap-1.5">
            {(['bottom-left', 'bottom-center', 'bottom-right'] as const).map((pos) => {
              const label = pos.replace('bottom-', '');
              return (
                <button
                  key={pos}
                  onClick={() => onChangePosition(pos)}
                  className={`flex-1 py-1 rounded-lg text-[10px] uppercase font-bold border transition-colors capitalize cursor-pointer ${
                    handlePosition === pos
                      ? 'bg-white/10 border-rose-500/60 text-white'
                      : 'bg-white/[0.02] border-white/10 text-white/40 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
