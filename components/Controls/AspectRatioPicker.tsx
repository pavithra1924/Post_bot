'use client';

import React from 'react';
import { AspectRatio, ASPECT_DIMENSIONS } from '@/lib/canvasRenderer';
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
      <label className="text-xs font-semibold tracking-wider text-white/70 uppercase">
        Aspect Ratio
      </label>
      <div className="grid grid-cols-3 gap-2">
        {options.map((opt) => {
          const isActive = value === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onChange(opt.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-center ${isActive
                  ? 'bg-[#0095F6]/15 border-[#0095F6] text-white shadow-lg shadow-[#0095F6]/10'
                  : 'bg-[#000000] border-[#262626] text-[#A8A8A8] hover:bg-[#181818] hover:text-white'
                }`}
            >
              <div className={`mb-1.5 ${isActive ? 'text-[#0095F6]' : 'text-[#737373]'}`}>
                {opt.icon}
              </div>
              <span className="text-xs font-bold">{opt.label}</span>
              <span className="text-[10px] text-white/40 mt-0.5">{opt.sublabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
