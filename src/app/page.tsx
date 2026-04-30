import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/HeroSection";
import ListingCarousel from "@/components/ListingCarousel";
import ListingCard from "@/components/ListingCard";
import type { Listing } from "@/components/ListingCarousel";
import { FileText, MailCheck, BadgeCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

const popularListings: Listing[] = [
  {
    id: 1,
    title: "Projeksiyon Cihazı Kurulumu",
    description: "Ofisimiz için profesyonel projeksiyon ve ses sistemi kurulumu yaptırmak istiyoruz.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAAilImTYeLMEVFPBZKBdj46Qd3ugDjFNfLmtcRlH-rxbYTub_TjOyui563WCG6Hhg8d9OfOKXADEn5cZuFeUMZTnSICh_pUWRnkuPclSQIS1bmTgHqPXpv0wqJoLt00ymJrS3QMd3gNgbOIoOrRVOl8RbwGzqKTrqGh_RBnnnmzq_QP-7GPw5UNUIFKrCuyqsZ0TPP76gSqEa87yygxegdLVe6hv_5NPRdLSPRJTCxnGOn1j9mg8-ZTFx-AWGTbbmlrbQGXfJZez4s",
    category: "Hizmet",
    budget: "5.000 - 10.000 TL",
    offers: 12,
    timeLeft: "2 gün kaldı",
  },
  {
    id: 2,
    title: "iPhone 15 Pro Max 256GB",
    description: "Sıfır veya temiz ikinci el iPhone 15 Pro Max arıyorum. Garanti tercihimdir.",
    image: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Elektronik",
    budget: "55.000 - 65.000 TL",
    offers: 8,
    timeLeft: "5 gün kaldı",
  },
  {
    id: 3,
    title: "Kurumsal Web Sitesi Tasarımı",
    description: "Şirketimiz için modern, responsive ve SEO uyumlu kurumsal web sitesi yaptırmak istiyoruz.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Yazılım",
    budget: "15.000 - 25.000 TL",
    offers: 21,
    timeLeft: "3 gün kaldı",
  },
  {
    id: 4,
    title: "İstanbul - Ankara Ev Taşıma",
    description: "3+1 dairemizin eşyalarını İstanbul'dan Ankara'ya profesyonel nakliye ile taşıtmak istiyoruz.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Nakliye",
    budget: "12.000 - 18.000 TL",
    offers: 6,
    timeLeft: "1 gün kaldı",
  },
  {
    id: 5,
    title: "Lise Matematik Özel Ders",
    description: "11. sınıf öğrencisi için haftada 3 gün matematik özel ders verecek deneyimli öğretmen arıyorum.",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Eğitim",
    budget: "800 - 1.200 TL/Saat",
    offers: 4,
    timeLeft: "4 gün kaldı",
  },
];

const recentListings: Listing[] = [
  {
    id: 6,
    title: "Bahçe Peyzaj Düzenlemesi",
    description: "Villa bahçemiz için komple peyzaj tasarımı ve uygulama hizmeti arıyoruz.",
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Bahçe & Peyzaj",
    budget: "20.000 - 35.000 TL",
    offers: 3,
    timeLeft: "6 gün kaldı",
  },
  {
    id: 7,
    title: "Düğün Fotoğrafçısı",
    description: "Ağustos ayında yapılacak düğünümüz için profesyonel fotoğraf ve drone çekimi.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Fotoğraf & Video",
    budget: "8.000 - 15.000 TL",
    offers: 0,
    timeLeft: "7 gün kaldı",
  },
  {
    id: 8,
    title: "Klima Montajı (3 Adet)",
    description: "Evimize 3 adet inverter klima alımı ve montajı için uygun fiyat teklifi bekliyorum.",
    image: "https://images.unsplash.com/photo-1631545806609-35d4ae440431?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Tadilat",
    budget: "30.000 - 45.000 TL",
    offers: 5,
    timeLeft: "3 gün kaldı",
  },
  {
    id: 9,
    title: "İngilizce Çeviri (50 Sayfa)",
    description: "Akademik makale çevirisi için profesyonel ve alanında uzman çevirmen arıyorum.",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Çeviri",
    budget: "3.000 - 5.000 TL",
    offers: 9,
    timeLeft: "2 gün kaldı",
  },
  {
    id: 10,
    title: "Kedi Bakım & Pansiyon",
    description: "Tatil süresince (10 gün) 2 kedimiz için güvenilir pansiyon hizmeti arıyoruz.",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Evcil Hayvan",
    budget: "1.500 - 3.000 TL",
    offers: 2,
    timeLeft: "5 gün kaldı",
  },
];

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="flex-1 w-full">
        {/* Hero Section - Giriş yapmamış kullanıcılar için */}
        <HeroSection />

        {/* Popular Listings Section */}
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
                <Link href="/taleplerim" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
                  Tümünü Gör <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            <ListingCarousel listings={popularListings} />
          </div>
        </div>

        {/* How it Works Section */}
        <div id="nasil-calisir" className="w-full bg-primary/5 dark:bg-black py-16 scroll-mt-24">
          <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-40">
            <div className="flex flex-col gap-12 text-center">
              <div className="flex flex-col gap-2">
                <h2 className="text-gray-900 dark:text-white text-3xl font-bold tracking-tight">
                  Nasıl Çalışır?
                </h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                  Sadece 3 adımda ihtiyacınız olan ürüne veya hizmete en uygun fiyatla ulaşın.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-200 dark:bg-gray-700 -z-10"></div>

                <div className="flex flex-col items-center gap-4 group">
                  <div className="size-24 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center group-hover:-translate-y-1 transition-transform duration-300">
                    <FileText size={36} className="text-primary" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-gray-900 dark:text-white text-lg font-bold">1. İhtiyacını Anlat</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed px-4">
                      Detaylı bir şekilde neye ihtiyacın olduğunu yaz, kategorini seç.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-4 group">
                  <div className="size-24 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center group-hover:-translate-y-1 transition-transform duration-300">
                    <MailCheck size={36} className="text-primary" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-gray-900 dark:text-white text-lg font-bold">2. Teklifleri Topla</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed px-4">
                      Satıcılardan gelen rekabetçi teklifleri anında görüntüle.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-4 group">
                  <div className="size-24 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center group-hover:-translate-y-1 transition-transform duration-300">
                    <BadgeCheck size={36} className="text-primary" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-gray-900 dark:text-white text-lg font-bold">3. En İyisini Seç</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed px-4">
                      Sana en uygun fiyatı ve güvenilir satıcıyı onayla, alışverişi tamamla.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Listings Section */}
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
              <Link href="/taleplerim" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
                Tümünü Gör <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              {recentListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="w-full bg-background-light dark:bg-background-dark py-12">
          <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-40">
            <div className="bg-primary rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-primary/20 relative overflow-hidden">
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

              <div className="flex flex-col gap-4 text-center md:text-left relative z-10 w-full">
                <h2 className="text-white text-2xl md:text-3xl font-bold">Hâlâ aradığını bulamadın mı?</h2>
                <p className="text-green-100 text-base md:text-lg max-w-lg">
                  Hemen ücretsiz bir talep oluştur, aradığın ürün veya hizmet ayağına gelsin.
                </p>
              </div>

              <div className="flex gap-4 relative z-10 flex-shrink-0">
                <Link href="/talep-olustur" className="flex min-w-[200px] cursor-pointer items-center justify-center rounded-xl h-12 px-6 bg-white text-primary hover:bg-gray-50 text-base font-bold transition-colors shadow-lg">
                  Ücretsiz Talep Oluştur
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
