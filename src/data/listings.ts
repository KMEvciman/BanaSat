export interface ListingDetail {
  id: number;
  title: string;
  description: string;
  fullDescription: string;
  image: string;
  images: string[];
  category: string;
  budget: string;
  offers: number;
  views: number;
  status: "aktif" | "beklemede" | "tamamlandi" | "iptal";
  timeLeft: string;
  createdAt: string;
  location: string;
  owner: {
    name: string;
    avatar: string;
    rating: number;
    reviews: number;
  };
  teklifler: {
    id: number;
    sellerName: string;
    sellerAvatar: string;
    sellerRating: number;
    sellerReviews: number;
    verified: boolean;
    price: string;
    deliveryTime: string;
    warranty: string;
    note: string;
    badge?: string;
  }[];
}

export const allListings: ListingDetail[] = [
  {
    id: 1,
    title: "Projeksiyon Cihazı Kurulumu",
    description: "Ofisimiz için profesyonel projeksiyon ve ses sistemi kurulumu yaptırmak istiyoruz.",
    fullDescription: "Ofisimiz için profesyonel projeksiyon cihazı ve ses sistemi kurulumu yaptırmak istiyoruz. Toplantı odamız yaklaşık 40 metrekare. Projeksiyon perdesi, kablolama ve ses sistemi dahil komple kurulum teklifi bekliyoruz. Marka tercihi yoktur ancak kaliteli ve uzun ömürlü bir sistem istiyoruz.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAAilImTYeLMEVFPBZKBdj46Qd3ugDjFNfLmtcRlH-rxbYTub_TjOyui563WCG6Hhg8d9OfOKXADEn5cZuFeUMZTnSICh_pUWRnkuPclSQIS1bmTgHqPXpv0wqJoLt00ymJrS3QMd3gNgbOIoOrRVOl8RbwGzqKTrqGh_RBnnnmzq_QP-7GPw5UNUIFKrCuyqsZ0TPP76gSqEa87yygxegdLVe6hv_5NPRdLSPRJTCxnGOn1j9mg8-ZTFx-AWGTbbmlrbQGXfJZez4s",
    images: [
      "https://images.unsplash.com/photo-1581858326442-f875086d7dcd?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=400",
    ],
    category: "Hizmet",
    budget: "5.000 - 10.000 TL",
    offers: 12,
    views: 245,
    status: "aktif",
    timeLeft: "2 gün kaldı",
    createdAt: "25 Nisan 2026",
    location: "İstanbul, Kadıköy",
    owner: { name: "Mehmet K.", avatar: "https://ui-avatars.com/api/?name=Mehmet+K&background=5BB678&color=fff", rating: 4.6, reviews: 18 },
    teklifler: [
      { id: 101, sellerName: "Ahmet Usta Yapı", sellerAvatar: "https://ui-avatars.com/api/?name=Ahmet+Usta&background=random", sellerRating: 4.8, sellerReviews: 124, verified: true, price: "7.200₺", deliveryTime: "3 Gün", warranty: "2 Yıl Garanti", note: "Epson marka projeksiyon + 120 inç motorlu perde + ses sistemi kurulumu dahildir." },
      { id: 102, sellerName: "Modern Yapı", sellerAvatar: "https://ui-avatars.com/api/?name=Modern+Yapi&background=random", sellerRating: 5.0, sellerReviews: 210, verified: false, price: "8.500₺", deliveryTime: "2 Gün", warranty: "3 Yıl Garanti", note: "Premium marka projeksiyon ve Bose ses sistemi ile kurulum yapılacaktır.", badge: "En Yüksek Puan" },
    ],
  },
  {
    id: 2,
    title: "iPhone 15 Pro Max 256GB",
    description: "Sıfır veya temiz ikinci el iPhone 15 Pro Max arıyorum. Garanti tercihimdir.",
    fullDescription: "Sıfır veya çok temiz ikinci el iPhone 15 Pro Max 256GB arıyorum. Natural Titanium veya Black Titanium renk tercihimdir. Pil sağlığı %90 üzeri olmalı. Apple Türkiye garantisi olan cihazlara öncelik vereceğim. Kutusu ve aksesuarları tam olursa sevinirim.",
    image: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1592899677974-c460ce17e4bf?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1603791239531-1dda55e194a6?auto=format&fit=crop&q=80&w=400",
    ],
    category: "Elektronik",
    budget: "55.000 - 65.000 TL",
    offers: 8,
    views: 189,
    status: "aktif",
    timeLeft: "5 gün kaldı",
    createdAt: "22 Nisan 2026",
    location: "İstanbul, Beşiktaş",
    owner: { name: "Ahmet Y.", avatar: "https://ui-avatars.com/api/?name=Ahmet+Y&background=5BB678&color=fff", rating: 4.8, reviews: 12 },
    teklifler: [
      { id: 201, sellerName: "TeknoStore", sellerAvatar: "https://ui-avatars.com/api/?name=Tekno+Store&background=random", sellerRating: 4.8, sellerReviews: 120, verified: true, price: "58.500₺", deliveryTime: "1 Gün", warranty: "2 Yıl Apple TR", note: "Sıfır kutusunda, Apple Türkiye faturalı. Natural Titanium renk mevcuttur." },
      { id: 202, sellerName: "MobilDünya", sellerAvatar: "https://ui-avatars.com/api/?name=Mobil+Dunya&background=random", sellerRating: 4.2, sellerReviews: 30, verified: true, price: "56.000₺", deliveryTime: "2 Gün", warranty: "1 Yıl İthalatçı", note: "İthalatçı garantili, kutulu sıfır ürün.", badge: "En İyi Fiyat" },
    ],
  },
  {
    id: 3,
    title: "Kurumsal Web Sitesi Tasarımı",
    description: "Şirketimiz için modern, responsive ve SEO uyumlu kurumsal web sitesi yaptırmak istiyoruz.",
    fullDescription: "Şirketimiz için modern, responsive ve SEO uyumlu kurumsal web sitesi yaptırmak istiyoruz. 5-7 sayfa olacak. Hakkımızda, hizmetler, referanslar, blog ve iletişim sayfaları olmalı. Admin paneli ile içerik yönetimi yapabilmeliyiz. Hosting ve domain dahil olursa tercih sebebidir.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [],
    category: "Yazılım & IT",
    budget: "15.000 - 25.000 TL",
    offers: 21,
    views: 412,
    status: "aktif",
    timeLeft: "3 gün kaldı",
    createdAt: "20 Nisan 2026",
    location: "Uzaktan",
    owner: { name: "Zeynep D.", avatar: "https://ui-avatars.com/api/?name=Zeynep+D&background=5BB678&color=fff", rating: 4.9, reviews: 5 },
    teklifler: [
      { id: 301, sellerName: "WebCraft Studio", sellerAvatar: "https://ui-avatars.com/api/?name=WebCraft&background=random", sellerRating: 4.9, sellerReviews: 87, verified: true, price: "18.000₺", deliveryTime: "10 Gün", warranty: "1 Yıl Destek", note: "Next.js ile modern web sitesi, admin paneli, SEO ve 1 yıl hosting dahil." },
    ],
  },
  {
    id: 4,
    title: "İstanbul - Ankara Ev Taşıma",
    description: "3+1 dairemizin eşyalarını İstanbul'dan Ankara'ya profesyonel nakliye ile taşıtmak istiyoruz.",
    fullDescription: "3+1 dairemizin tüm eşyalarını İstanbul Ataşehir'den Ankara Çankaya'ya taşıtmak istiyoruz. Beyaz eşya, mobilya ve kişisel eşyalar dahil. Ambalajlama, söküm-montaj ve sigorta dahil teklif bekliyoruz.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [],
    category: "Nakliye & Taşımacılık",
    budget: "12.000 - 18.000 TL",
    offers: 6,
    views: 98,
    status: "beklemede",
    timeLeft: "1 gün kaldı",
    createdAt: "18 Nisan 2026",
    location: "İstanbul → Ankara",
    owner: { name: "Ali R.", avatar: "https://ui-avatars.com/api/?name=Ali+R&background=5BB678&color=fff", rating: 4.3, reviews: 7 },
    teklifler: [],
  },
  {
    id: 5,
    title: "Lise Matematik Özel Ders",
    description: "11. sınıf öğrencisi için haftada 3 gün matematik özel ders verecek deneyimli öğretmen arıyorum.",
    fullDescription: "11. sınıf öğrencim için haftada 3 gün, birer saatlik matematik özel ders verecek deneyimli bir öğretmen arıyorum. YKS hazırlığına yönelik, konu anlatımı ve soru çözümü yapılmalı. Yüz yüze veya online olabilir.",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [],
    category: "Eğitim & Özel Ders",
    budget: "800 - 1.200 TL/Saat",
    offers: 4,
    views: 67,
    status: "aktif",
    timeLeft: "4 gün kaldı",
    createdAt: "15 Nisan 2026",
    location: "İstanbul, Beşiktaş",
    owner: { name: "Fatma S.", avatar: "https://ui-avatars.com/api/?name=Fatma+S&background=5BB678&color=fff", rating: 5.0, reviews: 2 },
    teklifler: [],
  },
  {
    id: 6,
    title: "Bahçe Peyzaj Düzenlemesi",
    description: "Villa bahçemiz için komple peyzaj tasarımı ve uygulama hizmeti arıyoruz.",
    fullDescription: "Villa bahçemiz (yaklaşık 200m²) için komple peyzaj tasarımı ve uygulama hizmeti arıyoruz. Çim serimi, otomatik sulama sistemi, aydınlatma ve bitkilendirme dahil olmalı.",
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [],
    category: "Bahçe & Peyzaj",
    budget: "20.000 - 35.000 TL",
    offers: 3,
    views: 54,
    status: "tamamlandi",
    timeLeft: "Süresi doldu",
    createdAt: "10 Nisan 2026",
    location: "İstanbul, Sarıyer",
    owner: { name: "Emre T.", avatar: "https://ui-avatars.com/api/?name=Emre+T&background=5BB678&color=fff", rating: 4.7, reviews: 9 },
    teklifler: [],
  },
  {
    id: 7,
    title: "Düğün Fotoğrafçısı",
    description: "Ağustos ayında yapılacak düğünümüz için profesyonel fotoğraf ve drone çekimi.",
    fullDescription: "Ağustos 2026'da İstanbul'da yapılacak düğünümüz için profesyonel fotoğraf ve drone çekimi hizmeti arıyoruz. Gelin hazırlığından düğün sonuna kadar tüm süreç dahil olmalı.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [],
    category: "Fotoğraf & Video",
    budget: "8.000 - 15.000 TL",
    offers: 0,
    views: 23,
    status: "aktif",
    timeLeft: "7 gün kaldı",
    createdAt: "28 Nisan 2026",
    location: "İstanbul",
    owner: { name: "Selin A.", avatar: "https://ui-avatars.com/api/?name=Selin+A&background=5BB678&color=fff", rating: 4.5, reviews: 3 },
    teklifler: [],
  },
  {
    id: 8,
    title: "Klima Montajı (3 Adet)",
    description: "Evimize 3 adet inverter klima alımı ve montajı için uygun fiyat teklifi bekliyorum.",
    fullDescription: "Evimize 3 adet inverter klima (9000+12000+18000 BTU) alımı ve montajı için teklif bekliyoruz. Dış ünite yerleşimi ve bakır boru dahil olmalı.",
    image: "https://images.unsplash.com/photo-1631545806609-35d4ae440431?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [],
    category: "Tadilat & Dekorasyon",
    budget: "30.000 - 45.000 TL",
    offers: 5,
    views: 112,
    status: "iptal",
    timeLeft: "İptal edildi",
    createdAt: "5 Nisan 2026",
    location: "Ankara, Çankaya",
    owner: { name: "Can B.", avatar: "https://ui-avatars.com/api/?name=Can+B&background=5BB678&color=fff", rating: 4.1, reviews: 4 },
    teklifler: [],
  },
  {
    id: 9,
    title: "İngilizce Çeviri (50 Sayfa)",
    description: "Akademik makale çevirisi için profesyonel ve alanında uzman çevirmen arıyorum.",
    fullDescription: "Tıp alanında 50 sayfalık akademik makale çevirisi için profesyonel çevirmen arıyorum. Kaynak dil İngilizce, hedef dil Türkçe. Tıbbi terminolojiye hakim olunmalı. Redaksiyon dahil olmalı.",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [],
    category: "Çeviri & Redaksiyon",
    budget: "3.000 - 5.000 TL",
    offers: 9,
    views: 156,
    status: "tamamlandi",
    timeLeft: "Tamamlandı",
    createdAt: "1 Nisan 2026",
    location: "Uzaktan",
    owner: { name: "Dr. Ayşe M.", avatar: "https://ui-avatars.com/api/?name=Ayse+M&background=5BB678&color=fff", rating: 4.9, reviews: 15 },
    teklifler: [],
  },
  {
    id: 10,
    title: "Kedi Bakım & Pansiyon",
    description: "Tatil süresince (10 gün) 2 kedimiz için güvenilir pansiyon hizmeti arıyoruz.",
    fullDescription: "10 günlük tatilimiz süresince 2 kedimiz (British Shorthair, 3 ve 5 yaşında) için güvenilir ev tipi pansiyon hizmeti arıyoruz. Günlük fotoğraf/video güncellemesi bekliyoruz.",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [],
    category: "Evcil Hayvan",
    budget: "1.500 - 3.000 TL",
    offers: 2,
    views: 41,
    status: "aktif",
    timeLeft: "5 gün kaldı",
    createdAt: "27 Nisan 2026",
    location: "İstanbul, Kadıköy",
    owner: { name: "Deniz K.", avatar: "https://ui-avatars.com/api/?name=Deniz+K&background=5BB678&color=fff", rating: 4.4, reviews: 6 },
    teklifler: [],
  },
];

export function getListingById(id: number): ListingDetail | undefined {
  return allListings.find((l) => l.id === id);
}
