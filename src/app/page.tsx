import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { FileText, MailCheck, BadgeCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="flex-1 w-full">
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

        {/* Recent Requests Section */}
        <div className="w-full bg-white dark:bg-background-dark py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-40 flex flex-col gap-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <h2 className="text-gray-900 dark:text-white text-2xl font-bold leading-tight tracking-tight">
                Son Eklenen Talepler
              </h2>
              <Link className="text-primary text-sm font-semibold hover:underline flex items-center gap-1" href="/taleplerim">
                Tümünü Gör <ArrowRight size={16} />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1 */}
              <div className="flex flex-col rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group">
                <div className="relative w-full aspect-video overflow-hidden">
                  <div
                    className="w-full h-full bg-center bg-no-repeat bg-cover group-hover:scale-105 transition-transform duration-500"
                    style={{
                      backgroundImage: 'url("https://images.unsplash.com/photo-1632661674596-df8be070a5c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80")',
                    }}
                  ></div>
                  <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-gray-900 dark:text-white shadow-sm">
                    Elektronik
                  </div>
                </div>
                <div className="flex flex-col p-4 gap-3 flex-1">
                  <div className="flex-1">
                    <h3 className="text-gray-900 dark:text-white text-base font-bold leading-tight line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                      iPhone 13 Pro 128GB - Sıfır
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">İstanbul, Kadıköy</p>
                  </div>
                  <div className="flex flex-col gap-2 border-t border-gray-100 dark:border-gray-700 pt-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Bütçe:</span>
                      <span className="font-bold text-gray-900 dark:text-white">25.000₺ - 30.000₺</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Teklifler:</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium text-xs">
                        5 Teklif
                      </span>
                    </div>
                  </div>
                  <Link href="/satici/teklif-ver" className="w-full mt-1 flex cursor-pointer items-center justify-center rounded-lg h-9 bg-primary/10 hover:bg-primary hover:text-white text-primary text-sm font-semibold transition-colors">
                    Teklif Ver
                  </Link>
                </div>
              </div>

              {/* Card 2 */}
              <div className="flex flex-col rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group">
                <div className="relative w-full aspect-video overflow-hidden">
                  <div
                    className="w-full h-full bg-center bg-no-repeat bg-cover group-hover:scale-105 transition-transform duration-500"
                    style={{
                      backgroundImage: 'url("https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80")',
                    }}
                  ></div>
                  <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-gray-900 dark:text-white shadow-sm">
                    Yazılım
                  </div>
                </div>
                <div className="flex flex-col p-4 gap-3 flex-1">
                  <div className="flex-1">
                    <h3 className="text-gray-900 dark:text-white text-base font-bold leading-tight line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                      Kurumsal Web Sitesi Tasarımı
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Uzaktan / Remote</p>
                  </div>
                  <div className="flex flex-col gap-2 border-t border-gray-100 dark:border-gray-700 pt-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Bütçe:</span>
                      <span className="font-bold text-gray-900 dark:text-white">10.000₺ - 15.000₺</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Teklifler:</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium text-xs">
                        12 Teklif
                      </span>
                    </div>
                  </div>
                  <Link href="/satici/teklif-ver" className="w-full mt-1 flex cursor-pointer items-center justify-center rounded-lg h-9 bg-primary/10 hover:bg-primary hover:text-white text-primary text-sm font-semibold transition-colors">
                    Teklif Ver
                  </Link>
                </div>
              </div>

              {/* Card 3 */}
              <div className="flex flex-col rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group">
                <div className="relative w-full aspect-video overflow-hidden">
                  <div
                    className="w-full h-full bg-center bg-no-repeat bg-cover group-hover:scale-105 transition-transform duration-500"
                    style={{
                      backgroundImage: 'url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80")',
                    }}
                  ></div>
                  <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-gray-900 dark:text-white shadow-sm">
                    Nakliye
                  </div>
                </div>
                <div className="flex flex-col p-4 gap-3 flex-1">
                  <div className="flex-1">
                    <h3 className="text-gray-900 dark:text-white text-base font-bold leading-tight line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                      İstanbul - Ankara Ev Taşıma
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">3+1 Daire</p>
                  </div>
                  <div className="flex flex-col gap-2 border-t border-gray-100 dark:border-gray-700 pt-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Bütçe:</span>
                      <span className="font-bold text-gray-900 dark:text-white">15.000₺ - 20.000₺</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Teklifler:</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium text-xs">
                        3 Teklif
                      </span>
                    </div>
                  </div>
                  <Link href="/satici/teklif-ver" className="w-full mt-1 flex cursor-pointer items-center justify-center rounded-lg h-9 bg-primary/10 hover:bg-primary hover:text-white text-primary text-sm font-semibold transition-colors">
                    Teklif Ver
                  </Link>
                </div>
              </div>

              {/* Card 4 */}
              <div className="flex flex-col rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group">
                <div className="relative w-full aspect-video overflow-hidden">
                  <div
                    className="w-full h-full bg-center bg-no-repeat bg-cover group-hover:scale-105 transition-transform duration-500"
                    style={{
                      backgroundImage: 'url("https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80")',
                    }}
                  ></div>
                  <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-gray-900 dark:text-white shadow-sm">
                    Eğitim
                  </div>
                </div>
                <div className="flex flex-col p-4 gap-3 flex-1">
                  <div className="flex-1">
                    <h3 className="text-gray-900 dark:text-white text-base font-bold leading-tight line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                      Lise Takviye Matematik Özel Ders
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Beşiktaş, İstanbul</p>
                  </div>
                  <div className="flex flex-col gap-2 border-t border-gray-100 dark:border-gray-700 pt-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Bütçe:</span>
                      <span className="font-bold text-gray-900 dark:text-white">750₺ / Saat</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Teklifler:</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium text-xs">
                        Henüz Yok
                      </span>
                    </div>
                  </div>
                  <Link href="/satici/teklif-ver" className="w-full mt-1 flex cursor-pointer items-center justify-center rounded-lg h-9 bg-primary/10 hover:bg-primary hover:text-white text-primary text-sm font-semibold transition-colors">
                    İlk Teklifi Ver
                  </Link>
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
