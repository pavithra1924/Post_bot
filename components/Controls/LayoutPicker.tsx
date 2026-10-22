'use client';

import React from 'react';
import { LayoutStyle } from '@/lib/canvasRenderer';
import { LayoutTemplate, Layers, Frame, AlignLeft, Sparkles, Gem } from 'lucide-react';

interface LayoutPickerProps {
  currentLayout: LayoutStyle;
  onChangeLayout: (layout: LayoutStyle) => void;
}

const LAYOUTS: { id: LayoutStyle; name: string; desc: string; icon: React.ReactNode }[] = [
  {
    id: 'pinterest-luxury',
    name: 'Pinterest Luxury',
    desc: 'Golden luxury brackets, radial ambient glow, and crisp ivory type',
    icon: <Gem className="w-4 h-4 text-amber-600" />,
  },
  {
    id: 'editorial-frame',
    name: 'Editorial Magazine',
    desc: 'Classical double hairline border & luxury serif negative space',
    icon: <Frame className="w-4 h-4 text-rose-500" />,
  },
  {
    id: 'glass-card',
    name: 'Frosted Glass Card',
    desc: 'Translucent glass card backdrop with soft glow',
    icon: <Layers className="w-4 h-4 text-indigo-500" />,
  },
  {
    id: 'centered-hero',
    name: 'Centered Hero',
    desc: 'Bold centered statement with glowing drop shadow depth',
    icon: <LayoutTemplate className="w-4 h-4 text-amber-500" />,
  },
  {
    id: 'minimal-badge',
    name: 'Minimal Pill Badge',
    desc: 'Clean modern typography with vertical left accent bar',
    icon: <AlignLeft className="w-4 h-4 text-emerald-600" />,
  },
  {
    id: 'atmospheric-glow',
    name: 'Atmospheric Glow',
    desc: 'High-contrast clean vignette with modern corner brackets',
    icon: <Sparkles className="w-4 h-4 text-purple-500" />,
  },
];

export const LayoutPicker: React.FC<LayoutPickerProps> = ({ currentLayout, onChangeLayout }) => {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold tracking-wider text-slate-800 uppercase">
          Canva & Pinterest Layout Style
        </label>
        <span className="text-[10px] text-amber-600 font-bold font-mono">6 Compositions</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {LAYOUTS.map((lay) => {
          const isActive = currentLayout === lay.id;
          return (
            <button
              key={lay.id}
              onClick={() => onChangeLayout(lay.id)}
              className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all relative overflow-hidden cursor-pointer ${
                isActive
                  ? 'bg-amber-50/80 border-amber-400 shadow-sm text-slate-900 ring-1 ring-amber-300'
                  : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <div className="mb-1.5 p-1.5 rounded-lg bg-white border border-slate-200/90 shadow-xs">
                {lay.icon}
              </div>
              <span className="text-xs font-bold text-slate-900 tracking-tight">{lay.name}</span>
              <span className="text-[9px] text-slate-500 mt-0.5 line-clamp-2 leading-tight">{lay.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
