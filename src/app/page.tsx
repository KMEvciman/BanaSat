import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { FileText, MailCheck, BadgeCheck, ArrowRight, Flame, Clock } from "lucide-react";
import Link from "next/link";

const popularListings = [
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

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="flex-1 w-full">
        {/* Popular Listings Section */}
        <div className="w-full bg-background-light dark:bg-background-dark py-10 md:py-14">
          <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-40">
            <div className="flex items-center justify-between mb-8">
              <div className="flex flex-col gap-1">
                <h2 className="text-gray-900 dark:text-white text-2xl md:text-3xl font-bold tracking-tight">
                  En Popüler İlanlar
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Şu anda en çok teklif alan ilanlar
                </p>
              </div>
              <Link href="/ilanlarim" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
                Tümünü Gör <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
              {popularListings.map((listing) => (
                <div
                  key={listing.id}
                  className="group bg-white dark:bg-[#1a2030] rounded-xl border border-gray-100 dark:border-gray-800/60 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      src={listing.image}
                      alt={listing.title}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-orange-500/15 text-orange-500 dark:bg-orange-400/15 dark:text-orange-400 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 backdrop-blur-md border border-orange-500/20 dark:border-orange-400/20">
                        <Flame size={14} className="fill-current" />
                        Popüler
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-white/85 dark:bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-gray-200/50 dark:border-white/10">
                      <span className="text-primary font-bold text-xs">{listing.category}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
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
                        <span className="text-green-600 dark:text-green-400 text-xs font-semibold mt-0.5">{listing.offers} teklif</span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between gap-3 pt-0.5">
                      <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500">
                        <Clock size={14} />
                        <span className="text-[11px] whitespace-nowrap">{listing.timeLeft}</span>
                      </div>
                      <Link
                        href="/satici/teklif-ver"
                        className="flex-1 bg-primary text-white py-2 rounded-lg text-xs font-semibold hover:bg-blue-600 transition-colors active:scale-95 transform text-center shadow-sm shadow-primary/20"
                      >
                        Teklif Ver
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="w-full bg-white dark:bg-background-dark">
          <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-40 py-8 md:py-16">
            <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-16 items-center">
              {/* Content */}
              <div className="flex flex-col gap-6 flex-1 text-center lg:text-left items-center lg:items-start">
                <div className="flex flex-col gap-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 w-fit mx-auto lg:mx-0">
                    <span className="size-2 rounded-full bg-primary animate-pulse"></span>
                    <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                      Güvenli Pazar Yeri
                    </span>
                  </div>
                  <h1 className="text-gray-900 dark:text-white text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tighter">
                    Aradığınızı Değil,<br />
                    <span className="text-primary">En Uygun Teklifi</span> Bulun
                  </h1>
                  <h2 className="text-gray-500 dark:text-gray-400 text-base sm:text-lg font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
                    İhtiyacınızı girin, binlerce onaylı satıcıdan en iyi fiyat teklifleri anında cebinize gelsin.
                  </h2>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-2">
                  <Link href="/talep-olustur" className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-12 px-8 bg-primary hover:bg-blue-600 text-white text-base font-bold transition-all shadow-lg hover:shadow-primary/30">
                    Hemen Talep Oluştur
                  </Link>
                  <Link href="#nasil-calisir" className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-12 px-8 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-base font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
                    Nasıl Çalışır?
                  </Link>
                </div>
                <div className="flex items-center gap-4 pt-4 opacity-80 justify-center lg:justify-start w-full">
                  <div className="flex -space-x-3">
                    <div
                      className="size-8 rounded-full border-2 border-white dark:border-background-dark bg-gray-200"
                      style={{
                        backgroundImage: 'url("https://ui-avatars.com/api/?name=User+A&background=random")',
                        backgroundSize: "cover",
                      }}
                    ></div>
                    <div
                      className="size-8 rounded-full border-2 border-white dark:border-background-dark bg-gray-300"
                      style={{
                        backgroundImage: 'url("https://ui-avatars.com/api/?name=User+B&background=random")',
                        backgroundSize: "cover",
                      }}
                    ></div>
                    <div
                      className="size-8 rounded-full border-2 border-white dark:border-background-dark bg-gray-400"
                      style={{
                        backgroundImage: 'url("https://ui-avatars.com/api/?name=User+C&background=random")',
                        backgroundSize: "cover",
                      }}
                    ></div>
                  </div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    10,000+ Tamamlanan Talep
                  </p>
                </div>
              </div>
              {/* Hero Image */}
              <div className="w-full lg:w-1/2 relative mt-8 lg:mt-0">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl blur-2xl opacity-70"></div>
                <div
                  className="relative w-full aspect-[4/3] bg-center bg-no-repeat bg-cover rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
                  style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80")',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features / How it Works Section */}
        <div id="nasil-calisir" className="w-full bg-blue-50/50 dark:bg-slate-900/50 py-16 scroll-mt-24">
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
                {/* Connector Line (Desktop) */}
                <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-200 dark:bg-gray-700 -z-10"></div>
                
                {/* Step 1 */}
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
                
                {/* Step 2 */}
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
                
                {/* Step 3 */}
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

        {/* CTA Section */}
        <div className="w-full bg-background-light dark:bg-background-dark py-12">
          <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-40">
            <div className="bg-primary rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-blue-900/20 relative overflow-hidden">
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              
              <div className="flex flex-col gap-4 text-center md:text-left relative z-10 w-full">
                <h2 className="text-white text-2xl md:text-3xl font-bold">Hâlâ aradığını bulamadın mı?</h2>
                <p className="text-blue-100 text-base md:text-lg max-w-lg">
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
