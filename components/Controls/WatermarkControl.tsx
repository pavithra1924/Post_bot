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
        <label className="text-xs font-bold tracking-wider text-slate-800 uppercase">
          Instagram Handle / Watermark
        </label>
        <button
          onClick={onToggleShowHandle}
          className={`text-[11px] font-bold px-2 py-0.5 rounded transition-all cursor-pointer ${
            showHandle ? 'bg-amber-50 text-amber-800 border border-amber-200 shadow-xs' : 'bg-slate-100 text-slate-500 border border-slate-200'
          }`}
        >
          {showHandle ? 'Enabled' : 'Disabled'}
        </button>
      </div>

      {showHandle && (
        <div className="space-y-2 pt-1">
          <div className="relative">
            <AtSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={handle}
              onChange={(e) => onChangeHandle(e.target.value)}
              placeholder="_sparkwithin_hub_"
              className="w-full bg-slate-50/70 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all font-medium"
            />
          </div>

          <div className="flex gap-1.5">
            {(['bottom-left', 'bottom-center', 'bottom-right'] as const).map((pos) => {
              const label = pos.replace('bottom-', '');
              return (
                <button
                  key={pos}
                  onClick={() => onChangePosition(pos)}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] uppercase font-bold border transition-all capitalize cursor-pointer ${
                    handlePosition === pos
                      ? 'bg-amber-50/80 border-amber-300 text-slate-900 shadow-xs ring-1 ring-amber-300'
                      : 'bg-slate-50/70 border-slate-200 text-slate-600 hover:bg-slate-100'
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
