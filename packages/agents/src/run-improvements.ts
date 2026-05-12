import "dotenv/config";
import { writeFileSync } from "fs";
import { join } from "path";
import { ExportHubOrchestrator } from "./orchestrator.js";

const o = new ExportHubOrchestrator(process.env.ANTHROPIC_API_KEY);

async function main() {
  console.log("=== VERİ ANALİSTİ — Yeni İl Verileri ===\n");
  const iller = await o.runAgent("data-analyst",
    `Türkiye'nin aşağıdaki illeri için gerçekçi ihracat verisi üret. Her il için ayrı JSON objesi ver, markdown kod bloğuna sar. Format: {"id":"ankara","il":"Ankara","bolge":"İç Anadolu","yillikIhracat":{"2020":X,"2021":X,"2022":X,"2023":X,"2024":X},"birim":"milyar USD","buyumeOrani2024":X,"topSektorler":[{"ad":"...","pay":X}],"topUlkeler":[{"ulke":"...","pay":X}],"ihracatciSayisi":X,"aciklama":"..."}
    
    İller: Ankara, Antalya, Mersin, Konya, Denizli, Kayseri
    
    TÜİK 2024 verilerine göre gerçekçi rakamlar kullan. Pay değerleri % olarak, ihracat değerleri milyar USD.`
  );
  console.log(iller.output);
  writeFileSync("/tmp/iller-output.txt", iller.output);

  console.log("\n\n=== VERİ ANALİSTİ — Yeni Sektörler ===\n");
  const sektorler = await o.runAgent("data-analyst",
    `Şu 3 sektör için JSON verisi üret. Format: {"id":"gida","ad":"Gıda ve Tarım Ürünleri","toplamIhracat2024":X,"birim":"milyar USD","buyumeOrani2024":X,"topIller":["..."],"topUlkeler":["..."],"urunGruplari":[{"ad":"...","pay":X}],"aciklama":"..."}
    
    Sektörler: 
    1) Gıda ve Tarım (id: gida) — Türkiye'nin güçlü ihracat kalemi
    2) Kimya ve Plastik (id: kimya) — petrokimya, boya, plastik
    3) Demir Çelik (id: demir-celik) — Türkiye dünyanın önde gelen üreticisi
    
    Gerçekçi 2024 rakamlar kullan.`
  );
  console.log(sektorler.output);
  writeFileSync("/tmp/sektorler-output.txt", sektorler.output);

  console.log("\n\n=== UZMAN — Yeni SSS Soruları ===\n");
  const sss = await o.runAgent("senior-export-expert",
    `Türkiye'den ihracat yapan veya yapacak KOBİ'lerin en çok merak ettiği 10 yeni SSS sorusu ve cevabı yaz. Mevcut sorular şunlar (tekrarlama): gümrük müşaviri, FOB/CIF farkı, ATR belgesi, devlet teşvikleri, pazar seçimi, ilk ihracat gereksinimleri. 
    
    Format: JSON array: [{"s":"soru?","c":"cevap (2-3 cümle, teknik ama anlaşılır)"}]
    Konular: akreditif vs havale, menşe şahadeti, ithalatçı ülke gümrük vergisi araştırma, numune gönderimi, fiyat teklifi hazırlama, ihracat sigortası, Türk Eximbank kredileri, döviz riski yönetimi, ETGB nedir, CE belgesi.`
  );
  console.log(sss.output);
  writeFileSync("/tmp/sss-output.txt", sss.output);
}

main().catch(console.error);
