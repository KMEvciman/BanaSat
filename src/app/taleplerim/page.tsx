"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { useState, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Clock,
  Flame,
  Eye,
  MessageCircle,
  ChevronDown,
  Plus,
  LayoutGrid,
  List,
} from "lucide-react";

type TalepStatus = "aktif" | "beklemede" | "tamamlandi" | "iptal";

interface Talep {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  budget: string;
  offers: number;
  views: number;
  status: TalepStatus;
  timeLeft: string;
  createdAt: string;
  location: string;
}

const talepler: Talep[] = [
  {
    id: 1,
    title: "Projeksiyon Cihazı Kurulumu",
    description: "Ofisimiz için profesyonel projeksiyon ve ses sistemi kurulumu yaptırmak istiyoruz.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAAilImTYeLMEVFPBZKBdj46Qd3ugDjFNfLmtcRlH-rxbYTub_TjOyui563WCG6Hhg8d9OfOKXADEn5cZuFeUMZTnSICh_pUWRnkuPclSQIS1bmTgHqPXpv0wqJoLt00ymJrS3QMd3gNgbOIoOrRVOl8RbwGzqKTrqGh_RBnnnmzq_QP-7GPw5UNUIFKrCuyqsZ0TPP76gSqEa87yygxegdLVe6hv_5NPRdLSPRJTCxnGOn1j9mg8-ZTFx-AWGTbbmlrbQGXfJZez4s",
    category: "Hizmet",
    budget: "5.000 - 10.000 TL",
    offers: 12,
    views: 245,
    status: "aktif",
    timeLeft: "2 gün kaldı",
    createdAt: "25 Nisan 2026",
    location: "İstanbul, Kadıköy",
  },
  {
    id: 2,
    title: "iPhone 15 Pro Max 256GB",
    description: "Sıfır veya temiz ikinci el iPhone 15 Pro Max arıyorum. Garanti tercihimdir.",
    image: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Elektronik",
    budget: "55.000 - 65.000 TL",
    offers: 8,
    views: 189,
    status: "aktif",
    timeLeft: "5 gün kaldı",
    createdAt: "22 Nisan 2026",
    location: "İstanbul, Beşiktaş",
  },
  {
    id: 3,
    title: "Kurumsal Web Sitesi Tasarımı",
    description: "Şirketimiz için modern, responsive ve SEO uyumlu kurumsal web sitesi yaptırmak istiyoruz.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Yazılım & IT",
    budget: "15.000 - 25.000 TL",
    offers: 21,
    views: 412,
    status: "aktif",
    timeLeft: "3 gün kaldı",
    createdAt: "20 Nisan 2026",
    location: "Uzaktan",
  },
  {
    id: 4,
    title: "İstanbul - Ankara Ev Taşıma",
    description: "3+1 dairemizin eşyalarını İstanbul'dan Ankara'ya profesyonel nakliye ile taşıtmak istiyoruz.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Nakliye & Taşımacılık",
    budget: "12.000 - 18.000 TL",
    offers: 6,
    views: 98,
    status: "beklemede",
    timeLeft: "1 gün kaldı",
    createdAt: "18 Nisan 2026",
    location: "İstanbul → Ankara",
  },
  {
    id: 5,
    title: "Lise Matematik Özel Ders",
    description: "11. sınıf öğrencisi için haftada 3 gün matematik özel ders verecek deneyimli öğretmen arıyorum.",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Eğitim & Özel Ders",
    budget: "800 - 1.200 TL/Saat",
    offers: 4,
    views: 67,
    status: "aktif",
    timeLeft: "4 gün kaldı",
    createdAt: "15 Nisan 2026",
    location: "İstanbul, Beşiktaş",
  },
  {
    id: 6,
    title: "Bahçe Peyzaj Düzenlemesi",
    description: "Villa bahçemiz için komple peyzaj tasarımı ve uygulama hizmeti arıyoruz.",
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Bahçe & Peyzaj",
    budget: "20.000 - 35.000 TL",
    offers: 3,
    views: 54,
    status: "tamamlandi",
    timeLeft: "Süresi doldu",
    createdAt: "10 Nisan 2026",
    location: "İstanbul, Sarıyer",
  },
  {
    id: 7,
    title: "Düğün Fotoğrafçısı",
    description: "Ağustos ayında yapılacak düğünümüz için profesyonel fotoğraf ve drone çekimi.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Fotoğraf & Video",
    budget: "8.000 - 15.000 TL",
    offers: 0,
    views: 23,
    status: "aktif",
    timeLeft: "7 gün kaldı",
    createdAt: "28 Nisan 2026",
    location: "İstanbul",
  },
  {
    id: 8,
    title: "Klima Montajı (3 Adet)",
    description: "Evimize 3 adet inverter klima alımı ve montajı için uygun fiyat teklifi bekliyorum.",
    image: "https://images.unsplash.com/photo-1631545806609-35d4ae440431?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Tadilat & Dekorasyon",
    budget: "30.000 - 45.000 TL",
    offers: 5,
    views: 112,
    status: "iptal",
    timeLeft: "İptal edildi",
    createdAt: "5 Nisan 2026",
    location: "Ankara, Çankaya",
  },
  {
    id: 9,
    title: "İngilizce Çeviri (50 Sayfa)",
    description: "Akademik makale çevirisi için profesyonel ve alanında uzman çevirmen arıyorum.",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Çeviri & Redaksiyon",
    budget: "3.000 - 5.000 TL",
    offers: 9,
    views: 156,
    status: "tamamlandi",
    timeLeft: "Tamamlandı",
    createdAt: "1 Nisan 2026",
    location: "Uzaktan",
  },
];

const statusConfig: Record<TalepStatus, { label: string; color: string; bg: string }> = {
  aktif: { label: "Aktif", color: "text-green-700 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" },
  beklemede: { label: "Beklemede", color: "text-amber-700 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800" },
  tamamlandi: { label: "Tamamlandı", color: "text-blue-700 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800" },
  iptal: { label: "İptal Edildi", color: "text-red-700 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800" },
};

const statusFilters: { value: string; label: string }[] = [
  { value: "tumu", label: "Tümü" },
  { value: "aktif", label: "Aktif" },
  { value: "beklemede", label: "Beklemede" },
  { value: "tamamlandi", label: "Tamamlandı" },
  { value: "iptal", label: "İptal Edildi" },
];

const categoryFilters = [
  "Tüm Kategoriler",
  "Elektronik",
  "Yazılım & IT",
  "Hizmet",
  "Nakliye & Taşımacılık",
  "Eğitim & Özel Ders",
  "Tadilat & Dekorasyon",
  "Fotoğraf & Video",
  "Bahçe & Peyzaj",
  "Çeviri & Redaksiyon",
];

const sortOptions = [
  { value: "newest", label: "En Yeni" },
  { value: "oldest", label: "En Eski" },
  { value: "most-offers", label: "En Çok Teklif" },
  { value: "least-offers", label: "En Az Teklif" },
  { value: "most-views", label: "En Çok Görüntülenen" },
];

export default function Taleplerim() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("tumu");
  const [categoryFilter, setCategoryFilter] = useState("Tüm Kategoriler");
  const [sortBy, setSortBy] = useState("newest");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const filtered = useMemo(() => {
    let result = [...talepler];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter !== "tumu") {
      result = result.filter((t) => t.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== "Tüm Kategoriler") {
      result = result.filter((t) => t.category === categoryFilter);
    }

    // Sort
    switch (sortBy) {
      case "oldest":
        result.reverse();
        break;
      case "most-offers":
        result.sort((a, b) => b.offers - a.offers);
        break;
      case "least-offers":
        result.sort((a, b) => a.offers - b.offers);
        break;
      case "most-views":
        result.sort((a, b) => b.views - a.views);
        break;
      default:
        break;
    }

    return result;
  }, [searchQuery, statusFilter, categoryFilter, sortBy]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { tumu: talepler.length };
    for (const t of talepler) {
      c[t.status] = (c[t.status] || 0) + 1;
    }
    return c;
  }, []);

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-40 py-8 md:py-12">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                Taleplerim
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Oluşturduğunuz tüm talepleri buradan yönetin ve takip edin.
              </p>
            </div>
            <Link
              href="/talep-olustur"
              className="flex items-center justify-center gap-2 rounded-xl h-11 px-6 bg-primary hover:bg-primary/85 transition-colors text-white text-sm font-bold shadow-md hover:shadow-lg shadow-primary/20 shrink-0"
            >
              <Plus size={18} />
              Yeni Talep Oluştur
            </Link>
          </div>

          {/* Status Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 mb-6 no-scrollbar scrollbar-hide">
            {statusFilters.map((sf) => (
              <button
                key={sf.value}
                onClick={() => setStatusFilter(sf.value)}
                className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  statusFilter === sf.value
                    ? "bg-primary text-white shadow-sm"
                    : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                {sf.label}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    statusFilter === sf.value
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {counts[sf.value] || 0}
                </span>
              </button>
            ))}
          </div>

          {/* Search & Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Search size={18} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white pl-10 pr-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-400"
                placeholder="Talep ara..."
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowCategoryDropdown(!showCategoryDropdown);
                  setShowSortDropdown(false);
                }}
                className="flex items-center gap-2 h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors whitespace-nowrap"
              >
                <SlidersHorizontal size={16} />
                {categoryFilter}
                <ChevronDown size={16} />
              </button>
              {showCategoryDropdown && (
                <div className="absolute right-0 top-12 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl py-1 z-50">
                  {categoryFilters.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setCategoryFilter(cat);
                        setShowCategoryDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        categoryFilter === cat
                          ? "text-primary font-semibold bg-primary/5"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowSortDropdown(!showSortDropdown);
                  setShowCategoryDropdown(false);
                }}
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
                      onClick={() => {
                        setSortBy(opt.value);
                        setShowSortDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        sortBy === opt.value
                          ? "text-primary font-semibold bg-primary/5"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
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
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold text-gray-900 dark:text-white">{filtered.length}</span> talep bulundu
            </p>
          </div>

          {/* Cards Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              {filtered.map((talep) => {
                const sc = statusConfig[talep.status];
                return (
                  <Link
                    key={talep.id}
                    href={`/ilan/${talep.id}`}
                    className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="relative h-32 sm:h-44 w-full overflow-hidden">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src={talep.image}
                        alt={talep.title}
                      />
                      {/* Status Badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-md ${sc.bg} ${sc.color}`}>
                          {sc.label}
                        </span>
                      </div>
                      {/* Category */}
                      <div className="absolute bottom-3 right-3 bg-white/85 dark:bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-gray-200/50 dark:border-white/10">
                        <span className="text-primary font-bold text-xs">{talep.category}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                      <div>
                        <h3 className="text-gray-900 dark:text-white text-sm font-bold leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                          {talep.title}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                          {talep.description}
                        </p>
                      </div>

                      {/* Budget & Offers */}
                      <div className="flex items-center justify-between py-2.5 border-y border-gray-100 dark:border-gray-800">
                        <div className="flex flex-col">
                          <span className="text-gray-400 dark:text-gray-500 text-[10px] uppercase font-semibold tracking-wider">Bütçe</span>
                          <span className="text-gray-900 dark:text-white font-bold text-xs mt-0.5">{talep.budget}</span>
                        </div>
                        <div className="text-right flex flex-col">
                          <span className="text-gray-400 dark:text-gray-500 text-[10px] uppercase font-semibold tracking-wider">Teklifler</span>
                          <span className={`text-xs font-semibold mt-0.5 ${talep.offers > 0 ? "text-green-600 dark:text-green-400" : "text-gray-400 dark:text-gray-500"}`}>
                            {talep.offers > 0 ? `${talep.offers} teklif` : "Henüz yok"}
                          </span>
                        </div>
                      </div>

                      {/* Meta */}
                      <div className="flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-500">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Eye size={12} />
                            {talep.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle size={12} />
                            {talep.offers}
                          </span>
                        </div>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {talep.timeLeft}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="size-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500 mb-4">
                <Search size={28} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Talep bulunamadı</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                Arama kriterlerinize uygun talep bulunamadı. Filtreleri değiştirmeyi veya yeni bir talep oluşturmayı deneyin.
              </p>
              <Link
                href="/talep-olustur"
                className="mt-6 flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/85 text-white text-sm font-bold rounded-xl transition-colors shadow-md"
              >
                <Plus size={18} />
                Yeni Talep Oluştur
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
