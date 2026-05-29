"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Eye, Clock, Lock, Check } from "lucide-react";

export default function ParentControlsPage() {
  const [settings, setSettings] = useState({
    screenTimeLimit: 30,
    requireApproval: false,
    showProgress: true,
    restrictContent: false,
    dailyGoal: 15,
  });

  const features = [
    {
      icon: Clock,
      title: "Screen Time Limit",
      desc: "Set daily time limit for app usage",
      type: "slider",
      value: settings.screenTimeLimit,
      min: 15,
      max: 120,
      unit: "minutes",
      key: "screenTimeLimit" as const,
    },
    {
      icon: Shield,
      title: "Content Filtering",
      desc: "Restrict mature content",
      type: "toggle",
      value: settings.restrictContent,
      key: "restrictContent" as const,
    },
    {
      icon: Eye,
      title: "View Progress",
      desc: "Parents can view learning progress",
      type: "toggle",
      value: settings.showProgress,
      key: "showProgress" as const,
    },
    {
      icon: Lock,
      title: "Require Approval",
      desc: "Require approval for new content",
      type: "toggle",
      value: settings.requireApproval,
      key: "requireApproval" as const,
    },
  ];

  const updateSetting = (key: keyof typeof settings, value: boolean | number) => {
    setSettings({ ...settings, [key]: value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/noor" className="p-2 -ml-2 rounded-lg hover:bg-secondary">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="font-semibold">Parent Controls</h1>
              <p className="text-xs text-muted-foreground">Parent Dashboard — NOOR</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Child Profile */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl">
              👧
            </div>
            <div>
              <h2 className="text-xl font-bold">Ayesha, Age 7</h2>
              <p className="text-purple-200">Level 3 Learner</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">15</p>
              <p className="text-sm text-purple-200">Stories</p>
            </div>
            <div>
              <p className="text-2xl font-bold">8</p>
              <p className="text-sm text-purple-200">Days Streak</p>
            </div>
            <div>
              <p className="text-2xl font-bold">45min</p>
              <p className="text-sm text-purple-200">Today</p>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-4 mb-6">
          {features.map((feature) => (
            <div key={feature.key} className="bg-card rounded-2xl border p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
                {feature.type === "toggle" && (
                  <button
                    onClick={() => updateSetting(feature.key, !feature.value)}
                    className={`w-14 h-8 rounded-full relative transition-colors ${
                      feature.value ? "bg-purple-600" : "bg-gray-200"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full bg-white absolute top-1 transition-transform shadow ${
                        feature.value ? "translate-x-7" : "translate-x-1"
                      }`}
                    />
                  </button>
                )}
              </div>

              {feature.type === "slider" && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>{feature.min} {feature.unit}</span>
                    <span className="font-medium text-purple-600">
                      {settings[feature.key]} {feature.unit}
                    </span>
                    <span>{feature.max} {feature.unit}</span>
                  </div>
                  <input
                    type="range"
                    min={feature.min}
                    max={feature.max}
                    value={settings.screenTimeLimit}
                    onChange={(e) =>
                      updateSetting("screenTimeLimit", parseInt(e.target.value))
                    }
                    className="w-full h-2 bg-purple-100 rounded-full appearance-none cursor-pointer accent-purple-600"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Daily Goal */}
        <div className="bg-card rounded-2xl border p-4 mb-6">
          <h3 className="font-medium mb-4">Daily Learning Goal</h3>
          <div className="flex gap-2">
            {[10, 15, 20, 30].map((mins) => (
              <button
                key={mins}
                onClick={() => updateSetting("dailyGoal", mins)}
                className={`flex-1 py-3 rounded-xl font-medium ${
                  settings.dailyGoal === mins
                    ? "bg-purple-600 text-white"
                    : "bg-secondary"
                }`}
              >
                {mins} min
              </button>
            ))}
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Today's Progress</span>
              <span className="font-medium">
                {Math.round((settings.screenTimeLimit / settings.dailyGoal) * 100)}%
              </span>
            </div>
            <div className="w-full bg-purple-100 rounded-full h-3">
              <div
                className="bg-purple-600 h-3 rounded-full transition-all"
                style={{
                  width: `${Math.min(
                    (settings.screenTimeLimit / settings.dailyGoal) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <button className="w-full py-4 rounded-xl bg-purple-600 text-white font-semibold flex items-center justify-center gap-2">
            <Check className="h-5 w-5" />
            Save All Settings
          </button>
          <button className="w-full py-4 rounded-xl border font-medium">
            Reset to Defaults
          </button>
        </div>
      </main>
    </div>
  );
}