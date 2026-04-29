"use client";

import { 
  ShoppingBag, 
  Lock, 
  HelpCircle, 
  User, 
  ChevronRight, 
  Truck, 
  ChevronDown, 
  CreditCard, 
  Landmark, 
  Laptop, 
  BadgeCheck, 
  ArrowRight,
  Headphones
} from "lucide-react";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export default function OdemeEkrani() {
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col pt-0">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 w-full bg-white dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-40 py-8 md:py-16">
        {/* Breadcrumbs */}
        <nav className="flex mb-6 text-sm font-medium text-gray-500 dark:text-gray-400">
          <ol className="flex items-center space-x-2">
            <li><Link href="/talep-olustur" className="hover:text-primary transition-colors">Talep Oluştur</Link></li>
            <li><ChevronRight size={16} /></li>
            <li><Link href="/teklif-karsilastir" className="hover:text-primary transition-colors">Teklif Seçimi</Link></li>
            <li><ChevronRight size={16} /></li>
            <li aria-current="page" className="text-[#111318] dark:text-white font-semibold">Ödeme Yap</li>
          </ol>
        </nav>

        {/* Page Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#111318] dark:text-white tracking-tight">Güvenli Ödeme</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Siparişinizi tamamlamak için teslimat ve ödeme bilgilerinizi giriniz.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Forms */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Shipping Address */}
            <section className="bg-white dark:bg-[#1a202c] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
                <div className="size-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary">
                  <Truck size={20} />
                </div>
                <h2 className="text-xl font-bold text-[#111318] dark:text-white">Teslimat Adresi</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[#111318] dark:text-gray-200">Ad</label>
                  <input className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-[#111318] dark:text-white h-12 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm placeholder:text-gray-400 outline-none" placeholder="Ali" type="text" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[#111318] dark:text-gray-200">Soyad</label>
                  <input className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-[#111318] dark:text-white h-12 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm placeholder:text-gray-400 outline-none" placeholder="Yılmaz" type="text" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[#111318] dark:text-gray-200">Telefon</label>
                  <input className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-[#111318] dark:text-white h-12 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm placeholder:text-gray-400 outline-none" placeholder="05XX XXX XX XX" type="tel" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[#111318] dark:text-gray-200">Şehir</label>
                  <div className="relative">
                    <select className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-[#111318] dark:text-white h-12 px-4 pr-10 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm appearance-none cursor-pointer outline-none">
                      <option>İstanbul</option>
                      <option>Ankara</option>
                      <option>İzmir</option>
                      <option>Bursa</option>
                      <option>Antalya</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                      <ChevronDown size={20} />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[#111318] dark:text-gray-200">İlçe</label>
                  <div className="relative">
                    <select className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-[#111318] dark:text-white h-12 px-4 pr-10 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm appearance-none cursor-pointer outline-none">
                      <option>Kadıköy</option>
                      <option>Beşiktaş</option>
                      <option>Şişli</option>
                      <option>Üsküdar</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                      <ChevronDown size={20} />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[#111318] dark:text-gray-200">Posta Kodu</label>
                  <input className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-[#111318] dark:text-white h-12 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm placeholder:text-gray-400 outline-none" placeholder="34000" type="text" />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm font-semibold text-[#111318] dark:text-gray-200">Açık Adres</label>
                  <textarea className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-[#111318] dark:text-white p-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm resize-none placeholder:text-gray-400 outline-none" placeholder="Mahalle, Cadde, Sokak, Kapı No, Daire No..." rows={3}></textarea>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-2">
                <input className="rounded border-gray-300 text-primary focus:ring-primary dark:bg-gray-800 dark:border-gray-600 size-5" id="saveAddress" type="checkbox" />
                <label className="text-sm text-gray-600 dark:text-gray-300 cursor-pointer select-none" htmlFor="saveAddress">Bu adresi sonraki siparişlerim için kaydet</label>
              </div>
            </section>

            {/* Payment Section */}
            <section className="bg-white dark:bg-[#1a202c] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 md:p-8">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary">
                    <CreditCard size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-[#111318] dark:text-white">Ödeme Yöntemi</h2>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-400 dark:text-gray-500 text-xs font-medium border border-gray-200 dark:border-gray-700 px-2 py-1 rounded">SSL Secured</span>
                </div>
              </div>

              {/* Payment Tabs */}
              <div className="flex gap-4 mb-8">
                <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border-2 border-primary text-primary font-bold shadow-sm transition-all outline-none">
                  <CreditCard size={20} />
                  Kredi / Banka Kartı
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all outline-none">
                  <Landmark size={20} />
                  Havale / EFT
                </button>
              </div>

              {/* Card Form */}
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[#111318] dark:text-gray-200">Kart Üzerindeki İsim</label>
                  <input className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-[#111318] dark:text-white h-12 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm placeholder:text-gray-400 uppercase outline-none" placeholder="AD SOYAD" type="text" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[#111318] dark:text-gray-200">Kart Numarası</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CreditCard size={20} className="text-gray-400" />
                    </div>
                    <input className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-[#111318] dark:text-white h-12 pl-10 pr-12 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm placeholder:text-gray-400 font-mono tracking-wider outline-none" placeholder="0000 0000 0000 0000" type="text" />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1 pointer-events-none">
                      <div className="h-5 w-8 bg-gray-200 dark:bg-gray-600 rounded"></div>
                      <div className="h-5 w-8 bg-gray-200 dark:bg-gray-600 rounded"></div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-[#111318] dark:text-gray-200">Son Kullanma Tarihi</label>
                    <input className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-[#111318] dark:text-white h-12 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm placeholder:text-gray-400 text-center outline-none" placeholder="AA / YY" type="text" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-[#111318] dark:text-gray-200 flex items-center gap-1">
                      CVV / CVC
                      <span title="Kartın arkasındaki 3 haneli kod">
                        <HelpCircle size={16} className="text-gray-400 cursor-help" />
                      </span>
                    </label>
                    <div className="relative">
                      <input className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-[#111318] dark:text-white h-12 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm placeholder:text-gray-400 text-center outline-none" placeholder="123" type="text" />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Lock size={18} className="text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer border border-primary/20">
                    <div className="size-5 rounded-full border-2 border-primary bg-primary flex items-center justify-center">
                      <div className="size-2 rounded-full bg-white"></div>
                    </div>
                    <div className="flex-1 text-sm font-medium text-gray-900 dark:text-white">Tek Çekim</div>
                    <div className="font-bold text-gray-900 dark:text-white">86.500,00 TL</div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Summary */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-24 space-y-6">
              
              {/* Order Summary Card */}
              <div className="bg-white dark:bg-[#1a202c] rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                  <h3 className="text-lg font-bold text-[#111318] dark:text-white">Sipariş Özeti</h3>
                </div>
                <div className="p-6">
                  
                  <div className="flex gap-4 mb-6">
                    <div className="w-20 h-20 rounded-lg bg-gray-100 dark:bg-gray-700 flex-shrink-0 overflow-hidden relative border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-400">
                      <Laptop size={32} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-[#111318] dark:text-white leading-tight mb-1">MacBook Pro M3 Max - 16 inç (Gümüş)</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Satıcı: <span className="text-primary font-medium hover:underline cursor-pointer">Teknoloji Dünyası</span></p>
                      <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded w-fit">
                        <BadgeCheck size={14} />
                        Onaylı Satıcı
                      </div>
                    </div>
                  </div>

                  {/* Cost Breakdown */}
                  <div className="space-y-3 pt-6 border-t border-dashed border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                      <span>Teklif Tutarı</span>
                      <span className="font-medium text-[#111318] dark:text-white">85.000,00 TL</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                      <span>Hizmet Bedeli &amp; Kargo</span>
                      <span className="font-medium text-[#111318] dark:text-white">1.500,00 TL</span>
                    </div>
                    <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                      <span>İndirim (Hoşgeldin)</span>
                      <span className="font-medium">- 500,00 TL</span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-end mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Toplam Tutar</p>
                      <p className="text-xs text-gray-400 font-normal">KDV Dahil</p>
                    </div>
                    <div className="text-2xl font-bold text-primary tracking-tight">86.000 TL</div>
                  </div>

                  {/* Agreement Checkbox */}
                  <div className="mt-6 mb-4 flex items-start gap-3">
                    <input className="mt-1 rounded border-gray-300 text-primary focus:ring-primary dark:bg-gray-800 dark:border-gray-600 size-4" id="terms" type="checkbox" />
                    <label className="text-xs text-gray-500 dark:text-gray-400 leading-snug cursor-pointer select-none" htmlFor="terms">
                      <Link href="#" className="text-[#111318] dark:text-white font-medium hover:underline">Mesafeli Satış Sözleşmesi</Link>&apos;ni ve <Link href="#" className="text-[#111318] dark:text-white font-medium hover:underline">Ön Bilgilendirme Formu</Link>&apos;nu okudum, onaylıyorum.
                    </label>
                  </div>

                  {/* CTA Button */}
                  <button className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group">
                    <span>Ödemeyi Tamamla</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>

                  {/* Trust Badges */}
                  <div className="mt-6 flex flex-col items-center gap-3">
                    <div className="flex gap-2 opacity-60 grayscale hover:grayscale-0 transition-all duration-300 cursor-default">
                      <div className="h-6 w-10 bg-blue-900 rounded flex items-center justify-center text-[8px] text-white font-bold">VISA</div>
                      <div className="h-6 w-10 bg-red-600 rounded flex items-center justify-center text-[8px] text-white font-bold">MC</div>
                      <div className="h-6 w-10 bg-blue-400 rounded flex items-center justify-center text-[8px] text-white font-bold">AMEX</div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400 dark:text-gray-500 font-medium text-center">
                      <Lock size={14} />
                      Bilgileriniz 256-bit SSL sertifikası ile korunmaktadır.
                    </div>
                  </div>
                </div>
              </div>

              {/* Support Card */}
              <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-4 border border-blue-100 dark:border-blue-900/30 flex items-start gap-3">
                <Headphones className="text-primary mt-1" size={20} />
                <div>
                  <h5 className="text-sm font-bold text-primary dark:text-blue-400 mb-1">Yardıma mı ihtiyacınız var?</h5>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">Ödeme sırasında sorun yaşarsanız <Link href="#" className="underline font-medium hover:text-primary">Canlı Destek</Link> hattımıza bağlanabilirsiniz.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </main>

      {/* Simplified Footer specific for secure pages (or use global one) */}
      <Footer />
    </div>
  );
}
