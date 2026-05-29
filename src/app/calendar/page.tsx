"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, Moon, Star } from "lucide-react";
import { hijriMonths, islamicEvents } from "@/data/calendar-data";

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(9);
  const [currentYear, setCurrentYear] = useState(1446);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const today = { month: 9, day: 15, year: 1446 };

  const daysInMonth = 30;

  const getEvent = (day: number) => {
    return islamicEvents.find((e) => {
      const eventDay = parseInt(e.hijriDate.split(" ")[0]);
      const eventMonthName = e.hijriDate.split(" ")[1];
      return eventDay === day && hijriMonths[currentMonth - 1] === eventMonthName;
    });
  };

  const prevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
        <div className="max-w-md mx-auto px-4 py-4">
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
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white mb-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Moon className="h-6 w-6 text-amber-400" />
            <span className="text-sm">Today</span>
          </div>
          <p className="text-3xl font-bold">{today.day} {hijriMonths[today.month - 1]}</p>
          <p className="text-indigo-200">{today.year} AH</p>
        </div>

        <div className="bg-card rounded-2xl border p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-secondary">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h2 className="font-semibold">
              {hijriMonths[currentMonth - 1]} {currentYear} AH
            </h2>
            <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-secondary">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
              <div key={d} className="text-center text-xs text-muted-foreground py-2">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const event = getEvent(day);
              const isToday = currentMonth === today.month && day === today.day;
              
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm ${
                    isToday
                      ? "bg-indigo-600 text-white"
                      : event
                      ? "bg-amber-100 text-amber-700"
                      : "hover:bg-secondary"
                  }`}
                >
                  <span className="font-medium">{day}</span>
                  {event && <Star className="h-3 w-3 text-amber-500 mt-0.5" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">Upcoming Events</h3>
          {islamicEvents.slice(0, 4).map((evt) => (
            <div key={evt.id} className="bg-card rounded-xl border p-4 flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-indigo-600">
                  {evt.hijriDate.split(" ")[0]}
                </span>
                <span className="text-xs text-indigo-500">
                  {evt.hijriDate.split(" ")[1]}
                </span>
              </div>
              <div>
                <h4 className="font-medium">{evt.name}</h4>
                <p className="urdu-text text-sm text-muted-foreground" dir="rtl">
                  {evt.nameArabic}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {evt.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}