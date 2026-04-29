"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Flame, Clock } from "lucide-react";
import Link from "next/link";

export interface Listing {
  id: number;
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
      <div className="relative h-48 w-full overflow-hidden">
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
          <span
            className="flex-1 bg-primary text-white py-2 rounded-lg text-xs font-semibold text-center shadow-sm shadow-primary/20"
          >
            {listing.offers === 0 ? "İlk Teklifi Ver" : "Teklif Ver"}
          </span>
        </div>
      </div>
    </Link>
  );
}

const VISIBLE = 4;
const GAP = 20; // gap-5 = 1.25rem = 20px

export default function ListingCarousel({ listings }: { listings: Listing[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(listings.length / VISIBLE);

  const canPrev = page > 0;
  const canNext = page < totalPages - 1;

  const getCardWidth = useCallback(() => {
    const el = containerRef.current;
    if (!el) return 300;
    return (el.clientWidth - GAP * (VISIBLE - 1)) / VISIBLE;
  }, []);

  const [cardWidth, setCardWidth] = useState(0);

  useEffect(() => {
    const update = () => setCardWidth(getCardWidth());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [getCardWidth]);

  const goTo = (dir: "prev" | "next") => {
    setPage((p) => {
      if (dir === "prev") return Math.max(0, p - 1);
      return Math.min(totalPages - 1, p + 1);
    });
  };

  const offset = page * (cardWidth + GAP) * VISIBLE;

  return (
    <div className="relative">
      {/* Left Arrow */}
      {canPrev && (
        <button
          onClick={() => goTo("prev")}
          className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 size-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary transition-all"
          aria-label="Önceki"
        >
          <ChevronLeft size={22} />
        </button>
      )}

      {/* Right Arrow */}
      {canNext && (
        <button
          onClick={() => goTo("next")}
          className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 size-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary transition-all"
          aria-label="Sonraki"
        >
          <ChevronRight size={22} />
        </button>
      )}

      {/* Track */}
      <div ref={containerRef} className="overflow-hidden">
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

      {/* Dots */}
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
