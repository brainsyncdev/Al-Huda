"use client";

export interface PrayerTime {
  name: string;
  nameArabic: string;
  nameUrdu: string;
  time: string;
  adhan: string;
  status: "passed" | "current" | "next" | "upcoming";
  rakahs?: number;
}

export interface PrayerDay {
  date: string;
  hijriDate: string;
  dayOfWeek: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  fastingRecommended?: boolean;
}

// Major cities prayer times (sample data)
export const prayerTimesData: Record<string, PrayerDay[]> = {
  "Lahore": [
    {
      date: "2025-03-15",
      hijriDate: "15 رمضان 1446",
      dayOfWeek: "Saturday",
      fajr: "5:12 AM",
      sunrise: "6:08 AM",
      dhuhr: "12:15 PM",
      asr: "4:32 PM",
      maghrib: "6:20 PM",
      isha: "7:45 PM",
      fastingRecommended: true
    },
    {
      date: "2025-03-16",
      hijriDate: "16 رمضان 1446",
      dayOfWeek: "Sunday",
      fajr: "5:11 AM",
      sunrise: "6:07 AM",
      dhuhr: "12:15 PM",
      asr: "4:33 PM",
      maghrib: "6:21 PM",
      isha: "7:46 PM",
      fastingRecommended: true
    },
    {
      date: "2025-03-17",
      hijriDate: "17 رمضان 1446",
      dayOfWeek: "Monday",
      fajr: "5:10 AM",
      sunrise: "6:06 AM",
      dhuhr: "12:14 PM",
      asr: "4:33 PM",
      maghrib: "6:22 PM",
      isha: "7:47 PM",
      fastingRecommended: true
    },
    {
      date: "2025-03-18",
      hijriDate: "18 رمضان 1446",
      dayOfWeek: "Tuesday",
      fajr: "5:09 AM",
      sunrise: "6:05 AM",
      dhuhr: "12:14 PM",
      asr: "4:34 PM",
      maghrib: "6:22 PM",
      isha: "7:47 PM",
      fastingRecommended: true
    },
    {
      date: "2025-03-19",
      hijriDate: "19 رمضان 1446",
      dayOfWeek: "Wednesday",
      fajr: "5:08 AM",
      sunrise: "6:04 AM",
      dhuhr: "12:13 PM",
      asr: "4:34 PM",
      maghrib: "6:23 PM",
      isha: "7:48 PM",
      fastingRecommended: true
    },
    {
      date: "2025-03-20",
      hijriDate: "20 رمضان 1446",
      dayOfWeek: "Thursday",
      fajr: "5:07 AM",
      sunrise: "6:03 AM",
      dhuhr: "12:13 PM",
      asr: "4:35 PM",
      maghrib: "6:24 PM",
      isha: "7:49 PM",
      fastingRecommended: true
    },
    {
      date: "2025-03-21",
      hijriDate: "21 رمضان 1446",
      dayOfWeek: "Friday",
      fajr: "5:06 AM",
      sunrise: "6:02 AM",
      dhuhr: "12:12 PM",
      asr: "4:35 PM",
      maghrib: "6:24 PM",
      isha: "7:50 PM",
      fastingRecommended: false
    }
  ],
  "Karachi": [
    {
      date: "2025-03-15",
      hijriDate: "15 رمضان 1446",
      dayOfWeek: "Saturday",
      fajr: "5:25 AM",
      sunrise: "6:32 AM",
      dhuhr: "12:35 PM",
      asr: "4:52 PM",
      maghrib: "6:40 PM",
      isha: "8:05 PM",
      fastingRecommended: true
    }
  ],
  "Islamabad": [
    {
      date: "2025-03-15",
      hijriDate: "15 رمضان 1446",
      dayOfWeek: "Saturday",
      fajr: "5:08 AM",
      sunrise: "6:05 AM",
      dhuhr: "12:10 PM",
      asr: "4:28 PM",
      maghrib: "6:15 PM",
      isha: "7:40 PM",
      fastingRecommended: true
    }
  ],
  "Dubai": [
    {
      date: "2025-03-15",
      hijriDate: "15 رمضان 1446",
      dayOfWeek: "Saturday",
      fajr: "5:35 AM",
      sunrise: "6:25 AM",
      dhuhr: "12:20 PM",
      asr: "3:45 PM",
      maghrib: "6:25 PM",
      isha: "7:50 PM",
      fastingRecommended: true
    }
  ],
  "Makkah": [
    {
      date: "2025-03-15",
      hijriDate: "15 رمضان 1446",
      dayOfWeek: "Saturday",
      fajr: "4:45 AM",
      sunrise: "6:15 AM",
      dhuhr: "12:15 PM",
      asr: "3:40 PM",
      maghrib: "6:20 PM",
      isha: "7:45 PM",
      fastingRecommended: true
    }
  ]
};

// Calculate prayer status based on current time
export function getPrayerStatus(prayerTime: string): PrayerTime["status"] {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  const prayerMinutes = timeToMinutes(prayerTime);
  
  if (currentMinutes > prayerMinutes + 30) return "passed";
  if (currentMinutes > prayerMinutes - 5 && currentMinutes <= prayerMinutes + 30) return "current";
  return "upcoming";
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.replace("AM", "").replace("PM", "").trim().split(":");
  let h = parseInt(hours);
  const m = parseInt(minutes);
  if (time.includes("PM") && h !== 12) h += 12;
  if (time.includes("AM") && h === 12) h = 0;
  return h * 60 + m;
}

// Get next prayer
export function getNextPrayer(prayers: PrayerTime[]): PrayerTime | undefined {
  return prayers.find(p => p.status === "next" || p.status === "upcoming");
}

// Get current prayer
export function getCurrentPrayer(prayers: PrayerTime[]): PrayerTime | undefined {
  return prayers.find(p => p.status === "current");
}