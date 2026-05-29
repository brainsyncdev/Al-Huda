"use client";

import { useState, useEffect } from "react";
import { MapPin, Clock, Compass, Bell, ChevronRight, Moon, Sun } from "lucide-react";

interface PrayerTime {
  name: string;
  nameUrdu: string;
  time: string;
  status: "passed" | "current" | "next";
}

export default function PrayerPage() {
  const [location, setLocation] = useState("Lahore, Pakistan");
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [qiblaDirection, setQiblaDirection] = useState(248);
  const [notifications, setNotifications] = useState(true);

  // Mock prayer times
  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours();
    
    const times: PrayerTime[] = [
      { name: "Fajr", nameUrdu: "فجر", time: "5:12 AM", status: currentHour > 5 ? "passed" : "next" },
      { name: "Sunrise", nameUrdu: "طلوع", time: "6:32 AM", status: "passed" },
      { name: "Dhuhr", nameUrdu: "ظہر", time: "1:04 PM", status: currentHour >= 13 && currentHour < 16 ? "current" : currentHour > 13 ? "passed" : "next" },
      { name: "Asr", nameUrdu: "عصر", time: "4:32 PM", status: currentHour >= 16 && currentHour < 18 ? "current" : currentHour > 16 ? "passed" : "next" },
      { name: "Maghrib", nameUrdu: "مغرب", time: "6:47 PM", status: currentHour >= 18 && currentHour < 20 ? "current" : "next" },
      { name: "Isha", nameUrdu: "عشا", time: "8:12 PM", status: "next" },
    ];

    setPrayerTimes(times);
  }, []);

  const hijriDate = "۱۵ رمضان ۱۴۴۶";
  const gregorianDate = "March 15, 2025";

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
      <header className="px-4 py-4 border-b bg-white/80 backdrop-blur">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center">
              <Moon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold">نماز کے اوقات</h1>
              <p className="text-xs text-muted-foreground">Prayer Times</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Location & Date */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{location}</span>
          </div>
          <p className="text-2xl font-bold urdu-text" dir="rtl">{hijriDate}</p>
          <p className="text-sm text-muted-foreground">{gregorianDate}</p>
        </div>

        {/* Qibla Direction */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-white/30 flex items-center justify-center">
                <div 
                  className="w-1 h-12 bg-white rounded-full origin-bottom"
                  style={{ transform: `rotate(${qiblaDirection}deg)` }}
                />
              </div>
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-xs">N</div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-1">قبلہ</h3>
              <p className="text-white/80">Qibla Direction</p>
              <p className="text-3xl font-bold mt-2">{qiblaDirection}°</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between text-sm">
            <span>Distance to Makkah</span>
            <span className="font-medium">4,500 km</span>
          </div>
        </div>

        {/* Prayer Times */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">نماز کے اوقات</h3>
          <div className="bg-card rounded-2xl border overflow-hidden">
            {prayerTimes.map((prayer, index) => (
              <div
                key={prayer.name}
                className={`flex items-center justify-between p-4 ${
                  prayer.status === "current" 
                    ? "bg-emerald-50 border-l-4 border-emerald-500" 
                    : index !== prayerTimes.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    prayer.status === "current" 
                      ? "bg-emerald-500 text-white" 
                      : prayer.status === "passed"
                      ? "bg-secondary text-muted-foreground"
                      : "bg-secondary text-foreground"
                  }`}>
                    {prayer.status === "current" && <div className="w-3 h-3 rounded-full bg-white animate-pulse" />}
                    {prayer.status === "next" && <Clock className="h-5 w-5" />}
                    {prayer.status === "passed" && <Moon className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="font-medium">{prayer.name}</p>
                    <p className="text-sm text-muted-foreground urdu-text" dir="rtl">
                      {prayer.nameUrdu}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{prayer.time}</p>
                  {prayer.status === "current" && (
                    <p className="text-xs text-emerald-600 font-medium">Current</p>
                  )}
                  {prayer.status === "next" && (
                    <p className="text-xs text-muted-foreground">Next</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calculation Method */}
        <div className="bg-card rounded-xl border p-4 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Calculation Method</p>
              <p className="text-sm text-muted-foreground">University of Karachi</p>
            </div>
            <button className="text-sm text-emerald-600 font-medium">
              Change
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-card rounded-xl border p-4">
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
              className={`w-12 h-7 rounded-full transition-colors ${
                notifications ? "bg-emerald-500" : "bg-secondary"
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                notifications ? "translate-x-6" : "translate-x-1"
              }`} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}