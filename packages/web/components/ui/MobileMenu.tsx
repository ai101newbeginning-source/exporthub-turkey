"use client";

import { useState } from "react";

const LINKS = [
  { href: "/veriler", label: "İhracat Verileri" },
  { href: "/sektorler", label: "Sektörler" },
  { href: "/rehberler", label: "Rehberler" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="text-slate-300 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
        aria-label="Menü"
      >
        {open ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute top-16 left-0 right-0 bg-slate-950/98 backdrop-blur border-b border-slate-800 px-4 py-4 z-50 animate-fade-up">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-slate-300 hover:text-white border-b border-slate-800/50 last:border-0 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/rehberler/ilk-ihracat"
            onClick={() => setOpen(false)}
            className="block mt-3 bg-turkish-red text-white px-4 py-2.5 rounded-lg text-sm text-center hover:bg-red-700 transition-colors"
          >
            Başlangıç Rehberi
          </a>
        </div>
      )}
    </div>
  );
}
