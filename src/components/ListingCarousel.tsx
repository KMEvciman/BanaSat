"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Flame, Clock } from "lucide-react";
import Link from "next/link";

export interface Listing {
  id: string | number;
  title: string;
  description: string;
  image: string;
  category: string;
  budget: string;
  offers: number;
  timeLeft: string;
}

function CarouselCard({ listing }: { listing: Listing }) {
  return (
    <Link href={`/ilan/${listing.id}`} className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800/60 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 shrink-0 block">
      <div className="relative h-44 sm:h-48 w-full overflow-hidden">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={listing.image}
          alt={listing.title}
        />
        {listing.offers >= 8 && (
          <div className="absolute top-3 left-3">
            <span className="bg-orange-500/15 text-orange-500 dark:bg-orange-400/15 dark:text-orange-400 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 backdrop-blur-md border border-orange-500/20 dark:border-orange-400/20">
              <Flame size={14} className="fill-current" />
              Popüler
            </span>
          </div>
        )}
        <div className="absolute bottom-3 right-3 bg-white/85 dark:bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-gray-200/50 dark:border-white/10">
          <span className="text-primary font-bold text-xs">{listing.category}</span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-gray-900 dark:text-white text-sm font-bold leading-tight line-clamp-1 group-hover:text-primary transition-colors">
            {listing.title}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
            {listing.description}
          </p>
        </div>

        <div className="flex items-center justify-between py-2.5 border-y border-gray-100 dark:border-gray-800/60">
          <div className="flex flex-col">
            <span className="text-gray-400 dark:text-gray-500 text-[10px] uppercase font-semibold tracking-wider">Bütçe</span>
            <span className="text-gray-900 dark:text-white font-bold text-xs mt-0.5">{listing.budget}</span>
          </div>
          <div className="text-right flex flex-col">
            <span className="text-gray-400 dark:text-gray-500 text-[10px] uppercase font-semibold tracking-wider">Durum</span>
            <span className={`text-xs font-semibold mt-0.5 ${listing.offers > 0 ? "text-green-600 dark:text-green-400" : "text-gray-400 dark:text-gray-500"}`}>
              {listing.offers > 0 ? `${listing.offers} teklif` : "Henüz yok"}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-0.5">
          <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500">
            <Clock size={14} />
            <span className="text-[11px] whitespace-nowrap">{listing.timeLeft}</span>
          </div>
          <span className="flex-1 bg-primary text-white py-2 rounded-lg text-xs font-semibold text-center shadow-sm shadow-primary/20">
            {listing.offers === 0 ? "İlk Teklifi Ver" : "Teklif Ver"}
          </span>
        </div>
      </div>
    </Link>
  );
}

const GAP = 16;

function getVisibleCount(): number {
  if (typeof window === "undefined") return 4;
  const w = window.innerWidth;
  if (w < 640) return 1;
  if (w < 1024) return 2;
  if (w < 1280) return 3;
  return 4;
}

export default function ListingCarousel({ listings }: { listings: Listing[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(4);
  const [page, setPage] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const totalPages = Math.ceil(listings.length / visible);
  const canPrev = page > 0;
  const canNext = page < totalPages - 1;

  const recalc = useCallback(() => {
    const v = getVisibleCount();
    setVisible(v);
    const el = containerRef.current;
    if (!el) return;
    setCardWidth((el.clientWidth - GAP * (v - 1)) / v);
  }, []);

  useEffect(() => {
    recalc();
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, [recalc]);

  useEffect(() => {
    if (page >= totalPages) setPage(Math.max(0, totalPages - 1));
  }, [page, totalPages]);

  const goTo = (dir: "prev" | "next") => {
    setPage((p) => {
      if (dir === "prev") return Math.max(0, p - 1);
      return Math.min(totalPages - 1, p + 1);
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && canNext) goTo("next");
      if (diff < 0 && canPrev) goTo("prev");
    }
  };

  const offset = page * (cardWidth + GAP) * visible;

  return (
    <div className="relative">
      {canPrev && (
        <button
          onClick={() => goTo("prev")}
          className="absolute left-1 sm:-left-5 top-1/2 -translate-y-1/2 z-10 size-9 sm:size-10 hidden sm:flex items-center justify-center rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary transition-all"
          aria-label="Önceki"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {canNext && (
        <button
          onClick={() => goTo("next")}
          className="absolute right-1 sm:-right-5 top-1/2 -translate-y-1/2 z-10 size-9 sm:size-10 hidden sm:flex items-center justify-center rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary transition-all"
          aria-label="Sonraki"
        >
          <ChevronRight size={20} />
        </button>
      )}

      <div
        ref={containerRef}
        className="overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            gap: `${GAP}px`,
            transform: `translateX(-${offset}px)`,
          }}
        >
          {listings.map((listing) => (
            <div
              key={listing.id}
              style={{ width: cardWidth > 0 ? `${cardWidth}px` : undefined, minWidth: cardWidth > 0 ? `${cardWidth}px` : undefined }}
            >
              <CarouselCard listing={listing} />
            </div>
          ))}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-1.5 mt-6">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === page ? "w-6 bg-primary" : "w-1.5 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400"
              }`}
              aria-label={`Sayfa ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
