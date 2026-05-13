import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { MobileMenu } from "@/components/ui/MobileMenu";
import { slugify } from "@/lib/utils";

export const metadata: Metadata = {
  metadataBase: new URL("https://exporthub.com.tr"),
  title: {
    template: "%s | ExportHub",
    default: "ExportHub Türkiye — İhracat Verileri ve Rehberler",
  },
  description:
    "Türkiye'nin kapsamlı ihracat veri portalı. İl bazlı ihracat istatistikleri, sektör analizleri ve ihracat rehberleri.",
  keywords: [
    "türkiye ihracat verileri",
    "ihracat istatistikleri",
    "nasıl ihracat yapılır",
    "türkiye dış ticaret",
  ],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "ExportHub Türkiye",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body>
        <header className="sticky top-0 z-50 bg-white/96 backdrop-blur border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-turkish-red font-bold text-xl">Export</span>
                <span className="text-slate-900 font-bold text-xl">Hub</span>
                <span className="text-slate-400 text-sm ml-1">Türkiye</span>
              </Link>
              <nav className="hidden md:flex items-center gap-6 text-sm">
                <Link href="/veriler" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
                  İhracat Verileri
                </Link>
                <Link href="/sektorler" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
                  Sektörler
                </Link>
                <Link href="/rehberler" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
                  Rehberler
                </Link>
                <Link
                  href="/rehberler/ilk-ihracat"
                  className="bg-turkish-red text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors shadow-sm"
                >
                  Başlangıç Rehberi
                </Link>
              </nav>
              <MobileMenu />
            </div>
          </div>
        </header>
        <main className="min-h-screen">{children}</main>
        <footer className="border-t border-slate-200 py-12 mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between gap-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-turkish-red font-bold text-lg">Export</span>
                  <span className="text-slate-900 font-bold text-lg">Hub</span>
                </div>
                <p className="text-slate-400 text-sm max-w-xs">
                  Türkiye ihracat ekosisteminin veri merkezi. TÜİK ve TİM
                  verilerine dayalı güvenilir bilgi.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-8 text-sm">
                <div>
                  <div className="text-slate-900 font-semibold mb-3">İller</div>
                  {["İstanbul", "Kocaeli", "Bursa", "Gaziantep", "İzmir"].map((il) => (
                    <Link
                      key={il}
                      href={`/veriler/${slugify(il)}`}
                      className="block text-slate-400 hover:text-slate-900 mb-1.5 transition-colors"
                    >
                      {il}
                    </Link>
                  ))}
                </div>
                <div>
                  <div className="text-slate-900 font-semibold mb-3">Kaynaklar</div>
                  <div className="text-slate-400 text-xs space-y-1">
                    <div>TÜİK — Türkiye İstatistik Kurumu</div>
                    <div>TİM — Türkiye İhracatçılar Meclisi</div>
                    <div>Ticaret Bakanlığı</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-slate-200 mt-8 pt-6 text-slate-500 text-xs">
              © 2024 ExportHub Türkiye. Veriler TÜİK ve TİM kaynaklıdır.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
