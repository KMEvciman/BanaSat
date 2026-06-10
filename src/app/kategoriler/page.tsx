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
  Smartphone,
  Laptop,
  Tv,
  WashingMachine,
  Microwave,
  Gamepad2,
  Sofa,
  Home,
  Shirt,
  Baby,
  Dumbbell,
  Puzzle,
  BookOpen,
  Car,
  Hammer,
  Sparkles,
  PawPrint,
  Truck,
  Wrench,
  GraduationCap,
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
  // Ürün (alım-satım) kategorileri
  "Telefon & Aksesuar": Smartphone,
  "Bilgisayar & Tablet": Laptop,
  "Elektronik": Tv,
  "Beyaz Eşya": WashingMachine,
  "Küçük Ev Aletleri": Microwave,
  "Oyun & Konsol": Gamepad2,
  "Mobilya": Sofa,
  "Ev & Yaşam": Home,
  "Giyim & Moda": Shirt,
  "Anne & Bebek": Baby,
  "Spor & Outdoor": Dumbbell,
  "Hobi & Oyuncak": Puzzle,
  "Kitap, Film & Müzik": BookOpen,
  "Otomotiv & Yedek Parça": Car,
  "Bahçe & Yapı Market": Hammer,
  "Kozmetik & Kişisel Bakım": Sparkles,
  "Evcil Hayvan Ürünleri": PawPrint,
  // Hizmet kategorileri (ikincil)
  "Nakliye & Taşımacılık": Truck,
  "Tadilat & Usta": Wrench,
  "Eğitim & Özel Ders": GraduationCap,
  "Diğer Hizmetler": Package,
};

const allCategories = Object.keys(categoryIcons);

const mockListings: CategoryListing[] = [
  { id: 1, title: "iPhone 15 Pro Max 256GB", description: "Sıfır veya temiz ikinci el iPhone 15 Pro Max arıyorum. Garanti tercihimdir.", image: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=800&q=80", category: "Telefon & Aksesuar", budget: "55.000 - 65.000 TL", offers: 8, views: 189, timeLeft: "5 gün kaldı", location: "İstanbul" },
  { id: 2, title: "Samsung Galaxy S24 Ultra", description: "Temiz, kutulu Galaxy S24 Ultra arıyorum. Faturalı olması önemli.", image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80", category: "Telefon & Aksesuar", budget: "45.000 - 55.000 TL", offers: 6, views: 142, timeLeft: "4 gün kaldı", location: "Ankara" },
  { id: 3, title: "MacBook Air M3 13''", description: "Eğitim için MacBook Air M3 arıyorum. 16GB RAM tercihim.", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80", category: "Bilgisayar & Tablet", budget: "40.000 - 50.000 TL", offers: 11, views: 256, timeLeft: "3 gün kaldı", location: "Uzaktan" },
  { id: 4, title: "Gaming PC (RTX 4070)", description: "Oyun ve render için hazır toplama gaming bilgisayar arıyorum.", image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80", category: "Bilgisayar & Tablet", budget: "50.000 - 70.000 TL", offers: 9, views: 312, timeLeft: "6 gün kaldı", location: "İstanbul" },
  { id: 5, title: "55'' 4K Smart TV", description: "Salon için 55 inç 4K Smart TV arıyorum. QLED tercih sebebi.", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80", category: "Elektronik", budget: "20.000 - 30.000 TL", offers: 7, views: 178, timeLeft: "5 gün kaldı", location: "İzmir" },
  { id: 6, title: "Çamaşır Makinesi (9 kg)", description: "A+++ enerji sınıfı, 9 kg çamaşır makinesi arıyorum.", image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80", category: "Beyaz Eşya", budget: "15.000 - 22.000 TL", offers: 5, views: 96, timeLeft: "4 gün kaldı", location: "Bursa" },
  { id: 7, title: "No-Frost Buzdolabı", description: "Geniş hacimli, no-frost buzdolabı arıyorum. İnox renk tercihim.", image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=800&q=80", category: "Beyaz Eşya", budget: "25.000 - 35.000 TL", offers: 4, views: 88, timeLeft: "3 gün kaldı", location: "İstanbul" },
  { id: 8, title: "Robot Süpürge", description: "Haritalama özellikli robot süpürge arıyorum. Akıllı uygulama desteği olmalı.", image: "https://images.unsplash.com/photo-1603618000123-f9a1e8a4b3c8?auto=format&fit=crop&w=800&q=80", category: "Küçük Ev Aletleri", budget: "8.000 - 15.000 TL", offers: 6, views: 124, timeLeft: "2 gün kaldı", location: "Ankara" },
  { id: 9, title: "PlayStation 5 Slim", description: "Sıfır veya az kullanılmış PS5 Slim arıyorum. Ek kol ile olursa tercihim.", image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80", category: "Oyun & Konsol", budget: "20.000 - 28.000 TL", offers: 13, views: 401, timeLeft: "5 gün kaldı", location: "İstanbul" },
  { id: 10, title: "Koltuk Takımı (3+3+1)", description: "Modern tasarım, gri tonlarında koltuk takımı arıyorum.", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80", category: "Mobilya", budget: "15.000 - 25.000 TL", offers: 3, views: 76, timeLeft: "6 gün kaldı", location: "Ankara" },
  { id: 11, title: "Yemek Masası Takımı", description: "6 kişilik ahşap yemek masası ve sandalye takımı arıyorum.", image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80", category: "Mobilya", budget: "10.000 - 18.000 TL", offers: 4, views: 92, timeLeft: "7 gün kaldı", location: "İzmir" },
  { id: 12, title: "Aydınlatma & Avize", description: "Salon için modern LED avize ve aydınlatma seti arıyorum.", image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80", category: "Ev & Yaşam", budget: "3.000 - 6.000 TL", offers: 5, views: 67, timeLeft: "4 gün kaldı", location: "İstanbul" },
  { id: 13, title: "Kışlık Mont (Erkek)", description: "Su geçirmez, kaliteli kışlık erkek mont arıyorum. L beden.", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80", category: "Giyim & Moda", budget: "2.000 - 5.000 TL", offers: 6, views: 134, timeLeft: "5 gün kaldı", location: "İstanbul" },
  { id: 14, title: "Bebek Arabası (Travel Sistem)", description: "Travel sistem bebek arabası arıyorum. Temiz ikinci el olabilir.", image: "https://images.unsplash.com/photo-1591147834150-2eec4c55a4f2?auto=format&fit=crop&w=800&q=80", category: "Anne & Bebek", budget: "5.000 - 10.000 TL", offers: 7, views: 156, timeLeft: "3 gün kaldı", location: "Ankara" },
  { id: 15, title: "Koşu Bandı", description: "Ev tipi katlanabilir koşu bandı arıyorum. Eğim ayarı olmalı.", image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80", category: "Spor & Outdoor", budget: "12.000 - 20.000 TL", offers: 4, views: 89, timeLeft: "6 gün kaldı", location: "İstanbul" },
  { id: 16, title: "Lego Technic Seti", description: "Koleksiyon için Lego Technic seti arıyorum. Kutusu tam olmalı.", image: "https://images.unsplash.com/photo-1606503153255-59d8b8b82176?auto=format&fit=crop&w=800&q=80", category: "Hobi & Oyuncak", budget: "3.000 - 8.000 TL", offers: 3, views: 54, timeLeft: "8 gün kaldı", location: "Uzaktan" },
  { id: 17, title: "İkinci El Kitap Seti", description: "Klasik roman seti arıyorum. Temiz ve eksiksiz olması önemli.", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80", category: "Kitap, Film & Müzik", budget: "500 - 1.500 TL", offers: 9, views: 167, timeLeft: "4 gün kaldı", location: "Uzaktan" },
  { id: 18, title: "Kış Lastiği (4 Adet)", description: "205/55 R16 kış lastiği arıyorum. DOT yeni olmalı.", image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80", category: "Otomotiv & Yedek Parça", budget: "8.000 - 14.000 TL", offers: 5, views: 198, timeLeft: "5 gün kaldı", location: "İstanbul" },
  { id: 19, title: "Akülü Matkap Seti", description: "Profesyonel akülü matkap ve uç seti arıyorum.", image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80", category: "Bahçe & Yapı Market", budget: "2.500 - 5.000 TL", offers: 6, views: 112, timeLeft: "3 gün kaldı", location: "Ankara" },
  { id: 20, title: "Cilt Bakım Seti", description: "Markalı cilt bakım seti arıyorum. SKT uzun olmalı.", image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80", category: "Kozmetik & Kişisel Bakım", budget: "1.500 - 4.000 TL", offers: 5, views: 142, timeLeft: "6 gün kaldı", location: "İstanbul" },
  { id: 21, title: "Kedi Maması (Toplu)", description: "Tahılsız yetişkin kedi maması arıyorum. Toplu alım yapacağım.", image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80", category: "Evcil Hayvan Ürünleri", budget: "2.000 - 4.000 TL", offers: 3, views: 41, timeLeft: "5 gün kaldı", location: "İstanbul" },
  { id: 22, title: "İstanbul - Ankara Ev Taşıma", description: "3+1 dairemizin eşyalarını profesyonel nakliye ile taşıtmak istiyoruz.", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80", category: "Nakliye & Taşımacılık", budget: "12.000 - 18.000 TL", offers: 6, views: 98, timeLeft: "1 gün kaldı", location: "İstanbul" },
  { id: 23, title: "Klima Montajı (3 Adet)", description: "3 adet inverter klima montajı için usta arıyorum.", image: "https://images.unsplash.com/photo-1631545806609-35d4ae440431?auto=format&fit=crop&w=800&q=80", category: "Tadilat & Usta", budget: "5.000 - 9.000 TL", offers: 5, views: 112, timeLeft: "3 gün kaldı", location: "Ankara" },
  { id: 24, title: "Lise Matematik Özel Ders", description: "11. sınıf öğrencisi için haftada 3 gün matematik özel ders.", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80", category: "Eğitim & Özel Ders", budget: "800 - 1.200 TL/Saat", offers: 4, views: 67, timeLeft: "4 gün kaldı", location: "İstanbul" },
  { id: 25, title: "Düğün Fotoğrafçısı", description: "Düğünümüz için profesyonel fotoğraf ve drone çekimi.", image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80", category: "Diğer Hizmetler", budget: "8.000 - 15.000 TL", offers: 0, views: 23, timeLeft: "7 gün kaldı", location: "İstanbul" },
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
