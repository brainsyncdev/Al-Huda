"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Eye, Clock, Lock, Check, User, Volume2, Star, Calendar } from "lucide-react";

export default function ParentControlsPage() {
  const [settings, setSettings] = useState({
    screenTimeLimit: 30,
    restrictContent: true,
    showProgress: true,
    requireApproval: false,
    soundEffects: true,
    darkMode: false,
  });

  const childProfile = {
    name: "Ahmed",
    age: 8,
    level: 3,
    streak: 5,
    todayMinutes: 25,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/noor" className="p-2 -ml-2 rounded-lg hover:bg-purple-100">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="font-semibold">Parent Dashboard</h1>
              <p className="text-xs text-muted-foreground">Parent Controls — NOOR</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Child Profile Card */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl">
              👧
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{childProfile.name}, Age {childProfile.age}</h2>
              <p className="text-purple-200">Level {childProfile.level} Learner</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-purple-400">
            <div className="text-center">
              <p className="text-2xl font-bold">{childProfile.streak}</p>
              <p className="text-xs text-purple-200">Day Streak</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{childProfile.todayMinutes}</p>
              <p className="text-xs text-purple-200">Min Today</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">15</p>
              <p className="text-xs text-purple-200">Stories</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-card rounded-xl border p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Weekly Progress</h3>
            <Calendar className="h-5 w-5 text-purple-500" />
          </div>
          <div className="flex justify-between text-center">
            {["M", "T", "W", "T", "F", "S", "S"].map((day, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  idx < 4 ? "bg-purple-500 text-white" : "bg-purple-100 text-purple-600"
                }`}>
                  {idx < 4 ? <Check className="h-4 w-4" /> : ""}
                </div>
                <span className="text-xs text-muted-foreground">{day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-4">
          {/* Screen Time */}
          <div className="bg-card rounded-xl border p-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Daily Screen Time</h3>
                <p className="text-sm text-muted-foreground">Limit daily usage to</p>
              </div>
              <span className="text-xl font-bold text-purple-600">
                {settings.screenTimeLimit} min
              </span>
            </div>
            <input
              type="range"
              min="15"
              max="120"
              step="15"
              value={settings.screenTimeLimit}
              onChange={(e) => setSettings({ ...settings, screenTimeLimit: parseInt(e.target.value) })}
              className="w-full h-2 bg-purple-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>15 min</span>
              <span>120 min</span>
            </div>
          </div>

          {/* Content Filtering */}
          <div className="bg-card rounded-xl border p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Content Filtering</h3>
                <p className="text-sm text-muted-foreground">Restrict mature themes</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, restrictContent: !settings.restrictContent })}
                className={`w-14 h-8 rounded-full relative transition-colors ${
                  settings.restrictContent ? "bg-purple-600" : "bg-gray-200"
                }`}
              >
                <div className={`w-6 h-6 rounded-full bg-white shadow absolute top-1 transition-transform ${
                  settings.restrictContent ? "translate-x-7" : "translate-x-1"
                }`} />
              </button>
            </div>
          </div>

          {/* View Progress */}
          <div className="bg-card rounded-xl border p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">View Progress</h3>
                <p className="text-sm text-muted-foreground">Track learning activity</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, showProgress: !settings.showProgress })}
                className={`w-14 h-8 rounded-full relative transition-colors ${
                  settings.showProgress ? "bg-purple-600" : "bg-gray-200"
                }`}
              >
                <div className={`w-6 h-6 rounded-full bg-white shadow absolute top-1 transition-transform ${
                  settings.showProgress ? "translate-x-7" : "translate-x-1"
                }`} />
              </button>
            </div>
          </div>

          {/* Approval Required */}
          <div className="bg-card rounded-xl border p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <Lock className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Require Approval</h3>
                <p className="text-sm text-muted-foreground">Approve new content</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, requireApproval: !settings.requireApproval })}
                className={`w-14 h-8 rounded-full relative transition-colors ${
                  settings.requireApproval ? "bg-purple-600" : "bg-gray-200"
                }`}
              >
                <div className={`w-6 h-6 rounded-full bg-white shadow absolute top-1 transition-transform ${
                  settings.requireApproval ? "translate-x-7" : "translate-x-1"
                }`} />
              </button>
            </div>
          </div>

          {/* Sound Effects */}
          <div className="bg-card rounded-xl border p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <Volume2 className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Sound Effects</h3>
                <p className="text-sm text-muted-foreground">Audio feedback</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, soundEffects: !settings.soundEffects })}
                className={`w-14 h-8 rounded-full relative transition-colors ${
                  settings.soundEffects ? "bg-purple-600" : "bg-gray-200"
                }`}
              >
                <div className={`w-6 h-6 rounded-full bg-white shadow absolute top-1 transition-transform ${
                  settings.soundEffects ? "translate-x-7" : "translate-x-1"
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button className="w-full mt-6 py-4 rounded-xl bg-purple-600 text-white font-semibold flex items-center justify-center gap-2">
          <Check className="h-5 w-5" />
          Save All Settings
        </button>

        <button className="w-full mt-3 py-4 rounded-xl border font-medium">
          Reset to Defaults
        </button>
      </main>
    </div>
  );
}