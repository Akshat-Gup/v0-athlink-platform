"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SimpleCalendarProps {
  selected?: Date
  onSelect?: (date: Date) => void
  className?: string
}

export function SimpleCalendar({ selected, onSelect, className }: SimpleCalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date())

  const today = new Date()
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const firstDayWeekday = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(year, month, day)
    onSelect?.(clickedDate)
  }

  const isSelected = (day: number) => {
    if (!selected) return false
    const date = new Date(year, month, day)
    return date.toDateString() === selected.toDateString()
  }

  const isToday = (day: number) => {
    const date = new Date(year, month, day)
    return date.toDateString() === today.toDateString()
  }

  // Generate calendar days
  const calendarDays = []

  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDayWeekday; i++) {
    calendarDays.push(null)
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  return (
    <div className={`p-3 bg-white border rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm" onClick={goToPreviousMonth} className="h-7 w-7 p-0">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-sm font-medium">
          {monthNames[month]} {year}
        </h3>
        <Button variant="ghost" size="sm" onClick={goToNextMonth} className="h-7 w-7 p-0">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((dayName) => (
          <div key={dayName} className="text-center text-xs font-medium text-gray-500 py-1">
            {dayName}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => (
          <div key={index} className="aspect-square">
            {day && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDateClick(day)}
                className={`w-full h-full p-0 text-sm ${
                  isSelected(day)
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : isToday(day)
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {day}
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
