"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Moon, Globe, Volume2, BookOpen, Bell, Shield, HelpCircle, Info, ChevronRight, User } from "lucide-react";

export default function FahmSettingsPage() {
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true,
    audioAutoPlay: false,
    showTransliteration: true,
    fontSize: "medium",
    selectedReciter: "Mishary Rashid Alafasy",
  });

  const updateSetting = (key: string, value: boolean | string) => {
    setSettings({ ...settings, [key]: value });
  };

  const reciters = [
    "Mishary Rashid Alafasy",
    "Abdul Rahman Al-Sudais",
    "Saad Al-Ghamdi",
    "Maher Al Muaiqly",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/fahm" className="p-2 -ml-2 rounded-lg hover:bg-secondary">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="font-semibold">Settings</h1>
              <p className="text-xs text-muted-foreground">ترتیبات — Preferences</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Profile */}
        <div className="bg-card rounded-2xl border p-4 mb-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white text-2xl font-bold">
            ع
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Ahmed Khan</h3>
            <p className="text-sm text-muted-foreground">Level 5 Learner</p>
          </div>
          <button className="px-4 py-2 rounded-xl border text-sm font-medium">
            Edit
          </button>
        </div>

        {/* Appearance */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2 px-2">Appearance</h3>
          <div className="bg-card rounded-2xl border overflow-hidden">
            <div className="p-4 flex items-center justify-between border-b">
              <div className="flex items-center gap-3">
                <Moon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">Coming soon</p>
                </div>
              </div>
              <button
                disabled
                className="w-12 h-7 rounded-full relative bg-gray-200 cursor-not-allowed opacity-50"
              >
                <div className="w-5 h-5 rounded-full bg-white shadow absolute top-1 left-1" />
              </button>
            </div>

            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Language</p>
                  <p className="text-sm text-muted-foreground">English / اردو</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Reading */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2 px-2">Reading</h3>
          <div className="bg-card rounded-2xl border overflow-hidden">
            <div className="p-4 flex items-center justify-between border-b">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Translation</p>
                  <p className="text-sm text-muted-foreground">Urdu (Fateh Muhammad Jalandhari)</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="p-4 flex items-center justify-between border-b">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Arabic Script</p>
                  <p className="text-sm text-muted-foreground">Nastaliq</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="p-4 flex items-center justify-between border-b">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Font Size</p>
                  <p className="text-sm text-muted-foreground">Medium</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                <p className="font-medium">Show Transliteration</p>
              </div>
              <button
                onClick={() => updateSetting("showTransliteration", !settings.showTransliteration)}
                className={`w-12 h-7 rounded-full relative transition-colors ${
                  settings.showTransliteration ? "bg-teal-500" : "bg-gray-200"
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow absolute top-1 transition-transform ${
                  settings.showTransliteration ? "translate-x-6" : "translate-x-1"
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Audio */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2 px-2">Audio</h3>
          <div className="bg-card rounded-2xl border overflow-hidden">
            <div className="p-4 flex items-center justify-between border-b">
              <div className="flex items-center gap-3">
                <Volume2 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Reciter</p>
                  <p className="text-sm text-muted-foreground">{settings.selectedReciter}</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 className="h-5 w-5 text-muted-foreground" />
                <p className="font-medium">Auto-play Next Ayah</p>
              </div>
              <button
                onClick={() => updateSetting("audioAutoPlay", !settings.audioAutoPlay)}
                className={`w-12 h-7 rounded-full relative transition-colors ${
                  settings.audioAutoPlay ? "bg-teal-500" : "bg-gray-200"
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow absolute top-1 transition-transform ${
                  settings.audioAutoPlay ? "translate-x-6" : "translate-x-1"
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2 px-2">Notifications</h3>
          <div className="bg-card rounded-2xl border overflow-hidden">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Daily Reminder</p>
                  <p className="text-sm text-muted-foreground">Read Quran today</p>
                </div>
              </div>
              <button
                onClick={() => updateSetting("notifications", !settings.notifications)}
                className={`w-12 h-7 rounded-full relative transition-colors ${
                  settings.notifications ? "bg-teal-500" : "bg-gray-200"
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow absolute top-1 transition-transform ${
                  settings.notifications ? "translate-x-6" : "translate-x-1"
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2 px-2">Support</h3>
          <div className="bg-card rounded-2xl border overflow-hidden">
            {[
              { icon: HelpCircle, label: "Help Center" },
              { icon: Shield, label: "Privacy Policy" },
              { icon: Info, label: "About Al-Huda" },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`p-4 flex items-center justify-between ${
                  idx < 2 ? "border-b" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                  <p className="font-medium">{item.label}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>

        {/* App Version */}
        <p className="text-center text-sm text-muted-foreground py-4">
          Al-Huda v1.0.0
        </p>
      </main>
    </div>
  );
}