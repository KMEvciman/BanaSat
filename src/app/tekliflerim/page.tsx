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
  Eye,
  ChevronDown,
  X,
  Truck,
  ShieldCheck,
  Wallet,
  MessageCircle,
  HandCoins,
} from "lucide-react";

type TeklifStatus = "beklemede" | "kabul" | "red" | "geri_cekildi";

interface Teklif {
  id: number;
  talepTitle: string;
  talepDescription: string;
  talepImage: string;
  category: string;
  talepBudget: string;
  teklifFiyat: string;
  teklifNot: string;
  teslimatSuresi: string;
  garanti: string;
  kargoUcreti: string;
  status: TeklifStatus;
  talepSahibi: string;
  teklifTarihi: string;
  talepViews: number;
  talepOffers: number;
  timeLeft: string;
}

const teklifler: Teklif[] = [
  {
    id: 1,
    talepTitle: "iPhone 15 Pro Max 256GB",
    talepDescription: "Sıfır veya temiz ikinci el iPhone 15 Pro Max arıyorum. Garanti tercihimdir.",
    talepImage: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Elektronik",
    talepBudget: "55.000 - 65.000 TL",
    teklifFiyat: "58.500 TL",
    teklifNot: "Elimde sıfır kutusunda, Türkiye garantili iPhone 15 Pro Max 256GB Natural Titanium renk mevcuttur. Apple Türkiye faturası ile birlikte gönderim yapılacaktır.",
    teslimatSuresi: "1 İş Günü",
    garanti: "2 Yıl Apple TR Garantisi",
    kargoUcreti: "Ücretsiz",
    status: "beklemede",
    talepSahibi: "Ahmet Y.",
    teklifTarihi: "27 Nisan 2026",
    talepViews: 189,
    talepOffers: 8,
    timeLeft: "5 gün kaldı",
  },
  {
    id: 2,
    talepTitle: "Kurumsal Web Sitesi Tasarımı",
    talepDescription: "Şirketimiz için modern, responsive ve SEO uyumlu kurumsal web sitesi yaptırmak istiyoruz.",
    talepImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Yazılım & IT",
    talepBudget: "15.000 - 25.000 TL",
    teklifFiyat: "18.000 TL",
    teklifNot: "5 sayfalık responsive kurumsal web sitesi, SEO altyapısı, admin paneli ve 1 yıl ücretsiz hosting dahildir. Tasarım sürecinde 3 revizyon hakkınız bulunmaktadır.",
    teslimatSuresi: "10 İş Günü",
    garanti: "1 Yıl Teknik Destek",
    kargoUcreti: "-",
    status: "kabul",
    talepSahibi: "Zeynep D.",
    teklifTarihi: "24 Nisan 2026",
    talepViews: 412,
    talepOffers: 21,
    timeLeft: "3 gün kaldı",
  },
  {
    id: 3,
    talepTitle: "Projeksiyon Cihazı Kurulumu",
    talepDescription: "Ofisimiz için profesyonel projeksiyon ve ses sistemi kurulumu yaptırmak istiyoruz.",
    talepImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAAilImTYeLMEVFPBZKBdj46Qd3ugDjFNfLmtcRlH-rxbYTub_TjOyui563WCG6Hhg8d9OfOKXADEn5cZuFeUMZTnSICh_pUWRnkuPclSQIS1bmTgHqPXpv0wqJoLt00ymJrS3QMd3gNgbOIoOrRVOl8RbwGzqKTrqGh_RBnnnmzq_QP-7GPw5UNUIFKrCuyqsZ0TPP76gSqEa87yygxegdLVe6hv_5NPRdLSPRJTCxnGOn1j9mg8-ZTFx-AWGTbbmlrbQGXfJZez4s",
    category: "Hizmet",
    talepBudget: "5.000 - 10.000 TL",
    teklifFiyat: "7.200 TL",
    teklifNot: "Epson marka projeksiyon cihazı + 120 inç motorlu perde + ses sistemi kurulumu dahildir. Kablolama ve montaj işçiliği fiyata dahildir.",
    teslimatSuresi: "3 İş Günü",
    garanti: "2 Yıl Garanti",
    kargoUcreti: "Ücretsiz",
    status: "beklemede",
    talepSahibi: "Mehmet K.",
    teklifTarihi: "26 Nisan 2026",
    talepViews: 245,
    talepOffers: 12,
    timeLeft: "2 gün kaldı",
  },
  {
    id: 4,
    talepTitle: "İstanbul - Ankara Ev Taşıma",
    talepDescription: "3+1 dairemizin eşyalarını İstanbul'dan Ankara'ya profesyonel nakliye ile taşıtmak istiyoruz.",
    talepImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Nakliye & Taşımacılık",
    talepBudget: "12.000 - 18.000 TL",
    teklifFiyat: "14.500 TL",
    teklifNot: "Sigortalı taşımacılık, ambalajlama, söküm-montaj hizmeti dahildir. 2 adet kapalı kasa kamyon ile taşıma yapılacaktır.",
    teslimatSuresi: "2 İş Günü",
    garanti: "Sigortalı Taşıma",
    kargoUcreti: "-",
    status: "red",
    talepSahibi: "Ali R.",
    teklifTarihi: "20 Nisan 2026",
    talepViews: 98,
    talepOffers: 6,
    timeLeft: "Süresi doldu",
  },
  {
    id: 5,
    talepTitle: "Lise Matematik Özel Ders",
    talepDescription: "11. sınıf öğrencisi için haftada 3 gün matematik özel ders verecek deneyimli öğretmen arıyorum.",
    talepImage: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Eğitim & Özel Ders",
    talepBudget: "800 - 1.200 TL/Saat",
    teklifFiyat: "950 TL/Saat",
    teklifNot: "10 yıllık deneyimli matematik öğretmeniyim. YKS ve TYT konularında uzmanım. İlk ders ücretsiz deneme dersi olarak yapılacaktır.",
    teslimatSuresi: "Hemen Başlayabilirim",
    garanti: "-",
    kargoUcreti: "-",
    status: "kabul",
    talepSahibi: "Fatma S.",
    teklifTarihi: "18 Nisan 2026",
    talepViews: 67,
    talepOffers: 4,
    timeLeft: "4 gün kaldı",
  },
  {
    id: 6,
    talepTitle: "Bahçe Peyzaj Düzenlemesi",
    talepDescription: "Villa bahçemiz için komple peyzaj tasarımı ve uygulama hizmeti arıyoruz.",
    talepImage: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Bahçe & Peyzaj",
    talepBudget: "20.000 - 35.000 TL",
    teklifFiyat: "28.000 TL",
    teklifNot: "Komple peyzaj projesi, çim serimi, otomatik sulama sistemi, aydınlatma ve bitkilendirme dahildir. Proje çizimi ücretsiz sunulacaktır.",
    teslimatSuresi: "15 İş Günü",
    garanti: "1 Yıl Bitki Garantisi",
    kargoUcreti: "-",
    status: "geri_cekildi",
    talepSahibi: "Emre T.",
    teklifTarihi: "12 Nisan 2026",
    talepViews: 54,
    talepOffers: 3,
    timeLeft: "Süresi doldu",
  },
  {
    id: 7,
    talepTitle: "İngilizce Çeviri (50 Sayfa)",
    talepDescription: "Akademik makale çevirisi için profesyonel ve alanında uzman çevirmen arıyorum.",
    talepImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Çeviri & Redaksiyon",
    talepBudget: "3.000 - 5.000 TL",
    teklifFiyat: "3.750 TL",
    teklifNot: "Akademik çeviri konusunda 8 yıllık deneyimim var. Tıp, mühendislik ve sosyal bilimler alanlarında uzmanım. Redaksiyon dahildir.",
    teslimatSuresi: "7 İş Günü",
    garanti: "Sınırsız Revizyon",
    kargoUcreti: "-",
    status: "beklemede",
    talepSahibi: "Selin A.",
    teklifTarihi: "28 Nisan 2026",
    talepViews: 156,
    talepOffers: 9,
    timeLeft: "2 gün kaldı",
  },
];

const statusConfig: Record<TeklifStatus, { label: string; color: string; bg: string }> = {
  beklemede: { label: "Beklemede", color: "text-amber-700 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800" },
  kabul: { label: "Kabul Edildi", color: "text-green-700 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" },
  red: { label: "Reddedildi", color: "text-red-700 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800" },
  geri_cekildi: { label: "Geri Çekildi", color: "text-gray-600 dark:text-gray-400", bg: "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700" },
};

const statusFilters = [
  { value: "tumu", label: "Tümü" },
  { value: "beklemede", label: "Beklemede" },
  { value: "kabul", label: "Kabul Edildi" },
  { value: "red", label: "Reddedildi" },
  { value: "geri_cekildi", label: "Geri Çekildi" },
];

const categoryFilters = [
  "Tüm Kategoriler",
  "Elektronik",
  "Yazılım & IT",
  "Hizmet",
  "Nakliye & Taşımacılık",
  "Eğitim & Özel Ders",
  "Bahçe & Peyzaj",
  "Çeviri & Redaksiyon",
];

const sortOptions = [
  { value: "newest", label: "En Yeni" },
  { value: "oldest", label: "En Eski" },
  { value: "price-high", label: "Fiyat: Yüksekten Düşüğe" },
  { value: "price-low", label: "Fiyat: Düşükten Yükseğe" },
  { value: "most-offers", label: "En Çok Teklif Alan" },
];

function TeklifModal({ teklif, onClose }: { teklif: Teklif; onClose: () => void }) {
  const sc = statusConfig[teklif.status];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 sm:px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Teklif Detayı</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{teklif.teklifTarihi}</p>
          </div>
          <button
            onClick={onClose}
            className="size-9 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-5">
          {/* Talep Info */}
          <div className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
            <img
              src={teklif.talepImage}
              alt={teklif.talepTitle}
              className="size-16 rounded-lg object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Talep</p>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{teklif.talepTitle}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Talep Sahibi: <span className="font-medium text-gray-700 dark:text-gray-300">{teklif.talepSahibi}</span></p>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Teklif Durumu</span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${sc.bg} ${sc.color}`}>
              {sc.label}
            </span>
          </div>

          {/* Price */}
          <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Verdiğiniz Teklif</p>
            <p className="text-3xl font-black text-primary tracking-tight">{teklif.teklifFiyat}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Talep Bütçesi: {teklif.talepBudget}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
              <Truck size={18} className="text-gray-400 dark:text-gray-500" />
              <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-semibold tracking-wider">Teslimat</span>
              <span className="text-xs font-bold text-gray-900 dark:text-white text-center">{teklif.teslimatSuresi}</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
              <ShieldCheck size={18} className="text-gray-400 dark:text-gray-500" />
              <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-semibold tracking-wider">Garanti</span>
              <span className="text-xs font-bold text-gray-900 dark:text-white text-center">{teklif.garanti || "-"}</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
              <Wallet size={18} className="text-gray-400 dark:text-gray-500" />
              <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-semibold tracking-wider">Kargo</span>
              <span className="text-xs font-bold text-gray-900 dark:text-white text-center">{teklif.kargoUcreti}</span>
            </div>
          </div>

          {/* Note */}
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Teklif Notunuz</p>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{teklif.teklifNot}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-4 sm:px-6 py-4 flex gap-3 rounded-b-2xl">
          <Link
            href="/talep-detay"
            className="flex-1 flex items-center justify-center gap-2 h-11 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-sm font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Talebi Görüntüle
          </Link>
          <Link
            href="/mesajlar"
            className="flex-1 flex items-center justify-center gap-2 h-11 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/85 transition-colors shadow-sm shadow-primary/20"
          >
            <MessageCircle size={16} />
            Mesaj Gönder
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Tekliflerim() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("tumu");
  const [categoryFilter, setCategoryFilter] = useState("Tüm Kategoriler");
  const [sortBy, setSortBy] = useState("newest");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedTeklif, setSelectedTeklif] = useState<Teklif | null>(null);

  const filtered = useMemo(() => {
    let result = [...teklifler];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.talepTitle.toLowerCase().includes(q) ||
          t.talepDescription.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "tumu") {
      result = result.filter((t) => t.status === statusFilter);
    }

    if (categoryFilter !== "Tüm Kategoriler") {
      result = result.filter((t) => t.category === categoryFilter);
    }

    switch (sortBy) {
      case "oldest":
        result.reverse();
        break;
      case "price-high":
        result.sort((a, b) => {
          const pa = parseFloat(a.teklifFiyat.replace(/[^0-9]/g, ""));
          const pb = parseFloat(b.teklifFiyat.replace(/[^0-9]/g, ""));
          return pb - pa;
        });
        break;
      case "price-low":
        result.sort((a, b) => {
          const pa = parseFloat(a.teklifFiyat.replace(/[^0-9]/g, ""));
          const pb = parseFloat(b.teklifFiyat.replace(/[^0-9]/g, ""));
          return pa - pb;
        });
        break;
      case "most-offers":
        result.sort((a, b) => b.talepOffers - a.talepOffers);
        break;
      default:
        break;
    }

    return result;
  }, [searchQuery, statusFilter, categoryFilter, sortBy]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { tumu: teklifler.length };
    for (const t of teklifler) {
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
                Tekliflerim
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Verdiğiniz tüm teklifleri buradan takip edin.
              </p>
            </div>
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
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Search size={18} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white pl-10 pr-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-400"
                placeholder="Teklif ara..."
              />
            </div>

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
                <div className="absolute right-0 top-12 w-52 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl py-1 z-50">
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
              <span className="font-semibold text-gray-900 dark:text-white">{filtered.length}</span> teklif bulundu
            </p>
          </div>

          {/* Cards Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              {filtered.map((teklif) => {
                const sc = statusConfig[teklif.status];
                return (
                  <div
                    key={teklif.id}
                    className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="relative h-32 sm:h-44 w-full overflow-hidden">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src={teklif.talepImage}
                        alt={teklif.talepTitle}
                      />
                      <div className="absolute top-3 left-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-md ${sc.bg} ${sc.color}`}>
                          {sc.label}
                        </span>
                      </div>
                      <div className="absolute bottom-3 right-3 bg-white/85 dark:bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-gray-200/50 dark:border-white/10">
                        <span className="text-primary font-bold text-xs">{teklif.category}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                      <div>
                        <h3 className="text-gray-900 dark:text-white text-sm font-bold leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                          {teklif.talepTitle}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                          {teklif.talepDescription}
                        </p>
                      </div>

                      {/* Price Comparison */}
                      <div className="flex items-center justify-between py-2.5 border-y border-gray-100 dark:border-gray-800">
                        <div className="flex flex-col">
                          <span className="text-gray-400 dark:text-gray-500 text-[10px] uppercase font-semibold tracking-wider">Teklifiniz</span>
                          <span className="text-primary font-bold text-sm mt-0.5">{teklif.teklifFiyat}</span>
                        </div>
                        <div className="text-right flex flex-col">
                          <span className="text-gray-400 dark:text-gray-500 text-[10px] uppercase font-semibold tracking-wider">Bütçe</span>
                          <span className="text-gray-900 dark:text-white font-bold text-xs mt-0.5">{teklif.talepBudget}</span>
                        </div>
                      </div>

                      {/* Meta */}
                      <div className="flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-500">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Eye size={12} />
                            {teklif.talepViews}
                          </span>
                          <span className="flex items-center gap-1">
                            <HandCoins size={12} />
                            {teklif.talepOffers}
                          </span>
                        </div>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {teklif.timeLeft}
                        </span>
                      </div>

                      {/* CTA */}
                      <button
                        onClick={() => setSelectedTeklif(teklif)}
                        className="w-full bg-primary/10 dark:bg-primary/15 text-primary py-2 rounded-lg text-xs font-semibold hover:bg-primary hover:text-white transition-colors text-center"
                      >
                        Verilen Teklifi Gör
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="size-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500 mb-4">
                <Search size={28} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Teklif bulunamadı</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                Arama kriterlerinize uygun teklif bulunamadı. Filtreleri değiştirmeyi deneyin.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Teklif Detail Modal */}
      {selectedTeklif && (
        <TeklifModal teklif={selectedTeklif} onClose={() => setSelectedTeklif(null)} />
      )}
    </>
  );
}
