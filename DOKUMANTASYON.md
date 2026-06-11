# BanaSat - Proje Dokümantasyonu

Alıcı odaklı pazar yeri. Alıcı talep (ilan) oluşturur, satıcılar teklif verir,
alıcı teklifleri karşılaştırıp seçer, taraflar mesajlaşır.

---

## Genel Yapı

```
BanaSat/
├── src/                  # Frontend (Next.js 16 + React 19 + Tailwind v4)
├── Backend/              # Backend (NestJS 10 + Prisma 5 + PostgreSQL 16)
├── docker-compose.yml    # PostgreSQL + pgAdmin
└── DOKUMANTASYON.md
```

---

## Frontend

- **Teknoloji:** Next.js 16 (App Router), React 19, Tailwind CSS v4, lucide-react
- **Tema:** Açık/koyu mod (koyu modda saf siyah arka plan). Ana renk `#5BB678` (yeşil), beyaz.
- **Auth (simülasyon):** `AuthContext` ile giriş/kayıt/çıkış. Giriş yapmamış kullanıcı
  hero bölümünü ve Giriş/Kayıt butonlarını görür; giriş yapınca profil menüsü, mesajlar,
  talep oluştur görünür.
- **Responsive:** PC görünümü korunarak mobil uyumlu. Mobilde hamburger menü (sağ üst),
  tema butonu (sol üst), ortada logo. Kategoriler hamburger içinde açılır/kapanır.
- **Sayfalar:** Ana sayfa, Kategoriler, İlan detay (`/ilan/[id]`), Taleplerim, Tekliflerim,
  Talep oluştur, Teklif ver, Teklif karşılaştır, Mesajlar, Ödeme, Profil, Giriş, Kayıt.

### Önemli Frontend Bileşenleri
- `Navbar` — masaüstü ve mobil ayrı render; sabit (fixed) üst bar.
- `ListingCard` / `ListingCarousel` — ilan kartları; carousel mobilde dokunmatik kaydırma,
  her ekran boyutunda tam kart sayısı gösterir, oklar yalnızca masaüstünde.
- Taleplerim/Tekliflerim/Kategoriler — filtreleme + sıralama + kart grid (mobilde ikili).

---

## Backend

### Teknoloji ve Mimari
- **NestJS 10** (modüler, controller → service → Prisma katmanları)
- **Prisma 5** ORM, tek `schema.prisma` dosyasında tüm veri modeli
- **PostgreSQL 16** (Docker)
- **JWT** (access + refresh), **bcrypt**, **helmet**, **class-validator**

### Mimari İlkeler
- Her özellik kendi modülünde; iş mantığı serviste, HTTP controller'da.
- Tüm girdiler DTO + class-validator ile doğrulanır.
- Yanıtlar `{ success, data }`, hatalar `{ success: false, statusCode, message }`.
- Sırlar ortam değişkenlerinden gelir; uygulama açılışta env doğrular (fail-fast).
- Parola/token hash'leme tek sorumlu `HashingService`'te toplanır.

### Veri Modeli (Prisma)
`User`, `Category`, `Listing`, `ListingImage`, `Offer`, `Conversation`, `Message`,
`Order`, `Review` + enum'lar (`UserRole`, `ListingStatus`, `OfferStatus`, `OrderStatus`).

### Modüller ve Uç Noktalar

**Auth** (`/api/auth`)
- `POST /register` — kayıt + token
- `POST /login` — giriş + token
- `POST /refresh` — token yenileme (refresh token ile)
- `POST /logout` — çıkış (refresh token geçersizleşir)
- `GET /me` — giriş yapan kullanıcı profili
- Çift token (access 15dk + refresh 7gün), refresh token DB'de hash'li, token rotation.
- Global JWT guard; `@Public()` ile muafiyet.

**Users** (`/api/users`)
- `PATCH /me` — profil güncelle (ad, e-posta, telefon, bio, konum, avatar); e-posta benzersizlik kontrolü
- `PATCH /me/password` — parola değiştir (mevcut parola doğrulanır, oturumlar sıfırlanır)
- `POST /me/avatar` — profil fotoğrafı yükle (multipart, alan: `avatar`; JPEG/PNG/GIF/WEBP, max 5MB); eski dosya silinir
- `GET /:id` — herkese açık profil (e-posta/telefon gizli)

> Yüklenen dosyalar `/uploads/avatars/` altından statik sunulur (örn. `http://localhost:4000/uploads/avatars/<dosya>`).

**Categories** (`/api/categories`)
- `GET /` — tüm kategoriler + aktif ilan sayısı (public)
- `GET /:slug` — tek kategori (public)

**Listings / Talepler** (`/api/listings`)
- `GET /` — filtre (kategori, durum, arama, sahip) + sıralama (yeni/eski/en çok teklif/en çok görüntülenen) + sayfalama (public)
- `GET /:id` — detay; görüntülenme sayacını artırır (public)
- `POST /` — oluştur (sahip = giriş yapan)
- `PATCH /:id` — güncelle (yalnızca sahip)
- `DELETE /:id` — sil (yalnızca sahip)

**Offers / Teklifler** (`/api/offers`)
- `POST /` — teklif ver (kendi ilanına veremez, aktif ilana, ilana tek teklif)
- `GET /mine` — verdiğim teklifler (filtre + sıralama + sayfalama)
- `PATCH /:id/accept` — ilan sahibi kabul eder (teklif KABUL, ilan BEKLEMEDE — transaction)
- `PATCH /:id/reject` — ilan sahibi reddeder
- `PATCH /:id/withdraw` — satıcı geri çeker (yalnızca beklemede)

**Messages / Mesajlaşma** (`/api/conversations`)
- `POST /` — konuşma başlat/getir (ilan bağlamında, get-or-create)
- `GET /` — konuşmalarım (karşı taraf, son mesaj, okunmamış sayısı)
- `GET /:id` — konuşma + mesajlar (yalnızca katılımcılar)
- `POST /:id/messages` — mesaj gönder
- `PATCH /:id/read` — okundu işaretle

**Orders / Siparişler** (`/api/orders`)
- `POST /` — kabul edilmiş teklif için sipariş oluştur (yalnızca alıcı, tek sipariş)
- `POST /:id/pay` — ödeme (simülasyon); sipariş ODENDI, ilan TAMAMLANDI olur
- `GET /mine` — alımlarım
- `GET /sales` — satışlarım
- `GET /:id` — sipariş detayı (yalnızca alıcı/satıcı)
- `PATCH /:id/status` — durum ilerlet (ODENDI→HAZIRLANIYOR→KARGODA: satıcı, KARGODA→TESLIM_EDILDI: alıcı)
- `PATCH /:id/cancel` — iptal (yalnızca ödeme beklenirken)

**Reviews / Değerlendirmeler** (`/api/reviews`)
- `POST /` — teslim edilmiş sipariş için satıcıyı değerlendir (1-5 puan + yorum); satıcı rating ortalaması atomik güncellenir
- `GET /user/:userId` — bir kullanıcının aldığı değerlendirmeler (public)

**Health** (`/api/health`) — uygulama + veritabanı durumu (public).

---

## Kurulum ve Çalıştırma

```bash
# 1. Veritabanı (proje kök dizini)
docker compose up -d

# 2. Backend
cd Backend
npm install
# .env.example -> .env (varsayılanlar Docker ile uyumlu)
npm run prisma:migrate    # tabloları oluştur
npm run db:seed           # 24 kategoriyi yükle
npm run start:dev         # http://localhost:4000/api

# 3. Frontend (proje kök dizini)
npm install
npm run dev               # http://localhost:3000
```

---

## Yapılan İşlemler Günlüğü

### Frontend (tamamlandı)
- Navbar yeniden düzenlendi: kategori barı, Taleplerim/Tekliflerim, Talep Oluştur butonu.
- Renk paleti `#5BB678` yeşil + beyaz; logo entegrasyonu; koyu mod saf siyah.
- Ana sayfa: En Popüler İlanlar (carousel), Nasıl Çalışır, Son Eklenen İlanlar.
- Auth simülasyonu (`AuthContext`): giriş/kayıt/çıkış, role göre arayüz.
- Sayfalar: Giriş, Kayıt, Profil (avatar yükleme), Taleplerim, Tekliflerim (filtre/sıralama),
  Kategoriler (mock veri), dinamik İlan detay (`/ilan/[id]`).
- Tüm tasarım responsive yapıldı (PC görünümü korunarak); mobil hamburger menü.
- React hydration mismatch hataları giderildi.

### Backend (tamamlandı)
- **Altyapı:** Docker (PostgreSQL + pgAdmin), NestJS iskeleti, config doğrulama,
  global pipe/filter/interceptor, helmet, CORS, Prisma şeması + kategori seed.
- **Auth modülü:** JWT access/refresh, bcrypt, global guard, token rotation.
- **Categories modülü:** kategori listeleme (aktif ilan sayısıyla).
- **Listings modülü:** talep CRUD, filtreleme/sıralama/sayfalama, sahiplik kontrolü,
  görüntülenme sayacı.
- **Offers modülü:** teklif verme/kabul/red/geri çekme, iş kuralları, durum geçişleri.
- **Users modülü:** profil güncelleme, parola değiştirme, public profil; ortak
  `HashingService` refactor'ü.
- **Messages modülü:** konuşma (get-or-create), mesaj gönderme, okundu işaretleme,
  okunmamış sayacı, katılımcı yetki kontrolü.
- **Orders modülü:** kabul edilen teklif için sipariş, ödeme simülasyonu (ilan TAMAMLANDI),
  durum akışı (hazırlanıyor/kargoda/teslim edildi) aktör denetimiyle, alımlarım/satışlarım, iptal.
- **Reviews modülü:** teslim edilen sipariş sonrası satıcı değerlendirme (1-5 + yorum),
  satıcı rating ortalamasının atomik güncellenmesi, mükerrer engelleme. (Şema: Review'a
  orderId @unique eklendi — migration `add_review_order_relation`.)
- **Avatar yükleme:** multer ile disk depolama (`/uploads/avatars`), tip/boyut doğrulama,
  statik sunum (`useStaticAssets`), yeni yüklemede eski dosyanın silinmesi.

### Frontend-Backend Entegrasyonu (devam ediyor)
- **API katmanı** (`src/lib/api/`): `client.ts` (token yönetimi, otomatik refresh, hata),
  `services.ts` (tüm uç noktalar), `types.ts`, `adapters.ts`.
- `.env.local` → `NEXT_PUBLIC_API_URL=http://localhost:4000/api`
- **Bağlanan sayfalar:** Giriş, Kayıt, Çıkış (gerçek JWT); Ana sayfa (En Popüler/Son Eklenen
  ilanlar API'den); Talep Oluştur; İlan Detay (teklif ver/kabul/red, mesaj başlat); Profil
  (bilgi güncelleme + avatar yükleme); Taleplerim; Tekliflerim (geri çekme dahil); Kategoriler;
  Kullanıcı public profili (`/kullanici/[id]`); Mesajlaşma (gerçek zamanlıya yakın, polling ile).
- **JWT doğrulama:** access stratejisi her istekte kullanıcının DB'de var olduğunu kontrol eder
  (silinmiş kullanıcı 401 alır).

### Çalıştırma (geliştirme)
1. `docker compose up -d` (kök dizin)
2. `cd Backend && npm run start:dev`
3. `npm run dev` (kök dizin, frontend)

### Kategori Yeniden Düzenleme (alım-satım odaklı)
- Kategoriler hizmet ağırlıklı listeden alım-satım (ürün) odaklı listeye çevrildi.
  Öncelik ürünlerde; hizmetler sona alındı.
- **Yeni kategoriler (21):** Telefon & Aksesuar, Bilgisayar & Tablet, Elektronik,
  Beyaz Eşya, Küçük Ev Aletleri, Oyun & Konsol, Mobilya, Ev & Yaşam, Giyim & Moda,
  Anne & Bebek, Spor & Outdoor, Hobi & Oyuncak, Kitap-Film & Müzik, Otomotiv & Yedek Parça,
  Bahçe & Yapı Market, Kozmetik & Kişisel Bakım, Evcil Hayvan Ürünleri,
  Nakliye & Taşımacılık, Tadilat & Usta, Eğitim & Özel Ders, Diğer Hizmetler.
- **Güncellenen dosyalar:** `Backend/prisma/seed.ts` (kaynak), `src/components/layout/Navbar.tsx`,
  `src/app/kategoriler/page.tsx` (ikon eşlemesi + mock ilanlar), `src/components/layout/Footer.tsx`,
  `src/app/taleplerim/page.tsx`, `src/app/tekliflerim/page.tsx`, `src/data/listings.ts` (mock kategori eşlemesi).
- **DİKKAT:** Backend kategorileri DB'ye yansıması için seed tekrar çalıştırılmalı:
  `cd Backend && npm run db:seed`. (Seed upsert kullanır; eski kategoriler DB'de kalır,
  isterseniz manuel temizlenebilir.)
- Seed çalıştırıldı: 21 yeni kategori DB'ye yazıldı (sıfır DB, eski kategori yok).

### Ortam Notu (port çakışması)
- Host makinede 5432 portunda native bir PostgreSQL çalıştığı için docker postgres 5433'e
  maplendi. Kök dizinde `.env` → `POSTGRES_PORT=5433`, `Backend/.env` → `DATABASE_URL` portu 5433.
- `Backend/.env` docker-compose varsayılan kimlik bilgileriyle oluşturuldu (geliştirme).

## Mesajlaşmaya Teklif Entegrasyonu

Sohbet içinden gerçek teklif/karşı-teklif gönderme ve kabul/reddetme eklendi.

### Backend
- `schema.prisma`: `MessageType` enum (TEXT, OFFER); `Message` modeline `type` ve `offerId` (Offer'a SetNull); `Offer`'a `messages` ilişkisi. Migration: `20260610000000_add_message_offer`.
- `messages.service.ts`: Ortak `MESSAGE_SELECT` (offer bilgisi dahil) + `normalizeMessage` (Decimal→number). Yeni `sendOffer()` metodu: yalnızca satıcı taraf teklif sunar, ilan AKTIF olmalı, `Offer` upsert (varsa güncelle + BEKLEMEDE'ye al), OFFER tipi mesaj oluşturur.
- `messages.controller.ts`: `POST /conversations/:id/offer`.
- `dto/send-offer.dto.ts`: price (min 1), deliveryTime, note (opsiyonel).

### Frontend
- `types.ts`: `Message`'a `type` ve `offer` (MessageOfferRef) eklendi.
- `services.ts`: `messagesApi.sendOffer()`.
- `mesajlar/page.tsx`: Satıcı için header'da "Teklif Ver" butonu + modal (fiyat/teslim/not); OFFER mesajları özel kart olarak (tutar + durum etiketi); alıcı + teklif BEKLEMEDE ise Kabul/Reddet butonları (`offersApi.accept/reject`).

## Karşılıklı Teklif (Pazarlık) + Teklif Engelleme

### Backend
- `schema.prisma`: `Conversation`'a `offersBlocked` (default false). `Message`'a teklif anlık görüntüsü kolonları: `offerPrice`, `offerDeliveryTime`, `offerNote`. Migration: `20260611000000_offer_negotiation`.
- `messages.service.ts`:
  - `sendOffer`: artık hem alıcı hem satıcı gönderebilir (karşılıklı pazarlık). Teklif daima konuşmanın satıcısına ait tekil Offer kaydı üzerinden yürür (upsert). Her mesaj o anki fiyatı snapshot olarak saklar. `offersBlocked` ise reddedilir.
  - `acceptOffer`/`rejectOffer`: güncel BEKLEMEDE teklifi yanıtlar. Son teklifi gönderen kendi teklifini yanıtlayamaz (`getActiveOffer` kontrolü).
  - `setOffersBlocked`: yalnızca alıcı (ilan sahibi) teklif gönderimini açar/kapatır.
  - `MESSAGE_SELECT` ve `CONVERSATION_SELECT` snapshot + offersBlocked içerir.
- `messages.controller.ts`: `PATCH :id/offer/accept`, `PATCH :id/offer/reject`, `PATCH :id/block-offers`. Yeni `BlockOffersDto`.

### Frontend
- `types.ts`: `Message`'a snapshot alanları; `ConversationDetail`'e `offersBlocked`.
- `services.ts`: `acceptOffer`, `rejectOffer`, `setBlockOffers`.
- `mesajlar/page.tsx`:
  - Konuşma listesi okunmamış rozeti kırmızı (mesaj ikonuyla aynı).
  - Header: alıcı için "Teklifi Engelle/Engeli Kaldır"; satıcı için "Teklif Ver" (engelliyse gizli).
  - Teklif kartı ferah/profesyonel; snapshot fiyat gösterir. Son teklif + beklemede + gönderen ben değilsem üç buton: Reddet | Karşı Teklif | Kabul Et.
  - Karşı Teklif mevcut fiyatı modale ön doldurur. Engelliyse giriş üstünde bilgi şeridi.

## Uçtan Uca Teklif Akışı + Sipariş + Çok-İlanlı Engelleme

### İşleyiş
X talep açar → Y ilan detayından teklif verir → teklif sohbete OFFER mesajı olarak düşer (konuşma otomatik başlar, mesajlara yönlendirilir). Teklif kartında hangi ilana ait olduğu görünür. Taraflar sohbette karşılıklı teklifleşir; teklif sahibi kendi teklifini güncelleyebilir. Teklif kabul edilince ilgili teklif için sipariş oluşur ve "Siparişlerim" sayfasında görünür.

### Backend
- `schema.prisma`: `Conversation.offersBlocked` kaldırıldı. Yeni `OfferBlock` modeli (listingId, blockedUserId, unique). Migration: `20260611120000_offer_blocks`.
- `messages.service.ts`: `findOne` engel durumunu `OfferBlock`'tan türetir. `sendOffer` OfferBlock kontrolü yapar. `acceptOffer` kabulde otomatik `Order` oluşturur (upsert). `getOfferBlockOptions` (ilan sahibinin ilanları + engel durumu) ve `setOfferBlocks` (seçili ilanlara senkronize engel) eklendi.
- `messages.controller.ts`: `GET/PUT :id/offer-blocks`. Eski `block-offers` ve `BlockOffersDto` kaldırıldı; `SetOfferBlocksDto` eklendi.
- `offers.service.ts`: `create` OfferBlock kontrolü; `accept` kabulde otomatik `Order` oluşturur.

### Frontend
- `client.ts`: `api.put` eklendi.
- `types.ts`: `OfferBlockOptions` / `OfferBlockOptionListing`.
- `services.ts`: `offerBlockOptions`, `setOfferBlocks`.
- `ilan/[id]/page.tsx`: Teklif verme artık `createOrGet` + `sendOffer` ile sohbete düşer ve mesajlara yönlendirir.
- `mesajlar/page.tsx`: Teklif kartında ilgili ilan satırı (linkli). Yanıtlayan için "Karşı Teklif Ver" (tam genişlik) + Reddet/Kabul Et (ferah, profesyonel). Teklif sahibi için "Teklifi Güncelle". "Teklifi Engelle" artık modal açar: ilan sahibinin tüm ilanları, checkbox, "Hepsini Seç", İptal/Engelle.
- `siparislerim/page.tsx`: Yeni sayfa — Alımlarım/Satışlarım sekmeleri, sipariş kartları, ödeme bekleyen alımlar için "Ödemeyi Tamamla". Navbar profil menüsüne "Siparişlerim" eklendi.
