import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { 
  Printer, 
  Share2, 
  Star, 
  Wallet, 
  Truck, 
  Zap, 
  Coins, 
  ShieldCheck, 
  RotateCcw, 
  Gift, 
  CheckCircle, 
  Info 
} from "lucide-react";

import Link from "next/link";

export default function TeklifKarsilastirma() {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full bg-white dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-40 py-8 md:py-16 flex flex-col gap-6">
        {/* Breadcrumbs */}
        <div className="flex flex-wrap gap-2 mb-6 text-sm">
          <a className="text-[#616e89] dark:text-gray-400 font-medium leading-normal hover:text-primary hover:underline" href="#">Ana Sayfa</a>
          <span className="text-[#616e89] dark:text-gray-400 font-medium leading-normal">/</span>
          <a className="text-[#616e89] dark:text-gray-400 font-medium leading-normal hover:text-primary hover:underline" href="#">Taleplerim</a>
          <span className="text-[#616e89] dark:text-gray-400 font-medium leading-normal">/</span>
          <a className="text-[#616e89] dark:text-gray-400 font-medium leading-normal hover:text-primary hover:underline" href="#">iPhone 15 Talebi</a>
          <span className="text-[#616e89] dark:text-gray-400 font-medium leading-normal">/</span>
          <span className="text-[#111318] dark:text-white font-semibold leading-normal">Karşılaştırma</span>
        </div>

        {/* Page Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-[#111318] dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">Teklifleri Karşılaştır</h1>
            <p className="text-[#616e89] dark:text-gray-400 text-base font-normal leading-normal max-w-2xl">
              Seçtiğiniz 3 teklifin detaylı özelliklerini yan yana karşılaştırın ve size en uygun olanı seçin.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#dbdee6] dark:border-[#3e4552] bg-white dark:bg-gray-900 text-[#111318] dark:text-white text-sm font-bold hover:bg-gray-50 dark:hover:bg-[#2a2f3d] transition-colors">
              <Printer size={20} />
              <span className="hidden sm:inline">Yazdır</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#dbdee6] dark:border-[#3e4552] bg-white dark:bg-gray-900 text-[#111318] dark:text-white text-sm font-bold hover:bg-gray-50 dark:hover:bg-[#2a2f3d] transition-colors">
              <Share2 size={20} />
              <span className="hidden sm:inline">Paylaş</span>
            </button>
          </div>
        </div>

        {/* Comparison Table Container */}
        <div className="overflow-x-auto pb-4 custom-scrollbar">
          <div className="min-w-[900px]">
            {/* Grid Setup: 4 Columns */}
            <div className="grid grid-cols-[220px_1fr_1fr_1fr] gap-4">
              
              {/* Header Row: Sellers */}
              <div className="pt-12 flex flex-col justify-end pb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#616e89] dark:text-gray-500 pl-2">Satıcı Bilgileri</span>
              </div>

              {/* Seller A */}
              <div className="relative flex flex-col items-center p-6 bg-white dark:bg-gray-900 rounded-t-xl border-x border-t border-[#dbdee6] dark:border-[#3e4552] shadow-sm">
                <div className="size-16 rounded-full bg-gray-100 mb-3 border border-gray-200 p-1">
                  <img className="w-full h-full object-cover rounded-full" src="https://ui-avatars.com/api/?name=Tekno+Store&background=random" alt="TeknoStore" />
                </div>
                <h3 className="text-lg font-bold text-[#111318] dark:text-white">TeknoStore</h3>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="text-yellow-400 fill-yellow-400" size={18} />
                  <span className="text-sm font-medium text-[#111318] dark:text-gray-200">4.8</span>
                  <span className="text-xs text-[#616e89] dark:text-gray-400">(120)</span>
                </div>
              </div>

              {/* Seller B (Recommended) */}
              <div className="relative flex flex-col items-center p-6 bg-white dark:bg-gray-900 rounded-t-xl border-x border-t-4 border-primary shadow-md z-10 -mt-2 pb-8">
                <div className="absolute -top-3 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">
                  En İyi Fiyat
                </div>
                <div className="size-16 rounded-full bg-gray-100 mb-3 border border-gray-200 p-1">
                  <img className="w-full h-full object-cover rounded-full" src="https://ui-avatars.com/api/?name=Mobil+Dunya&background=random" alt="MobilDünya" />
                </div>
                <h3 className="text-lg font-bold text-[#111318] dark:text-white">MobilDünya</h3>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="text-yellow-400 fill-yellow-400" size={18} />
                  <span className="text-sm font-medium text-[#111318] dark:text-gray-200">4.2</span>
                  <span className="text-xs text-[#616e89] dark:text-gray-400">(30)</span>
                </div>
              </div>

              {/* Seller C */}
              <div className="relative flex flex-col items-center p-6 bg-white dark:bg-gray-900 rounded-t-xl border-x border-t border-[#dbdee6] dark:border-[#3e4552] shadow-sm">
                <div className="size-16 rounded-full bg-gray-100 mb-3 border border-gray-200 p-1">
                  <img className="w-full h-full object-cover rounded-full" src="https://ui-avatars.com/api/?name=Hizli+Satici&background=random" alt="HızlıSatıcı" />
                </div>
                <h3 className="text-lg font-bold text-[#111318] dark:text-white">HızlıSatıcı</h3>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="text-yellow-400 fill-yellow-400" size={18} />
                  <span className="text-sm font-medium text-[#111318] dark:text-gray-200">4.9</span>
                  <span className="text-xs text-[#616e89] dark:text-gray-400">(500)</span>
                </div>
              </div>

              {/* Row: Price */}
              <div className="flex items-center pl-4 py-4 border-b border-[#dbdee6] dark:border-[#3e4552]">
                <div className="size-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mr-3 text-primary">
                  <Wallet size={20} />
                </div>
                <div>
                  <p className="font-bold text-[#111318] dark:text-white">Toplam Fiyat</p>
                  <p className="text-xs text-[#616e89] dark:text-gray-400">Vergiler dahil</p>
                </div>
              </div>
              <div className="flex items-center justify-center py-4 bg-white dark:bg-gray-900 border-x border-b border-[#dbdee6] dark:border-[#3e4552]">
                <span className="text-xl font-bold text-[#111318] dark:text-white">25.000 TL</span>
              </div>
              <div className="flex items-center justify-center py-4 bg-blue-50/30 dark:bg-blue-900/10 border-x border-b border-primary/20 relative">
                <span className="text-2xl font-black text-primary">24.500 TL</span>
                <span className="absolute top-2 right-2 text-[10px] font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded">En Düşük</span>
              </div>
              <div className="flex items-center justify-center py-4 bg-white dark:bg-gray-900 border-x border-b border-[#dbdee6] dark:border-[#3e4552]">
                <span className="text-xl font-bold text-[#111318] dark:text-white">26.000 TL</span>
              </div>

              {/* Row: Delivery Time */}
              <div className="flex items-center pl-4 py-4 border-b border-[#dbdee6] dark:border-[#3e4552]">
                <div className="size-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mr-3 text-[#616e89] dark:text-gray-400">
                  <Truck size={20} />
                </div>
                <p className="font-medium text-[#111318] dark:text-white text-sm">Teslimat Süresi</p>
              </div>
              <div className="flex items-center justify-center py-4 bg-white dark:bg-gray-900 border-x border-b border-[#dbdee6] dark:border-[#3e4552] text-sm font-medium">
                2 Gün
              </div>
              <div className="flex items-center justify-center py-4 bg-white dark:bg-gray-900 border-x border-b border-primary/20 text-sm font-medium">
                5 Gün
              </div>
              <div className="flex items-center justify-center py-4 bg-white dark:bg-gray-900 border-x border-b border-[#dbdee6] dark:border-[#3e4552] text-sm font-bold text-green-600">
                1 Gün
                <Zap size={16} className="ml-1 text-green-600" />
              </div>

              {/* Row: Shipping Cost */}
              <div className="flex items-center pl-4 py-4 border-b border-[#dbdee6] dark:border-[#3e4552]">
                <div className="size-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mr-3 text-[#616e89] dark:text-gray-400">
                  <Coins size={20} />
                </div>
                <p className="font-medium text-[#111318] dark:text-white text-sm">Kargo Ücreti</p>
              </div>
              <div className="flex items-center justify-center py-4 bg-gray-50 dark:bg-gray-900 border-x border-b border-[#dbdee6] dark:border-[#3e4552] text-sm font-bold text-green-600">
                Ücretsiz
              </div>
              <div className="flex items-center justify-center py-4 bg-blue-50/10 dark:bg-blue-900/5 border-x border-b border-primary/20 text-sm font-medium text-red-500">
                +50 TL
              </div>
              <div className="flex items-center justify-center py-4 bg-gray-50 dark:bg-gray-900 border-x border-b border-[#dbdee6] dark:border-[#3e4552] text-sm font-bold text-green-600">
                Ücretsiz
              </div>

              {/* Row: Warranty */}
              <div className="flex items-center pl-4 py-4 border-b border-[#dbdee6] dark:border-[#3e4552]">
                <div className="size-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mr-3 text-[#616e89] dark:text-gray-400">
                  <ShieldCheck size={20} />
                </div>
                <p className="font-medium text-[#111318] dark:text-white text-sm">Garanti</p>
              </div>
              <div className="flex items-center justify-center py-4 bg-white dark:bg-gray-900 border-x border-b border-[#dbdee6] dark:border-[#3e4552] text-sm text-[#616e89] dark:text-gray-300">
                2 Yıl TR Garantili
              </div>
              <div className="flex items-center justify-center py-4 bg-white dark:bg-gray-900 border-x border-b border-primary/20 text-sm text-[#616e89] dark:text-gray-300">
                1 Yıl İthalatçı
              </div>
              <div className="flex items-center justify-center py-4 bg-white dark:bg-gray-900 border-x border-b border-[#dbdee6] dark:border-[#3e4552] text-sm text-[#616e89] dark:text-gray-300">
                2 Yıl TR Garantili
              </div>

              {/* Row: Return Policy */}
              <div className="flex items-center pl-4 py-4 border-b border-[#dbdee6] dark:border-[#3e4552]">
                <div className="size-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mr-3 text-[#616e89] dark:text-gray-400">
                  <RotateCcw size={20} />
                </div>
                <p className="font-medium text-[#111318] dark:text-white text-sm">İade Politikası</p>
              </div>
              <div className="flex items-center justify-center py-4 bg-gray-50 dark:bg-gray-900 border-x border-b border-[#dbdee6] dark:border-[#3e4552] text-sm text-[#616e89] dark:text-gray-300">
                14 Gün
              </div>
              <div className="flex items-center justify-center py-4 bg-blue-50/10 dark:bg-blue-900/5 border-x border-b border-primary/20 text-sm text-[#616e89] dark:text-gray-300">
                7 Gün
              </div>
              <div className="flex items-center justify-center py-4 bg-gray-50 dark:bg-gray-900 border-x border-b border-[#dbdee6] dark:border-[#3e4552] text-sm font-medium text-green-600">
                30 Gün
              </div>

              {/* Row: Additional Feature */}
              <div className="flex items-center pl-4 py-4 border-b border-[#dbdee6] dark:border-[#3e4552]">
                <div className="size-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mr-3 text-[#616e89] dark:text-gray-400">
                  <Gift size={20} />
                </div>
                <p className="font-medium text-[#111318] dark:text-white text-sm">Hediye / Ekstra</p>
              </div>
              <div className="flex items-center justify-center py-4 bg-white dark:bg-gray-900 border-x border-b border-[#dbdee6] dark:border-[#3e4552] text-sm text-[#616e89] dark:text-gray-300">
                -
              </div>
              <div className="flex items-center justify-center py-4 bg-white dark:bg-gray-900 border-x border-b border-primary/20 text-sm text-[#616e89] dark:text-gray-300">
                -
              </div>
              <div className="flex items-center justify-center py-4 bg-white dark:bg-gray-900 border-x border-b border-[#dbdee6] dark:border-[#3e4552] text-sm font-medium text-primary">
                Kılıf Hediye
              </div>

              {/* Footer Row: Buttons */}
              <div className="pt-4"></div>
              
              <div className="p-4 bg-white dark:bg-gray-900 border-x border-b rounded-b-xl border-[#dbdee6] dark:border-[#3e4552] flex justify-center">
                <Link href="/odeme" className="w-full flex items-center justify-center h-12 bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-lg font-bold text-sm transition-all duration-200">
                  Teklifi Seç
                </Link>
              </div>
              <div className="p-4 bg-white dark:bg-gray-900 border-x border-b border-primary/20 rounded-b-xl shadow-lg relative z-10 flex justify-center">
                <Link href="/odeme" className="w-full flex items-center justify-center h-12 bg-primary text-white hover:bg-blue-700 rounded-lg font-bold text-base shadow-lg shadow-blue-500/30 transition-all duration-200 gap-2">
                  Teklifi Seç
                  <CheckCircle size={18} />
                </Link>
              </div>
              <div className="p-4 bg-white dark:bg-gray-900 border-x border-b rounded-b-xl border-[#dbdee6] dark:border-[#3e4552] flex justify-center">
                <Link href="/odeme" className="w-full flex items-center justify-center h-12 bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-lg font-bold text-sm transition-all duration-200">
                  Teklifi Seç
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Info / Disclaimer Section */}
        <div className="mt-8 flex flex-col md:flex-row gap-6 p-4 rounded-xl bg-blue-50 dark:bg-gray-900 border border-blue-100 dark:border-[#2a2f3d]">
          <div className="flex gap-4">
            <div className="size-10 min-w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-primary">
              <Info size={20} />
            </div>
            <div>
              <h4 className="font-bold text-[#111318] dark:text-white mb-1">Nasıl Karar Vermeliyim?</h4>
              <p className="text-sm text-[#616e89] dark:text-gray-400 leading-relaxed">
                Fiyat en önemli faktör gibi görünse de, <strong>Satıcı Puanı</strong> ve <strong>Garanti Koşulları</strong> uzun vadede daha kritik olabilir. MobilDünya fiyat avantajı sağlarken, HızlıSatıcı müşteri memnuniyeti ve teslimat hızında öne çıkıyor.
              </p>
            </div>
          </div>
        </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
