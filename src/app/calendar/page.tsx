"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Moon, Star } from "lucide-react";
import { hijriMonths, islamicEvents, type IslamicEvent } from "@/data/calendar-data";

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(9); // Ramadan
  const [selectedEvent, setSelectedEvent] = useState<IslamicEvent | null>(null);

  const daysInMonth = 30;
  const firstDayOfMonth = 3; // Day of week the month starts on (0 = Sunday)

  const eventDays: Record<number, IslamicEvent[]> = {
    1: [islamicEvents.find(e => e.id === 6)!],
    10: [islamicEvents.find(e => e.id === 2)!],
    12: [islamicEvents.find(e => e.id === 3)!],
    27: [islamicEvents.find(e => e.id === 4)!],
    15: [islamicEvents.find(e => e.id === 5)!],
  };

  const upcomingEvents = islamicEvents.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <header className="bg-white/95 backdrop-blur border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Link href="/" className="p-2 -ml-2 rounded-lg hover:bg-secondary">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="font-semibold">Islamic Calendar</h1>
                <p className="text-xs text-muted-foreground">اسلامی کیلنڈر</p>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-indigo-100">
              <Moon className="h-5 w-5 text-indigo-600" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Month Navigation */}
        <div className="bg-card rounded-2xl border p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCurrentMonth((m) => (m === 1 ? 12 : m - 1))}
              className="p-2 rounded-lg hover:bg-secondary"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="text-center">
              <h2 className="text-xl font-bold">{hijriMonths[currentMonth - 1]}</h2>
              <p className="text-sm text-muted-foreground">1446 AH</p>
            </div>
            <button
              onClick={() => setCurrentMonth((m) => (m === 12 ? 1 : m + 1))}
              className="p-2 rounded-lg hover:bg-secondary"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-xs text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for first day */}
            {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
              <div key={`empty-${idx}`} className="aspect-square" />
            ))}
            
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const hasEvent = eventDays[day]?.length > 0;
              const events = eventDays[day] || [];

              return (
                <button
                  key={day}
                  onClick={() => hasEvent && setSelectedEvent(events[0])}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-colors ${
                    hasEvent
                      ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                      : "hover:bg-secondary"
                  } ${day === 15 ? "ring-2 ring-indigo-500" : ""}`}
                >
                  <span className="font-medium">{day}</span>
                  {hasEvent && <Star className="h-3 w-3 text-indigo-500 fill-indigo-500" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Event */}
        {selectedEvent && (
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white mb-6">
            <div className="flex items-center gap-3 mb-3">
              <Moon className="h-6 w-6" />
              <h3 className="text-xl font-bold">{selectedEvent.name}</h3>
            </div>
            <p className="urdu-text text-lg opacity-90 mb-2" dir="rtl">
              {selectedEvent.nameArabic}
            </p>
            <p className="text-sm opacity-80 mb-4">{selectedEvent.hijriDate}</p>
            <p className="text-sm opacity-90">{selectedEvent.description}</p>
            <button
              onClick={() => setSelectedEvent(null)}
              className="mt-4 px-4 py-2 rounded-lg bg-white/20 font-medium"
            >
              Close
            </button>
          </div>
        )}

        {/* Upcoming Events */}
        <div>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-indigo-600" />
            Upcoming Events
          </h3>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="bg-card rounded-xl border p-4 flex items-center gap-4"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  event.type === "celebration" ? "bg-emerald-100 text-emerald-600" :
                  event.type === "worship" ? "bg-indigo-100 text-indigo-600" :
                  "bg-amber-100 text-amber-600"
                }`}>
                  {event.type === "celebration" ? "🎉" :
                   event.type === "worship" ? "🤲" : "📜"}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{event.name}</p>
                  <p className="text-sm text-muted-foreground">{event.hijriDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}