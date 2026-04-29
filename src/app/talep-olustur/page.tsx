"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { 
  Package, 
  Truck, 
  Eye, 
  Pencil, 
  ChevronDown, 
  Upload, 
  ArrowRight, 
  Lightbulb, 
  CheckCircle, 
  ListChecks, 
  Camera, 
  Headphones 
} from "lucide-react";

export default function TalepOlustur() {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full bg-white dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-40 py-8 md:py-16 flex flex-col gap-8">
          {/* Page Header */}
          <div className="flex flex-col gap-2 text-center md:text-left">
            <h1 className="text-[#111318] dark:text-white tracking-tight text-3xl font-bold leading-tight">
              Yeni Talep Oluştur
            </h1>
            <p className="text-[#616e89] dark:text-gray-400 text-base font-normal">
              Satıcılardan en iyi teklifleri almak için ürün detaylarını girin.
            </p>
          </div>

          {/* Stepper */}
          <div className="w-full flex justify-center md:justify-start py-4">
            <div className="flex items-center w-full md:w-3/4 lg:w-2/3">
              <div className="flex flex-col items-center relative group cursor-default">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold shadow-lg shadow-primary/30 z-10 transition-transform hover:scale-105">
                  <Package size={20} />
                </div>
                <span className="absolute top-12 whitespace-nowrap text-sm font-bold text-primary">
                  Ürün & Özellikler
                </span>
              </div>

              <div className="flex-1 h-1 bg-primary/20 mx-2 relative">
                <div className="absolute left-0 top-0 h-full bg-primary w-1/3 rounded-full"></div>
              </div>

              <div className="flex flex-col items-center relative group cursor-default">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 flex items-center justify-center font-bold z-10">
                  <Truck size={20} />
                </div>
                <span className="absolute top-12 whitespace-nowrap text-sm font-medium text-gray-400 dark:text-gray-500">
                  Teslimat & Bütçe
                </span>
              </div>

              <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 mx-2 rounded-full"></div>

              <div className="flex flex-col items-center relative group cursor-default">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 flex items-center justify-center font-bold z-10">
                  <Eye size={20} />
                </div>
                <span className="absolute top-12 whitespace-nowrap text-sm font-medium text-gray-400 dark:text-gray-500">
                  Önizleme
                </span>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 pt-6">
            {/* Left Column: Form */}
            <div className="bg-white dark:bg-[#1a202c] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-gray-800 p-6 md:p-8">
              <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-col gap-2">
                  <label className="text-[#111318] dark:text-gray-200 text-sm font-medium leading-normal">
                    Ürün Adı <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      className="w-full rounded-lg border border-[#dbdee6] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#111318] dark:text-white px-4 py-3 text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-[#9ca3af]"
                      placeholder="Örn. iPhone 14 Pro Max 256GB"
                      type="text"
                    />
                    <Pencil size={20} className="absolute right-4 top-3.5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[#111318] dark:text-gray-200 text-sm font-medium leading-normal">
                    Kategori <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select className="w-full appearance-none rounded-lg border border-[#dbdee6] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#111318] dark:text-white px-4 py-3 text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer">
                      <option disabled selected value="">Kategori Seçiniz</option>
                      <option value="electronics">Elektronik</option>
                      <option value="furniture">Mobilya</option>
                      <option value="fashion">Giyim & Moda</option>
                      <option value="automotive">Otomotiv</option>
                    </select>
                    <ChevronDown size={20} className="absolute right-4 top-3.5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[#111318] dark:text-gray-200 text-sm font-medium leading-normal">
                    Detaylı Açıklama <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="w-full min-h-[140px] rounded-lg border border-[#dbdee6] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#111318] dark:text-white px-4 py-3 text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-[#9ca3af] resize-y"
                    placeholder="İhtiyacınız olan özellikleri, renk tercihini ve durumu (sıfır/ikinci el) belirtin..."
                  ></textarea>
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-right">0/1000 karakter</p>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[#111318] dark:text-gray-200 text-sm font-medium leading-normal">
                    Görsel Ekle (Opsiyonel)
                  </label>
                  <div className="border-2 border-dashed border-[#dbdee6] dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group">
                    <div className="size-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <Upload size={24} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Dosyaları buraya sürükleyin veya tıklayın</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG (Maks. 5MB)</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end pt-4 border-t border-gray-100 dark:border-gray-800 mt-2">
                  <button className="bg-primary hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20" type="submit">
                    Devam Et
                    <ArrowRight size={20} />
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Tips */}
            <div className="flex flex-col gap-6">
              <div className="bg-[#f0f9ff] dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-xl p-6 relative overflow-hidden">
                <Lightbulb size={120} className="absolute -right-6 -top-6 text-blue-500/5 dark:text-blue-400/5 pointer-events-none select-none" />
                <h3 className="text-lg font-bold text-[#111318] dark:text-white mb-4 relative z-10">Nasıl harika bir talep oluşturulur?</h3>
                <div className="flex flex-col gap-5 relative z-10">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 size-8 rounded-full bg-white dark:bg-blue-900/50 flex items-center justify-center text-primary shadow-sm">
                      <CheckCircle size={18} />
                    </div>
                    <div className="flex flex-col">
                      <h4 className="text-sm font-bold text-[#111318] dark:text-white">Net Olun</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Model ve marka belirtmek satıcıların işini kolaylaştırır.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 size-8 rounded-full bg-white dark:bg-blue-900/50 flex items-center justify-center text-primary shadow-sm">
                      <ListChecks size={18} />
                    </div>
                    <div className="flex flex-col">
                      <h4 className="text-sm font-bold text-[#111318] dark:text-white">Detay Verin</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Daha fazla detay eklemek <span className="font-bold text-primary">3 kat daha fazla</span> teklif getirir.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 size-8 rounded-full bg-white dark:bg-blue-900/50 flex items-center justify-center text-primary shadow-sm">
                      <Camera size={18} />
                    </div>
                    <div className="flex flex-col">
                      <h4 className="text-sm font-bold text-[#111318] dark:text-white">Görsel Ekleyin</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Örnek görseller satıcıların tam olarak ne istediğinizi anlamasına yardımcı olur.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#1a202c] border border-[#e5e7eb] dark:border-gray-800 rounded-xl p-6 flex flex-col items-center text-center gap-3">
                <div className="size-12 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 flex items-center justify-center mb-1">
                  <Headphones size={24} />
                </div>
                <h4 className="text-base font-bold text-[#111318] dark:text-white">Yardıma mı ihtiyacınız var?</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Talep oluştururken takıldığınız bir nokta olursa destek ekibimiz yanınızda.</p>
                <a className="text-sm font-semibold text-primary hover:underline mt-1" href="#">Canlı Destek Başlat</a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
