import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/HeroSection";
import HomeListings from "@/components/home/HomeListings";
import { FileText, MailCheck, BadgeCheck } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="flex-1 w-full">
        {/* Hero Section - Giriş yapmamış kullanıcılar için */}
        <HeroSection />

        {/* En Popüler + Son Eklenen İlanlar (API'den) */}
        <HomeListings />

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
