"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Compass, Navigation, MapPin } from "lucide-react";

export default function QiblaPage() {
  const [qiblaDirection, setQiblaDirection] = useState(136); // Kaaba direction from Mecca
  const [deviceDirection, setDeviceDirection] = useState(0);
  const [location, setLocation] = useState({ lat: 0, lon: 0 });
  const [hasPermission, setHasPermission] = useState(false);

  // Calculate Qibla direction based on location
  const calculateQibla = (lat: number, lon: number) => {
    const kaabaLat = 21.4225;
    const kaabaLon = 39.8264;
    
    const lat1 = (lat * Math.PI) / 180;
    const lat2 = (kaabaLat * Math.PI) / 180;
    const dLon = ((kaabaLon - lon) * Math.PI) / 180;

    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    const bearing = (Math.atan2(y, x) * 180) / Math.PI;
    
    return (bearing + 360) % 360;
  };

  useEffect(() => {
    // Simulate location (in real app, use geolocation API)
    setLocation({ lat: 24.8607, lon: 67.0011 }); // Karachi
    setQiblaDirection(calculateQibla(24.8607, 67.0011));
    setHasPermission(true);

    // Device orientation listener
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        setDeviceDirection(event.alpha);
      }
    };

    window.addEventListener("deviceorientation", handleOrientation);
    return () => window.removeEventListener("deviceorientation", handleOrientation);
  }, []);

  const relativeDirection = (qiblaDirection - deviceDirection + 360) % 360;
  const isAligned = relativeDirection < 15 || relativeDirection > 345;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-indigo-800 text-white">
      {/* Header */}
      <header className="px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center gap-4">
          <Link href="/" className="p-2 -ml-2 rounded-lg hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-semibold">Qibla Direction</h1>
            <p className="text-xs text-indigo-200">قبلہ کی سمت</p>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8 flex flex-col items-center">
        {/* Compass */}
        <div className="relative w-72 h-72 mb-8">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-indigo-400/50" />
          
          {/* Compass markings */}
          <div className="absolute inset-4">
            {["N", "E", "S", "W"].map((dir, idx) => (
              <span
                key={dir}
                className="absolute text-sm font-bold text-indigo-300"
                style={{
                  left: idx === 0 ? "50%" : idx === 2 ? "50%" : idx === 1 ? "auto" : "auto",
                  right: idx === 1 ? "0" : idx === 3 ? "0" : "auto",
                  top: idx === 0 ? "0" : idx === 2 ? "auto" : "50%",
                  bottom: idx === 2 ? "0" : idx === 0 ? "auto" : "auto",
                  transform: idx === 0 ? "translate(-50%, -50%)" : idx === 2 ? "translate(-50%, 50%)" : idx === 1 ? "translate(50%, -50%) rotate(90deg)" : "translate(-50%, 50%) rotate(-90deg)",
                }}
              >
                {dir}
              </span>
            ))}
          </div>

          {/* Compass needle */}
          <div
            className="absolute inset-8 transition-transform duration-300"
            style={{ transform: `rotate(${-deviceDirection}deg)` }}
          >
            <div className="w-full h-full relative">
              {/* Kaaba indicator (red) */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full shadow-lg"
                style={{ transform: `translateX(-50%) rotate(${qiblaDirection}deg)` }}
              >
                <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75" />
              </div>
              
              {/* North pointer */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-12 border-l-transparent border-r-transparent border-b-indigo-400"
                style={{ transform: "translateX(-50%)" }}
              />
            </div>
          </div>

          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg" />
        </div>

        {/* Status */}
        <div className="text-center mb-8">
          {isAligned ? (
            <div className="bg-emerald-500/20 rounded-2xl px-6 py-4">
              <p className="text-2xl mb-1">✅</p>
              <p className="text-emerald-300 font-semibold">You are facing Qibla!</p>
              <p className="urdu-text text-emerald-200 text-sm" dir="rtl">
                آپ قبلہ کی طرف مڑے ہوئے ہیں
              </p>
            </div>
          ) : (
            <div className="bg-indigo-700/50 rounded-2xl px-6 py-4">
              <p className="text-4xl mb-2">📍</p>
              <p className="font-semibold mb-1">Turn to face Qibla</p>
              <p className="text-indigo-200 text-sm mb-2">
                {Math.round(Math.min(relativeDirection, 360 - relativeDirection))}° away
              </p>
              <p className="urdu-text text-indigo-300 text-sm" dir="rtl">
                {relativeDirection > 180 ? "دائیں طرف" : "بائیں طرف"} مڑیں
              </p>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="bg-white/10 rounded-2xl p-4 w-full">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-indigo-300 mt-0.5" />
            <div>
              <p className="font-medium">Your Location</p>
              <p className="text-sm text-indigo-200">
                Karachi, Pakistan
              </p>
              <p className="text-xs text-indigo-300 mt-1">
                Qibla: {Math.round(qiblaDirection)}° from North
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 text-center text-sm text-indigo-200">
          <p>Hold your phone flat and rotate until the red dot points to the center</p>
          <button
            onClick={() => setDeviceDirection(qiblaDirection)}
            className="mt-4 px-6 py-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
          >
            Simulate Alignment
          </button>
        </div>
      </main>
    </div>
  );
}