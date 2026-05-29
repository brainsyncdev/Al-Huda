"use client";

import Link from "next/link";
import { ArrowLeft, Bell, Moon, Globe, Shield, HelpCircle, Info, ChevronRight } from "lucide-react";

interface SettingsItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  desc: string;
  toggle?: boolean;
  disabled?: boolean;
}

interface SettingsGroup {
  title: string;
  items: SettingsItem[];
}

export default function SettingsPage() {
  const settingsGroups: SettingsGroup[] = [
    {
      title: "Appearance",
      items: [
        { icon: Moon, label: "Dark Mode", desc: "Coming soon", toggle: true, disabled: true },
        { icon: Globe, label: "Language", desc: "English / اردو", disabled: false },
        { icon: Globe, label: "Arabic Script", desc: "Nastaliq", disabled: false },
      ],
    },
    {
      title: "Notifications",
      items: [
        { icon: Bell, label: "Daily Reminder", desc: "Read Quran today", toggle: true, disabled: false },
        { icon: Bell, label: "Prayer Alerts", desc: "Get notified for prayer times", toggle: true, disabled: false },
        { icon: Bell, label: "Streak Reminder", desc: "Don't break your streak", toggle: true, disabled: false },
      ],
    },
    {
      title: "Reading",
      items: [
        { icon: Globe, label: "Translation", desc: "Urdu (Fateh Muhammad Jalandhari)", disabled: false },
        { icon: Globe, label: "Tafsir", desc: "Enable Tafsir explanations", disabled: false },
        { icon: Globe, label: "Font Size", desc: "Medium", disabled: false },
      ],
    },
    {
      title: "Audio",
      items: [
        { icon: Globe, label: "Recitation Style", desc: "Mishary Rashid Alafasy", disabled: false },
        { icon: Globe, label: "Auto-play", desc: "Play next ayah automatically", disabled: false },
        { icon: Globe, label: "Tarteel Mode", desc: "Enable melody guidelines", disabled: false },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/profile" className="p-2 -ml-2 rounded-lg hover:bg-secondary">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="font-semibold">Settings</h1>
              <p className="text-xs text-muted-foreground">ترتیبات</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {settingsGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2 px-2">
              {group.title}
            </h3>
            <div className="bg-card rounded-2xl border overflow-hidden">
              {group.items.map((item, itemIdx) => (
                <div
                  key={itemIdx}
                  className={`flex items-center gap-4 p-4 ${
                    itemIdx < group.items.length - 1 ? "border-b" : ""
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${item.disabled ? "text-muted-foreground" : ""}`}>
                      {item.label}
                    </p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  {item.toggle ? (
                    <button
                      disabled={item.disabled}
                      className={`w-12 h-7 rounded-full relative transition-colors ${
                        item.disabled
                          ? "bg-gray-200"
                          : "bg-teal-600"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white absolute top-1 transition-transform ${
                        item.disabled ? "left-1" : "translate-x-6"
                      }`} />
                    </button>
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Support */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2 px-2">
            Support
          </h3>
          <div className="bg-card rounded-2xl border overflow-hidden">
            {[
              { icon: HelpCircle, label: "Help Center" },
              { icon: Shield, label: "Privacy Policy" },
              { icon: Info, label: "About Al-Huda" },
            ].map((item, idx) => (
              <Link
                key={idx}
                href="#"
                className={`flex items-center gap-4 p-4 ${
                  idx < 2 ? "border-b" : ""
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <span className="flex-1 font-medium">{item.label}</span>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </div>

        {/* App Version */}
        <p className="text-center text-sm text-muted-foreground">
          Al-Huda v1.0.0
        </p>
      </main>
    </div>
  );
}