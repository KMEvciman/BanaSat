import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { 
  ChevronRight, 
  Printer, 
  Check, 
  Package, 
  Truck, 
  Home, 
  Copy, 
  MapPin, 
  Star, 
  Headphones 
} from "lucide-react";

export default function Taleplerim() {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full bg-white dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-40 py-8 md:py-16">
        {/* Page Heading & Status */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2 text-sm text-slate-500 dark:text-slate-400">
              <a className="hover:underline" href="#">Siparişlerim</a>
              <ChevronRight size={16} />
              <span>Detay</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Sipariş #123456 Takibi</h1>
            <p className="text-slate-600 dark:text-slate-400">Tahmini Teslimat: <span className="font-semibold text-slate-900 dark:text-white">27 Ekim 2023, Cuma</span></p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 dark:bg-gray-800 dark:text-slate-300 dark:border-gray-700 dark:hover:bg-gray-700 transition-colors">
              <Printer size={20} />
              Fatura Yazdır
            </button>
          </div>
        </div>

        {/* Progress Stepper (Timeline) */}
        <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-100 dark:border-gray-700 p-6 mb-8 overflow-x-auto">
          <div className="min-w-[700px]">
            <div className="relative flex items-center justify-between w-full">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 dark:bg-gray-700 -z-0 rounded-full transform -translate-y-1/2 px-10"></div>
              <div className="absolute top-1/2 left-0 w-[66%] h-1 bg-primary -z-0 rounded-full transform -translate-y-1/2 mx-10"></div>
              
              <div className="flex flex-col items-center relative z-10 group">
                <div className="size-10 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30 ring-4 ring-white dark:ring-gray-800">
                  <Check size={20} />
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Sipariş Alındı</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">24 Eki, 14:00</p>
                </div>
              </div>

              <div className="flex flex-col items-center relative z-10 group">
                <div className="size-10 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30 ring-4 ring-white dark:ring-gray-800">
                  <Package size={20} />
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Hazırlanıyor</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">25 Eki, 09:30</p>
                </div>
              </div>

              <div className="flex flex-col items-center relative z-10 group">
                <div className="size-12 rounded-full bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/40 ring-4 ring-white dark:ring-gray-800 scale-110 transition-transform">
                  <Truck size={24} className="animate-pulse" />
                </div>
                <div className="mt-4 text-center">
                  <p className="text-base font-bold text-primary">Kargoda</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">25 Eki, 16:45</p>
                  <span className="inline-block px-2 py-0.5 mt-1 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider rounded dark:bg-blue-900/30 dark:text-blue-300">Yolda</span>
                </div>
              </div>

              <div className="flex flex-col items-center relative z-10 group opacity-50">
                <div className="size-10 rounded-full bg-slate-200 dark:bg-gray-600 flex items-center justify-center text-slate-500 dark:text-slate-300 ring-4 ring-white dark:ring-gray-800">
                  <Home size={20} />
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Teslim Edildi</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Bekleniyor</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-100 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-gray-700 flex justify-between items-center bg-slate-50/50 dark:bg-gray-800">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Truck className="text-primary" size={20} />
                  Teslimat Bilgileri
                </h3>
                <a className="text-sm text-primary font-medium hover:underline" href="#">Kargo Sitesinde Gör</a>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-1">Kargo Firması</p>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-slate-200 dark:bg-gray-600 bg-cover bg-center" style={{ backgroundImage: "url('https://ui-avatars.com/api/?name=YK&background=random')" }}></div>
                    <p className="text-base font-medium text-slate-900 dark:text-white">Yurtiçi Kargo</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-1">Takip Numarası</p>
                  <div className="flex items-center gap-2">
                    <p className="text-base font-mono font-medium text-slate-900 dark:text-white">123987456TR</p>
                    <button className="text-slate-400 hover:text-primary transition-colors" title="Kopyala">
                      <Copy size={18} />
                    </button>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-1">Teslimat Adresi</p>
                  <div className="flex items-start gap-3">
                    <MapPin className="text-slate-400 mt-0.5" size={20} />
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">Ahmet Yılmaz</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                        Barbaros Mah. Lale Sok. No: 15, D: 4<br />
                        Ataşehir, İstanbul 34746
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full h-48 bg-slate-100 dark:bg-gray-700 relative group overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800')" }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                  <div className="bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2">
                    <span className="size-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-xs font-bold text-slate-800 dark:text-white">Transfer Merkezinde</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-100 dark:border-gray-700 p-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Son Hareketler</h3>
              <div className="space-y-6 relative pl-2">
                <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-gray-700"></div>
                <div className="relative flex items-start gap-4">
                  <div className="size-6 rounded-full bg-primary border-4 border-white dark:border-gray-800 z-10 shrink-0"></div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Transfer Merkezine Ulaştı</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">İstanbul Anadolu TM - Ataşehir, İstanbul</p>
                    <p className="text-xs text-slate-400 mt-1">Bugün, 16:45</p>
                  </div>
                </div>
                <div className="relative flex items-start gap-4">
                  <div className="size-6 rounded-full bg-slate-200 dark:bg-gray-600 border-4 border-white dark:border-gray-800 z-10 shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Kargoya Verildi</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Gönderi kargo firmasına teslim edildi.</p>
                    <p className="text-xs text-slate-400 mt-1">Bugün, 09:30</p>
                  </div>
                </div>
                <div className="relative flex items-start gap-4">
                  <div className="size-6 rounded-full bg-slate-200 dark:bg-gray-600 border-4 border-white dark:border-gray-800 z-10 shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Sipariş Hazırlandı</p>
                    <p className="text-xs text-slate-400 mt-1">Dün, 18:20</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-100 dark:border-gray-700 overflow-hidden sticky top-8">
              <div className="p-6 border-b border-slate-100 dark:border-gray-700">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">Sipariş Özeti</h3>
                <div className="flex gap-4">
                  <div className="size-20 bg-slate-100 dark:bg-gray-700 rounded-lg bg-cover bg-center shrink-0 border border-slate-200 dark:border-gray-600" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&q=80&w=200')" }}></div>
                  <div className="flex flex-col justify-between py-0.5">
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">iPhone 15 Pro Max 256GB - Natural Titanium</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Adet: 1</p>
                    </div>
                    <p className="text-sm font-bold text-primary">79.999 TL</p>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-slate-50/50 dark:bg-gray-800/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Ara Toplam</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">79.999 TL</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Kargo</span>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">Bedava</span>
                </div>
                <div className="h-px bg-slate-200 dark:bg-gray-700 mb-4"></div>
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-slate-900 dark:text-white">Toplam</span>
                  <span className="text-xl font-black text-slate-900 dark:text-white">79.999 TL</span>
                </div>
              </div>
              <div className="p-6 flex flex-col gap-3">
                <button className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-400 cursor-not-allowed rounded-lg py-3 text-sm font-bold transition-colors" disabled>
                  <Star size={20} />
                  Satıcıyı Değerlendir
                </button>
                <p className="text-xs text-center text-slate-400 dark:text-slate-500 px-2">Ürün teslim edildikten sonra değerlendirme yapabilirsiniz.</p>
                <button className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 dark:bg-gray-800 dark:border-gray-600 dark:text-slate-300 dark:hover:bg-gray-700 dark:hover:text-white rounded-lg py-3 text-sm font-bold transition-all mt-2">
                  <Headphones size={20} />
                  Destek Al
                </button>
              </div>
            </div>
          </div>
        </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
