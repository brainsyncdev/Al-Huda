"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Compass, Navigation, RefreshCw } from "lucide-react";

export default function QiblaPage() {
  const [qiblaDirection, setQiblaDirection] = useState(120);
  const [currentDirection, setCurrentDirection] = useState(0);
  const [isCalibrating, setIsCalibrating] = useState(true);

  // Simulated compass direction (in real app, would use DeviceOrientation API)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDirection((prev) => (prev + 1) % 360);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const distance = 6500; // km (example: Lahore to Makkah)

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <header className="bg-white/95 backdrop-blur border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 -ml-2 rounded-lg hover:bg-secondary">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="font-semibold">Qibla Direction</h1>
              <p className="text-xs text-muted-foreground">قبلہ کی سمت</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <p className="text-sm text-muted-foreground mb-2">Makkah Al-Mukarramah</p>
          <p className="text-3xl font-bold text-emerald-700">{distance.toLocaleString()} km</p>
        </div>

        {/* Compass */}
        <div className="relative w-72 h-72 mx-auto mb-8">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-emerald-200" />
          
          {/* Compass face */}
          <div
            className="absolute inset-4 rounded-full bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center"
            style={{ transform: `rotate(${-currentDirection}deg)` }}
          >
            {/* Direction markers */}
            <div className="absolute top-4 text-sm font-bold text-emerald-700">N</div>
            <div className="absolute bottom-4 text-sm font-bold text-muted-foreground">S</div>
            <div className="absolute left-4 text-sm font-bold text-muted-foreground">W</div>
            <div className="absolute right-4 text-sm font-bold text-muted-foreground">E</div>

            {/* Kaaba indicator */}
            <div
              className="absolute"
              style={{
                transform: `rotate(${qiblaDirection}deg) translateY(-80px)`,
              }}
            >
              <div className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <span>🕋</span>
                <span>Kaaba</span>
              </div>
            </div>

            {/* Compass needle */}
            <div className="w-4 h-32">
              <div className="w-4 h-16 bg-emerald-600 rounded-t-full" />
              <div className="w-4 h-16 bg-gray-300 rounded-b-full" />
            </div>
          </div>

          {/* Center circle */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
              <Navigation className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>

        {/* Qibla Info */}
        <div className="bg-card rounded-2xl border p-6 text-center">
          <Compass className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Face this direction</h2>
          <p className="urdu-text text-lg text-emerald-600 mb-2" dir="rtl">
            اس طرف رخ کریں
          </p>
          <p className="text-muted-foreground mb-4">
            Turn your device to align with the Qibla direction
          </p>
          <p className="text-3xl font-bold text-emerald-600">
            {qiblaDirection}°
          </p>
          <p className="text-sm text-muted-foreground">from North</p>
        </div>

        {/* Calibration Button */}
        <button
          onClick={() => setIsCalibrating(!isCalibrating)}
          className="w-full mt-6 py-4 rounded-xl border-2 border-emerald-500 text-emerald-600 font-semibold flex items-center justify-center gap-2 hover:bg-emerald-50 transition-colors"
        >
          <RefreshCw className="h-5 w-5" />
          {isCalibrating ? "Stop Calibration" : "Start Calibration"}
        </button>

        {/* Tips */}
        <div className="mt-6 bg-amber-50 rounded-xl p-4">
          <h4 className="font-medium mb-2">💡 Tips</h4>
          <ul className="text-sm text-amber-800 space-y-1">
            <li>• Keep your device flat and level</li>
            <li>• Move away from magnetic objects</li>
            <li>• Calibration improves accuracy</li>
          </ul>
        </div>
      </main>
    </div>
  );
}