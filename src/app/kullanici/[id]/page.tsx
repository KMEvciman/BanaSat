"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ListingCard from "@/components/ListingCard";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { usersApi, reviewsApi, listingsApi } from "@/lib/api/services";
import type { PublicProfile, Review, Listing } from "@/lib/api/types";
import { listingToCard } from "@/lib/api/adapters";
import { Star, BadgeCheck, MapPin, CalendarDays } from "lucide-react";

export default function KullaniciProfil() {
  const params = useParams();
  const id = String(params.id);

  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    usersApi
      .publicProfile(id)
      .then((p) => {
        setProfile(p);
        return Promise.all([
          reviewsApi.forUser(id).catch(() => []),
          listingsApi.list({ ownerId: id, status: "AKTIF", limit: 12 }).catch(() => ({ items: [] as Listing[] })),
        ]);
      })
      .then(([revs, lst]) => {
        setReviews(revs as Review[]);
        setListings((lst as { items: Listing[] }).items);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="flex-1 w-full bg-background-light dark:bg-background-dark">
          <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-40 py-10">
            <div className="h-40 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (notFound || !profile) {
    return (
      <>
        <Navbar />
        <main className="flex-1 w-full bg-background-light dark:bg-background-dark">
          <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-40 py-20 text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Kullanıcı Bulunamadı</h1>
            <Link href="/" className="text-primary font-semibold hover:underline">Ana Sayfaya Dön</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const avatar = profile.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=5BB678&color=fff&size=200`;

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-40 py-8 md:py-12 flex flex-col gap-8">
          {/* Profil başlığı */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 md:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="size-28 rounded-full bg-cover bg-center border-4 border-white dark:border-gray-800 shadow-lg shrink-0" style={{ backgroundImage: `url('${avatar}')` }}></div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">{profile.name}</h1>
                {profile.isVerified && <BadgeCheck size={20} className="text-primary" />}
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-1 mt-2">
                <Star className="text-yellow-400 fill-yellow-400" size={18} />
                <span className="font-semibold text-gray-900 dark:text-white">{profile.ratingAvg}</span>
                <span className="text-sm text-gray-500">({profile.ratingCount} değerlendirme)</span>
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                {profile.location && <span className="flex items-center gap-1"><MapPin size={14} /> {profile.location}</span>}
                <span className="flex items-center gap-1"><CalendarDays size={14} /> {new Date(profile.createdAt).toLocaleDateString("tr-TR", { month: "long", year: "numeric" })} tarihinden beri üye</span>
              </div>
              {profile.bio && <p className="text-sm text-gray-600 dark:text-gray-300 mt-4 leading-relaxed">{profile.bio}</p>}
            </div>
          </div>

          {/* Aktif ilanları */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Aktif İlanları ({listings.length})</h2>
            {listings.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                {listings.map((l) => (
                  <ListingCard key={l.id} listing={listingToCard(l)} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">Aktif ilanı yok.</p>
            )}
          </section>

          {/* Değerlendirmeler */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Değerlendirmeler ({reviews.length})</h2>
            {reviews.length > 0 ? (
              <div className="flex flex-col gap-3">
                {reviews.map((r) => (
                  <div key={r.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="size-8 rounded-full bg-cover bg-center" style={{ backgroundImage: `url('${r.author.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.author.name)}&background=5BB678&color=fff`}')` }}></div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{r.author.name}</span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={14} className={i < r.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"} />
                        ))}
                      </div>
                    </div>
                    {r.comment && <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{r.comment}</p>}
                    <p className="text-xs text-gray-400 mt-2">{r.order?.offer?.listing?.title}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">Henüz değerlendirme yok.</p>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
