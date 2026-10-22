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
    icon: <Gem className="w-4 h-4 text-amber-300" />,
  },
  {
    id: 'editorial-frame',
    name: 'Editorial Magazine',
    desc: 'Classical double hairline border & luxury serif negative space',
    icon: <Frame className="w-4 h-4 text-yellow-500" />,
  },
  {
    id: 'glass-card',
    name: 'Frosted Glass Card',
    desc: 'Canva-grade translucent glass card backdrop with soft glow',
    icon: <Layers className="w-4 h-4 text-rose-400" />,
  },
  {
    id: 'centered-hero',
    name: 'Centered Hero',
    desc: 'Bold centered statement with glowing drop shadow depth',
    icon: <LayoutTemplate className="w-4 h-4 text-amber-400" />,
  },
  {
    id: 'minimal-badge',
    name: 'Minimal Pill Badge',
    desc: 'Clean modern typography with vertical left accent bar',
    icon: <AlignLeft className="w-4 h-4 text-emerald-400" />,
  },
  {
    id: 'atmospheric-glow',
    name: 'Atmospheric Glow',
    desc: 'High-contrast dark vignette with tech corner brackets',
    icon: <Sparkles className="w-4 h-4 text-cyan-400" />,
  },
];

export const LayoutPicker: React.FC<LayoutPickerProps> = ({ currentLayout, onChangeLayout }) => {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold tracking-wider text-white/70 uppercase">
          Canva & Pinterest Layout Style
        </label>
        <span className="text-[10px] text-amber-400 font-mono">6 Compositions</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {LAYOUTS.map((lay) => {
          const isActive = currentLayout === lay.id;
          return (
            <button
              key={lay.id}
              onClick={() => onChangeLayout(lay.id)}
              className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all relative overflow-hidden ${
                isActive
                  ? 'bg-[#1c1c1e] border-[#0095F6] shadow-md shadow-[#0095F6]/10'
                  : 'bg-[#000000] border-[#262626] hover:bg-[#181818] text-[#A8A8A8]'
              }`}
            >
              <div className="mb-1.5 p-1.5 rounded-lg bg-[#121212] border border-[#262626]">
                {lay.icon}
              </div>
              <span className="text-xs font-bold text-white tracking-tight">{lay.name}</span>
              <span className="text-[9px] text-[#737373] mt-0.5 line-clamp-2 leading-tight">{lay.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
