"use client";
import { useEffect, useState } from "react";

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSkipped = localStorage.getItem("pwa-skip") === "true";
    if (hasSkipped) return;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleSkip = () => {
    localStorage.setItem("pwa-skip", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null; // 👈 cleaner than wrapping JSX in &&

  return (
    <div className="fixed z-50 bottom-24 left-1/2 -translate-x-1/2 w-[300px] bg-white border border-purple-200 rounded-2xl shadow-xl p-5 text-center">
      {/* ICON */}
      <div className="flex justify-center mb-3">
        <img src="/icon.png" alt="Kirananeeds" className="w-14 h-14 rounded-xl shadow" />
      </div>

      {/* TEXT */}
      <p className="text-lg font-bold text-purple-700 mb-1">Install Kirananeeds</p>
      <p className="text-sm text-gray-500 leading-snug mb-4">
        Add to your home screen for faster access and a better experience.
      </p>

      {/* BUTTONS */}
      <div className="flex gap-2 justify-center">
        <button
          onClick={handleInstall}
          className="bg-purple-600 text-white px-5 py-2 rounded-full text-sm font-semibold shadow hover:bg-purple-700 transition"
        >
          Install
        </button>
        <button
          onClick={handleSkip}
          className="border border-gray-300 text-gray-500 px-5 py-2 rounded-full text-sm hover:bg-gray-50 transition"
        >
          Not now
        </button>
      </div>
    </div>
  );
};

export default InstallPWA;