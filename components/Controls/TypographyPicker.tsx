'use client';

import React from 'react';
import { FONT_OPTIONS } from '@/lib/fonts';
import { AlignCenter, AlignLeft, Type } from 'lucide-react';

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
  '#F59E0B', // Gold
  '#00F0FF', // Cyber Cyan
  '#10B981', // Emerald
  '#EC4899', // Pink
  '#A855F7', // Purple
  '#1F2937', // Charcoal
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
      <label className="text-xs font-semibold tracking-wider text-white/70 uppercase">
        Typography & Styling
      </label>

      {/* Font Family Dropdown */}
      <div className="space-y-1.5">
        <label className="text-[11px] text-white/50">Font Family</label>
        <div className="relative">
          <select
            value={fontFamily}
            onChange={(e) => onChangeFont(e.target.value)}
            className="w-full bg-studio-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white appearance-none focus:outline-none focus:border-rose-500 transition-colors"
          >
            <optgroup label="Sans-Serif (Modern & Heavy)">
              {FONT_OPTIONS.filter((f) => f.category === 'sans').map((f) => (
                <option key={f.name} value={f.name}>
                  {f.label}
                </option>
              ))}
            </optgroup>
            <optgroup label="Serif (Editorial & Classical)">
              {FONT_OPTIONS.filter((f) => f.category === 'serif').map((f) => (
                <option key={f.name} value={f.name}>
                  {f.label}
                </option>
              ))}
            </optgroup>
            <optgroup label="Monospace (Cyber & Tech)">
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
            <label className="text-[11px] text-white/50">Base Font Size</label>
            <span className="text-[11px] text-white/70 font-mono">{fontSize}px</span>
          </div>
          <input
            type="range"
            min="36"
            max="96"
            step="2"
            value={fontSize}
            onChange={(e) => onChangeFontSize(Number(e.target.value))}
            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] text-white/50">Alignment</label>
          <div className="flex rounded-xl bg-white/5 p-1 border border-white/10">
            <button
              onClick={() => onChangeTextAlign('center')}
              className={`flex-1 py-1 rounded-lg flex items-center justify-center transition-colors ${
                textAlign === 'center' ? 'bg-rose-500 text-white' : 'text-white/60 hover:text-white'
              }`}
              title="Centered"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              onClick={() => onChangeTextAlign('left')}
              className={`flex-1 py-1 rounded-lg flex items-center justify-center transition-colors ${
                textAlign === 'left' ? 'bg-rose-500 text-white' : 'text-white/60 hover:text-white'
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
          <label className="text-[11px] text-white/50">Text Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={textColor}
              onChange={(e) => onChangeTextColor(e.target.value)}
              className="w-8 h-8 rounded-lg border border-white/20 bg-transparent cursor-pointer"
            />
            <div className="flex gap-1 flex-wrap">
              {QUICK_COLORS.slice(0, 4).map((c) => (
                <button
                  key={c}
                  onClick={() => onChangeTextColor(c)}
                  className="w-5 h-5 rounded border border-white/20"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Accent Color */}
        <div className="space-y-1.5">
          <label className="text-[11px] text-white/50">Accent / Badge Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={accentColor}
              onChange={(e) => onChangeAccentColor(e.target.value)}
              className="w-8 h-8 rounded-lg border border-white/20 bg-transparent cursor-pointer"
            />
            <div className="flex gap-1 flex-wrap">
              {QUICK_COLORS.slice(2, 6).map((c) => (
                <button
                  key={c}
                  onClick={() => onChangeAccentColor(c)}
                  className="w-5 h-5 rounded border border-white/20"
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
