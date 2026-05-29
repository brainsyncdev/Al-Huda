"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Bell, Settings, Volume2, Clock } from "lucide-react";
import { prayerTimesData, getPrayerStatus } from "@/data/prayer-times";

export default function PrayerPage() {
  const [selectedCity, setSelectedCity] = useState("Lahore");
  const [notifications, setNotifications] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  const cities = Object.keys(prayerTimesData);
  const days = prayerTimesData[selectedCity] || [];
  const today = days[0];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const prayers = today ? [
    { name: "Fajr", nameArabic: "صلاة الفجر", nameUrdu: "فجر", time: today.fajr },
    { name: "Sunrise", nameArabic: "الشروق", nameUrdu: "طلوع", time: today.sunrise },
    { name: "Dhuhr", nameArabic: "صلاة الظهر", nameUrdu: "ظہر", time: today.dhuhr },
    { name: "Asr", nameArabic: "صلاة العصر", nameUrdu: "عصر", time: today.asr },
    { name: "Maghrib", nameArabic: "صلاة المغرب", nameUrdu: "مغرب", time: today.maghrib },
    { name: "Isha", nameArabic: "صلاة العشاء", nameUrdu: "عشا", time: today.isha },
  ].map((p, i) => ({ ...p, status: getPrayerStatus(p.time) })) : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <header className="bg-white/95 backdrop-blur border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Link href="/" className="p-2 -ml-2 rounded-lg hover:bg-secondary">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="font-semibold">Prayer Times</h1>
                <p className="text-xs text-muted-foreground">نماز کے اوقات</p>
              </div>
            </div>
            <button className="p-2 rounded-lg hover:bg-secondary">
              <Settings className="h-5 w-5" />
            </button>
          </div>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-secondary/50 border-0"
          >
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <p className="text-3xl font-bold text-emerald-700">{today?.dayOfWeek}</p>
          <p className="urdu-text text-lg text-emerald-600" dir="rtl">{today?.hijriDate}</p>
          <p className="text-5xl font-bold text-emerald-700 mt-4">
            {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
          {today?.fastingRecommended && (
            <span className="inline-block mt-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm">
              🌙 Fasting Recommended
            </span>
          )}
        </div>

        <div className="space-y-3">
          {prayers.map((prayer, idx) => (
            <div
              key={prayer.name}
              className={`bg-card rounded-2xl border overflow-hidden ${
                prayer.status === "current" ? "border-emerald-500 bg-emerald-50" : ""
              }`}
            >
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    prayer.status === "current" ? "bg-emerald-500 text-white" :
                    prayer.status === "passed" ? "bg-emerald-100 text-emerald-600" : "bg-secondary"
                  }`}>
                    {prayer.status === "current" && <div className="w-3 h-3 rounded-full bg-white animate-pulse" />}
                    {prayer.status === "passed" && <Clock className="h-5 w-5" />}
                    {prayer.status === "upcoming" && <span className="text-lg">{idx === 1 ? "🌅" : "🕐"}</span>}
                  </div>
                  <div>
                    <p className="font-semibold">{prayer.name}</p>
                    <p className="urdu-text text-sm text-muted-foreground" dir="rtl">{prayer.nameUrdu}</p>
                  </div>
                </div>
                <p className="text-xl font-bold">{prayer.time}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-card rounded-xl border p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Adhan Notifications</p>
              <p className="text-sm text-muted-foreground">Get reminded for prayers</p>
            </div>
          </div>
          <button
            onClick={() => setNotifications(!notifications)}
            className={`w-12 h-7 rounded-full relative transition-colors ${notifications ? "bg-emerald-500" : "bg-secondary"}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white shadow absolute top-1 transition-transform ${notifications ? "translate-x-6" : "translate-x-1"}`} />
          </button>
        </div>
      </main>
    </div>
  );
}