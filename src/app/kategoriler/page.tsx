"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useMemo, Suspense } from "react";
import {
  Search,
  ArrowUpDown,
  Clock,
  Eye,
  ChevronDown,
  Flame,
  MessageCircle,
  Laptop,
  Code,
  Palette,
  Truck,
  GraduationCap,
  SprayCan,
  Hammer,
  Sofa,
  Car,
  Heart,
  Scale,
  Building,
  PartyPopper,
  Camera,
  Music,
  Languages,
  Shirt,
  TreePine,
  PawPrint,
  Dumbbell,
  UtensilsCrossed,
  Printer,
  Shield,
  Package,
} from "lucide-react";

interface CategoryListing {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  budget: string;
  offers: number;
  views: number;
  timeLeft: string;
  location: string;
}

const categoryIcons: Record<string, React.ElementType> = {
  "Elektronik": Laptop,
  "Yazılım & IT": Code,
  "Grafik Tasarım": Palette,
  "Nakliye & Taşımacılık": Truck,
  "Eğitim & Özel Ders": GraduationCap,
  "Temizlik": SprayCan,
  "Tadilat & Dekorasyon": Hammer,
  "Mobilya": Sofa,
  "Otomotiv": Car,
  "Sağlık & Güzellik": Heart,
  "Hukuk & Danışmanlık": Scale,
  "Emlak": Building,
  "Etkinlik & Organizasyon": PartyPopper,
  "Fotoğraf & Video": Camera,
  "Müzik & Ses": Music,
  "Çeviri & Redaksiyon": Languages,
  "Giyim & Moda": Shirt,
  "Bahçe & Peyzaj": TreePine,
  "Evcil Hayvan": PawPrint,
  "Spor & Fitness": Dumbbell,
  "Yemek & Catering": UtensilsCrossed,
  "Matbaa & Baskı": Printer,
  "Sigorta": Shield,
  "Kargo & Kurye": Package,
};

const allCategories = Object.keys(categoryIcons);

const mockListings: CategoryListing[] = [
  { id: 1, title: "Projeksiyon Cihazı Kurulumu", description: "Ofisimiz için profesyonel projeksiyon ve ses sistemi kurulumu yaptırmak istiyoruz.", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80", category: "Yazılım & IT", budget: "5.000 - 10.000 TL", offers: 12, views: 245, timeLeft: "2 gün kaldı", location: "İstanbul" },
  { id: 2, title: "iPhone 15 Pro Max 256GB", description: "Sıfır veya temiz ikinci el iPhone 15 Pro Max arıyorum.", image: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=800&q=80", category: "Elektronik", budget: "55.000 - 65.000 TL", offers: 8, views: 189, timeLeft: "5 gün kaldı", location: "İstanbul" },
  { id: 3, title: "Kurumsal Web Sitesi Tasarımı", description: "Modern, responsive ve SEO uyumlu kurumsal web sitesi.", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80", category: "Yazılım & IT", budget: "15.000 - 25.000 TL", offers: 21, views: 412, timeLeft: "3 gün kaldı", location: "Uzaktan" },
  { id: 4, title: "İstanbul - Ankara Ev Taşıma", description: "3+1 dairemizin eşyalarını profesyonel nakliye ile taşıtmak istiyoruz.", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80", category: "Nakliye & Taşımacılık", budget: "12.000 - 18.000 TL", offers: 6, views: 98, timeLeft: "1 gün kaldı", location: "İstanbul" },
  { id: 5, title: "Lise Matematik Özel Ders", description: "11. sınıf öğrencisi için haftada 3 gün matematik özel ders.", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80", category: "Eğitim & Özel Ders", budget: "800 - 1.200 TL/Saat", offers: 4, views: 67, timeLeft: "4 gün kaldı", location: "İstanbul" },
  { id: 6, title: "Bahçe Peyzaj Düzenlemesi", description: "Villa bahçemiz için komple peyzaj tasarımı ve uygulama.", image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80", category: "Bahçe & Peyzaj", budget: "20.000 - 35.000 TL", offers: 3, views: 54, timeLeft: "6 gün kaldı", location: "İstanbul" },
  { id: 7, title: "Düğün Fotoğrafçısı", description: "Düğünümüz için profesyonel fotoğraf ve drone çekimi.", image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80", category: "Fotoğraf & Video", budget: "8.000 - 15.000 TL", offers: 0, views: 23, timeLeft: "7 gün kaldı", location: "İstanbul" },
  { id: 8, title: "Klima Montajı (3 Adet)", description: "3 adet inverter klima alımı ve montajı.", image: "https://images.unsplash.com/photo-1631545806609-35d4ae440431?auto=format&fit=crop&w=800&q=80", category: "Tadilat & Dekorasyon", budget: "30.000 - 45.000 TL", offers: 5, views: 112, timeLeft: "3 gün kaldı", location: "Ankara" },
  { id: 9, title: "İngilizce Çeviri (50 Sayfa)", description: "Akademik makale çevirisi için profesyonel çevirmen.", image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80", category: "Çeviri & Redaksiyon", budget: "3.000 - 5.000 TL", offers: 9, views: 156, timeLeft: "2 gün kaldı", location: "Uzaktan" },
  { id: 10, title: "Kedi Bakım & Pansiyon", description: "10 gün boyunca 2 kedimiz için güvenilir pansiyon.", image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80", category: "Evcil Hayvan", budget: "1.500 - 3.000 TL", offers: 2, views: 41, timeLeft: "5 gün kaldı", location: "İstanbul" },
  { id: 11, title: "Logo ve Kurumsal Kimlik", description: "Yeni markamız için logo, kartvizit ve kurumsal kimlik tasarımı.", image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80", category: "Grafik Tasarım", budget: "5.000 - 8.000 TL", offers: 14, views: 320, timeLeft: "4 gün kaldı", location: "Uzaktan" },
  { id: 12, title: "Ofis Temizliği (Haftalık)", description: "200m² ofisimiz için haftada 3 gün profesyonel temizlik.", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80", category: "Temizlik", budget: "4.000 - 6.000 TL/Ay", offers: 7, views: 88, timeLeft: "3 gün kaldı", location: "İstanbul" },
  { id: 13, title: "Koltuk Takımı (3+3+1)", description: "Modern tasarım, gri tonlarında koltuk takımı arıyorum.", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80", category: "Mobilya", budget: "15.000 - 25.000 TL", offers: 3, views: 76, timeLeft: "6 gün kaldı", location: "Ankara" },
  { id: 14, title: "Araç Kaplama (Full)", description: "2022 model BMW 3 Serisi için mat siyah full kaplama.", image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800&q=80", category: "Otomotiv", budget: "20.000 - 30.000 TL", offers: 5, views: 198, timeLeft: "5 gün kaldı", location: "İstanbul" },
  { id: 15, title: "Düğün Organizasyonu", description: "150 kişilik düğün organizasyonu için komple paket.", image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80", category: "Etkinlik & Organizasyon", budget: "50.000 - 80.000 TL", offers: 8, views: 267, timeLeft: "10 gün kaldı", location: "İstanbul" },
  { id: 16, title: "Stüdyo Ses Kaydı", description: "5 şarkılık albüm için profesyonel stüdyo kaydı.", image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80", category: "Müzik & Ses", budget: "10.000 - 20.000 TL", offers: 2, views: 45, timeLeft: "7 gün kaldı", location: "İstanbul" },
  { id: 17, title: "Kişisel Antrenör (3 Ay)", description: "Haftada 4 gün kişisel fitness antrenörü arıyorum.", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80", category: "Spor & Fitness", budget: "6.000 - 10.000 TL/Ay", offers: 6, views: 134, timeLeft: "5 gün kaldı", location: "İstanbul" },
  { id: 18, title: "Toplu Yemek Siparişi", description: "50 kişilik şirket etkinliği için catering hizmeti.", image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80", category: "Yemek & Catering", budget: "8.000 - 12.000 TL", offers: 4, views: 89, timeLeft: "2 gün kaldı", location: "İstanbul" },
  { id: 19, title: "Broşür Baskısı (5000 Adet)", description: "A4 boyutunda, çift taraflı, kuşe kağıda broşür baskısı.", image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80", category: "Matbaa & Baskı", budget: "3.000 - 5.000 TL", offers: 11, views: 203, timeLeft: "3 gün kaldı", location: "İstanbul" },
  { id: 20, title: "Konut Sigortası", description: "3+1 dairemiz için kapsamlı konut sigortası teklifi.", image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80", category: "Sigorta", budget: "2.000 - 4.000 TL/Yıl", offers: 9, views: 167, timeLeft: "4 gün kaldı", location: "İstanbul" },
  { id: 21, title: "Acil Kurye Hizmeti", description: "İstanbul içi aynı gün teslimat kurye hizmeti.", image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=800&q=80", category: "Kargo & Kurye", budget: "500 - 1.000 TL", offers: 3, views: 56, timeLeft: "1 gün kaldı", location: "İstanbul" },
  { id: 22, title: "Cilt Bakım Paketi", description: "Profesyonel cilt analizi ve 5 seanslık bakım paketi.", image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80", category: "Sağlık & Güzellik", budget: "3.000 - 6.000 TL", offers: 5, views: 142, timeLeft: "6 gün kaldı", location: "İstanbul" },
  { id: 23, title: "Hukuki Danışmanlık", description: "Şirket kuruluşu için hukuki danışmanlık hizmeti.", image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80", category: "Hukuk & Danışmanlık", budget: "5.000 - 10.000 TL", offers: 4, views: 98, timeLeft: "5 gün kaldı", location: "İstanbul" },
  { id: 24, title: "Kiralık Daire Aranıyor", description: "Kadıköy civarında 2+1 kiralık daire arıyorum.", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80", category: "Emlak", budget: "12.000 - 18.000 TL/Ay", offers: 7, views: 312, timeLeft: "7 gün kaldı", location: "İstanbul" },
  { id: 25, title: "Abiye Elbise Dikimi", description: "Özel gün için kişiye özel abiye elbise dikimi.", image: "https://images.unsplash.com/photo-1518622358385-8ea7d0794bf6?auto=format&fit=crop&w=800&q=80", category: "Giyim & Moda", budget: "3.000 - 7.000 TL", offers: 6, views: 178, timeLeft: "8 gün kaldı", location: "İstanbul" },
];

const sortOptions = [
  { value: "newest", label: "En Yeni" },
  { value: "most-offers", label: "En Çok Teklif" },
  { value: "most-views", label: "En Çok Görüntülenen" },
  { value: "ending-soon", label: "Süresi Azalan" },
];

function KategorilerContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("q") || "Tümü";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const filtered = useMemo(() => {
    let result = [...mockListings];

    if (selectedCategory !== "Tümü") {
      result = result.filter((l) => l.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (l) => l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case "most-offers":
        result.sort((a, b) => b.offers - a.offers);
        break;
      case "most-views":
        result.sort((a, b) => b.views - a.views);
        break;
      case "ending-soon":
        result.sort((a, b) => {
          const aNum = parseInt(a.timeLeft) || 99;
          const bNum = parseInt(b.timeLeft) || 99;
          return aNum - bNum;
        });
        break;
      default:
        break;
    }

    return result;
  }, [selectedCategory, searchQuery, sortBy]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { "Tümü": mockListings.length };
    for (const l of mockListings) {
      counts[l.category] = (counts[l.category] || 0) + 1;
    }
    return counts;
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-40 py-8 md:py-12">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
          Kategoriler
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {selectedCategory === "Tümü" ? "Tüm kategorilerdeki ilanları keşfedin." : `${selectedCategory} kategorisindeki ilanlar`}
        </p>
      </div>

      {/* Category Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-6 no-scrollbar scrollbar-hide">
        <button
          onClick={() => setSelectedCategory("Tümü")}
          className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            selectedCategory === "Tümü"
              ? "bg-primary text-white shadow-sm"
              : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
          }`}
        >
          Tümü
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${selectedCategory === "Tümü" ? "bg-white/20 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-500"}`}>
            {categoryCounts["Tümü"]}
          </span>
        </button>
        {allCategories.map((cat) => {
          const Icon = categoryIcons[cat];
          const count = categoryCounts[cat] || 0;
          if (count === 0) return null;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <Icon size={14} />
              {cat}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${selectedCategory === cat ? "bg-white/20 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-500"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Sort */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white pl-10 pr-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-400"
            placeholder="İlan ara..."
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="flex items-center gap-2 h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors whitespace-nowrap"
          >
            <ArrowUpDown size={16} />
            {sortOptions.find((s) => s.value === sortBy)?.label}
            <ChevronDown size={16} />
          </button>
          {showSortDropdown && (
            <div className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl py-1 z-50">
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setSortBy(opt.value); setShowSortDropdown(false); }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    sortBy === opt.value ? "text-primary font-semibold bg-primary/5" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        <span className="font-semibold text-gray-900 dark:text-white">{filtered.length}</span> ilan bulundu
      </p>

      {/* Cards Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {filtered.map((listing) => (
            <Link
              key={listing.id}
              href={`/ilan/${listing.id}`}
              className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-32 sm:h-44 w-full overflow-hidden">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={listing.image} alt={listing.title} />
                {listing.offers >= 8 && (
                  <div className="absolute top-3 left-3">
                    <span className="bg-orange-500/15 text-orange-500 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 backdrop-blur-md border border-orange-500/20">
                      <Flame size={14} className="fill-current" /> Popüler
                    </span>
                  </div>
                )}
                <div className="absolute bottom-3 right-3 bg-white/85 dark:bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-gray-200/50 dark:border-white/10">
                  <span className="text-primary font-bold text-xs">{listing.category}</span>
                </div>
              </div>
              <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                <div>
                  <h3 className="text-gray-900 dark:text-white text-sm font-bold leading-tight line-clamp-1 group-hover:text-primary transition-colors">{listing.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">{listing.description}</p>
                </div>
                <div className="flex items-center justify-between py-2.5 border-y border-gray-100 dark:border-gray-800">
                  <div className="flex flex-col">
                    <span className="text-gray-400 dark:text-gray-500 text-[10px] uppercase font-semibold tracking-wider">Bütçe</span>
                    <span className="text-gray-900 dark:text-white font-bold text-xs mt-0.5">{listing.budget}</span>
                  </div>
                  <div className="text-right flex flex-col">
                    <span className="text-gray-400 dark:text-gray-500 text-[10px] uppercase font-semibold tracking-wider">Teklifler</span>
                    <span className={`text-xs font-semibold mt-0.5 ${listing.offers > 0 ? "text-green-600 dark:text-green-400" : "text-gray-400"}`}>
                      {listing.offers > 0 ? `${listing.offers} teklif` : "Henüz yok"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><Eye size={12} /> {listing.views}</span>
                    <span className="flex items-center gap-1"><MessageCircle size={12} /> {listing.offers}</span>
                  </div>
                  <span className="flex items-center gap-1"><Clock size={12} /> {listing.timeLeft}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="size-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 mb-4">
            <Search size={28} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">İlan bulunamadı</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">Bu kategoride henüz ilan yok veya arama kriterlerinize uygun sonuç bulunamadı.</p>
        </div>
      )}
    </div>
  );
}

export default function Kategoriler() {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full bg-background-light dark:bg-background-dark">
        <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-12 text-center text-gray-500">Yükleniyor...</div>}>
          <KategorilerContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
