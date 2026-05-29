"use client";

import Link from "next/link";
import { ArrowLeft, Heart, Star, Users, Globe, BookOpen } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/settings" className="p-2 -ml-2 rounded-lg hover:bg-secondary">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="font-semibold">About Al-Huda</h1>
              <p className="text-xs text-muted-foreground">ہمارے بارے میں</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* App Logo & Name */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white text-4xl mb-4 shadow-lg">
            📖
          </div>
          <h2 className="text-2xl font-bold mb-1">Al-Huda</h2>
          <p className="urdu-text text-lg text-muted-foreground mb-2" dir="rtl">
            الہدیٰ — The Right Guidance
          </p>
          <p className="text-sm text-muted-foreground">Version 1.0.0</p>
        </div>

        {/* Mission Statement */}
        <div className="bg-gradient-to-br from-teal-100 to-teal-50 rounded-2xl p-6 mb-6">
          <h3 className="font-semibold mb-3 text-center">Our Mission</h3>
          <p className="text-center text-muted-foreground">
            Al-Huda is designed to make Quranic learning accessible, engaging, 
            and rewarding for everyone — from young children to adults seeking 
            deeper understanding of the Holy Quran.
          </p>
          <p className="text-center text-sm text-teal-700 mt-3 urdu-text" dir="rtl">
            قرآن کی تعلیم کو ہر کسی کے لیے آسان بنانا
          </p>
        </div>

        {/* Features Overview */}
        <div className="mb-6">
          <h3 className="font-semibold mb-4">What We Offer</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: BookOpen, title: "NOOR", desc: "Kids Learning", color: "purple" },
              { icon: Globe, title: "FAHM", desc: "Deep Understanding", color: "teal" },
              { icon: Star, title: "EXPLORE", desc: "Discover Topics", color: "amber" },
              { icon: Heart, title: "Duas", desc: "Daily Supplications", color: "red" },
            ].map((feature) => (
              <div key={feature.title} className="bg-card rounded-xl border p-4">
                <div className={`w-10 h-10 rounded-lg bg-${feature.color}-100 flex items-center justify-center mb-3`}>
                  <feature.icon className={`h-5 w-5 text-${feature.color}-600`} />
                </div>
                <h4 className="font-semibold">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-card rounded-2xl border p-6 mb-6">
          <h3 className="font-semibold mb-4">Community</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-teal-600">10K+</p>
              <p className="text-sm text-muted-foreground">Active Users</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-teal-600">50K+</p>
              <p className="text-sm text-muted-foreground">Daily Reads</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-teal-600">4.9★</p>
              <p className="text-sm text-muted-foreground">App Rating</p>
            </div>
          </div>
        </div>

        {/* Credits */}
        <div className="bg-card rounded-2xl border p-6 mb-6">
          <h3 className="font-semibold mb-4">Credits</h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong>Arabic Text:</strong> Uthmani Script from Tanzil.net
            </p>
            <p>
              <strong>Translations:</strong> Urdu (Fateh Muhammad Jalandhari), English (Sahih International)
            </p>
            <p>
              <strong>Recitation:</strong> Mishary Rashid Alafasy
            </p>
            <p>
              <strong>Data Sources:</strong> Quran.com API, Sunnah.com API
            </p>
          </div>
        </div>

        {/* Contact & Support */}
        <div className="space-y-3">
          <button className="w-full py-4 rounded-xl border font-medium">
            Contact Support
          </button>
          <button className="w-full py-4 rounded-xl border font-medium">
            Rate the App
          </button>
          <button className="w-full py-4 rounded-xl border font-medium">
            Share with Friends
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Made with <Heart className="h-4 w-4 inline text-red-500 fill-red-500" /> for the Ummah
          </p>
          <p className="text-xs text-muted-foreground">
            © 2025 Al-Huda. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
}