"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function HeroSection() {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) return null;

  return (
    <div className="w-full bg-white dark:bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-40 py-8 md:py-16">
        <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-16 items-center">
          {/* Content */}
          <div className="flex flex-col gap-6 flex-1 text-center lg:text-left items-center lg:items-start">
            <div className="flex flex-col gap-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 dark:bg-primary/20 w-fit mx-auto lg:mx-0">
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
              <Link href="/kayit" className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-12 px-8 bg-primary hover:bg-primary/85 text-white text-base font-bold transition-all shadow-lg hover:shadow-primary/30">
                Hemen Ücretsiz Başla
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
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-emerald-100 dark:from-primary/10 dark:to-emerald-900/20 rounded-2xl blur-2xl opacity-70"></div>
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
  );
}
