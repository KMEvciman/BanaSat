// API verisini kart bileşeninin beklediği şekle dönüştüren yardımcılar.

import type { Listing as ApiListing, CardListing } from "./types";
import { API_URL } from "./client";

export const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80";

// Backend görselleri relatif yol (/uploads/...) döndürür. Mobilde Image
// bileşeni relatif yolu çözemez; bu yüzden API kökünü (/api öneki hariç)
// başa ekleyerek tam URL üretiriz.
const ASSET_BASE = API_URL.replace(/\/api\/?$/, "");

/** Relatif görsel yolunu tam URL'ye çevirir. Boşsa placeholder döner. */
export function resolveImageUrl(url: string | null | undefined): string {
  if (!url) return PLACEHOLDER_IMAGE;
  // Backend görselleri localhost/değişken host ile kaydeder; host'u yok say,
  // /uploads/... kısmını mobil API köküyle (LAN IP) birleştir.
  const idx = url.indexOf("/uploads/");
  if (idx !== -1) return `${ASSET_BASE}${url.slice(idx)}`;
  if (/^https?:\/\//i.test(url)) return url; // dış kaynak (unsplash vb.)
  return `${ASSET_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}

/** Avatar için tam URL; boşsa isimden üretilmiş placeholder döner. */
export function resolveAvatarUrl(url: string | null | undefined, name: string): string {
  if (!url) return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=5BB678&color=fff`;
  const idx = url.indexOf("/uploads/");
  if (idx !== -1) return `${ASSET_BASE}${url.slice(idx)}`;
  if (/^https?:\/\//i.test(url)) return url;
  return `${ASSET_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}

/** Bitiş tarihinden "X gün kaldı" / "Süresi doldu" metni üretir. */
export function formatTimeLeft(deadline: string | null): string {
  if (!deadline) return "Süre belirtilmedi";
  const diffMs = new Date(deadline).getTime() - Date.now();
  if (diffMs <= 0) return "Süresi doldu";
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return `${days} gün kaldı`;
}

/** API ilanını kart formatına dönüştürür. */
export function listingToCard(listing: ApiListing): CardListing {
  return {
    id: listing.id,
    title: listing.title,
    description: listing.description,
    image: resolveImageUrl(listing.coverImageUrl),
    category: listing.category?.name ?? "Diğer",
    budget: listing.budgetLabel,
    offers: listing.offerCount,
    timeLeft: formatTimeLeft(listing.deadline),
  };
}
