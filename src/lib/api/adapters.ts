// API verisini frontend kart bileşenlerinin beklediği şekle dönüştüren yardımcılar.

import type { Listing as ApiListing } from "./types";
import type { Listing as CardListing } from "@/components/ListingCarousel";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80";

/** Bitiş tarihinden "X gün kaldı" / "Süresi doldu" metni üretir. */
export function formatTimeLeft(deadline: string | null): string {
  if (!deadline) return "Süre belirtilmedi";
  const diffMs = new Date(deadline).getTime() - Date.now();
  if (diffMs <= 0) return "Süresi doldu";
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return `${days} gün kaldı`;
}

/** API ilanını kart bileşeni formatına dönüştürür. */
export function listingToCard(listing: ApiListing): CardListing {
  return {
    id: listing.id,
    title: listing.title,
    description: listing.description,
    image: listing.coverImageUrl || PLACEHOLDER_IMAGE,
    category: listing.category?.name ?? "Diğer",
    budget: listing.budgetLabel,
    offers: listing.offerCount,
    timeLeft: formatTimeLeft(listing.deadline),
  };
}
