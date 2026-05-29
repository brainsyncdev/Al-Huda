"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Moon, BookOpen, Search } from "lucide-react";

interface ModeSelectorProps {
  onComplete?: () => void;
}

export function ModeSelector({ onComplete }: ModeSelectorProps) {
  const [step, setStep] = useState(0);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const router = useRouter();

  const modes = [
    {
      id: "noor",
      icon: <Moon className="h-12 w-12" />,
      title: "میرا بچہ",
      subtitle: "My Child",
      description: "Age 3-12",
      details: "Stories, Arabic Learning, Games",
      color: "from-purple-500 to-purple-600",
    },
    {
      id: "fahm",
      icon: <BookOpen className="h-12 w-12" />,
      title: "میں مسلمان ہوں",
      subtitle: "I am a Muslim",
      description: "Age 13+",
      details: "Tilawat, Guidance, Hifz",
      color: "from-teal-600 to-teal-700",
    },
    {
      id: "explore",
      icon: <Search className="h-12 w-12" />,
      title: "جاننا چاہتا ہوں",
      subtitle: "I want to explore",
      description: "Any age",
      details: "Discovery, No pressure, Wisdom",
      color: "from-blue-500 to-blue-600",
    },
  ];

  const handleModeSelect = (modeId: string) => {
    setSelectedMode(modeId);
    setStep(1);
  };

  const handleComplete = () => {
    if (selectedMode) {
      localStorage.setItem("alhuda-mode", selectedMode);
      router.push(`/${selectedMode}`);
      onComplete?.();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white">
      <header className="px-6 py-4 flex items-center max-w-md mx-auto">
        {step > 0 ? (
          <button
            onClick={() => setStep(0)}
            className="p-2 -ml-2 rounded-lg hover:bg-secondary"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        ) : (
          <div className="w-9" />
        )}
        <div className="flex-1 text-center">
          <span className="text-sm text-muted-foreground">Step {step + 1} of 2</span>
        </div>
        <div className="w-9" />
      </header>

      <div className="max-w-md mx-auto px-6 mb-8">
        <div className="h-1 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: "50%" }}
            animate={{ width: step === 0 ? "50%" : "100%" }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <main className="max-w-md mx-auto px-6">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <p className="arabic-text text-2xl text-primary mb-2" dir="rtl">
                  السَّلاَمُ عَلَيْكُمْ
                </p>
                <h1 className="text-2xl font-bold mb-2">Who are you?</h1>
                <p className="text-muted-foreground">آپ کون ہیں؟</p>
              </div>

              <div className="space-y-4">
                {modes.map((mode) => (
                  <motion.button
                    key={mode.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleModeSelect(mode.id)}
                    className={`w-full rounded-2xl p-6 bg-gradient-to-br ${mode.color} text-white text-left`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="opacity-90">{mode.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-1 urdu-text" dir="rtl">
                          {mode.title}
                        </h3>
                        <p className="text-sm opacity-90 mb-2">{mode.subtitle}</p>
                        <div className="flex items-center gap-2 text-xs opacity-70">
                          <span className="px-2 py-0.5 bg-white/20 rounded">
                            {mode.description}
                          </span>
                          <span>{mode.details}</span>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 1 && selectedMode && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">Almost there!</h1>
                <p className="text-muted-foreground">تھوڑا اور بتائیں</p>
              </div>

              {selectedMode === "fahm" && <FahmSetup onComplete={handleComplete} />}
              {selectedMode === "noor" && <NoorSetup onComplete={handleComplete} />}
              {selectedMode === "explore" && <ExploreSetup onComplete={handleComplete} />}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function FahmSetup({ onComplete }: { onComplete: () => void }) {
  const [arabicLevel, setArabicLevel] = useState<string>("");

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl p-6 border">
        <h3 className="font-semibold mb-4">Quran ke saath aap kahan hain?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          آپ قرآن کے ساتھ کہاں ہیں؟
        </p>

        <div className="space-y-3">
          {[
            { id: "none", label: "بالکل نیا ہوں", sub: "I am completely new" },
            { id: "beginner", label: "پڑھ لیتا ہوں", sub: "I can read but don't understand" },
            { id: "hafiz", label: "حافظ ہوں", sub: "I am a Hafiz" },
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => setArabicLevel(option.id)}
              className={`w-full p-4 rounded-xl border text-left transition-colors ${
                arabicLevel === option.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    arabicLevel === option.id ? "border-primary" : "border-muted-foreground"
                  }`}
                >
                  {arabicLevel === option.id && (
                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  )}
                </div>
                <div>
                  <p className="font-medium urdu-text" dir="rtl">{option.label}</p>
                  <p className="text-xs text-muted-foreground">{option.sub}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onComplete}
        disabled={!arabicLevel}
        className="w-full py-4 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        شروع کریں — Start
      </button>
    </div>
  );
}

function NoorSetup({ onComplete }: { onComplete: () => void }) {
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("");

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl p-6 border space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Child's Name (بچے کا نام)</label>
          <input
            type="text"
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            placeholder="e.g., حانیہ"
            className="w-full px-4 py-3 rounded-xl border bg-background"
            dir="rtl"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Age (عمر)</label>
          <div className="flex gap-2 flex-wrap">
            {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((age) => (
              <button
                key={age}
                onClick={() => setChildAge(age.toString())}
                className={`w-12 h-12 rounded-xl border font-medium transition-colors ${
                  childAge === age.toString()
                    ? "border-primary bg-primary text-white"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {age}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={onComplete}
        disabled={!childName || !childAge}
        className="w-full py-4 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        شروع کریں — Start
      </button>
    </div>
  );
}

function ExploreSetup({ onComplete }: { onComplete: () => void }) {
  const [interests, setInterests] = useState<string[]>([]);

  const interestOptions = [
    { id: "peace", label: "Peace & Mental Health", icon: "☮️" },
    { id: "justice", label: "Justice & Ethics", icon: "⚖️" },
    { id: "science", label: "Science & Knowledge", icon: "🔬" },
    { id: "family", label: "Family & Relationships", icon: "👨‍👩‍👧" },
    { id: "business", label: "Business & Finance", icon: "💰" },
    { id: "society", label: "Society & Community", icon: "🌍" },
  ];

  const toggleInterest = (id: string) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl p-6 border">
        <h3 className="font-semibold mb-2">What matters most to you?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          ہم آپ کے لیے قرآن سے متعلقہ حکمت دکھائیں گے
        </p>

        <div className="grid grid-cols-2 gap-3">
          {interestOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => toggleInterest(option.id)}
              className={`p-3 rounded-xl border text-left transition-colors ${
                interests.includes(option.id)
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <span className="text-xl mb-1 block">{option.icon}</span>
              <span className="text-sm font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800">
        <p>
          <strong>No account needed.</strong> No pressure. Ever.
          Everything is verified from authentic sources.
        </p>
      </div>

      <button
        onClick={onComplete}
        className="w-full py-4 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
      >
        Start Exploring — دریافت شروع کریں
      </button>
    </div>
  );
}

export default ModeSelector;