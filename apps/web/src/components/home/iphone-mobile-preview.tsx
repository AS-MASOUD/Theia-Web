"use client";

import React, { useState, useRef } from "react";
import { RotateCw, ExternalLink, Smartphone } from "lucide-react";

export function IphoneMobilePreview() {
  const [key, setKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Target URL: either the standalone mobile app (if configured) or the embedded mobile route
  const targetUrl =
    process.env.NEXT_PUBLIC_MOBILE_APP_URL || "/preview/mobile";

  const handleReload = () => {
    setIsLoading(true);
    setKey((prev) => prev + 1);
    setTimeout(() => setIsLoading(false), 600);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center relative select-none">
      {/* Top Controller Bar */}
      <div className="flex items-center justify-between w-full max-w-[370px] mb-4 px-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#76A98C] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#76A98C]" />
          </span>
          <span className="text-xs font-semibold text-[#F0F0F1] flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-[#F0AE55]" />
            <span>نسخه موبایل تئا (iOS / PWA)</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleReload}
            className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-[#A0A3AD] hover:text-[#F0AE55] transition-colors cursor-pointer"
            title="بارگذاری مجدد پیش‌نمایش"
          >
            <RotateCw
              className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-[#F0AE55]" : ""}`}
            />
          </button>
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-[#A0A3AD] hover:text-[#F0AE55] transition-colors cursor-pointer"
            title="مشاهده تمام‌صفحه نسخه موبایل"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* iPhone 16 Pro Realistic Chassis */}
      <div className="relative w-[320px] sm:w-[350px] md:w-[365px] h-[660px] sm:h-[700px]">
        {/* Soft Golden Ambient Glow behind the iPhone */}
        <div className="absolute -inset-6 rounded-[65px] bg-[radial-gradient(circle_at_center,rgba(240,174,85,0.22)_0%,rgba(240,174,85,0.06)_45%,transparent_70%)] blur-2xl pointer-events-none -z-10" />

        {/* Side Hardware Buttons */}
        {/* Left Side: Action Button */}
        <div className="absolute -left-[3.5px] top-28 w-[3.5px] h-7 bg-gradient-to-r from-[#22242B] to-[#3A3E48] rounded-l-sm shadow-sm" />
        {/* Left Side: Volume Up */}
        <div className="absolute -left-[3.5px] top-40 w-[3.5px] h-12 bg-gradient-to-r from-[#22242B] to-[#3A3E48] rounded-l-sm shadow-sm" />
        {/* Left Side: Volume Down */}
        <div className="absolute -left-[3.5px] top-56 w-[3.5px] h-12 bg-gradient-to-r from-[#22242B] to-[#3A3E48] rounded-l-sm shadow-sm" />
        {/* Right Side: Power Button */}
        <div className="absolute -right-[3.5px] top-44 w-[3.5px] h-16 bg-gradient-to-l from-[#22242B] to-[#3A3E48] rounded-r-sm shadow-sm" />

        {/* Titanium Outer Rim */}
        <div className="w-full h-full rounded-[52px] p-[10px] sm:p-[11px] bg-gradient-to-b from-[#383C46] via-[#1D1F24] to-[#121316] border border-white/[0.12] shadow-[0_30px_90px_rgba(0,0,0,0.85),0_0_40px_rgba(240,174,85,0.12)] ring-1 ring-white/[0.08] relative flex flex-col">
          {/* Top Speaker Slit */}
          <div className="absolute top-[5px] left-1/2 -translate-x-1/2 w-12 h-1 bg-[#1A1C22] rounded-full z-40 border-b border-white/[0.05]" />

          {/* Inner Display Screen with Bezel */}
          <div className="relative w-full h-full rounded-[42px] bg-[#0D0E10] overflow-hidden border border-black/80 flex flex-col shadow-inner">
            {/* iOS Dynamic Island */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-[110px] h-[26px] bg-black rounded-full z-40 flex items-center justify-between px-3 shadow-[0_2px_8px_rgba(0,0,0,0.8)] pointer-events-none">
              {/* Front Camera Lens */}
              <div className="w-2.5 h-2.5 rounded-full bg-[#151720] border border-[#2B2E3C] flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-blue-950/60" />
              </div>
              {/* FaceID / Ambient Sensor */}
              <div className="w-2 h-2 rounded-full bg-[#121318]" />
            </div>

            {/* iOS Status Bar */}
            <div className="absolute top-0 left-0 right-0 h-10 px-6 flex items-center justify-between z-30 pointer-events-none text-white text-[11px] font-semibold select-none pt-1">
              {/* Clock (9:41) */}
              <span className="font-mono tracking-tight text-[11px] font-bold text-white/95">
                9:41
              </span>

              {/* Status Icons: Signal, Wi-Fi, Battery */}
              <div className="flex items-center gap-1.5 text-white/90">
                {/* 4-bar cellular signal */}
                <svg
                  className="w-3.5 h-3 overflow-visible"
                  viewBox="0 0 17 12"
                  fill="currentColor"
                >
                  <rect x="0" y="9" width="3" height="3" rx="0.5" />
                  <rect x="4.5" y="6" width="3" height="6" rx="0.5" />
                  <rect x="9" y="3" width="3" height="9" rx="0.5" />
                  <rect x="13.5" y="0" width="3" height="12" rx="0.5" />
                </svg>

                {/* Wi-Fi Icon */}
                <svg
                  className="w-3.5 h-3"
                  viewBox="0 0 16 12"
                  fill="currentColor"
                >
                  <path d="M8 9.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm-3.8-3a5.5 5.5 0 017.6 0l-1.1 1.1a4 4 0 00-5.4 0L4.2 6.5zm-2.8-2.8a9.5 9.5 0 0113.2 0l-1.1 1.1a8 8 0 00-11 0L1.4 3.7z" />
                </svg>

                {/* Battery Indicator */}
                <div className="flex items-center">
                  <div className="w-5 h-2.5 rounded-[4px] border border-white/80 p-[1px] flex items-center">
                    <div className="h-full w-[88%] bg-white rounded-[2px]" />
                  </div>
                  <div className="w-[1.5px] h-1 bg-white/70 rounded-r-[1px] ml-[1px]" />
                </div>
              </div>
            </div>

            {/* Embedded Mobile Viewport iframe */}
            <div className="w-full h-full pt-9 pb-3 overflow-hidden bg-[#0D0E10] relative">
              <iframe
                key={key}
                ref={iframeRef}
                src={targetUrl}
                title="Theia Mobile App Layout"
                className="w-full h-full border-0 select-none bg-[#0D0E10]"
                loading="eager"
              />
            </div>

            {/* iOS Home Indicator Bar */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/45 rounded-full z-40 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
