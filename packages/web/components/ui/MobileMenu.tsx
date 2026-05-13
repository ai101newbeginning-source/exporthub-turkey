"use client";

import { useState } from "react";
import Link from "next/link";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [dataOpen, setDataOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="text-slate-600 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100 transition-colors"
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
          {/* Veriler accordion */}
          <button
            onClick={() => setDataOpen((v) => !v)}
            className="w-full flex items-center justify-between py-3 text-slate-300 hover:text-white border-b border-slate-800/50 transition-colors"
          >
            <span>Veriler</span>
            <svg
              className={`w-3.5 h-3.5 transition-transform ${dataOpen ? "rotate-180" : ""}`}
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M2 4l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {dataOpen && (
            <div className="pl-4 border-b border-slate-800/50">
              <Link
                href="/veriler"
                onClick={() => setOpen(false)}
                className="block py-2.5 text-slate-400 hover:text-white transition-colors text-sm"
              >
                İl Bazlı Veriler
                <span className="block text-xs text-slate-600 mt-0.5">11 il, yıllık ihracat trendi</span>
              </Link>
              <Link
                href="/sektorler"
                onClick={() => setOpen(false)}
                className="block py-2.5 text-slate-400 hover:text-white transition-colors text-sm"
              >
                Sektör Analizleri
                <span className="block text-xs text-slate-600 mt-0.5">9 sektör, ürün grupları</span>
              </Link>
            </div>
          )}

          <Link
            href="/rehberler"
            onClick={() => setOpen(false)}
            className="block py-3 text-slate-300 hover:text-white border-b border-slate-800/50 transition-colors"
          >
            Rehberler
          </Link>

          <Link
            href="/rehberler/ilk-ihracat"
            onClick={() => setOpen(false)}
            className="block mt-3 bg-turkish-red text-white px-4 py-2.5 rounded-lg text-sm text-center hover:bg-red-700 transition-colors"
          >
            İhracata Başla
          </Link>
        </div>
      )}
    </div>
  );
}
