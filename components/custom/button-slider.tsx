import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { DoubleSlider } from "@/components/custom/double-slider";

interface BudgetSliderProps {
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: [number, number];
  onChange?: (value: [number, number]) => void;
}

export const BudgetSlider: React.FC<BudgetSliderProps> = ({
  min = 1000,
  max = 25000,
  step = 500,
  defaultValue = [1000, 25000],
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<[number, number]>(defaultValue);

  const handleSliderChange = (val: number[]) => {
    if (val.length === 2) {
      setValue([val[0], val[1]]);
      onChange?.([val[0], val[1]]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="bg-transparent border-0 hover:bg-gray-100 rounded-lg px-3 py-2 h-auto text-sm font-normal w-auto min-w-0 focus:outline-none flex items-center justify-center shadow-none"
        >
          {value[0] !== min || value[1] !== max
            ? `$${value[0].toLocaleString()} - $${value[1].toLocaleString()}`
            : "Budget Range"}
          <svg
            className={`ml-2 h-4 w-4 transition-transform ${open ? "rotate-180" : "rotate-0"}`}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 8L10 12L14 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4 bg-white rounded-xl shadow-lg border mt-2 z-50">
        <DoubleSlider
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderChange}
          className="w-full"
        />
        <div className="flex justify-between text-xs mt-2">
          <span>${value[0].toLocaleString()}</span>
          <span>${value[1].toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between mt-4 gap-2">
          <input
            type="number"
            min={min}
            max={value[1]}
            step={step}
            value={value[0]}
            onChange={e => {
              const newMin = Math.max(min, Math.min(Number(e.target.value), value[1]));
              setValue([newMin, value[1]]);
              onChange?.([newMin, value[1]]);
            }}
            className="border rounded px-2 py-1 w-20 text-sm"
            aria-label="Minimum budget"
          />
          <span className="mx-1">-</span>
          <input
            type="number"
            min={value[0]}
            max={max}
            step={step}
            value={value[1]}
            onChange={e => {
              const newMax = Math.min(max, Math.max(Number(e.target.value), value[0]));
              setValue([value[0], newMax]);
              onChange?.([value[0], newMax]);
            }}
            className="border rounded px-2 py-1 w-20 text-sm"
            aria-label="Maximum budget"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};
