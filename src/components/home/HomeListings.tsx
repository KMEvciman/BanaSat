"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import ListingCarousel from "@/components/ListingCarousel";
import ListingCard from "@/components/ListingCard";
import type { Listing as CardListing } from "@/components/ListingCarousel";
import type { Listing } from "@/lib/api/types";
import { listingsApi, offersApi } from "@/lib/api/services";
import { listingToCard } from "@/lib/api/adapters";
import { useAuth } from "@/context/AuthContext";

/** Ana sayfadaki "En Popüler" (carousel) ve "Son Eklenen" (grid) ilan bölümleri. */
export default function HomeListings() {
  const { user } = useAuth();
  const [popular, setPopular] = useState<CardListing[]>([]);
  const [recent, setRecent] = useState<CardListing[]>([]);
  const [regional, setRegional] = useState<CardListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([
      listingsApi.list({ sort: "most-offers", limit: 8, status: "AKTIF" }),
      listingsApi.list({ sort: "newest", limit: 8, status: "AKTIF" }),
    ])
      .then(([pop, rec]) => {
        if (!active) return;
        setPopular(pop.items.map(listingToCard));
        setRecent(rec.items.map(listingToCard));
      })
      .catch((err) => active && setError(err?.message ?? "İlanlar yüklenemedi."))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  // Kullanıcının iline + teklif verdiği kategorilere göre öneriler.
  useEffect(() => {
    if (!user?.province) { setRegional([]); return; }
    let active = true;
    const myProvince = user.province;
    (async () => {
      try {
        // Kullanıcının daha önce teklif verdiği kategoriler.
        const mine = await offersApi.mine({ limit: 100 }).catch(() => null);
        const slugs = mine
          ? Array.from(new Set(mine.items.map((o) => o.listing.category.slug)))
          : [];

        let items: Listing[] = [];
        if (slugs.length > 0) {
          // İlgili kategorilerde, kullanıcının ilindeki talepler.
          const results = await Promise.all(
            slugs.slice(0, 6).map((slug) =>
              listingsApi
                .list({ province: myProvince, categorySlug: slug, status: "AKTIF", limit: 8, sort: "newest" })
                .then((r) => r.items)
                .catch(() => [] as Listing[]),
            ),
          );
          items = results.flat();
        }
        // Kategori bazlı sonuç yoksa ile göre genel taleplere düş.
        if (items.length === 0) {
          const r = await listingsApi.list({ province: myProvince, status: "AKTIF", limit: 8, sort: "newest" });
          items = r.items;
        }

        // Kendi ilanlarını çıkar + benzersizleştir + en fazla 8.
        const seen = new Set<string>();
        const unique: Listing[] = [];
        for (const l of items) {
          if (l.owner.id === user.id || seen.has(l.id)) continue;
          seen.add(l.id);
          unique.push(l);
          if (unique.length >= 8) break;
        }
        if (active) setRegional(unique.map(listingToCard));
      } catch {
        // sessizce geç
      }
    })();
    return () => { active = false; };
  }, [user?.province, user?.id]);

  return (
    <>
      {/* Konumunda İlgini Çekebilecek İlanlar (il + teklif geçmişi kategorilerine göre) */}
      {user?.province && regional.length > 0 && (
        <div className="w-full bg-white dark:bg-background-dark pt-10 md:pt-14">
          <div className="px-4 md:px-10">
            <div className="max-w-7xl mx-auto mb-8">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="flex items-center gap-1 text-primary text-xs sm:text-sm font-semibold">
                    <MapPin size={15} /> {user.province}{user.district ? ` / ${user.district}` : ""}
                  </span>
                  <h2 className="text-gray-900 dark:text-white text-2xl md:text-3xl font-bold tracking-tight">
                    Konumunda İlgini Çekebilecek İlanlar
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    İlgilendiğin kategorilerde bölgendeki taleplere göz at
                  </p>
                </div>
                <Link href={`/kategoriler?il=${encodeURIComponent(user.province)}`} className="text-primary text-sm font-semibold hover:underline flex items-center gap-1 shrink-0">
                  Tümünü Gör <ArrowRight size={16} />
                </Link>
              </div>
            </div>
            <ListingCarousel listings={regional} />
          </div>
        </div>
      )}

      {/* En Popüler İlanlar */}
      <div className="w-full bg-background-light dark:bg-background-dark py-10 md:py-14">
        <div className="px-4 md:px-10">
          <div className="max-w-7xl mx-auto mb-8">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <h2 className="text-gray-900 dark:text-white text-2xl md:text-3xl font-bold tracking-tight">
                  En Popüler İlanlar
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Şu anda en çok teklif alan ilanlar
                </p>
              </div>
              <Link href="/kategoriler" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
                Tümünü Gör <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {loading ? (
            <SkeletonRow />
          ) : error ? (
            <p className="max-w-7xl mx-auto text-sm text-red-500">{error}</p>
          ) : popular.length === 0 ? (
            <p className="max-w-7xl mx-auto text-sm text-gray-500 dark:text-gray-400">Henüz ilan yok.</p>
          ) : (
            <ListingCarousel listings={popular} />
          )}
        </div>
      </div>

      {/* Son Eklenen İlanlar */}
      <div className="w-full bg-white dark:bg-background-dark py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-40">
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col gap-1">
              <h2 className="text-gray-900 dark:text-white text-2xl md:text-3xl font-bold tracking-tight">
                Son Eklenen İlanlar
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Yeni yayınlanan taleplere göz atın
              </p>
            </div>
            <Link href="/kategoriler" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
              Tümünü Gör <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-72 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
              ))}
            </div>
          ) : recent.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">Henüz ilan yok.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              {recent.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function SkeletonRow() {
  return (
    <div className="flex gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex-1 h-72 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
      ))}
    </div>
  );
}
