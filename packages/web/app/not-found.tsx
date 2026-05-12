import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-32 text-center">
      <div className="text-turkish-red text-6xl font-extrabold mb-4">404</div>
      <h1 className="text-2xl font-bold text-white mb-4">Sayfa Bulunamadı</h1>
      <p className="text-slate-400 mb-8">Aradığınız içerik mevcut değil.</p>
      <Link
        href="/"
        className="bg-turkish-red text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-colors"
      >
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}
