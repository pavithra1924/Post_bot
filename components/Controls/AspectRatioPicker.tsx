'use client';

import React from 'react';
import { AspectRatio } from '@/lib/canvasRenderer';
import { Square, RectangleVertical, Smartphone } from 'lucide-react';

interface AspectRatioPickerProps {
  value: AspectRatio;
  onChange: (val: AspectRatio) => void;
}

export const AspectRatioPicker: React.FC<AspectRatioPickerProps> = ({ value, onChange }) => {
  const options: { id: AspectRatio; label: string; sublabel: string; icon: React.ReactNode }[] = [
    {
      id: '1:1',
      label: '1:1',
      sublabel: 'Square Feed',
      icon: <Square className="w-4 h-4" />,
    },
    {
      id: '4:5',
      label: '4:5',
      sublabel: 'Portrait Feed',
      icon: <RectangleVertical className="w-4 h-4" />,
    },
    {
      id: '9:16',
      label: '9:16',
      sublabel: 'Story / Reel',
      icon: <Smartphone className="w-4 h-4" />,
    },
  ];

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold tracking-wider text-slate-800 uppercase">
        Aspect Ratio
      </label>
      <div className="grid grid-cols-3 gap-2">
        {options.map((opt) => {
          const isActive = value === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onChange(opt.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-center cursor-pointer ${
                isActive
                  ? 'bg-amber-50/80 border-amber-400 text-slate-900 shadow-sm ring-1 ring-amber-300'
                  : 'bg-slate-50/70 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className={`mb-1.5 ${isActive ? 'text-amber-600' : 'text-slate-400'}`}>
                {opt.icon}
              </div>
              <span className="text-xs font-bold">{opt.label}</span>
              <span className="text-[10px] text-slate-500 mt-0.5">{opt.sublabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
