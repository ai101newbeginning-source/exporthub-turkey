"use client";

import { useEffect, useRef, useState } from "react";

interface Stat {
  label: string;
  value: string;
  kaynak: string;
  numericValue?: number;
  suffix?: string;
  prefix?: string;
}

function CountUpNumber({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const [current, setCurrent] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1500;
          const start = performance.now();
          const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCurrent(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-3xl font-extrabold text-white mb-1">
      {prefix}{current.toLocaleString("tr-TR")}{suffix}
    </div>
  );
}

export function StatsCounter({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          {stat.numericValue !== undefined ? (
            <CountUpNumber
              target={stat.numericValue}
              suffix={stat.suffix}
              prefix={stat.prefix}
            />
          ) : (
            <div className="text-3xl font-extrabold text-white mb-1">{stat.value}</div>
          )}
          <div className="text-sm text-slate-400">{stat.label}</div>
          <div className="text-xs text-slate-600 mt-1">Kaynak: {stat.kaynak}</div>
        </div>
      ))}
    </div>
  );
}
