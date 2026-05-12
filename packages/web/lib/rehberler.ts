export interface Adim {
  numara: number;
  baslik: string;
  icerik: string;
}

export interface Rehber {
  slug: string;
  baslik: string;
  ozet: string;
  kategori: string;
  kategoriRenk: string;
  okumaSuresi: number;
  onayci: string;
  adimlar?: Adim[];
  bolumler?: Array<{ baslik: string; icerik: string }>;
  ozHususlar: string[];
  kaynaklar: string[];
}

export const REHBERLER: Record<string, Rehber> = {
  "ilk-ihracat": {
    slug: "ilk-ihracat",
    baslik: "İlk İhracat Nasıl Yapılır? 10 Adımda Başlangıç",
    ozet:
      "Türkiye'den ilk kez ihracat yapacak KOBİ'ler için eksiksiz başlangıç kılavuzu. Ürün seçiminden ilk sevkiyata kadar tüm adımlar.",
    kategori: "Başlangıç",
    kategoriRenk: "emerald",
    okumaSuresi: 12,
    onayci: "Senior Export Expert",
    adimlar: [
      {
        numara: 1,
        baslik: "İhracat Potansiyelinizi Belirleyin",
        icerik:
          "Ürününüzün uluslararası rekabetçiliğini analiz edin. Kalite belgelerinizi, üretim kapasitenizi ve fiyat rekabetçiliğinizi değerlendirin. Hangi pazar segmentini hedeflediğinizi netleştirin.",
      },
      {
        numara: 2,
        baslik: "Hedef Pazar Seçimi Yapın",
        icerik:
          "TİM ve Ticaret Bakanlığı'nın pazar araştırma raporlarını inceleyin. Coğrafi yakınlık, gümrük anlaşmaları ve ödeme güvenliği açısından önce AB, Orta Doğu veya BDT pazarlarını değerlendirin.",
      },
      {
        numara: 3,
        baslik: "Yasal Gerekliliklerinizi Tamamlayın",
        icerik:
          "Vergi numarası ve ticaret sicili kaydınızın bulunması yeterlidir. İhracata özel ek bir izin gerekmez; ancak bazı ürünler için Ticaret Bakanlığı'ndan ön izin alınması zorunludur (tekstil için gözetim belgesi vb.).",
      },
      {
        numara: 4,
        baslik: "HS Kodunuzu Tespit Edin",
        icerik:
          "Ürününüzün Harmonize Sistem (HS) kodunu doğru belirleyin. Bu kod, gümrük tarifesini, ithalat kısıtlamalarını ve ihracat teşviklerini doğrudan etkiler. Gümrük müşavirinizden ya da Ticaret Bakanlığı'nın TAREKS sisteminden yardım alabilirsiniz.",
      },
      {
        numara: 5,
        baslik: "Gümrük Müşaviri ile Çalışın",
        icerik:
          "Yetkili gümrük müşaviri, ihracat beyannamesini (EX) hazırlamaktan gümrük beyannamesinin onaylanmasına kadar tüm süreci yönetir. İlk ihracatınızda deneyimli bir müşavirle çalışmak ciddi zaman ve hata maliyeti tasarrufu sağlar.",
      },
      {
        numara: 6,
        baslik: "Fiyatlama ve Incoterms Belirleyin",
        icerik:
          "Alıcıyla hangi Incoterms kuralı üzerinden çalışacağınızı netleştirin. İlk ihracatta FOB (Free On Board) veya DAP (Delivered at Place) genellikle tercih edilir. Maliyet hesabınıza navlun, sigorta ve gümrük masraflarını dahil edin.",
      },
      {
        numara: 7,
        baslik: "Ödeme Yöntemini Belirleyin",
        icerik:
          "Yeni alıcılarla çalışırken akreditif (Letter of Credit) veya peşin ödeme en güvenli seçenektir. Uzun vadeli iş ortakları için açık hesap kullanılabilir. Eximbank'ın ihracat kredi sigortasından da yararlanabilirsiniz.",
      },
      {
        numara: 8,
        baslik: "Lojistik Planlamasını Yapın",
        icerik:
          "Sevkiyat modunu belirleyin: deniz, hava, kara veya demiryolu. Ürün hacmi ve teslimat süresine göre en uygun seçeneği tercih edin. Freight forwarder (nakliyat acentesi) ile sözleşme yapın ve sigortalama için yerli sigorta şirketlerini değerlendirin.",
      },
      {
        numara: 9,
        baslik: "İhracat Belgelerini Hazırlayın",
        icerik:
          "Temel belgeler: ticari fatura, çeki listesi, konşimento (B/L veya AWB), menşe şahadetnamesi. AB'ye ihracatta ATR veya EUR.1 belgesi gerekebilir. Belgelerin eksizsizliği gümrük işlemlerini doğrudan etkiler.",
      },
      {
        numara: 10,
        baslik: "Teşvik ve Destekleri Araştırın",
        icerik:
          "KOSGEB ihracat desteği, TİM'in uluslararası fuarlar programı, Eximbank kredi imkânları ve Ticaret Bakanlığı'nın pazar araştırma desteklerinden yararlanın. Yurt dışı fuar katılımları için destek başvurularını erkenden yapın.",
      },
    ],
    ozHususlar: [
      "İlk ihracatınızda küçük miktarlarla başlayarak lojistik ve gümrük süreçlerini öğrenin.",
      "Alıcı firmanın güvenilirliğini Ticaret Bakanlığı'nın yurt dışı temsilciliklerinden teyit edin.",
      "Döviz kuru riskini hedge etmek için bankanızın forward sözleşme seçeneklerini değerlendirin.",
    ],
    kaynaklar: ["TÜİK", "TİM", "Ticaret Bakanlığı", "Eximbank", "KOSGEB"],
  },

  "incoterms-rehberi": {
    slug: "incoterms-rehberi",
    baslik: "Incoterms 2020 Rehberi: EXW'dan DDP'ye",
    ozet:
      "13 Incoterms kuralının ihracatçı ve ithalatçı açısından farkları, sorumluluk ve maliyet dağılımı.",
    kategori: "Teknik",
    kategoriRenk: "sky",
    okumaSuresi: 15,
    onayci: "Senior Export Expert",
    bolumler: [
      {
        baslik: "Incoterms Nedir?",
        icerik:
          "Incoterms (International Commercial Terms), Uluslararası Ticaret Odası (ICC) tarafından yayımlanan ve alıcı-satıcı arasındaki yükümlülükleri, risk devirini ve maliyet paylaşımını standartlaştıran kurallardır. 2020 güncellemesiyle 11 kural iki kategoride düzenlenmiştir.",
      },
      {
        baslik: "Tüm Taşıma Modlarına Uygun Kurallar",
        icerik:
          "EXW (Ex Works): Satıcının sorumluluğu en düşük. Malı fabrikada teslim eder; tüm taşıma masraf ve riskleri alıcıya aittir. FCA (Free Carrier): Satıcı malı belirlenen noktada taşıyıcıya teslim eder. CPT (Carriage Paid To): Satıcı taşıma masrafını öder ancak risk FCA ile aynı noktada devredilir. CIP (Carriage and Insurance Paid To): CPT + sigorta satıcı üstlenir. DAP (Delivered at Place): Satıcı malı varış yerine kadar taşır, boşaltma alıcıya ait. DPU (Delivered at Place Unloaded): DAP + boşaltma satıcıya ait. DDP (Delivered Duty Paid): Satıcının sorumluluğu en yüksek; gümrük vergisi dahil tüm masraflar satıcıya aittir.",
      },
      {
        baslik: "Yalnızca Deniz ve İç Su Taşımacılığı",
        icerik:
          "FAS (Free Alongside Ship): Satıcı malı rıhtımda geminin yanına teslim eder. FOB (Free On Board): En yaygın kullanılan kural. Satıcı malı gemiye yükler; risk geminin güvertesinde devredilir. CFR (Cost and Freight): FOB + navlun satıcıya ait. CIF (Cost, Insurance and Freight): CFR + sigorta satıcıya ait.",
      },
      {
        baslik: "Türkiye İhracatçıları için Tavsiyeler",
        icerik:
          "İlk ihracatlarda FOB veya CFR tercih edilir çünkü kontrol satıcıdakalır. Güvenilir alıcılarla DAP veya DDP kullanmak rekabetçiliği artırabilir. AB pazarına ihracatta CIF veya DAP sıkça görülür. EXW görünürde basit olsa da alıcı ülkede gümrük sorumluluğunun karmaşıklığı nedeniyle ihracatçılar için risklidir.",
      },
    ],
    ozHususlar: [
      "CIF ile CIP arasındaki fark: CIF yalnızca deniz taşımacılığı için, CIP tüm modlar içindir ve sigorta kapsamı CIP'de daha geniştir.",
      "Incoterms ödeme yöntemini değil, teslim koşullarını düzenler; akreditif veya açık hesap ayrıca belirlenir.",
      "2020 revizyonuyla DPU kuralı DAT'ın yerini almıştır; eski sözleşmelerde DAT gördüğünüzde DPU olarak yorumlayın.",
    ],
    kaynaklar: ["ICC Incoterms 2020", "Ticaret Bakanlığı", "TİM"],
  },

  "gumruk-surecleri": {
    slug: "gumruk-surecleri",
    baslik: "Türkiye Gümrük Süreçleri 2024",
    ozet:
      "İhracat beyannamesi, ATR belgesi ve gümrük prosedürleri hakkında güncel bilgiler.",
    kategori: "Mevzuat",
    kategoriRenk: "amber",
    okumaSuresi: 10,
    onayci: "Senior Export Expert",
    bolumler: [
      {
        baslik: "İhracat Beyannamesinin Hazırlanması",
        icerik:
          "Türkiye'de ihracat beyannamesi (EX), gümrük müşaviri aracılığıyla BİLGE (Bilgisayarlı Gümrük Etkinlikleri) sistemi üzerinden elektronik olarak hazırlanır. Beyanname; ticari fatura, çeki listesi, taşıma belgesi ve varsa özel belgelerle desteklenir.",
      },
      {
        baslik: "Hat Sistemi ve Muayene",
        icerik:
          "TAREKS sistemi, ürün türü ve risk analizine göre ihracatı üç hatta yönlendirir. Yeşil hat: belge kontrolü gerekmez, çıkışa izin verilir. Sarı hat: belge kontrolü yapılır. Kırmızı hat: fiziki muayene uygulanır. Türkiye'de ihracat beyannamelerinin büyük çoğunluğu yeşil hatta işlem görmektedir.",
      },
      {
        baslik: "ATR ve EUR.1 Belgeleri",
        icerik:
          "AB'ye ihracat yapan Türk firmaları, Gümrük Birliği kapsamındaki sanayi malları için ATR dolaşım belgesi kullanır. Bu belge AB gümrük vergisinden muafiyeti sağlar. Tercihli menşe belgesi olan EUR.1 ise Serbest Ticaret Anlaşması imzalanmış ülkelerle ticarette kullanılır.",
      },
      {
        baslik: "Özel İzin Gerektiren Ürünler",
        icerik:
          "Tekstil ürünlerinde Çevre Bakanlığı TAREKS kaydı, tarım ürünlerinde Tarım Bakanlığı kontrol belgesi, ikili kullanım teknolojilerinde Savunma Sanayii Başkanlığı izni gerekebilir. Bunların yanı sıra bazı ürünler ihracat yasağı veya kota kapsamında olabilir; güncel listeyi Ticaret Bakanlığı sitesinden takip edin.",
      },
    ],
    ozHususlar: [
      "Gümrük müşavirine verilen temsil yetkisi noterden tasdikli vekâletname ile yapılır.",
      "İhracat bedelinin 180 gün içinde yurda getirilmesi zorunludur (Kambiyo mevzuatı gereği).",
      "Hatalı beyanname cezaları ağır olabileceğinden belgelerin eksizsizliğine özen gösterin.",
    ],
    kaynaklar: ["4458 Sayılı Gümrük Kanunu", "Ticaret Bakanlığı", "TÜİK"],
  },

  "akreditif": {
    slug: "akreditif",
    baslik: "Akreditif (Letter of Credit) Nasıl Çalışır?",
    ozet:
      "Uluslararası ticarette akreditif güvencesi ve UCP 600 kuralları hakkında kapsamlı rehber.",
    kategori: "Finansman",
    kategoriRenk: "purple",
    okumaSuresi: 8,
    onayci: "Senior Export Expert",
    bolumler: [
      {
        baslik: "Akreditif Nedir?",
        icerik:
          "Akreditif (Letter of Credit – L/C), alıcı bankanın satıcıya belirli belgeler karşılığında ödeme yapacağını garanti eden bir banka taahhüdüdür. Taraflar birbirini tanımıyorsa en güvenli ödeme aracıdır. UCP 600 kuralları, ICC tarafından yayımlanmış ve tüm dünyada geçerli olan akreditif standartlarını belirler.",
      },
      {
        baslik: "Akreditif Mekanizması",
        icerik:
          "1) Alıcı, bankasına (amir banka) akreditif açtırır. 2) Amir banka, ihracatçının ülkesindeki muhabir bankaya akreditifi bildirir. 3) İhracatçı malı sevk eder, akreditifte belirtilen belgeleri (konşimento, fatura, sigorta poliçesi vb.) düzenler. 4) Belgeler muhabir bankaya ibraz edilir; belgeler uygunsa banka ödemeyi yapar veya taahhüt verir. 5) Belgeler amir bankaya iletilir, alıcı ödeme yaparak belgelerle malı alır.",
      },
      {
        baslik: "Akreditif Türleri",
        icerik:
          "Görüldüğünde ödemeli (Sight L/C): Belgeler ibrazında anında ödeme. Vadeli (Usance L/C): Belirli bir vade sonrası ödeme. Rotatif: Aynı akreditif defalarca kullanılabilir. Back-to-back: İhracatçının tedarikçisine ikincil akreditif açılır. Teyitli (Confirmed L/C): Muhabir banka da ödeme taahhüdüyle ilk banka temerrüdüne karşı koruma sağlar.",
      },
      {
        baslik: "Dikkat Edilmesi Gerekenler",
        icerik:
          "Akreditif şartlarını sözleşme müzakeresi sırasında dikkatlice inceleyin; sonradan değişiklik masraflıdır. Belgelerin akreditif şartlarına tam uyumu kritiktir; küçük tutarsızlıklar (discrepancy) bile ödemeyi geciktirebilir. Vadeli akreditiflerde döviz kuru riskini forward ile hedge etmeyi değerlendirin.",
      },
    ],
    ozHususlar: [
      "Akreditifin açılış masrafı genellikle alıcı tarafından ödenir; pazarlık aşamasında bu maliyet hesaba katılmalıdır.",
      "Belge ibrazı için akreditifte belirtilen son tarihe mutlaka uyun; süre uzatımı alıcı onayı gerektirir.",
      "Teyitli akreditif seçeneği prim gerektirir ancak ülke riski yüksek pazarlarda zorunludur.",
    ],
    kaynaklar: ["ICC UCP 600", "Türkiye Bankacılık Kanunu", "Eximbank"],
  },
  "pazar-arastirmasi": {
    slug: "pazar-arastirmasi",
    baslik: "İhracatta Pazar Araştırması ve Alıcı Doğrulama",
    ozet: "Hedef pazar nasıl seçilir, yabancı alıcı nasıl bulunur ve güvenilirliği nasıl teyit edilir? KOBİ'lerin en çok dolandırıldığı bu aşamada korunma yolları.",
    kategori: "Strateji",
    kategoriRenk: "sky",
    okumaSuresi: 10,
    onayci: "Market Intelligence",
    bolumler: [
      {
        baslik: "Hedef Pazar Nasıl Seçilir?",
        icerik: "ITC Trade Map (trademap.org) ve TİM'in pazar araştırma raporları ücretsiz başlangıç noktasıdır. Türkiye'nin STA imzaladığı ülkelerde gümrük avantajı değerlendirilmeli. Önce coğrafi yakınlık (Orta Doğu, Balkanlar, BDT), dil kolaylığı ve ödeme güvenliği açısından filtreleyin.",
      },
      {
        baslik: "Yabancı Alıcı Bulma Kanalları",
        icerik: "TİM Ticaret Heyetleri ve Sektörel Ticaret Heyetleri: Bakanlık destekli, alıcıyla yüz yüze bağlantı. Ticaret Müşavirlikleri: 150+ ülkede Türk ticaret ataşeleri ücretsiz alıcı araştırması yapıyor. B2B platformları: Alibaba, GlobalSources, Europages, Kompass. Fuarlar: Hannover Messe (makine), Texworld (tekstil), SIAL (gıda) sektöre göre en verimli kanal.",
      },
      {
        baslik: "Alıcı Güvenilirliğini Nasıl Teyit Edersiniz?",
        icerik: "Coface, Euler Hermes veya D&B'den ticari kredi raporu alın (ortalama 150-300 €). Türk Ticaret Müşavirliği'nden alıcı hakkında ön bilgi isteyin (ücretsiz). LinkedIn'den şirketin varlığını, çalışan sayısını ve geçmişini doğrulayın. Referans isteyin: gerçek alıcılar mevcut tedarikçi referansı vermekten çekinmez.",
      },
      {
        baslik: "Dolandırıcılık Uyarıları",
        icerik: "Peşin ödeme yerine akreditif veya vesaik mukabili isteyen alıcıdan şüphelenin — tersi doğru, güvenilir alıcı nakit akışı için genellikle ertelenmiş ödeme ister. Fatura adresindeki şirket adı ile L/C'deki alıcı adının eşleşmesi zorunlu. 'Örnek sipariş' ile büyük hacim talep eden, iletişimi sadece WhatsApp üzerinden yürüten alıcılarda dikkatli olun.",
      },
    ],
    ozHususlar: [
      "Yeni bir pazara girerken ilk siparişi küçük tutun, alıcının ödeme davranışını test edin.",
      "Eximbank'ın ihracat kredi sigortası, alıcı temerrüdüne karşı %85'e kadar teminat sağlar.",
      "KOSGEB'in 'Pazar Araştırması ve Pazarlama Desteği' ile harcamalarınızın %60'ını geri alabilirsiniz.",
    ],
    kaynaklar: ["ITC Trade Map", "TİM", "Ticaret Müşavirlikleri", "Eximbank"],
  },

  "kdv-istisnasi": {
    slug: "kdv-istisnasi",
    baslik: "İhracatta KDV İstisnası ve KDV İadesi Nasıl Alınır?",
    ozet: "İhracat teslimleri KDV'den istisnadır ve yüklenilen KDV iade alınabilir. Bu nakit akışı avantajını kullanmak için gereken belgeler ve süreç.",
    kategori: "Vergi",
    kategoriRenk: "emerald",
    okumaSuresi: 9,
    onayci: "Senior Export Expert",
    bolumler: [
      {
        baslik: "İhracat KDV İstisnası Nedir?",
        icerik: "3065 sayılı KDV Kanunu'nun 11. maddesi gereği ihracat teslimleri KDV'den istisnadır. Yani malı yurt dışına sattığınızda faturanıza KDV eklemezsiniz. Ancak o malı üretirken ödediğiniz KDV'yi (hammadde, enerji, hizmet) Madde 32 kapsamında Hazine'den geri alabilirsiniz.",
      },
      {
        baslik: "İade Nasıl Talep Edilir?",
        icerik: "Mahsuben iade: Ödenecek KDV'den düşülür, en hızlı yol. Nakden iade: 10.000 TL'nin altında vergi inceleme raporu olmadan, üzerinde YMM tasdik raporu veya vergi inceleme raporu gerekir. Elektronik ortamda KDV İadesi Kontrol Raporu (KDVİRA) sistemi üzerinden başvuru yapılır. Süre: Mahsuben 1-2 ay, nakden 3-6 ay olabilir.",
      },
      {
        baslik: "Gerekli Belgeler",
        icerik: "İhracat beyannamesi (gümrükçe onaylı kapanmış), ticari fatura, yüklenilen KDV listesi, ihracata ait taşıma belgeleri. İmalatçı-ihracatçılarda ayrıca satın alma faturaları ve stok takip belgesi istenebilir.",
      },
      {
        baslik: "Dikkat Edilmesi Gereken Noktalar",
        icerik: "İhracat beyannamesinin kapanması iadein ön koşuludur; gümrük kapanışı gecikmesi iade sürecini doğrudan etkiler. Bedelsiz ihracat, örnekler ve numuneler için özel hükümler geçerlidir. İhracatla ilgisiz KDV (yurt içi satış, personel giderleri) yüklenilen KDV listesine dahil edilmemelidir.",
      },
    ],
    ozHususlar: [
      "YMM ile sürekli hizmet sözleşmesi yaparsanız iade süreci önemli ölçüde hızlanır.",
      "KDV iadesi nakit akışı üzerindeki etkisi büyük — aylık takip edin, gecikmelerinizi GİB'e bildirin.",
      "e-Fatura/e-Arşiv zorunluluğu kapsamındaysanız iade başvurularında elektronik belgeler öncelikli kabul görmektedir.",
    ],
    kaynaklar: ["3065 Sayılı KDV Kanunu", "GİB", "KDVİRA Sistemi"],
  },

  "devlet-destekleri": {
    slug: "devlet-destekleri",
    baslik: "İhracatçılar İçin Devlet Destekleri: KOSGEB, Eximbank ve Ticaret Bakanlığı",
    ozet: "Hibe ve düşük faizli krediden fuar desteklerine kadar ihracatçıların yararlanabileceği tüm destekler, başvuru koşulları ve pratik tüyolar.",
    kategori: "Finansman",
    kategoriRenk: "purple",
    okumaSuresi: 11,
    onayci: "Senior Export Expert",
    bolumler: [
      {
        baslik: "KOSGEB Uluslararasılaşma Desteği",
        icerik: "Yurt dışı pazar araştırması, reklam-tanıtım, yabancı dil sertifikası ve web sitesi giderleri için %60'a kadar hibe. Üst limit: 300.000 TL/yıl. Başvuru: KOSGEB portalı üzerinden, KOBİ koşulunu sağlayan tüm işletmeler yararlanabilir. Dikkat: gider yapılmadan önce onay alınması gerekir.",
      },
      {
        baslik: "Ticaret Bakanlığı Destekleri (2010/8 Sayılı Karar)",
        icerik: "Yurt dışı fuar katılımı: stand kirası ve nakliye giderlerinin %50-75'i hibe. Pazar araştırması: rapor başına 1.500 $'a kadar destek. E-ticaret platformu üyeliği: Amazon, Alibaba, Etsy üyelik ücretlerinin %75'i desteklenir. Reklam giderleri: Google, Meta, LinkedIn reklamları dahil, $400.000'a kadar. Başvuru: İhracatçı Birlikleri üzerinden yapılır.",
      },
      {
        baslik: "Eximbank Kredileri ve Sigorta",
        icerik: "Kısa vadeli ihracat kredisi: TCMB politika faizinin altında, 360 güne kadar. Sevk öncesi ihracat kredisi: sipariş aşamasında üretim finansmanı. İhracat kredi sigortası: alıcı temerrüdü ve politik risk karşı %85'e kadar teminat. İhracat alacak sigortası: senedin vadesinde ödenmemesi durumunda koruma. Özellikle Afrika, Orta Asya ve MENA gibi riskli pazarlara açılanlara kritik.",
      },
      {
        baslik: "TİM ve Birlik Destekleri",
        icerik: "Sektörel Ticaret Heyeti: Bakanlık-TİM ortaklığıyla düzenlenen, belirli ülkelere yönelik alıcı buluşmaları. Yurt İçi ve Yurt Dışı Fuarlar: İhracatçı Birlikleri toplu katılım organizasyonu. Ar-Ge ve Yenilik: TÜBİTAK 1501, TEYDEB programlarıyla ihracata yönelik ürün geliştirme destekleri.",
      },
    ],
    ozHususlar: [
      "Desteklerin çoğunda 'geriye dönük' harcama kabul edilmez — önce onay alın, sonra harcayın.",
      "Birden fazla desteği eş zamanlı kullanmak mümkün, ancak aynı gider kalemini iki farklı destekten talep edemezsiniz.",
      "KOSGEB ve Bakanlık desteklerinde KOBİ şartı (250 kişi altı, 500 milyon TL altı ciro) 2024 itibarıyla güncellenmiştir — kontrol edin.",
    ],
    kaynaklar: ["KOSGEB", "Ticaret Bakanlığı", "Eximbank", "TİM"],
  },

  "lojistik-secimi": {
    slug: "lojistik-secimi",
    baslik: "İhracatta Lojistik ve Nakliye Modu Seçimi",
    ozet: "Denizyolu, havayolu, karayolu ve demiryolu arasında doğru tercihi nasıl yaparsınız? Maliyet, hız ve ürüne göre karar rehberi.",
    kategori: "Lojistik",
    kategoriRenk: "amber",
    okumaSuresi: 8,
    onayci: "Senior Export Expert",
    bolumler: [
      {
        baslik: "Denizyolu (FCL / LCL)",
        icerik: "FCL (Full Container Load): Tam konteyner, 20' veya 40'. Büyük hacim için en ekonomik seçenek. LCL (Less than Container Load): Farklı gönderenlerle konteyner paylaşımı, küçük hacimler için. Transit süre: Avrupa 10-15 gün, Uzak Doğu 25-35 gün. Uygun ürünler: ağır ve hacimli sanayi malları, tekstil, gıda. Belge: Bill of Lading (B/L).",
      },
      {
        baslik: "Havayolu",
        icerik: "En hızlı, en pahalı mod. Kilo başına maliyet denizyolunun 4-6 katı. Uygun ürünler: elektronik, ilaç, mücevher, moda ürünleri, acil parça. İstanbul Havalimanı Avrupa'nın en büyük kargo terminaline sahip. Transit süre: Avrupa 1-2 gün, ABD 2-3 gün. Belge: Air Waybill (AWB). DHL, FedEx, UPS ekspres çözümleri küçük hacimler için alternatif.",
      },
      {
        baslik: "Karayolu",
        icerik: "Avrupa, Orta Doğu ve BDT için esneklik ve kapıdan kapıya teslimat avantajı. Transit süre: Almanya 4-5 gün, Irak 2-3 gün. TIR karnesi ile 58 ülkede kolaylaştırılmış gümrük. CMR konşimentosu uluslararası kara taşımasının temel belgesi. Türkiye kara taşımacılığında Avrupa'da 1. sıradadır.",
      },
      {
        baslik: "Demiryolu ve Çok Modlu Taşımacılık",
        icerik: "Bakü-Tiflis-Kars (BTK) hattıyla Orta Asya'ya demiryolu bağlantısı güçlendi. Çin'e denizyolundan %30 ucuz, havayolundan %70 ucuz. Transit süre: Çin 12-18 gün. Çok modlu (multimodal): farklı modları birleştirerek maliyet-hız dengesi. Örn. karayolu + denizyolu kombinasyonu (ro-ro).",
      },
    ],
    ozHususlar: [
      "Freight forwarder seçiminde en az 3 teklif alın ve referans kontrol edin — fiyat farkı %20-40 olabilir.",
      "Incoterms ile nakliye modu doğrudan bağlantılı: FOB/CFR/CIF yalnızca denizyolu için, FCA/CPT/CIP tüm modlar için geçerli.",
      "Ürününüzün ADR (tehlikeli madde), soğuk zincir veya özel ambalaj gerektirip gerektirmediğini önceden belirleyin.",
    ],
    kaynaklar: ["UND (Uluslararası Nakliyeciler Derneği)", "DTD", "Ticaret Bakanlığı"],
  },

  "uluslararasi-sozlesme": {
    slug: "uluslararasi-sozlesme",
    baslik: "Uluslararası Satış Sözleşmeleri: CISG ve ICC Model Sözleşme",
    ozet: "İhracat sözleşmesi nasıl hazırlanır? Hangi hukuk geçerli olur? Uyuşmazlık durumunda ne yapılır? CISG ve ICC model sözleşme rehberi.",
    kategori: "Hukuk",
    kategoriRenk: "sky",
    okumaSuresi: 10,
    onayci: "Senior Export Expert",
    bolumler: [
      {
        baslik: "CISG Nedir ve Neden Önemlidir?",
        icerik: "CISG (Milletlerarası Mal Satımı Sözleşmeleri Hakkında BM Antlaşması), Türkiye'nin 2011'de taraf olduğu ve 97 ülkede geçerli uluslararası satım hukukudur. Taraflar aksini kararlaştırmadıkça iki CISG ülkesi arasındaki mal satımlarına otomatik uygulanır. Türk BK veya alıcının ulusal hukukundan farklı hükümler içerebileceğinden bilinmesi kritiktir.",
      },
      {
        baslik: "Sözleşmede Olmazsa Olmaz Maddeler",
        icerik: "Tarafların tanımı ve adresleri. Malın tanımı, miktarı ve kalite kriterleri (ISO, CE sertifikaları dahil). Fiyat ve para birimi. Teslim koşulu (Incoterms kuralı). Ödeme yöntemi ve vadesi. Mülkiyetin geçişi. Garanti ve ayıp ihbarı süresi. Yetkili hukuk ve uyuşmazlık çözüm yeri.",
      },
      {
        baslik: "Uyuşmazlık Çözümü",
        icerik: "Mahkeme yerine tahkim tercih edin: ICC, LCIA veya İstanbul Tahkim Merkezi (ISTAC) kararları 170+ ülkede icra edilebilir. New York Sözleşmesi kapsamındaki tahkim kararları mahkeme kararlarından çok daha kolay tanınır. Mücbir sebep maddesi (force majeure): pandemi, savaş, doğal afet durumlarını açıkça tanımlayın.",
      },
      {
        baslik: "ICC Model Sözleşmeler",
        icerik: "ICC (Uluslararası Ticaret Odası) distribütörlük, acente ve tek seferlik satım için hazır model sözleşmeler sunar. Bu belgeler 150+ ülkede mahkemelerce tanınan standartlardır. Türkçe çevirileri ICC Türkiye üzerinden temin edilebilir. Kendi sözleşmenizi bu modeller üzerine inşa etmek, sıfırdan hazırlamaktan çok daha güvenlidir.",
      },
    ],
    ozHususlar: [
      "Sözleşmeyi her iki dilde (Türkçe + alıcının dili) hazırlayın; çelişki halinde hangi dilin esas alınacağını belirtin.",
      "CISG'i dışlamak istiyorsanız sözleşmede açıkça 'CISG'in uygulanması hariç tutulmuştur' yazın.",
      "Avukat ücreti ödememek için şimdi sözleşmeyi basit tutmak, ileride dava maliyetini katlayabilir — en azından ICC model sözleşmesini kullanın.",
    ],
    kaynaklar: ["CISG (BM)", "ICC Model Contracts", "ISTAC", "ICC Türkiye"],
  },

  "gaziantep-ihracat": {
    slug: "gaziantep-ihracat",
    baslik: "Gaziantep'ten İhracat: Sektörler ve Pazarlar",
    ozet:
      "Türkiye'nin en hızlı büyüyen ihracat kenti Gaziantep'in profili, güçlü sektörleri ve hedef pazar analizi.",
    kategori: "İl Rehberi",
    kategoriRenk: "red",
    okumaSuresi: 9,
    onayci: "Market Intelligence",
    bolumler: [
      {
        baslik: "Gaziantep İhracat Profili",
        icerik:
          "Gaziantep, 2024 yılında 12.1 milyar dolar ihracatla Türkiye'nin 5. büyük ihracat merkezi konumuna yükseldi. %16.3'lük büyüme oranıyla ülkenin en dinamik ihracat şehri olan Gaziantep, coğrafi konumuyla Orta Doğu ve Afrika pazarlarına doğal bir köprü oluşturuyor.",
      },
      {
        baslik: "Güçlü Sektörler",
        icerik:
          "Tekstil ve Halı: Gaziantep makineli halıcılıkta dünya lideri, yıllık 3.2 milyar dolarlık ihracat. Gıda ve Tarım: Coğrafi işaret korumalı Antep fıstığı, zeytinyağı ve baharat ihracatı. Makine ve Teçhizat: Orta Doğu altyapı projelerine 1.8 milyar dolarlık teçhizat ihracatı. Plastik ve Ambalaj: Bölgedeki sanayi büyümesine paralel güçlü ihracat potansiyeli.",
      },
      {
        baslik: "Hedef Pazarlar",
        icerik:
          "Irak (%22 pay): Sınır ticareti avantajıyla en büyük pazar. Kara yolu ile 1-2 günde teslimat mümkün. Körfez Ülkeleri (BAE, Suudi Arabistan, Katar): Yüksek gelirli tüketici pazarı, halı ve gıda talebi güçlü. Almanya ve AB: Tekstil ve konfeksiyonda köklü ticaret ilişkileri. Kuzey Afrika (Mısır, Libya, Tunus): Gelişen orta sınıf, Türk gıda ürünlerine artan talep.",
      },
      {
        baslik: "Lojistik Avantajlar",
        icerik:
          "Gaziantep Havalimanı'nın kargo kapasitesi 2023'te 40.000 ton/yıla yükseltildi. Islahiye-Nurdağı kara yolu güzergahı Irak ve Suriye'ye doğrudan bağlantı sağlıyor. Gaziantep OSB'de 1.200'ü aşkın ihracatçı firma faaliyet gösteriyor. İskenderun Limanı 130 km mesafede deniz ihracatı için kullanılıyor.",
      },
      {
        baslik: "İhracata Başlamak İçin",
        icerik:
          "GAGİAD (Gaziantep Genç İşadamları Derneği) ve GSO (Gaziantep Sanayi Odası), yeni ihracatçılara ücretsiz danışmanlık sağlıyor. TİM'in GAP Bölge Fuarı, her yıl Körfez ülkelerinden alıcıları Gaziantep'e çekiyor. KOSGEB'in 'Uluslararasılaşma' desteğinden ilk ihracatını yapacak Gaziantep firmaları öncelikli yararlanabiliyor.",
      },
    ],
    ozHususlar: [
      "Irak pazarına ihracatta Türkçe-Arapça iki dilli belge hazırlamak süreçleri kolaylaştırır.",
      "Antep fıstığı ve gıda ürünleri ihracatında Tarım Bakanlığı fitosaniter sertifikası zorunludur.",
      "Körfez ülkelerine helal sertifikalı ürün ihracatında GIMDES veya TSE belgesi rekabetçilik sağlar.",
    ],
    kaynaklar: ["GSO", "GAGİAD", "TİM GAP Bölge", "KOSGEB"],
  },

  "istanbul-ihracat": {
    slug: "istanbul-ihracat",
    baslik: "İstanbul'dan İhracat: Türkiye'nin Merkezi",
    ozet:
      "75 milyar dolarlık ihracatıyla Türkiye'nin tartışmasız ihracat başkenti İstanbul'un ekosistemi, sektörleri ve lojistik avantajları.",
    kategori: "İl Rehberi",
    kategoriRenk: "red",
    okumaSuresi: 11,
    onayci: "Market Intelligence",
    bolumler: [
      {
        baslik: "İstanbul İhracat Profili",
        icerik:
          "İstanbul, 2024 yılında 75.3 milyar dolar ihracatla Türkiye toplam ihracatının yaklaşık %29'unu tek başına gerçekleştirdi. Yaklaşık 22.000 aktif ihracatçı firmasıyla İstanbul, sadece Türkiye'nin değil tüm Orta Doğu ve Karadeniz havzasının ticaret merkezi konumundadır.",
      },
      {
        baslik: "Güçlü Sektörler",
        icerik:
          "Tekstil ve Konfeksiyon: 21.4 milyar dolarlık ihracatla ezici üstünlük. Fast fashion'dan lüks segmente geniş yelpaze. Makine ve Teçhizat: Endüstriyel ekipman ve yedek parça ihracatında öncü. Kimya ve Plastik: Petrokimya ürünleri ve ambalaj sektöründe güçlü ihracat. Mücevherat: Dünyanın en büyük mücevher ihracat merkezlerinden biri, 7 milyar dolarlık ihracat.",
      },
      {
        baslik: "Hedef Pazarlar",
        icerik:
          "Almanya (%12): Tekstil, makine ve kimya ürünlerinde en büyük pazar. Türk diasporası tüketici talebini de destekliyor. ABD (%8): Mücevherat ve teknik tekstil ihracatında güçlü büyüme. İngiltere (%7): Brexit sonrası ikili ticaret anlaşması ile rekabetçi tarife avantajı. İtalya ve Fransa: Moda ve tekstil sektöründe stratejik ortaklar.",
      },
      {
        baslik: "Lojistik Altyapı",
        icerik:
          "İstanbul Havalimanı, Avrupa'nın en büyük kargo terminaline sahip; yıllık 4 milyon ton kapasitesi. Ambarlı ve Haydarpaşa limanları konteyner ihracatının bel kemiği. İstanbul-Edirne kara güzergahı AB'ye kara ihracatında kritik. Halkalı Lojistik Merkezi, Orta Asya'ya uzanan demiryolu hattının başlangıç noktası.",
      },
      {
        baslik: "İhracatçı Ekosistemi",
        icerik:
          "İTKİB (İstanbul Tekstil ve Konfeksiyon İhracatçı Birlikleri), üyelerine yurt dışı pazar araştırması, fuar desteği ve eğitim imkânı sunuyor. İMEAK DTO (İstanbul ve Marmara Ege Akdeniz Karadeniz Bölgeleri Deniz Ticaret Odası), deniz ihracatı konusunda kapsamlı destek veriyor. Sabancı Üniversitesi ve İstanbul Ticaret Üniversitesi'nin uluslararası ticaret sertifika programları bölgeye özgüdür.",
      },
    ],
    ozHususlar: [
      "İstanbul'da ihracat maliyetleri yüksek olabilir — depo ve lojistik için Esenyurt, Hadımköy veya Gebze'yi değerlendirin.",
      "Tekstil ihracatında AB'nin yeni Yeşil Mutabakat gereklilikleri (karbon ayak izi, sürdürülebilirlik beyanı) 2025'ten itibaren zorunlu hale geliyor.",
      "İstanbul merkezli freight forwarder sayısı çok — fiyat karşılaştırması için en az 3 teklif alın.",
    ],
    kaynaklar: ["İTKİB", "İMEAK DTO", "İstanbul Ticaret Odası", "TÜİK"],
  },
};

export function getRehber(slug: string): Rehber | null {
  return REHBERLER[slug] ?? null;
}

export function getAllRehberler(): Rehber[] {
  return Object.values(REHBERLER);
}
