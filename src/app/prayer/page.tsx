"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Bell, Settings, ChevronRight, Volume2, Share2, Clock } from "lucide-react";
import { prayerTimesData, getPrayerStatus, type PrayerDay } from "@/data/prayer-times";

export default function PrayerPage() {
  const [selectedCity, setSelectedCity] = useState("Lahore");
  const [selectedDay, setSelectedDay] = useState(0);
  const [notifications, setNotifications] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  const cities = Object.keys(prayerTimesData);
  const days = prayerTimesData[selectedCity] || [];
  const today = days[selectedDay] || days[0];

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getPrayerTimes = () => {
    if (!today) return [];
    
    const prayers = [
      { name: "Fajr", nameArabic: "صلاة الفجر", nameUrdu: "فجر", time: today.fajr, adhan: "صباحاً" },
      { name: "Sunrise", nameArabic: "الشروق", nameUrdu: "طلوع", time: today.sunrise, adhan: "" },
      { name: "Dhuhr", nameArabic: "صلاة الظهر", nameUrdu: "ظہر", time: today.dhuhr, adhan: "ظهراً" },
      { name: "Asr", nameArabic: "صلاة العصر", nameUrdu: "عصر", time: today.asr, adhan: "عصراً" },
      { name: "Maghrib", nameArabic: "صلاة المغرب", nameUrdu: "مغرب", time: today.maghrib, adhan: "مغرباً" },
      { name: "Isha", nameArabic: "صلاة العشاء", nameUrdu: "عشا", time: today.isha, adhan: "رات" },
    ];

    return prayers.map((prayer, idx) => ({
      ...prayer,
      status: idx === 0 ? getPrayerStatus(prayer.time) : "passed"
    }));
  };

  const prayers = getPrayerTimes();

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
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

          {/* City Selector */}
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
        {/* Current Date */}
        <div className="text-center mb-6">
          <p className="text-3xl font-bold text-emerald-700">{today?.dayOfWeek}</p>
          <p className="urdu-text text-lg text-emerald-600" dir="rtl">{today?.hijriDate}</p>
          <p className="text-sm text-muted-foreground">{currentTime.toLocaleDateString()}</p>
          {today?.fastingRecommended && (
            <span className="inline-block mt-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm">
              🌙 Fasting Recommended
            </span>
          )}
        </div>

        {/* Current Time */}
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-6 text-white text-center mb-6">
          <p className="text-5xl font-bold">
            {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
          <p className="text-emerald-200 mt-2">Current Time</p>
        </div>

        {/* Prayer Times */}
        <div className="space-y-3">
          {prayers.map((prayer, idx) => {
            const isPrayer = prayer.name !== "Sunrise";
            
            return (
              <div
                key={prayer.name}
                className={`bg-card rounded-2xl border overflow-hidden ${
                  prayer.status === "current" ? "border-emerald-500 bg-emerald-50" : ""
                }`}
              >
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        prayer.status === "current"
                          ? "bg-emerald-500 text-white"
                          : prayer.status === "passed"
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-secondary"
                      }`}
                    >
                      {prayer.status === "current" && (
                        <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
                      )}
                      {prayer.status === "passed" && (
                        <Clock className="h-5 w-5" />
                      )}
                      {prayer.status === "upcoming" && (
                        <span className="text-lg">{idx === 1 ? "🌅" : "🕐"}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">{prayer.name}</p>
                      <p className="urdu-text text-sm text-muted-foreground" dir="rtl">
                        {prayer.nameUr}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">{prayer.time}</p>
                    {prayer.status === "current" && (
                      <p className="text-xs text-emerald-600 font-medium">Current</p>
                    )}
                    {prayer.status === "passed" && (
                      <p className="text-xs text-emerald-600">Completed</p>
                    )}
                  </div>
                </div>

                {/* Action buttons for main prayers */}
                {isPrayer && prayer.status !== "passed" && (
                  <div className="px-4 pb-4 flex gap-2">
                    <button className="flex-1 py-2 rounded-lg bg-emerald-100 text-emerald-700 font-medium flex items-center justify-center gap-2">
                      <Volume2 className="h-4 w-4" />
                      Adhan
                    </button>
                    <button className="flex-1 py-2 rounded-lg bg-emerald-600 text-white font-medium flex items-center justify-center gap-2">
                      ✓ I prayed
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Calculation Method */}
        <div className="mt-6 bg-card rounded-xl border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Calculation Method</p>
              <p className="text-sm text-muted-foreground">University of Karachi</p>
            </div>
            <button className="text-sm text-emerald-600 font-medium">Change</button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="mt-4 bg-card rounded-xl border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Adhan Notifications</p>
                <p className="text-sm text-muted-foreground">Get reminded for each prayer</p>
              </div>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-7 rounded-full relative transition-colors ${
                notifications ? "bg-emerald-500" : "bg-secondary"
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow absolute top-1 transition-transform ${
                notifications ? "translate-x-6" : "translate-x-1"
              }`} />
            </button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Link
            href="/qibla"
            className="bg-card rounded-xl border p-4 text-center hover:shadow-md"
          >
            <p className="text-2xl mb-1">🧭</p>
            <p className="font-medium">Qibla Direction</p>
            <p className="text-xs text-muted-foreground">قبلہ</p>
          </Link>
          <Link
            href="/calendar"
            className="bg-card rounded-xl border p-4 text-center hover:shadow-md"
          >
            <p className="text-2xl mb-1">📅</p>
            <p className="font-medium">Islamic Calendar</p>
            <p className="text-xs text-muted-foreground">اسلامی کیلنڈر</p>
          </Link>
        </div>
      </main>
    </div>
  );
}