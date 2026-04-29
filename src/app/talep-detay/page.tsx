"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { 
  Wallet, 
  MapPin, 
  Calendar, 
  Filter, 
  ArrowDownWideNarrow, 
  Check, 
  Star, 
  BadgeCheck, 
  Clock, 
  ShieldCheck, 
  MessageCircle, 
  Award, 
  Zap, 
  X 
} from "lucide-react";
import { useState } from "react";

export default function TalepDetay() {
  const [showComparison, setShowComparison] = useState(true);

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full bg-white dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-40 py-8 md:py-16 flex flex-col gap-6">
        {/* Breadcrumbs */}
        <nav className="flex flex-wrap gap-2 text-sm">
          <a className="text-gray-500 hover:text-primary transition-colors" href="#">Anasayfa</a>
          <span className="text-gray-400">/</span>
          <a className="text-gray-500 hover:text-primary transition-colors" href="#">Taleplerim</a>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 dark:text-gray-100 font-medium">Talep #10234</span>
        </nav>

        {/* Top Section */}
        <section className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">Talep #10234: Ev Tadilatı</h1>
                <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-xs font-bold rounded-full uppercase tracking-wider">Aktif</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Oluşturulma Tarihi: 10 Ekim 2023</p>
            </div>
            {/* Action Buttons */}
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Düzenle
              </button>
              <button className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-white dark:bg-gray-800 border border-red-200 dark:border-red-900 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                İptal Et
              </button>
            </div>
          </div>

          {/* Details Card */}
          <div className="bg-white dark:bg-[#1a202c] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1 flex flex-col gap-6">
                <div>
                  <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-3">Talep Detayları</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-primary rounded-lg">
                        <Wallet size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Bütçe Aralığı</p>
                        <p className="font-bold text-gray-900 dark:text-white">15.000₺ - 20.000₺</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-primary rounded-lg">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Konum</p>
                        <p className="font-bold text-gray-900 dark:text-white">Kadıköy, İstanbul</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-primary rounded-lg">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Bitiş Tarihi</p>
                        <p className="font-bold text-gray-900 dark:text-white">30 Ekim 2023</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-2">Açıklama</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                    3+1 dairemin salon ve mutfak boyası yenilenecek. Ayrıca mutfak dolaplarında ufak tamirat işleri var. Malzemeler bana ait olacak, sadece işçilik teklifi istiyorum.
                  </p>
                </div>
              </div>
              <div className="lg:w-1/3 w-full">
                <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-3">Fotoğraflar</h3>
                <div className="grid grid-cols-2 gap-2 aspect-[4/3] rounded-xl overflow-hidden">
                  <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1581858326442-f875086d7dcd?auto=format&fit=crop&q=80&w=400')" }}></div>
                  <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=400')" }}></div>
                  <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=400')" }}></div>
                  <div className="relative w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400')" }}>
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-sm">
                      +2
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr className="border-gray-200 dark:border-gray-800 my-2" />

        {/* Filter & Sort Toolbar */}
        <section className="sticky top-[72px] z-40 bg-background-light dark:bg-background-dark py-2">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Gelen Teklifler
              <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">3</span>
            </h3>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white dark:bg-[#1a202c] border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-200">
                <Filter size={18} />
                Filtrele
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white dark:bg-[#1a202c] border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-200">
                <ArrowDownWideNarrow size={18} />
                Sırala: Önerilen
              </button>
            </div>
          </div>
        </section>

        {/* Offers List */}
        <section className="flex flex-col gap-4 pb-20">
          {/* Card 1 */}
          <article className="bg-white dark:bg-[#1a202c] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow duration-200 overflow-hidden">
            <div className="p-5 flex flex-col md:flex-row gap-6">
              <div className="flex md:flex-col items-center md:items-start gap-4 md:w-48 md:border-r md:border-gray-100 dark:md:border-gray-800 md:pr-4">
                <div className="relative">
                  <div className="size-16 rounded-full bg-cover bg-center border-2 border-white dark:border-gray-700 shadow-sm" style={{ backgroundImage: "url('https://ui-avatars.com/api/?name=Ahmet+Usta&background=random')" }}></div>
                  <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-0.5 rounded-full border-2 border-white dark:border-gray-800">
                    <Check size={14} />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Ahmet Usta Yapı</h4>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="text-yellow-400 fill-yellow-400" size={18} />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">4.8</span>
                    <span className="text-xs text-gray-500">(124 yorum)</span>
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded">
                    <BadgeCheck size={14} />
                    Onaylı Satıcı
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-between gap-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Teklif Fiyatı</p>
                    <p className="text-3xl font-black text-primary tracking-tight">16.500₺</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm font-medium">
                      <Clock size={16} /> Teslimat: 5 Gün
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-sm font-medium">
                      <ShieldCheck size={16} /> 2 Yıl Garanti
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                  &quot;Merhaba, talebinizi inceledim. Belirttiğiniz işleri ekibimle 5 gün içinde tamamlayabiliriz. Kullandığımız boya markası...&quot;
                </p>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/30 px-5 py-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input className="size-4 rounded border-gray-300 text-primary focus:ring-primary" type="checkbox" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-primary transition-colors">Karşılaştır</span>
              </label>
              <div className="flex gap-3">
                <button className="px-5 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm font-semibold border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  Profili Gör
                </button>
                <Link href="/mesajlar" className="px-5 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 dark:shadow-none flex items-center gap-2">
                  <MessageCircle size={18} />
                  Mesaj Gönder
                </Link>
              </div>
            </div>
          </article>

          {/* Card 3 (Best Rated) */}
          <article className="relative bg-white dark:bg-[#1a202c] rounded-xl shadow-sm border border-orange-200 dark:border-orange-900 hover:shadow-md transition-shadow duration-200 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-red-500"></div>
            <div className="p-5 flex flex-col md:flex-row gap-6">
              <div className="flex md:flex-col items-center md:items-start gap-4 md:w-48 md:border-r md:border-gray-100 dark:md:border-gray-800 md:pr-4">
                <div className="relative">
                  <div className="size-16 rounded-full bg-cover bg-center border-2 border-white dark:border-gray-700 shadow-sm" style={{ backgroundImage: "url('https://ui-avatars.com/api/?name=Modern+Yapi&background=random')" }}></div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Modern Yapı</h4>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="text-yellow-400 fill-yellow-400" size={18} />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">5.0</span>
                    <span className="text-xs text-gray-500">(210 yorum)</span>
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs rounded border border-orange-100 dark:border-orange-800">
                    <Award size={14} />
                    En Yüksek Puan
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-between gap-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Teklif Fiyatı</p>
                    <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">18.000₺</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-sm font-medium">
                      <Zap size={16} />
                      Teslimat: 3 Gün
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                  &quot;Profesyonel ekibimizle en hızlı çözümü sunuyoruz. Duvar kağıdı sökümü ve saten alçı uygulaması fiyata dahildir.&quot;
                </p>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/30 px-5 py-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input className="size-4 rounded border-gray-300 text-primary focus:ring-primary" type="checkbox" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-primary transition-colors">Karşılaştır</span>
              </label>
              <div className="flex gap-3">
                <button className="px-5 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm font-semibold border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  Profili Gör
                </button>
                <Link href="/mesajlar" className="px-5 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 dark:shadow-none flex items-center gap-2">
                  <MessageCircle size={18} />
                  Mesaj Gönder
                </Link>
              </div>
            </div>
          </article>
        </section>

        {/* Floating Action Bar */}
        {showComparison && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-xl shadow-black/20 flex items-center gap-6 z-50 cursor-pointer">
            <span className="text-sm font-medium">2 Teklif Seçildi</span>
            <button className="bg-primary hover:bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-bold transition-colors">
              Karşılaştır
            </button>
            <button onClick={() => setShowComparison(false)} className="text-gray-400 hover:text-white">
              <X size={18} className="block" />
            </button>
          </div>
        )}
        </div>
      </main>
      <Footer />
    </>
  );
}
