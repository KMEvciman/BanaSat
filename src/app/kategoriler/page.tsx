"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ListingCard from "@/components/ListingCard";
import { useSearchParams } from "next/navigation";
import { useState, useMemo, useEffect, Suspense } from "react";
import { categoriesApi, listingsApi } from "@/lib/api/services";
import type { Category, Listing } from "@/lib/api/types";
import { listingToCard } from "@/lib/api/adapters";
import {
  Search, ArrowUpDown, ChevronDown, LayoutGrid,
  Smartphone, Laptop, Cpu, Tv, WashingMachine, Microwave, Gamepad2, Sofa,
  Home, Shirt, Baby, Dumbbell, Puzzle, BookOpen, Car, Hammer, Sparkles,
  PawPrint, Truck, Wrench, GraduationCap, Package,
} from "lucide-react";

// API'den gelen ikon anahtarını lucide bileşenine eşler.
const iconMap: Record<string, React.ElementType> = {
  Smartphone, Laptop, Cpu, Tv, WashingMachine, Microwave, Gamepad2, Sofa,
  Home, Shirt, Baby, Dumbbell, Puzzle, BookOpen, Car, Hammer, Sparkles,
  PawPrint, Truck, Wrench, GraduationCap, Package,
};

const sortOptions = [
  { value: "newest", label: "En Yeni" },
  { value: "most-offers", label: "En Çok Teklif" },
  { value: "most-views", label: "En Çok Görüntülenen" },
];

function KategorilerContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>("tumu");
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Kategorileri yükle; URL'deki ?q (isim) ile eşleşen kategoriyi seç.
  useEffect(() => {
    categoriesApi.list().then((cats) => {
      setCategories(cats);
      if (initialQuery) {
        const match = cats.find((c) => c.name === initialQuery || c.slug === initialQuery);
        if (match) setSelectedSlug(match.slug);
      }
    }).catch(() => {});
  }, [initialQuery]);

  // Seçili kategoriye göre ilanları çek.
  useEffect(() => {
    setLoading(true);
    listingsApi
      .list({
        status: "AKTIF",
        limit: 100,
        sort: sortBy,
        categorySlug: selectedSlug === "tumu" ? undefined : selectedSlug,
      })
      .then((res) => setListings(res.items))
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, [selectedSlug, sortBy]);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return listings;
    const q = searchQuery.toLowerCase();
    return listings.filter(
      (l) => l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q),
    );
  }, [listings, searchQuery]);

  const selectedName =
    selectedSlug === "tumu"
      ? "Tüm Kategoriler"
      : categories.find((c) => c.slug === selectedSlug)?.name ?? "Kategori";

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-40 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Kategoriler</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {selectedSlug === "tumu" ? "Tüm kategorilerdeki ilanları keşfedin." : `${selectedName} kategorisindeki ilanlar`}
        </p>
      </div>

      {/* Kategori chip'leri */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-6 no-scrollbar scrollbar-hide">
        <button
          onClick={() => setSelectedSlug("tumu")}
          className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            selectedSlug === "tumu"
              ? "bg-primary text-white shadow-sm"
              : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
          }`}
        >
          <LayoutGrid size={14} />
          Tümü
        </button>
        {categories.map((cat) => {
          const Icon = cat.icon ? iconMap[cat.icon] ?? Package : Package;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedSlug(cat.slug)}
              className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedSlug === cat.slug
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <Icon size={14} />
              {cat.name}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${selectedSlug === cat.slug ? "bg-white/20 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-500"}`}>
                {cat.listingCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Arama + Sıralama */}
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
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${sortBy === opt.value ? "text-primary font-semibold bg-primary/5" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        <span className="font-semibold text-gray-900 dark:text-white">{filtered.length}</span> ilan bulundu
      </p>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-72 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {filtered.map((listing) => (
            <ListingCard key={listing.id} listing={listingToCard(listing)} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="size-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 mb-4">
            <Search size={28} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">İlan bulunamadı</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">Bu kategoride henüz aktif ilan yok.</p>
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
