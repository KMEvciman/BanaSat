import { Flame, Clock } from "lucide-react";
import Link from "next/link";
import type { Listing } from "@/components/ListingCarousel";

export default function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link
      href={`/ilan/${listing.id}`}
      className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800/60 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 block"
    >
      {/* Image */}
      <div className="relative h-32 sm:h-48 w-full overflow-hidden">
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

      {/* Content */}
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        <div>
          <h3 className="text-gray-900 dark:text-white text-sm font-bold leading-tight line-clamp-1 group-hover:text-primary transition-colors">
            {listing.title}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
            {listing.description}
          </p>
        </div>

        {/* Budget & Offers */}
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

        {/* Footer */}
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
