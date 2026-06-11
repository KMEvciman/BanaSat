"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { listingsApi } from "@/lib/api/services";
import type { Listing, ListingStatus } from "@/lib/api/types";
import { formatTimeLeft } from "@/lib/api/adapters";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Clock,
  Eye,
  MessageCircle,
  ChevronDown,
  Plus,
} from "lucide-react";

const statusConfig: Record<ListingStatus, { label: string; color: string; bg: string }> = {
  AKTIF: { label: "Aktif", color: "text-green-700 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" },
  BEKLEMEDE: { label: "Beklemede", color: "text-amber-700 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800" },
  TAMAMLANDI: { label: "Tamamlandı", color: "text-blue-700 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800" },
  IPTAL: { label: "İptal Edildi", color: "text-red-700 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800" },
};

const statusFilters: { value: string; label: string }[] = [
  { value: "tumu", label: "Tümü" },
  { value: "AKTIF", label: "Aktif" },
  { value: "BEKLEMEDE", label: "Beklemede" },
  { value: "TAMAMLANDI", label: "Tamamlandı" },
  { value: "IPTAL", label: "İptal Edildi" },
];

const sortOptions = [
  { value: "newest", label: "En Yeni" },
  { value: "oldest", label: "En Eski" },
  { value: "most-offers", label: "En Çok Teklif" },
  { value: "least-offers", label: "En Az Teklif" },
  { value: "most-views", label: "En Çok Görüntülenen" },
];

const PLACEHOLDER = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80";

export default function Taleplerim() {
  const router = useRouter();
  const { user, isLoggedIn, loading: authLoading } = useAuth();

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("tumu");
  const [categoryFilter, setCategoryFilter] = useState("Tüm Kategoriler");
  const [sortBy, setSortBy] = useState("newest");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.replace("/giris");
    }
  }, [authLoading, isLoggedIn, router]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    listingsApi
      .list({ ownerId: user.id, limit: 100 })
      .then((res) => setListings(res.items))
      .catch((err) => setError(err?.message ?? "Talepler yüklenemedi."))
      .finally(() => setLoading(false));
  }, [user]);

  // Kullanıcının ilanlarındaki benzersiz kategoriler (dinamik filtre listesi).
  const categoryFilters = useMemo(() => {
    const names = Array.from(new Set(listings.map((l) => l.category.name)));
    return ["Tüm Kategoriler", ...names];
  }, [listings]);

  const filtered = useMemo(() => {
    let result = [...listings];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.name.toLowerCase().includes(q),
      );
    }
    if (statusFilter !== "tumu") {
      result = result.filter((t) => t.status === statusFilter);
    }
    if (categoryFilter !== "Tüm Kategoriler") {
      result = result.filter((t) => t.category.name === categoryFilter);
    }

    switch (sortBy) {
      case "oldest":
        result.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
        break;
      case "most-offers":
        result.sort((a, b) => b.offerCount - a.offerCount);
        break;
      case "least-offers":
        result.sort((a, b) => a.offerCount - b.offerCount);
        break;
      case "most-views":
        result.sort((a, b) => b.views - a.views);
        break;
      default:
        result.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
        break;
    }
    return result;
  }, [listings, searchQuery, statusFilter, categoryFilter, sortBy]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { tumu: listings.length };
    for (const t of listings) c[t.status] = (c[t.status] || 0) + 1;
    return c;
  }, [listings]);

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-40 py-8 md:py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Taleplerim</h1>
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
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${statusFilter === sf.value ? "bg-white/20 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"}`}>
                  {counts[sf.value] || 0}
                </span>
              </button>
            ))}
          </div>

          {/* Search & Filters */}
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
                placeholder="Talep ara..."
              />
            </div>

            <div className="relative">
              <button
                onClick={() => { setShowCategoryDropdown(!showCategoryDropdown); setShowSortDropdown(false); }}
                className="flex items-center gap-2 h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors whitespace-nowrap"
              >
                <SlidersHorizontal size={16} />
                {categoryFilter}
                <ChevronDown size={16} />
              </button>
              {showCategoryDropdown && (
                <div className="absolute right-0 top-12 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl py-1 z-50 max-h-64 overflow-y-auto">
                  {categoryFilters.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setCategoryFilter(cat); setShowCategoryDropdown(false); }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${categoryFilter === cat ? "text-primary font-semibold bg-primary/5" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => { setShowSortDropdown(!showSortDropdown); setShowCategoryDropdown(false); }}
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

          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold text-gray-900 dark:text-white">{filtered.length}</span> talep bulundu
            </p>
          </div>

          {/* İçerik */}
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-72 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <p className="text-sm text-red-500">{error}</p>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              {filtered.map((talep) => {
                const sc = statusConfig[talep.status];
                return (
                  <Link
                    key={talep.id}
                    href={`/ilan/${talep.id}`}
                    className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="relative h-32 sm:h-44 w-full overflow-hidden">
                      <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={talep.coverImageUrl || PLACEHOLDER} alt={talep.title} />
                      <div className="absolute top-3 left-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-md ${sc.bg} ${sc.color}`}>{sc.label}</span>
                      </div>
                      <div className="absolute bottom-3 right-3 bg-white/85 dark:bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-gray-200/50 dark:border-white/10">
                        <span className="text-primary font-bold text-xs">{talep.category.name}</span>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                      <div>
                        <h3 className="text-gray-900 dark:text-white text-sm font-bold leading-tight line-clamp-1 group-hover:text-primary transition-colors">{talep.title}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">{talep.description}</p>
                      </div>
                      <div className="flex items-center justify-between py-2.5 border-y border-gray-100 dark:border-gray-800">
                        <div className="flex flex-col">
                          <span className="text-gray-400 dark:text-gray-500 text-[10px] uppercase font-semibold tracking-wider">Bütçe</span>
                          <span className="text-gray-900 dark:text-white font-bold text-xs mt-0.5">{talep.budgetLabel}</span>
                        </div>
                        <div className="text-right flex flex-col">
                          <span className="text-gray-400 dark:text-gray-500 text-[10px] uppercase font-semibold tracking-wider">Teklifler</span>
                          <span className={`text-xs font-semibold mt-0.5 ${talep.offerCount > 0 ? "text-green-600 dark:text-green-400" : "text-gray-400 dark:text-gray-500"}`}>
                            {talep.offerCount > 0 ? `${talep.offerCount} teklif` : "Henüz yok"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-500">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1"><Eye size={12} />{talep.views}</span>
                          <span className="flex items-center gap-1"><MessageCircle size={12} />{talep.offerCount}</span>
                        </div>
                        <span className="flex items-center gap-1"><Clock size={12} />{formatTimeLeft(talep.deadline)}</span>
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
                Henüz bir talep oluşturmadınız veya filtrelere uygun talep yok.
              </p>
              <Link href="/talep-olustur" className="mt-6 flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/85 text-white text-sm font-bold rounded-xl transition-colors shadow-md">
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
