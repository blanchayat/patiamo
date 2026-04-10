"use client";

import { useEffect, useRef, useState } from "react";

export default function Reveal({
  children,
  className,
  delayMs,
}: {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: 0.18 },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${className ?? ""} ${visible ? "animate-fadeInUp" : ""}`.trim()}
      style={
        visible
          ? delayMs
            ? { animationDelay: `${delayMs}ms` }
            : undefined
          : {
              opacity: 0,
              transform: "translateY(20px)",
            }
      }
    >
      {children}
    </div>
  );
}
