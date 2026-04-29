"use client";

import { 
  Store, 
  Clock, 
  Wallet, 
  MapPin, 
  FileText, 
  CheckCircle, 
  Bold, 
  Italic, 
  List, 
  Link as LinkIcon, 
  UploadCloud, 
  Send, 
  Info 
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function SaticiTeklifVer() {
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen">
      <Navbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-40 py-8 md:py-16">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black leading-tight tracking-tight mb-2 text-[#111318] dark:text-white">Teklif Oluştur</h1>
          <p className="text-[#616e89] dark:text-slate-400 text-base">Alıcının talebine uygun en iyi teklifi hazırlayın ve gönderin.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Request Context */}
          <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-[#e5e7eb] dark:border-[#2d3748] overflow-hidden">
              <div className="p-6 pb-4 border-b border-[#f0f1f4] dark:border-[#2d3748]">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-xl font-bold leading-snug text-[#111318] dark:text-white">iPhone 13 Pro Max - 256GB - Grafit</h2>
                  <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Aktif Talep</span>
                </div>
                <p className="text-xs text-[#616e89] dark:text-slate-400 mt-2 flex items-center gap-1">
                  <Clock size={14} />
                  Yayınlanma: 2 saat önce
                </p>
              </div>

              <div className="grid grid-cols-3 gap-1 p-1 bg-[#f9fafb] dark:bg-gray-900">
                <div className="aspect-square bg-center bg-cover rounded-lg col-span-2 row-span-2" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&q=80&w=400')" }}></div>
                <div className="aspect-square bg-center bg-cover rounded-lg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1603791239531-1dda55e194a6?auto=format&fit=crop&q=80&w=200')" }}></div>
                <div className="aspect-square bg-center bg-cover rounded-lg relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1592899677974-c460ce17e4bf?auto=format&fit=crop&q=80&w=200')" }}>
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg">
                    <span className="text-white font-medium text-sm">+2</span>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Wallet size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#616e89] dark:text-slate-400">Bütçe Aralığı</p>
                    <p className="text-base font-bold text-[#111318] dark:text-white">25.000 TL - 28.000 TL</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#616e89] dark:text-slate-400">Konum</p>
                    <p className="text-base font-bold text-[#111318] dark:text-white">Kadıköy, İstanbul</p>
                  </div>
                </div>
                <div className="pt-5 border-t border-[#f0f1f4] dark:border-[#2d3748]">
                  <p className="text-sm font-medium text-[#616e89] dark:text-slate-400 mb-2">Alıcı Notu</p>
                  <div className="bg-[#f6f6f8] dark:bg-gray-900 p-4 rounded-lg">
                    <p className="text-sm leading-relaxed text-[#111318] dark:text-slate-200">
                      &quot;Merhaba, öğrenciyim ve çizim yapabileceğim temiz bir cihaz arıyorum. Ekranı çiziksiz, pili %85 üzeri olması tercihimdir. Kutusu ve faturası duruyorsa lütfen belirtin. Şimdiden teşekkürler.&quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Offer Form */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={(e) => e.preventDefault()} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-[#e5e7eb] dark:border-[#2d3748] p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#f0f1f4] dark:border-[#2d3748]">
                <FileText size={24} className="text-primary" />
                <h3 className="text-lg font-bold text-[#111318] dark:text-white">Teklif Detayları</h3>
              </div>

              {/* Price Input */}
              <div className="mb-8">
                <label htmlFor="price" className="block text-sm font-medium mb-2 text-[#111318] dark:text-white">Teklif Fiyatı (KDV Dahil)</label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">₺</span>
                  </div>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    className="block w-full rounded-lg border-0 py-4 pl-8 pr-12 text-[#111318] dark:text-white dark:bg-slate-800 ring-1 ring-inset ring-gray-300 dark:ring-slate-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-xl font-bold"
                    placeholder="0.00"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 sm:text-sm" id="price-currency">TL</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-[#616e89] dark:text-slate-400 flex items-center gap-1">
                  <Info size={16} />
                  Komisyon oranı %10 olarak hesaplanacaktır.
                </p>
              </div>

              {/* Logistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="delivery_time" className="block text-sm font-medium mb-2 text-[#111318] dark:text-white">Teslimat Süresi</label>
                  <select id="delivery_time" className="block w-full rounded-lg border-0 py-3 pl-3 pr-10 text-[#111318] dark:text-white dark:bg-slate-800 ring-1 ring-inset ring-gray-300 dark:ring-slate-600 focus:ring-2 focus:ring-primary sm:text-sm">
                    <option>Hemen Teslim</option>
                    <option>1 İş Günü</option>
                    <option>2-3 İş Günü</option>
                    <option>4-7 İş Günü</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="shipping_cost" className="block text-sm font-medium mb-2 text-[#111318] dark:text-white">Kargo Ücreti</label>
                  <select id="shipping_cost" className="block w-full rounded-lg border-0 py-3 pl-3 pr-10 text-[#111318] dark:text-white dark:bg-slate-800 ring-1 ring-inset ring-gray-300 dark:ring-slate-600 focus:ring-2 focus:ring-primary sm:text-sm">
                    <option>Satıcı Öder (Ücretsiz Kargo)</option>
                    <option>Alıcı Öder</option>
                  </select>
                </div>
              </div>

              {/* Warranty */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3 text-[#111318] dark:text-white">Garanti / İade Koşulları</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="relative flex cursor-pointer rounded-lg border bg-white dark:bg-slate-800 p-4 shadow-sm ring-1 ring-gray-300 dark:ring-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 has-[:checked]:ring-2 has-[:checked]:ring-primary has-[:checked]:bg-primary/5">
                    <input type="radio" name="warranty" value="official" className="sr-only" defaultChecked />
                    <span className="flex flex-col">
                      <span className="block text-sm font-medium text-gray-900 dark:text-white">Resmi Garanti</span>
                      <span className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">Min. 12 ay</span>
                    </span>
                    <CheckCircle className="text-primary has-[:checked]:block hidden absolute top-4 right-4" size={20} />
                  </label>
                  <label className="relative flex cursor-pointer rounded-lg border bg-white dark:bg-slate-800 p-4 shadow-sm ring-1 ring-gray-300 dark:ring-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 has-[:checked]:ring-2 has-[:checked]:ring-primary has-[:checked]:bg-primary/5">
                    <input type="radio" name="warranty" value="seller" className="sr-only" />
                    <span className="flex flex-col">
                      <span className="block text-sm font-medium text-gray-900 dark:text-white">Satıcı Garantisi</span>
                      <span className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">Mağaza kapsamı</span>
                    </span>
                    <CheckCircle className="text-primary has-[:checked]:block hidden absolute top-4 right-4" size={20} />
                  </label>
                  <label className="relative flex cursor-pointer rounded-lg border bg-white dark:bg-slate-800 p-4 shadow-sm ring-1 ring-gray-300 dark:ring-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 has-[:checked]:ring-2 has-[:checked]:ring-primary has-[:checked]:bg-primary/5">
                    <input type="radio" name="warranty" value="none" className="sr-only" />
                    <span className="flex flex-col">
                      <span className="block text-sm font-medium text-gray-900 dark:text-white">Garantisiz</span>
                      <span className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">Sadece iade hakkı</span>
                    </span>
                    <CheckCircle className="text-primary has-[:checked]:block hidden absolute top-4 right-4" size={20} />
                  </label>
                </div>
              </div>

              {/* Rich Text Editor */}
              <div className="mb-8">
                <label htmlFor="seller_note" className="block text-sm font-medium mb-2 text-[#111318] dark:text-white">Satıcı Notu</label>
                <div className="rounded-lg border border-gray-300 dark:border-slate-600 overflow-hidden focus-within:ring-1 focus-within:ring-primary focus-within:border-primary">
                  <div className="flex items-center gap-1 border-b border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 p-2">
                    <button type="button" className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300"><Bold size={20} /></button>
                    <button type="button" className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300"><Italic size={20} /></button>
                    <button type="button" className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300"><List size={20} /></button>
                    <div className="w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1"></div>
                    <button type="button" className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300"><LinkIcon size={20} /></button>
                  </div>
                  <textarea id="seller_note" rows={5} className="block w-full border-0 p-3 text-gray-900 dark:text-white dark:bg-slate-800 placeholder:text-gray-400 focus:ring-0 sm:text-sm" placeholder="Ürün durumu, ekstra aksesuarlar veya size özel avantajlardan bahsedin..."></textarea>
                </div>
              </div>

              {/* File Attachment */}
              <div className="mb-8">
                <label className="block text-sm font-medium mb-2 text-[#111318] dark:text-white">Dosya / Görsel Ekle</label>
                <div className="flex justify-center rounded-lg border border-dashed border-gray-300 dark:border-slate-600 px-6 py-8 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group/upload">
                  <div className="text-center">
                    <UploadCloud size={48} className="mx-auto text-gray-300 group-hover/upload:text-primary transition-colors" />
                    <div className="mt-4 flex text-sm leading-6 text-gray-600 dark:text-gray-400 justify-center">
                      <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-transparent font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary hover:text-blue-500">
                        <span>Dosya Yükle</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                      </label>
                      <p className="pl-1">veya sürükle bırak</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600 dark:text-gray-500">PNG, JPG, PDF (max. 10MB)</p>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#f0f1f4] dark:border-[#2d3748]">
                <div className="flex items-center">
                  <input id="save-draft" name="save-draft" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                  <label htmlFor="save-draft" className="ml-2 block text-sm text-gray-900 dark:text-white">Teklifi taslak olarak kaydet</label>
                </div>
                <div className="flex w-full sm:w-auto gap-4">
                  <button type="button" className="w-full sm:w-auto rounded-lg px-6 py-3 text-sm font-semibold text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700">İptal</button>
                  <button type="submit" className="w-full sm:w-auto rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 flex items-center justify-center gap-2">
                    <Send size={20} />
                    Teklifi Gönder
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
