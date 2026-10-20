"use client";

import { useEffect, useState } from "react";
import type { ComponentPropsWithoutRef } from "react";

type Props = ComponentPropsWithoutRef<"a"> & {
  href: string;
};

export function ResponsiveAuthLink({
  href,
  children,
  ...props
}: Props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");

    const update = () => setIsMobile(media.matches);

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  let destination = href;

  if (isMobile) {
    try {
      const url = new URL(href);

      if (url.hostname === "app.theia-finance.ir") {
        url.hostname = "m.theia-finance.ir";
        destination = url.toString();
      }
    } catch {
      destination = href;
    }
  }

  return (
    <a href={destination} {...props}>
      {children}
    </a>
  );
}
