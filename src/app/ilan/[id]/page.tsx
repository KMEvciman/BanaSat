"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { listingsApi, offersApi, messagesApi } from "@/lib/api/services";
import type { ListingDetail } from "@/lib/api/types";
import { formatTimeLeft } from "@/lib/api/adapters";
import { digitsOnly, formatThousands } from "@/lib/format";
import {
  MapPin, Calendar, Clock, Eye, MessageCircle, Star, BadgeCheck,
  Check, ShieldCheck, Flame, Send, X,
} from "lucide-react";

const statusConfig: Record<string, { label: string; cls: string }> = {
  AKTIF: { label: "Aktif", cls: "text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" },
  BEKLEMEDE: { label: "Beklemede", cls: "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800" },
  TAMAMLANDI: { label: "Tamamlandı", cls: "text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800" },
  IPTAL: { label: "İptal", cls: "text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800" },
};

export default function IlanDetay() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);
  const { user, isLoggedIn } = useAuth();

  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [actionError, setActionError] = useState("");
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    listingsApi
      .detail(id)
      .then((d) => setListing(d))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const isOwner = !!user && !!listing && user.id === listing.owner.id;

  // --- Teklif verme (sahibi olmayan, giriş yapmış kullanıcı) ---
  const [price, setPrice] = useState("");
  const [note, setNote] = useState("");
  const [offerSubmitting, setOfferSubmitting] = useState(false);

  const submitOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError("");
    setOfferSubmitting(true);
    try {
      // Teklif doğrudan sohbete düşsün: konuşmayı başlat, teklifi gönder, mesajlara git.
      const conv = await messagesApi.createOrGet({ listingId: id });
      await messagesApi.sendOffer(conv.id, {
        price: Number(price),
        note: note.trim() || undefined,
      });
      setPrice(""); setNote("");
      router.push(`/mesajlar?c=${conv.id}`);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Teklif gönderilemedi.");
    } finally {
      setOfferSubmitting(false);
    }
  };

  const handleOfferAction = async (offerId: string, action: "accept" | "reject") => {
    setActionError("");
    try {
      if (action === "accept") await offersApi.accept(offerId);
      else await offersApi.reject(offerId);
      load();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "İşlem başarısız.");
    }
  };

  const startConversation = async (sellerId: string) => {
    if (!isLoggedIn) {
      router.push("/giris");
      return;
    }
    try {
      const conv = await messagesApi.createOrGet({ listingId: id, participantId: sellerId });
      router.push(`/mesajlar?c=${conv.id}`);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Mesaj başlatılamadı.");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="flex-1 w-full bg-background-light dark:bg-background-dark">
          <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-40 py-10">
            <div className="h-64 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (notFound || !listing) {
    return (
      <>
        <Navbar />
        <main className="flex-1 w-full bg-background-light dark:bg-background-dark">
          <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-40 py-20 text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">İlan Bulunamadı</h1>
            <Link href="/" className="text-primary font-semibold hover:underline">Ana Sayfaya Dön</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const sc = statusConfig[listing.status];

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-40 py-6 md:py-10">
          <nav className="flex flex-wrap items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-gray-500 hover:text-primary">Anasayfa</Link>
            <span className="text-gray-400">/</span>
            <Link href="/kategoriler" className="text-gray-500 hover:text-primary">İlanlar</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 dark:text-white font-medium truncate max-w-[200px]">{listing.title}</span>
          </nav>

          {actionError && (
            <div className="mb-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 px-4 py-3 text-sm text-red-700 dark:text-red-400">
              {actionError}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
            {/* Sol kolon */}
            <div className="flex flex-col gap-6">
              <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-gray-100 dark:bg-gray-800">
                <img
                  src={listing.coverImageUrl || "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80"}
                  alt={listing.title}
                  onClick={() => setLightboxUrl(listing.coverImageUrl || "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80")}
                  className="w-full h-full object-cover cursor-zoom-in"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-md ${sc.cls}`}>{sc.label}</span>
                </div>
                <div className="absolute bottom-4 right-4 bg-white/85 dark:bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-gray-200/50 dark:border-white/10">
                  <span className="text-primary font-bold text-sm">{listing.category.name}</span>
                </div>
              </div>

              {listing.images.length > 0 && (
                <div className="flex gap-3 overflow-x-auto no-scrollbar scrollbar-hide">
                  {listing.images.map((img) => (
                    <div key={img.id} className="shrink-0 size-24 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                      <img src={img.url} alt="" onClick={() => setLightboxUrl(img.url)} className="w-full h-full object-cover cursor-zoom-in" />
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 md:p-8">
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-3">{listing.title}</h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-6">
                  {listing.location && <span className="flex items-center gap-1"><MapPin size={14} /> {listing.location}</span>}
                  <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(listing.createdAt).toLocaleDateString("tr-TR")}</span>
                  <span className="flex items-center gap-1"><Eye size={14} /> {listing.views} görüntülenme</span>
                  <span className="flex items-center gap-1"><Clock size={14} /> {formatTimeLeft(listing.deadline)}</span>
                </div>
                <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
                  <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-3">Detaylı Açıklama</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm whitespace-pre-line">{listing.fullDescription}</p>
                </div>
              </div>

              {/* Gelen Teklifler - yalnızca ilan sahibi görür */}
              {isOwner && (
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  Gelen Teklifler
                  <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">{listing.offers.length}</span>
                </h3>

                {listing.offers.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">Henüz teklif yok.</p>
                )}

                {listing.offers.map((offer) => (
                  <article key={offer.id} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                    <div className="p-5 flex flex-col md:flex-row gap-5">
                      <div className="flex md:flex-col items-center md:items-start gap-4 md:w-44 md:border-r md:border-gray-100 dark:md:border-gray-800 md:pr-4">
                        <div className="relative">
                          <div className="size-14 rounded-full bg-cover bg-center border-2 border-white dark:border-gray-700 shadow-sm" style={{ backgroundImage: `url('${offer.seller.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(offer.seller.name)}&background=5BB678&color=fff`}')` }}></div>
                          {offer.seller.isVerified && (
                            <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-0.5 rounded-full border-2 border-white dark:border-gray-800"><Check size={12} /></div>
                          )}
                        </div>
                        <div>
                          <Link href={`/kullanici/${offer.seller.id}`} className="font-bold text-gray-900 dark:text-white text-sm hover:text-primary transition-colors">{offer.seller.name}</Link>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="text-yellow-400 fill-yellow-400" size={14} />
                            <span className="text-xs font-semibold text-gray-900 dark:text-white">{offer.seller.ratingAvg}</span>
                            <span className="text-[11px] text-gray-500">({offer.seller.ratingCount})</span>
                          </div>
                          <span className={`mt-1.5 inline-block px-2 py-0.5 text-[11px] rounded ${statusConfig[offer.status]?.cls ?? "bg-gray-100 dark:bg-gray-800 text-gray-600"}`}>
                            {offerStatusLabel(offer.status)}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col justify-between gap-3">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <div>
                            <p className="text-xs text-gray-500 mb-0.5">Teklif Fiyatı</p>
                            <p className="text-2xl font-black text-primary tracking-tight">{offer.price.toLocaleString("tr-TR")} ₺</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/5 text-primary text-xs font-medium"><Clock size={14} /> {offer.deliveryTime}</span>
                            {offer.warranty && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-xs font-medium"><ShieldCheck size={14} /> {offer.warranty}</span>}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800">&quot;{offer.note}&quot;</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/30 px-5 py-3 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
                      <button onClick={() => startConversation(offer.seller.id)} className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm font-semibold border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
                        <MessageCircle size={16} /> Mesaj
                      </button>
                      {isOwner && offer.status === "BEKLEMEDE" && (
                        <>
                          <button onClick={() => handleOfferAction(offer.id, "reject")} className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm font-semibold rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">Reddet</button>
                          <button onClick={() => handleOfferAction(offer.id, "accept")} className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/85 transition-colors">Kabul Et</button>
                        </>
                      )}
                    </div>
                  </article>
                ))}
              </div>
              )}
            </div>

            {/* Sağ kolon */}
            <div className="flex flex-col gap-6">
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                <div className="text-center pb-5 border-b border-gray-100 dark:border-gray-800">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold tracking-wider mb-1">Bütçe</p>
                  <p className="text-2xl font-black text-gray-900 dark:text-white">{listing.budgetLabel}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-5">
                  <Stat icon={<Flame size={18} className="text-orange-500" />} value={listing.offers.length} label="Teklif" />
                  <Stat icon={<Eye size={18} className="text-primary" />} value={listing.views} label="Görüntülenme" />
                </div>

                {/* Teklif verme: sahibi olmayan, aktif ilan */}
                {!isOwner && listing.status === "AKTIF" && (
                  isLoggedIn ? (
                    <form onSubmit={submitOffer} className="mt-6 flex flex-col gap-3 border-t border-gray-100 dark:border-gray-800 pt-5">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">Teklif Ver</h4>
                      <input inputMode="numeric" value={formatThousands(price)} onChange={(e) => setPrice(digitsOnly(e.target.value))} required placeholder="Fiyat (₺)" className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white h-11 px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                      <textarea value={note} onChange={(e) => setNote(e.target.value)} required minLength={10} placeholder="Teklif notunuz (en az 10 karakter)" className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-y min-h-[80px]" />
                      <button disabled={offerSubmitting} className="w-full flex items-center justify-center gap-2 h-11 bg-primary hover:bg-primary/85 text-white font-bold rounded-xl transition-colors disabled:opacity-60">
                        <Send size={16} /> {offerSubmitting ? "Gönderiliyor..." : "Teklifi Gönder"}
                      </button>
                    </form>
                  ) : (
                    <Link href="/giris" className="mt-6 w-full flex items-center justify-center gap-2 h-12 bg-primary hover:bg-primary/85 text-white font-bold rounded-xl transition-colors">
                      Teklif vermek için giriş yap
                    </Link>
                  )
                )}

                {isOwner && (
                  <p className="mt-6 text-xs text-center text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-5">Bu sizin ilanınız. Gelen teklifleri yukarıdan yönetebilirsiniz.</p>
                )}
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4">İlan Sahibi</h4>
                <Link href={`/kullanici/${listing.owner.id}`} className="flex items-center gap-3 group">
                  <div className="size-12 rounded-full bg-cover bg-center border-2 border-gray-100 dark:border-gray-800" style={{ backgroundImage: `url('${listing.owner.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(listing.owner.name)}&background=5BB678&color=fff`}')` }}></div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-1 group-hover:text-primary transition-colors">
                      {listing.owner.name}
                      {listing.owner.isVerified && <BadgeCheck size={14} className="text-primary" />}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="text-yellow-400 fill-yellow-400" size={14} />
                      <span className="text-xs font-semibold text-gray-900 dark:text-white">{listing.owner.ratingAvg}</span>
                      <span className="text-[11px] text-gray-500">({listing.owner.ratingCount} değerlendirme)</span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Görsel büyük görünüm (lightbox) */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            onClick={() => setLightboxUrl(null)}
            className="absolute top-4 right-4 size-11 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Kapat"
          >
            <X size={22} />
          </button>
          <img
            src={lightboxUrl}
            alt=""
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
      {icon}
      <span className="text-lg font-bold text-gray-900 dark:text-white">{value}</span>
      <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-semibold">{label}</span>
    </div>
  );
}

function offerStatusLabel(status: string): string {
  const map: Record<string, string> = {
    BEKLEMEDE: "Beklemede", KABUL: "Kabul Edildi", RED: "Reddedildi", GERI_CEKILDI: "Geri Çekildi",
  };
  return map[status] ?? status;
}
