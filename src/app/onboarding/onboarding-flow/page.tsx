"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Check, Moon, BookOpen, Search, User, ArrowRight } from "lucide-react";
import Link from "next/link";

interface OnboardingStep {
  id: string;
  title: string;
  titleUr: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export default function OnboardingFlowPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const steps: OnboardingStep[] = [
    {
      id: "welcome",
      title: "Welcome to Al-Huda",
      titleUr: "الہدیٰ میں خوش آمدید",
      description: "Your journey to understanding the Quran begins here",
      icon: <BookOpen className="h-16 w-16" />,
      color: "from-emerald-600 to-teal-600",
    },
    {
      id: "modes",
      title: "Choose Your Path",
      titleUr: "اپنا راستہ چنیں",
      description: "Select the learning mode that suits you best",
      icon: <Moon className="h-16 w-16" />,
      color: "from-purple-600 to-pink-600",
    },
    {
      id: "profile",
      title: "Tell Us About Yourself",
      titleUr: "اپنے بارے میں بتائیں",
      description: "Help us personalize your experience",
      icon: <User className="h-16 w-16" />,
      color: "from-blue-600 to-cyan-600",
    },
  ];

  const modes = [
    { id: "noor", name: "NOOR", subtitle: "For Kids (3-12)", icon: <Moon className="h-10 w-10" />, color: "from-purple-500 to-purple-600" },
    { id: "fahm", name: "FAHM", subtitle: "For Muslims (13+)", icon: <BookOpen className="h-10 w-10" />, color: "from-teal-600 to-teal-700" },
    { id: "explore", name: "EXPLORE", subtitle: "Discover", icon: <Search className="h-10 w-10" />, color: "from-blue-500 to-blue-600" },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleModeSelect = (modeId: string) => {
    setSelectedMode(modeId);
  };

  const handleGetStarted = () => {
    if (selectedMode) {
      localStorage.setItem("alhuda-mode", selectedMode);
      window.location.href = `/${selectedMode}`;
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center">
        <div className="text-center px-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-6"
          >
            <Check className="h-12 w-12 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-2"
          >
            You&apos;re All Set!
          </motion.h1>
          <p className="text-muted-foreground mb-8">آپ تیار ہیں</p>
          <Link
            href={selectedMode ? `/${selectedMode}` : "/"}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold"
          >
            Start Learning
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Progress */}
      <div className="px-6 pt-8">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 flex-1 rounded-full mx-1 transition-colors ${
                  idx <= currentStep ? "bg-emerald-500" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="px-6 py-8"
        >
          <div className="max-w-md mx-auto">
            {/* Welcome Step */}
            {currentStep === 0 && (
              <div className="text-center">
                <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${steps[0].color} flex items-center justify-center mb-8 text-white`}>
                  {steps[0].icon}
                </div>
                <h1 className="text-3xl font-bold mb-2">{steps[0].title}</h1>
                <p className="text-2xl text-emerald-600 mb-4 urdu-text" dir="rtl">
                  {steps[0].titleUr}
                </p>
                <p className="text-muted-foreground">{steps[0].description}</p>
              </div>
            )}

            {/* Mode Selection Step */}
            {currentStep === 1 && (
              <div>
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold mb-2">{steps[1].title}</h1>
                  <p className="text-muted-foreground">{steps[1].description}</p>
                </div>
                <div className="space-y-4">
                  {modes.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => handleModeSelect(mode.id)}
                      className={`w-full p-6 rounded-2xl border-2 transition-all text-left ${
                        selectedMode === mode.id
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-gray-200 hover:border-emerald-300"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${mode.color} flex items-center justify-center text-white`}>
                          {mode.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold">{mode.name}</h3>
                          <p className="text-muted-foreground">{mode.subtitle}</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 ${
                          selectedMode === mode.id
                            ? "border-emerald-500 bg-emerald-500"
                            : "border-gray-300"
                        }`}>
                          {selectedMode === mode.id && (
                            <Check className="h-4 w-4 text-white" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Profile Step */}
            {currentStep === 2 && (
              <div className="text-center">
                <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${steps[2].color} flex items-center justify-center mb-8 text-white`}>
                  {steps[2].icon}
                </div>
                <h1 className="text-2xl font-bold mb-2">{steps[2].title}</h1>
                <p className="text-xl text-blue-600 mb-4 urdu-text" dir="rtl">
                  {steps[2].titleUr}
                </p>
                <p className="text-muted-foreground mb-8">{steps[2].description}</p>
                
                <div className="bg-card rounded-2xl border p-6 text-left">
                  <p className="text-sm text-muted-foreground mb-4">
                    {selectedMode === "fahm" && "Your Quran learning will be personalized based on your experience level."}
                    {selectedMode === "noor" && "We'll create a fun and engaging experience for your child."}
                    {selectedMode === "explore" && "Discover the wisdom of the Quran at your own pace."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-6 py-4">
        <div className="max-w-md mx-auto flex gap-4">
          {currentStep > 0 ? (
            <button
              onClick={handleBack}
              className="px-6 py-3 rounded-xl border font-medium flex items-center gap-2"
            >
              <ChevronLeft className="h-5 w-5" />
              Back
            </button>
          ) : (
            <Link
              href="/"
              className="px-6 py-3 rounded-xl border font-medium"
            >
              Skip
            </Link>
          )}
          
          <button
            onClick={currentStep === 2 ? handleGetStarted : handleNext}
            disabled={currentStep === 1 && !selectedMode}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === 2 ? (
              <>
                Get Started
                <ArrowRight className="h-5 w-5" />
              </>
            ) : (
              <>
                Continue
                <ChevronRight className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}