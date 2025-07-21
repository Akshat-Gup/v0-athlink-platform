"use client"

import type React from "react"
import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/molecules/popover"
import { DoubleSlider } from "@/components/atoms/double-slider"
import { ChevronDown, DollarSign } from "lucide-react"

interface BudgetSliderProps {
  min?: number
  max?: number
  step?: number
  defaultValue?: [number, number]
  onChange?: (value: [number, number]) => void
}

export const BudgetSlider: React.FC<BudgetSliderProps> = ({
  min = 1000,
  max = 25000,
  step = 500,
  defaultValue,
  onChange,
}) => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<[number, number] | undefined>(defaultValue)

  const handleSliderChange = (val: number[]) => {
    if (val.length === 2) {
      setValue([val[0], val[1]])
      onChange?.([val[0], val[1]])
    }
  }

  const handleClear = () => {
    setValue(undefined)
    onChange?.(undefined as any)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
          <button
            type="button"
            className="bg-transparent border-0 hover:bg-gray-100 rounded-lg px-3 py-2 h-auto text-sm font-normal w-auto min-w-0 focus:outline-none flex items-center justify-center shadow-none gap-2"
          >
          <DollarSign className="h-4 w-4 text-gray-600" />
            {value
              ? `$${value[0].toLocaleString()} - $${value[1].toLocaleString()}`
              : "Budget Range"}
          <ChevronDown className={`h-4 w-4 opacity-50 transition-transform ${open ? "rotate-180" : "rotate-0"}`} />
            </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4 bg-white rounded-xl shadow-lg border mt-2 z-50">
        <DoubleSlider min={min} max={max} step={step} value={value || [min, max]} onChange={handleSliderChange} className="w-full" />
        <div className="flex justify-between text-xs mt-2">
          <span>${(value || [min, max])[0].toLocaleString()}</span>
          <span>${(value || [min, max])[1].toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between mt-4 gap-2">
          <input
            type="number"
            min={min}
            max={(value || [min, max])[1]}
            step={step}
            value={(value || [min, max])[0]}
            onChange={(e) => {
              const currentVal = value || [min, max]
              const newMin = Math.max(min, Math.min(Number(e.target.value), currentVal[1]))
              setValue([newMin, currentVal[1]])
              onChange?.([newMin, currentVal[1]])
            }}
            className="border rounded px-2 py-1 w-20 text-sm"
            aria-label="Minimum budget"
          />
          <span className="mx-1">-</span>
          <input
            type="number"
            min={(value || [min, max])[0]}
            max={max}
            step={step}
            value={(value || [min, max])[1]}
            onChange={(e) => {
              const currentVal = value || [min, max]
              const newMax = Math.min(max, Math.max(Number(e.target.value), currentVal[0]))
              setValue([currentVal[0], newMax])
              onChange?.([currentVal[0], newMax])
            }}
            className="border rounded px-2 py-1 w-20 text-sm"
            aria-label="Maximum budget"
          />
        </div>
        {value && (
          <button
            onClick={handleClear}
            className="w-full mt-3 text-red-600 hover:text-red-700 hover:bg-red-50 py-2 px-3 rounded text-sm transition-colors"
          >
            Clear Budget Range
          </button>
        )}
      </PopoverContent>
    </Popover>
  )
}
