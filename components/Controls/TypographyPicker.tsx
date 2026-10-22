'use client';

import React from 'react';
import { FONT_OPTIONS } from '@/lib/fonts';
import { AlignCenter, AlignLeft } from 'lucide-react';

interface TypographyPickerProps {
  fontFamily: string;
  onChangeFont: (font: string) => void;
  fontSize: number;
  onChangeFontSize: (size: number) => void;
  textAlign: 'center' | 'left';
  onChangeTextAlign: (align: 'center' | 'left') => void;
  textColor: string;
  onChangeTextColor: (color: string) => void;
  accentColor: string;
  onChangeAccentColor: (color: string) => void;
}

const QUICK_COLORS = [
  '#FFFFFF', // Pure White
  '#FDF6E2', // Warm Cream
  '#F59E0B', // Positive Gold
  '#F43F5E', // Rose Coral
  '#10B981', // Emerald
  '#6366F1', // Indigo
  '#8B5CF6', // Purple
  '#0F172A', // Deep Slate
];

export const TypographyPicker: React.FC<TypographyPickerProps> = ({
  fontFamily,
  onChangeFont,
  fontSize,
  onChangeFontSize,
  textAlign,
  onChangeTextAlign,
  textColor,
  onChangeTextColor,
  accentColor,
  onChangeAccentColor,
}) => {
  return (
    <div className="space-y-4">
      <label className="text-xs font-bold tracking-wider text-slate-800 uppercase">
        Typography & Styling
      </label>

      {/* Font Family Dropdown */}
      <div className="space-y-1.5">
        <label className="text-[11px] text-slate-600 font-medium">Font Family</label>
        <div className="relative">
          <select
            value={fontFamily}
            onChange={(e) => onChangeFont(e.target.value)}
            className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 appearance-none focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all font-medium cursor-pointer"
          >
            <optgroup label="Sans-Serif (Modern & Clean)">
              {FONT_OPTIONS.filter((f) => f.category === 'sans').map((f) => (
                <option key={f.name} value={f.name}>
                  {f.label}
                </option>
              ))}
            </optgroup>
            <optgroup label="Serif (Editorial & Luxury)">
              {FONT_OPTIONS.filter((f) => f.category === 'serif').map((f) => (
                <option key={f.name} value={f.name}>
                  {f.label}
                </option>
              ))}
            </optgroup>
            <optgroup label="Monospace (Modern & Tech)">
              {FONT_OPTIONS.filter((f) => f.category === 'mono').map((f) => (
                <option key={f.name} value={f.name}>
                  {f.label}
                </option>
              ))}
            </optgroup>
            <optgroup label="Display & Script">
              {FONT_OPTIONS.filter((f) => f.category === 'display').map((f) => (
                <option key={f.name} value={f.name}>
                  {f.label}
                </option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>

      {/* Font Size Slider & Alignment */}
      <div className="grid grid-cols-2 gap-3 items-center">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] text-slate-600 font-medium">Base Font Size</label>
            <span className="text-[11px] text-slate-800 font-mono font-bold">{fontSize}px</span>
          </div>
          <input
            type="range"
            min="36"
            max="96"
            step="2"
            value={fontSize}
            onChange={(e) => onChangeFontSize(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] text-slate-600 font-medium">Alignment</label>
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => onChangeTextAlign('center')}
              className={`flex-1 py-1 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                textAlign === 'center' ? 'bg-white text-slate-900 shadow-xs font-bold border border-slate-200/60' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Centered"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              onClick={() => onChangeTextAlign('left')}
              className={`flex-1 py-1 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                textAlign === 'left' ? 'bg-white text-slate-900 shadow-xs font-bold border border-slate-200/60' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Left Aligned"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Colors */}
      <div className="grid grid-cols-2 gap-3">
        {/* Text Color */}
        <div className="space-y-1.5">
          <label className="text-[11px] text-slate-600 font-medium">Text Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={textColor}
              onChange={(e) => onChangeTextColor(e.target.value)}
              className="w-8 h-8 rounded-lg border border-slate-300 bg-transparent cursor-pointer shadow-xs"
            />
            <div className="flex gap-1 flex-wrap">
              {QUICK_COLORS.slice(0, 4).map((c) => (
                <button
                  key={c}
                  onClick={() => onChangeTextColor(c)}
                  className="w-5 h-5 rounded border border-slate-300 shadow-xs transition-transform hover:scale-110"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Accent Color */}
        <div className="space-y-1.5">
          <label className="text-[11px] text-slate-600 font-medium">Accent / Badge Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={accentColor}
              onChange={(e) => onChangeAccentColor(e.target.value)}
              className="w-8 h-8 rounded-lg border border-slate-300 bg-transparent cursor-pointer shadow-xs"
            />
            <div className="flex gap-1 flex-wrap">
              {QUICK_COLORS.slice(2, 6).map((c) => (
                <button
                  key={c}
                  onClick={() => onChangeAccentColor(c)}
                  className="w-5 h-5 rounded border border-slate-300 shadow-xs transition-transform hover:scale-110"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
