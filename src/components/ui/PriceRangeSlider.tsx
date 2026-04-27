import React, { useState, useEffect } from 'react';

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

  useEffect(() => {
    setMinVal(value[0]);
    setMaxVal(value[1]);
  }, [value]);

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

  return (
    <div className="w-full relative">
      {/* Labels / Values above the track */}
      <div className="flex justify-between items-center mb-3 text-[13px] font-semibold text-slate-700">
        <span>{format(minVal)}</span>
        <span>{maxVal >= max ? `${format(max)}+` : format(maxVal)}</span>
      </div>

      {/* Slider Container */}
      <div className="relative w-full h-1.5 bg-slate-200 rounded-full">
        {/* Active Range Track */}
        <div
          className="absolute h-full bg-red-600 rounded-full"
          style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
        />
        
        {/* Min Range Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minVal}
          onChange={handleMinChange}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleMouseUp}
          className="absolute w-full -top-1.5 h-1.5 bg-transparent appearance-none pointer-events-none 
          [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-red-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md 
          [&::-webkit-slider-thumb]:hover:scale-125 [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:cursor-grab active:[&::-webkit-slider-thumb]:cursor-grabbing
          
          [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 
          [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:bg-red-600 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-md
          [&::-moz-range-thumb]:hover:scale-125 [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:cursor-grab active:[&::-moz-range-thumb]:cursor-grabbing
          z-20"
        />

        {/* Max Range Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxVal}
          onChange={handleMaxChange}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleMouseUp}
          className="absolute w-full -top-1.5 h-1.5 bg-transparent appearance-none pointer-events-none 
          [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-red-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md 
          [&::-webkit-slider-thumb]:hover:scale-125 [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:cursor-grab active:[&::-webkit-slider-thumb]:cursor-grabbing
          
          [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 
          [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:bg-red-600 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-md
          [&::-moz-range-thumb]:hover:scale-125 [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:cursor-grab active:[&::-moz-range-thumb]:cursor-grabbing
          z-30"
        />
      </div>
    </div>
  );
}
