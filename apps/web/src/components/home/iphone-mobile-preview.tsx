"use client";

import React, { useState, useRef } from "react";
import { RotateCw, ExternalLink, Smartphone } from "lucide-react";

export function IphoneMobilePreview() {
  const [key, setKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Target URL: either the standalone mobile app (if configured) or the embedded mobile route
  const targetUrl = process.env.NEXT_PUBLIC_MOBILE_APP_URL || "/preview/mobile";

  const handleReload = () => {
    setIsLoading(true);
    setKey((prev) => prev + 1);
    setTimeout(() => setIsLoading(false), 600);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center relative select-none">
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
            {/* Embedded Mobile Viewport iframe */}
            <div className="w-full h-full pt-9 pb-3 overflow-hidden bg-[#0D0E10] relative select-none">
              <iframe
                key={key}
                ref={iframeRef}
                src={targetUrl}
                title="Theia Mobile App Layout"
                className="w-full h-full border-0 select-none bg-[#0D0E10] pointer-events-none"
                tabIndex={-1}
                aria-hidden="true"
                loading="eager"
              />
              {/* Invisible touch/click shield to make the frame completely unclickable */}
              <div
                className="absolute inset-0 z-30 cursor-default select-none bg-transparent"
                aria-hidden="true"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
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
