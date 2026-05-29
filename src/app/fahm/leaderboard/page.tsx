"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Trophy, Medal, Flame, TrendingUp, Crown, Users } from "lucide-react";

interface LeaderboardEntry {
  id: number;
  rank: number;
  name: string;
  nameArabic: string;
  points: number;
  streak: number;
  level: number;
  avatar: string;
  isCurrentUser?: boolean;
}

export default function LeaderboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<"daily" | "weekly" | "monthly" | "allTime">("weekly");

  const leaderboard: LeaderboardEntry[] = [
    { id: 1, rank: 1, name: "Ahmed Raza", nameArabic: "احمد رضا", points: 12500, streak: 45, level: 12, avatar: "👤", isCurrentUser: true },
    { id: 2, rank: 2, name: "Fatima Khan", nameArabic: "فاطمہ خان", points: 11800, streak: 38, level: 11, avatar: "👩" },
    { id: 3, rank: 3, name: "Muhammad Ali", nameArabic: "محمد علی", points: 11200, streak: 32, level: 10, avatar: "👦" },
    { id: 4, rank: 4, name: "Aisha Begum", nameArabic: "عائشہ بیگم", points: 10500, streak: 28, level: 9, avatar: "👧" },
    { id: 5, rank: 5, name: "Hassan Ahmad", nameArabic: "حسن احمد", points: 9800, streak: 25, level: 9, avatar: "👨" },
    { id: 6, rank: 6, name: "Zainab Malik", nameArabic: "زینب ملک", points: 9200, streak: 22, level: 8, avatar: "👩‍🦰" },
    { id: 7, rank: 7, name: "Omar Farooq", nameArabic: "عمر فاروق", points: 8500, streak: 20, level: 8, avatar: "🧔" },
    { id: 8, rank: 8, name: "Maryam Siddiqui", nameArabic: "مریم صدیقی", points: 7800, streak: 18, level: 7, avatar: "👩‍🦱" },
    { id: 9, rank: 9, name: "Ibrahim Sheikh", nameArabic: "ابراہیم شیخ", points: 7200, streak: 15, level: 7, avatar: "👴" },
    { id: 10, rank: 10, name: "Sara Hassan", nameArabic: "سارہ حسن", points: 6500, streak: 12, level: 6, avatar: "👱‍♀️" },
  ];

  const currentUser = leaderboard.find(l => l.isCurrentUser);

  const periodStats = {
    daily: { participants: 1250, myRank: 1, change: "+0" },
    weekly: { participants: 4800, myRank: 1, change: "-1" },
    monthly: { participants: 15000, myRank: 3, change: "+2" },
    allTime: { participants: 50000, myRank: 15, change: "+5" },
  };

  const current = periodStats[selectedPeriod];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <header className="bg-white/95 backdrop-blur border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/fahm" className="p-2 -ml-2 rounded-lg hover:bg-secondary">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex-1">
              <h1 className="font-semibold">Leaderboard</h1>
              <p className="text-xs text-muted-foreground">لیدربورڈ — Rankings</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-700">
              <Users className="h-4 w-4" />
              <span className="text-sm">{current.participants.toLocaleString()}</span>
            </div>
          </div>

          {/* Period Selector */}
          <div className="flex gap-2">
            {[
              { id: "daily", label: "Day" },
              { id: "weekly", label: "Week" },
              { id: "monthly", label: "Month" },
              { id: "allTime", label: "All" },
            ].map((period) => (
              <button
                key={period.id}
                onClick={() => setSelectedPeriod(period.id as typeof selectedPeriod)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedPeriod === period.id
                    ? "bg-amber-500 text-white"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Your Rank Card */}
        {currentUser && (
          <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm opacity-90">Your Rank</p>
                <p className="text-4xl font-bold">#{current.myRank}</p>
                <p className="text-sm opacity-90 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4" />
                  {current.change} from last period
                </p>
              </div>
              <div className="text-center">
                <span className="text-5xl">{currentUser.avatar}</span>
                <p className="font-semibold mt-2">{currentUser.name}</p>
                <p className="text-sm opacity-90">{currentUser.points.toLocaleString()} pts</p>
              </div>
            </div>
            <div className="flex items-center justify-between bg-white/20 rounded-xl p-3">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5" />
                <span>{currentUser.streak} day streak</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                <span>Level {currentUser.level}</span>
              </div>
            </div>
          </div>
        )}

        {/* Top 3 Podium */}
        <div className="flex items-end justify-center gap-4 mb-6">
          {[
            { entry: leaderboard[1], height: "h-28", order: 2 },
            { entry: leaderboard[0], height: "h-36", order: 1 },
            { entry: leaderboard[2], height: "h-24", order: 3 },
          ].map(({ entry, height, order }) => (
            <div
              key={entry.id}
              className={`flex-1 ${height} rounded-t-2xl bg-gradient-to-t from-amber-600 to-amber-400 flex flex-col items-center justify-end pb-3 text-white`}
            >
              <span className="text-2xl mb-1">
                {order === 1 ? "🥇" : order === 2 ? "🥈" : "🥉"}
              </span>
              <span className="text-sm font-semibold">{entry.name}</span>
              <span className="text-xs opacity-90">{entry.points.toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* Full Leaderboard */}
        <div className="space-y-3">
          {leaderboard.slice(3).map((entry) => (
            <div
              key={entry.id}
              className={`bg-card rounded-xl border p-4 flex items-center gap-4 ${
                entry.isCurrentUser ? "border-amber-500 bg-amber-50" : ""
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                entry.rank <= 3 ? "bg-amber-100 text-amber-700" : "bg-secondary"
              }`}>
                {entry.rank}
              </div>
              <span className="text-2xl">{entry.avatar}</span>
              <div className="flex-1">
                <p className="font-semibold">{entry.name}</p>
                <p className="text-xs text-muted-foreground urdu-text" dir="rtl">
                  {entry.nameArabic}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-amber-600">{entry.points.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                  <Flame className="h-3 w-3" />
                  {entry.streak}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}