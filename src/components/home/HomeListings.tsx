"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ListingCarousel from "@/components/ListingCarousel";
import ListingCard from "@/components/ListingCard";
import type { Listing as CardListing } from "@/components/ListingCarousel";
import { listingsApi } from "@/lib/api/services";
import { listingToCard } from "@/lib/api/adapters";

/** Ana sayfadaki "En Popüler" (carousel) ve "Son Eklenen" (grid) ilan bölümleri. */
export default function HomeListings() {
  const [popular, setPopular] = useState<CardListing[]>([]);
  const [recent, setRecent] = useState<CardListing[]>([]);
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

  return (
    <>
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
