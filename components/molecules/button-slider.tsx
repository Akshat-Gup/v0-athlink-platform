"use client"

import { useState, useEffect } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/molecules/popover"
import { DoubleSlider } from "@/components/atoms/double-slider"
import { ChevronDown, DollarSign } from "lucide-react"

interface BudgetSliderProps {
  min?: number
  max?: number
  step?: number
  value?: [number, number]
  onChange?: (value: [number, number] | undefined) => void
}

export const BudgetSlider: React.FC<BudgetSliderProps> = ({
  min = 1000,
  max = 25000,
  step = 500,
  value: externalValue,
  onChange,
}) => {
  const [open, setOpen] = useState(false)
  const [internalValue, setInternalValue] = useState<[number, number]>([min, max])

  // Sync with external value changes
  useEffect(() => {
    if (externalValue) {
      setInternalValue(externalValue)
    } else {
      setInternalValue([min, max])
    }
  }, [externalValue, min, max])

  const handleSliderChange = (val: number[]) => {
    if (val.length === 2) {
      const newValue = [val[0], val[1]] as [number, number]
      setInternalValue(newValue)
      onChange?.(newValue)
    }
  }

  const handleClear = () => {
    onChange?.(undefined)
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
          {externalValue
            ? `$${externalValue[0].toLocaleString()} - $${externalValue[1].toLocaleString()}`
            : "Budget Range"}
          <ChevronDown className={`h-4 w-4 opacity-50 transition-transform ${open ? "rotate-180" : "rotate-0"}`} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-5 bg-white rounded-xl shadow-lg border border-gray-200 mt-2 z-50">
        <div className="space-y-4">
          <div className="text-sm font-medium text-gray-900 mb-3">Budget Range</div>
          
          <DoubleSlider 
            min={min} 
            max={max} 
            step={step} 
            value={internalValue} 
            onChange={handleSliderChange} 
            className="w-full" 
          />
          
          <div className="flex justify-between items-center text-sm text-gray-600 px-1">
            <span>${internalValue[0].toLocaleString()}</span>
            <span>${internalValue[1].toLocaleString()}</span>
          </div>
          
          <div className="flex items-center justify-between gap-3 pt-2">
            <div className="flex flex-col space-y-1 flex-1">
              <label className="text-xs text-gray-500 font-medium">Min</label>
              <input
                type="number"
                min={min}
                max={(internalValue || [min, max])[1]}
                step={step}
                value={(internalValue || [min, max])[0]}
                onChange={(e) => {
                  const currentVal = internalValue || [min, max]
                  const newMin = Math.max(min, Math.min(Number(e.target.value), currentVal[1]))
                  const newValue = [newMin, currentVal[1]] as [number, number]
                  setInternalValue(newValue)
                  onChange?.(newValue)
                }}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                aria-label="Minimum budget"
              />
            </div>
            
            <div className="flex items-center justify-center pt-6">
              <div className="h-px w-3 bg-gray-300"></div>
            </div>
            
            <div className="flex flex-col space-y-1 flex-1">
              <label className="text-xs text-gray-500 font-medium">Max</label>
              <input
                type="number"
                min={(internalValue || [min, max])[0]}
                max={max}
                step={step}
                value={(internalValue || [min, max])[1]}
                onChange={(e) => {
                  const currentVal = internalValue || [min, max]
                  const newMax = Math.min(max, Math.max(Number(e.target.value), currentVal[0]))
                  const newValue = [currentVal[0], newMax] as [number, number]
                  setInternalValue(newValue)
                  onChange?.(newValue)
                }}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                aria-label="Maximum budget"
              />
            </div>
          </div>
          
          {internalValue && (
            <button
              onClick={handleClear}
              className="w-full mt-4 text-red-600 hover:text-red-700 hover:bg-red-50 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 border border-transparent hover:border-red-200"
            >
              Clear Budget Range
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}