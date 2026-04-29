"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { getListingById } from "@/data/listings";
import {
  Wallet,
  MapPin,
  Calendar,
  Clock,
  Eye,
  MessageCircle,
  Star,
  BadgeCheck,
  Check,
  ShieldCheck,
  Award,
  ArrowLeft,
  Share2,
  Heart,
  Flame,
  User,
} from "lucide-react";

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  aktif: { label: "Aktif", color: "text-green-700 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" },
  beklemede: { label: "Beklemede", color: "text-amber-700 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800" },
  tamamlandi: { label: "Tamamlandı", color: "text-blue-700 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800" },
  iptal: { label: "İptal Edildi", color: "text-red-700 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800" },
};

export default function IlanDetay() {
  const params = useParams();
  const id = Number(params.id);
  const listing = getListingById(id);
  const [liked, setLiked] = useState(false);

  if (!listing) {
    return (
      <>
        <Navbar />
        <main className="flex-1 w-full bg-background-light dark:bg-background-dark">
          <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-40 py-20 text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">İlan Bulunamadı</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Aradığınız ilan mevcut değil veya kaldırılmış olabilir.</p>
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
          {/* Breadcrumbs */}
          <nav className="flex flex-wrap items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-gray-500 hover:text-primary transition-colors">Anasayfa</Link>
            <span className="text-gray-400">/</span>
            <Link href="/taleplerim" className="text-gray-500 hover:text-primary transition-colors">İlanlar</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 dark:text-white font-medium truncate max-w-[200px]">{listing.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
            {/* Left Column */}
            <div className="flex flex-col gap-6">
              {/* Main Image */}
              <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-gray-100 dark:bg-gray-800">
                <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-md ${sc.bg} ${sc.color}`}>
                    {sc.label}
                  </span>
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => setLiked(!liked)}
                    className={`size-10 rounded-full backdrop-blur-md flex items-center justify-center transition-colors border ${liked ? "bg-red-500 border-red-500 text-white" : "bg-white/80 dark:bg-black/50 border-white/30 dark:border-white/10 text-gray-700 dark:text-white hover:bg-white dark:hover:bg-black/70"}`}
                  >
                    <Heart size={18} className={liked ? "fill-current" : ""} />
                  </button>
                  <button className="size-10 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-md flex items-center justify-center text-gray-700 dark:text-white border border-white/30 dark:border-white/10 hover:bg-white dark:hover:bg-black/70 transition-colors">
                    <Share2 size={18} />
                  </button>
                </div>
                <div className="absolute bottom-4 right-4 bg-white/85 dark:bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-gray-200/50 dark:border-white/10">
                  <span className="text-primary font-bold text-sm">{listing.category}</span>
                </div>
              </div>

              {/* Extra Images */}
              {listing.images.length > 0 && (
                <div className="flex gap-3 overflow-x-auto no-scrollbar scrollbar-hide">
                  {listing.images.map((img, i) => (
                    <div key={i} className="shrink-0 size-24 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              {/* Title & Description */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 md:p-8">
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-3">
                  {listing.title}
                </h1>

                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-6">
                  <span className="flex items-center gap-1"><MapPin size={14} /> {listing.location}</span>
                  <span className="flex items-center gap-1"><Calendar size={14} /> {listing.createdAt}</span>
                  <span className="flex items-center gap-1"><Eye size={14} /> {listing.views} görüntülenme</span>
                  <span className="flex items-center gap-1"><Clock size={14} /> {listing.timeLeft}</span>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
                  <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-3">Detaylı Açıklama</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                    {listing.fullDescription}
                  </p>
                </div>
              </div>

              {/* Offers Section */}
              {listing.teklifler.length > 0 && (
                <div className="flex flex-col gap-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    Gelen Teklifler
                    <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">{listing.teklifler.length}</span>
                  </h3>

                  {listing.teklifler.map((teklif) => (
                    <article key={teklif.id} className={`bg-white dark:bg-gray-900 rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow duration-200 ${teklif.badge ? "border-orange-200 dark:border-orange-900" : "border-gray-100 dark:border-gray-800"}`}>
                      {teklif.badge && <div className="h-1 bg-gradient-to-r from-orange-400 to-red-500"></div>}
                      <div className="p-5 flex flex-col md:flex-row gap-5">
                        <div className="flex md:flex-col items-center md:items-start gap-4 md:w-44 md:border-r md:border-gray-100 dark:md:border-gray-800 md:pr-4">
                          <div className="relative">
                            <div className="size-14 rounded-full bg-cover bg-center border-2 border-white dark:border-gray-700 shadow-sm" style={{ backgroundImage: `url('${teklif.sellerAvatar}')` }}></div>
                            {teklif.verified && (
                              <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-0.5 rounded-full border-2 border-white dark:border-gray-800">
                                <Check size={12} />
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-white text-sm">{teklif.sellerName}</h4>
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="text-yellow-400 fill-yellow-400" size={14} />
                              <span className="text-xs font-semibold text-gray-900 dark:text-white">{teklif.sellerRating}</span>
                              <span className="text-[11px] text-gray-500">({teklif.sellerReviews})</span>
                            </div>
                            {teklif.badge && (
                              <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-[11px] rounded border border-orange-100 dark:border-orange-800">
                                <Award size={12} />
                                {teklif.badge}
                              </div>
                            )}
                            {teklif.verified && !teklif.badge && (
                              <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-[11px] rounded">
                                <BadgeCheck size={12} />
                                Onaylı
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex-1 flex flex-col justify-between gap-3">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            <div>
                              <p className="text-xs text-gray-500 mb-0.5">Teklif Fiyatı</p>
                              <p className="text-2xl font-black text-primary tracking-tight">{teklif.price}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/5 dark:bg-primary/10 text-primary text-xs font-medium">
                                <Clock size={14} /> {teklif.deliveryTime}
                              </span>
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-xs font-medium">
                                <ShieldCheck size={14} /> {teklif.warranty}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                            &quot;{teklif.note}&quot;
                          </p>
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800/30 px-5 py-3 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
                        <button className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm font-semibold border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          Profili Gör
                        </button>
                        <Link href="/mesajlar" className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/85 transition-colors shadow-sm shadow-primary/20 flex items-center gap-2">
                          <MessageCircle size={16} />
                          Mesaj Gönder
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="flex flex-col gap-6">
              {/* Budget Card */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 lg:sticky lg:top-[120px]">
                <div className="flex flex-col gap-5">
                  {/* Budget */}
                  <div className="text-center pb-5 border-b border-gray-100 dark:border-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold tracking-wider mb-1">Bütçe Aralığı</p>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">{listing.budget}</p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center gap-1 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <Flame size={18} className="text-orange-500" />
                      <span className="text-lg font-bold text-gray-900 dark:text-white">{listing.offers}</span>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-semibold">Teklif</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <Eye size={18} className="text-primary" />
                      <span className="text-lg font-bold text-gray-900 dark:text-white">{listing.views}</span>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-semibold">Görüntülenme</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <Link
                    href="/satici/teklif-ver"
                    className="w-full flex items-center justify-center gap-2 h-12 bg-primary hover:bg-primary/85 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg shadow-primary/20"
                  >
                    Teklif Ver
                  </Link>

                  <Link
                    href="/mesajlar"
                    className="w-full flex items-center justify-center gap-2 h-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <MessageCircle size={18} />
                    Mesaj Gönder
                  </Link>
                </div>
              </div>

              {/* Owner Card */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4">İlan Sahibi</h4>
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-full bg-cover bg-center border-2 border-gray-100 dark:border-gray-800" style={{ backgroundImage: `url('${listing.owner.avatar}')` }}></div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm">{listing.owner.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="text-yellow-400 fill-yellow-400" size={14} />
                      <span className="text-xs font-semibold text-gray-900 dark:text-white">{listing.owner.rating}</span>
                      <span className="text-[11px] text-gray-500">({listing.owner.reviews} değerlendirme)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
