"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, Moon, Star } from "lucide-react";

const hijriMonths = [
  "Muharram", "Safar", "Rabi al-Awwal", "Rabi al-Thani",
  "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban",
  "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"
];

const islamicEvents = [
  { day: 1, month: 1, event: "Islamic New Year", eventUr: "۱ محرم" },
  { day: 10, month: 1, event: "Day of Ashura", eventUr: "عاشوراء" },
  { day: 12, month: 3, event: "Mawlid (Prophet's Birthday)", eventUr: "یوم ولادت" },
  { day: 27, month: 7, event: "Laylat al-Isra wal-Miraj", eventUr: "رات معراج" },
  { day: 15, month: 8, event: "Mid-Sha'ban", eventUr: "شب برات" },
  { day: 1, month: 9, event: "First Day of Ramadan", eventUr: "رمضان کی پہلی تاریخ" },
  { day: 27, month: 9, event: "Laylat al-Qadr", eventUr: "لیلة القدر" },
  { day: 1, month: 10, event: "Eid al-Fitr", eventUr: "عید الفطر" },
  { day: 10, month: 12, event: "Eid al-Adha", eventUr: "عید الاضحیٰ" },
];

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(8); // Ramadan
  const [currentYear, setCurrentYear] = useState(1446);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const daysInMonth = 30; // Approximate
  const firstDayOffset = 3; // Day of week the month starts on

  const getEvent = (day: number, month: number) => {
    return islamicEvents.find((e) => e.day === day && e.month === month);
  };

  const today = { day: 15, month: 8, year: 1446 }; // Mock today

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="p-2 -ml-2 rounded-lg hover:bg-secondary">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="font-semibold">Islamic Calendar</h1>
                <p className="text-xs text-muted-foreground">اسلامی کیلنڈر — Hijri</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Current Date Banner */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white mb-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Moon className="h-6 w-6" />
            <span className="text-sm">Today</span>
          </div>
          <p className="text-3xl font-bold mb-1">{today.day} {hijriMonths[today.month - 1]}</p>
          <p className="text-indigo-200">{today.year} AH</p>
        </div>

        {/* Month Navigation */}
        <div className="bg-card rounded-2xl border p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => {
                if (currentMonth === 1) {
                  setCurrentMonth(12);
                  setCurrentYear(currentYear - 1);
                } else {
                  setCurrentMonth(currentMonth - 1);
                }
              }}
              className="p-2 rounded-lg hover:bg-secondary"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="text-center">
              <h2 className="font-semibold">{hijriMonths[currentMonth - 1]}</h2>
              <p className="text-sm text-muted-foreground">{currentYear} AH</p>
            </div>
            <button
              onClick={() => {
                if (currentMonth === 12) {
                  setCurrentMonth(1);
                  setCurrentYear(currentYear + 1);
                } else {
                  setCurrentMonth(currentMonth + 1);
                }
              }}
              className="p-2 rounded-lg hover:bg-secondary"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-xs text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for offset */}
            {Array.from({ length: firstDayOffset }).map((_, idx) => (
              <div key={`empty-${idx}`} className="aspect-square" />
            ))}
            
            {/* Days */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const event = getEvent(day, currentMonth);
              const isToday = day === today.day && currentMonth === today.month;
              const isSelected = day === selectedDate;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(day)}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm relative ${
                    isToday
                      ? "bg-indigo-600 text-white"
                      : isSelected
                      ? "bg-indigo-100"
                      : "hover:bg-secondary"
                  }`}
                >
                  <span className="font-medium">{day}</span>
                  {event && (
                    <Star className={`h-3 w-3 ${isToday ? "text-indigo-200" : "text-amber-500"}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="mb-6">
          <h3 className="font-semibold mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            {islamicEvents.slice(0, 4).map((evt, idx) => (
              <div key={idx} className="bg-card rounded-xl border p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold text-indigo-600">{evt.day}</span>
                  <span className="text-xs text-indigo-500">{hijriMonths[evt.month - 1].slice(0, 3)}</span>
                </div>
                <div>
                  <h4 className="font-medium">{evt.event}</h4>
                  <p className="urdu-text text-sm text-muted-foreground" dir="rtl">
                    {evt.eventUr}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Info */}
        <div className="bg-amber-50 rounded-2xl p-4">
          <h3 className="font-semibold mb-2">Ramadan Info</h3>
          <p className="text-sm text-amber-800">
            🌙 Ramadan is the 9th month of the Islamic calendar. 
            Muslims fast from dawn to sunset and seek Laylat al-Qadr (27th night).
          </p>
        </div>
      </main>
    </div>
  );
}