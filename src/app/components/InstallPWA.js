"use client";
import { useEffect, useState } from "react";

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has skipped before
    const hasSkipped = localStorage.getItem("pwa-skip") === "true";
    if (hasSkipped) return;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true); // Show the install popup
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === "accepted") {
      console.log("User accepted the install prompt");
    } else {
      console.log("User dismissed the install prompt");
    }

    setDeferredPrompt(null);
    setIsVisible(false); // Hide popup after decision
  };

  const handleSkip = () => {
    localStorage.setItem("pwa-skip", "true"); // Remember user's choice
    setIsVisible(false);
  };

  return (
    isVisible && (
      <div className="fixed z-10 top-32 right-5 w-[280px] bg-[#eee1f2] p-4 border border-purple-dark rounded-md shadow-lg text-center">
        <p className="mb-3 text-xl text-purple-dark font-bold">VegaCart Light</p>
        <p className="mb-3 leading-snug text-purple-dark text-sm font-light">
          Get a better experience by installing our VegaCart Light app on your device.
        </p>
        <div className="flex gap-2 justify-center">
          <button
            className="bg-pink-dark px-4 py-1 rounded-md shadow-lg text-beige-light"
            onClick={handleInstall}
          >
            Install App
          </button>
          <button
            className="border border-pink-dark px-4 py-1 rounded-md shadow-lg text-pink-dark"
            onClick={handleSkip}
          >
            Skip
          </button>
        </div>
      </div>
    )
  );
};

export default InstallPWA;
