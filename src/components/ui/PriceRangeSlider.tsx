import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface PriceRangeSliderProps {
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  formatLabel?: (val: number) => string;
}

export default function PriceRangeSlider({
  min,
  max,
  step,
  value,
  onChange,
  formatLabel
}: PriceRangeSliderProps) {
  const [minVal, setMinVal] = useState(value[0]);
  const [maxVal, setMaxVal] = useState(value[1]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMinVal(value[0]);
    setMaxVal(value[1]);
  }, [value]);

  // Handle click outside to close popover
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = Math.min(Number(e.target.value), maxVal - step);
    setMinVal(newVal);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = Math.max(Number(e.target.value), minVal + step);
    setMaxVal(newVal);
  };

  const handleMouseUp = () => {
    onChange([minVal, maxVal]);
  };

  const minPercent = ((minVal - min) / (max - min)) * 100;
  const maxPercent = ((maxVal - min) / (max - min)) * 100;

  const format = formatLabel || ((val) => val.toString());

  // Generate 5 evenly spaced ticks for the scale
  const tickCount = 5;
  const ticks = Array.from({ length: tickCount }).map((_, i) => {
    return min + (max - min) * (i / (tickCount - 1));
  });

  const getDisplayText = () => {
    if (minVal === min && maxVal >= max) return 'Any Price';
    const minText = minVal === min ? '0' : format(minVal);
    const maxText = maxVal >= max ? 'Any' : format(maxVal);
    return `${minText} - ${maxText}`;
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-transparent outline-none text-sm text-slate-700 font-medium cursor-pointer"
      >
        <span className="truncate pr-2">{getDisplayText()}</span>
        <ChevronDown size={16} className={`text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] min-w-[280px]">
          {/* Current Selection Labels Above */}
          <div className="flex justify-between items-center mb-6 text-[13px] font-bold text-[#1a2e5a]">
            <div className="flex flex-col">
              <span className="text-slate-400 font-medium text-[10px] uppercase tracking-wider mb-1">Min Price</span>
              <span className="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg text-slate-700 text-xs">
                {minVal === min ? '0' : format(minVal)}
              </span>
            </div>
            <span className="text-slate-300 mx-2">-</span>
            <div className="flex flex-col items-end">
              <span className="text-slate-400 font-medium text-[10px] uppercase tracking-wider mb-1">Max Price</span>
              <span className="bg-red-50 border border-red-100 px-3 py-1.5 rounded-lg text-red-600 text-xs">
                {maxVal >= max ? 'Any' : format(maxVal)}
              </span>
            </div>
          </div>

          {/* Dual Range Slider Container */}
          <div className="w-full relative py-4">
            <div className="relative w-full h-1.5 bg-slate-100 rounded-full">
              {/* Active track */}
              <div 
                className="absolute h-full bg-red-500 rounded-full"
                style={{ 
                  left: `${minPercent}%`, 
                  right: `${100 - maxPercent}%` 
                }}
              />
              
              {/* Min Input */}
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={minVal}
                onChange={handleMinChange}
                onMouseUp={handleMouseUp}
                onTouchEnd={handleMouseUp}
                className="absolute w-full -top-1.5 h-5 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-red-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-red-500 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-md z-10"
              />
              
              {/* Max Input */}
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={maxVal}
                onChange={handleMaxChange}
                onMouseUp={handleMouseUp}
                onTouchEnd={handleMouseUp}
                className="absolute w-full -top-1.5 h-5 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-red-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-red-500 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-md z-20"
              />
            </div>
          </div>
          
          {/* Ticks and labels */}
          <div className="w-full mt-2">
            <div className="flex justify-between px-1 text-slate-300 text-[10px]">
              {ticks.map((_, i) => <span key={`tick-${i}`}>|</span>)}
            </div>
            <div className="flex justify-between px-0 mt-1 text-[10px] font-semibold text-slate-400">
              {ticks.map((val, i) => (
                <span key={`label-${i}`} className="w-8 text-center -ml-4 first:ml-0 last:-mr-4 first:text-left last:text-right">
                  {i === tickCount - 1 ? 'Any' : format(val).replace(' Crore', 'Cr').replace(' Lac', 'L')}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
