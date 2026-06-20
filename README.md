# BanaSat

**BanaSat**, alıcı odaklı (ters) bir pazar yeridir. Klasik pazar yerlerinin aksine ürünleri satıcılar değil, **alıcılar** listeler: Alıcı bir **talep** (ihtiyaç) oluşturur, satıcılar bu talebe **teklif** verir, alıcı en uygun teklifi seçer ve taraflar mesajlaşıp ödemeyi tamamlar.

> "Aradığınızı değil, en uygun teklifi bulun."

## İçindekiler

- [Amaç ve Çalışma Mantığı](#amaç-ve-çalışma-mantığı)
- [Özellikler](#özellikler)
- [Teknoloji Yığını](#teknoloji-yığını)
- [Proje Yapısı](#proje-yapısı)
- [Gereksinimler](#gereksinimler)
- [Kurulum](#kurulum)
  - [1. Veritabanı (Docker)](#1-veritabanı-docker)
  - [2. Backend (NestJS)](#2-backend-nestjs)
  - [3. Web (Next.js)](#3-web-nextjs)
  - [4. Mobil (Expo)](#4-mobil-expo)
- [Ortam Değişkenleri (.env Örnekleri)](#ortam-değişkenleri-env-örnekleri)
- [Faydalı Komutlar](#faydalı-komutlar)
- [Notlar ve Sık Karşılaşılan Sorunlar](#notlar-ve-sık-karşılaşılan-sorunlar)

## Amaç ve Çalışma Mantığı

1. **Talep oluşturma:** Alıcı; başlık, açıklama, kategori, bütçe, konum (il/ilçe) ve kapak görseli ile bir talep yayınlar.
2. **Teklif verme:** Satıcılar talebe fiyat ve not içeren teklif gönderir. Karşı teklif (pazarlık) desteklenir.
3. **İletişim:** Taraflar talep üzerinden mesajlaşır; teklifler mesajlaşma akışına entegredir.
4. **Anlaşma ve ödeme:** Alıcı teklifi kabul edince sipariş oluşur; alıcı "Ödemeye Geç" ile ödemeyi (simülasyon) tamamlar.
5. **Tamamlama:** Sipariş tamamlanır, taraflar birbirini değerlendirebilir.

## Özellikler

- Kullanıcı kaydı/girişi (JWT access + refresh token)
- Talep (ilan) oluşturma, düzenleme, silme; kapak ve galeri görseli yükleme
- Kategoriler ve gelişmiş filtreleme (kategori, il, arama, sıralama)
- Konuma ve teklif geçmişine göre kişiselleştirilmiş öneriler
- Teklif verme, karşı teklif, kabul/ret, geri çekme
- Gerçek zamanlıya yakın mesajlaşma (polling) ve teklif engelleme
- Sipariş ve ödeme akışı (simülasyon)
- Profil yönetimi, avatar yükleme, çoklu adres
- 81 il ve tüm ilçeler
- Açık/koyu tema
- Web (Next.js) ve mobil (React Native/Expo) istemciler — **aynı backend ve veritabanını** kullanır

## Teknoloji Yığını

| Katman | Teknolojiler |
|--------|--------------|
| **Web** | Next.js 16 (App Router), React 19, Tailwind CSS v4, lucide-react |
| **Backend** | NestJS 10, Prisma 5, PostgreSQL 16, JWT (passport-jwt), bcrypt, helmet |
| **Mobil** | React Native 0.81, Expo SDK 54, expo-router, NativeWind v4, expo-secure-store, expo-image-picker |
| **Altyapı** | Docker (PostgreSQL + pgAdmin) |

## Proje Yapısı

```
BanaSat/
├── src/                  # Web (Next.js) uygulaması
│   ├── app/              # Sayfalar (App Router)
│   ├── components/       # Paylaşılan bileşenler
│   ├── context/          # Auth, Theme context'leri
│   └── lib/api/          # API istemcisi ve servisler
├── Backend/              # NestJS API
│   ├── src/modules/      # auth, users, listings, offers, messages, orders, reviews, categories, locations, uploads
│   ├── prisma/           # schema.prisma, migrations, seed.ts
│   └── .env.example      # Backend ortam değişkenleri örneği
├── MOBILE/               # React Native (Expo) uygulaması
│   ├── app/              # Ekranlar (expo-router)
│   ├── components/        # TopBar, BottomNav, KeyboardAware, ListingCard ...
│   ├── context/          # Auth, Theme
│   └── lib/api/          # API istemcisi, servisler, tipler
└── docker-compose.yml    # PostgreSQL + pgAdmin
```

## Gereksinimler

- **Node.js** 20+
- **npm** (veya eşdeğeri)
- **Docker** ve **Docker Compose** (veritabanı için)
- Mobil için: **Expo Go** (SDK 54 uyumlu) yüklü bir cihaz veya emülatör

## Kurulum

Sırasıyla: veritabanı → backend → web/mobil.

### 1. Veritabanı (Docker)

Proje kökünde PostgreSQL'i (ve opsiyonel pgAdmin'i) başlatın:

```bash
docker compose up -d
```

- PostgreSQL: `localhost:5432` (kullanıcı: `banasat`, şifre: `banasat_dev_password`, db: `banasat`)
- pgAdmin (opsiyonel): http://localhost:5050

> Değerleri kök dizinde bir `.env` dosyasıyla özelleştirebilirsiniz (POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, POSTGRES_PORT, PGADMIN_EMAIL, PGADMIN_PASSWORD, PGADMIN_PORT). Belirtilmezse yukarıdaki varsayılanlar kullanılır.

### 2. Backend (NestJS)

```bash
cd Backend
npm install

# .env dosyasını oluşturun (aşağıdaki örneğe bakın)
cp .env.example .env

# Prisma client üret + migration'ları uygula
npm run prisma:generate
npm run prisma:deploy

# Örnek verileri yükle (kategoriler, iller vb.)
npm run db:seed

# Geliştirme sunucusunu başlat
npm run start:dev
```

Backend `http://localhost:4000/api` adresinde çalışır. Yüklenen dosyalar `http://localhost:4000/uploads/...` altında sunulur.

> **Not:** `prisma migrate dev` etkileşimli çalışır ve takılabilir. CI/otomatik ortamlarda `npm run prisma:deploy` (yani `prisma migrate deploy`) tercih edin.

### 3. Web (Next.js)

```bash
# proje kökünde
npm install

# Ortam değişkeni dosyası (aşağıdaki örneğe bakın)
# .env.local oluşturun

npm run dev
```

Web uygulaması http://localhost:3000 adresinde açılır.

### 4. Mobil (Expo)

```bash
cd MOBILE
npm install

# Önemli: app.json içindeki extra.apiUrl değerini ayarlayın (aşağıya bakın)

npx expo start -c
```

Çıkan QR kodunu **Expo Go** ile tarayın.

> **Önemli (fiziksel cihaz):** Telefon `localhost`'a erişemez. Backend ile aynı ağdaki **bilgisayarınızın LAN IP'sini** kullanın (ör. `http://192.168.1.35:4000/api`). Bilgisayarınızın IP'sini `ipconfig` (Windows) ile öğrenebilirsiniz.

## Ortam Değişkenleri (.env Örnekleri)

### Backend — `Backend/.env`

```dotenv
# Uygulama
NODE_ENV=development
PORT=4000
# Backend'in herkese açık adresi (yüklenen dosya URL'leri için)
APP_URL=http://localhost:4000
# Frontend'in çalıştığı adres (CORS için)
CORS_ORIGIN=http://localhost:3000

# Veritabanı (docker-compose.yml ile uyumlu)
# Format: postgresql://KULLANICI:SIFRE@HOST:PORT/VERITABANI?schema=public
DATABASE_URL=postgresql://banasat:banasat_dev_password@localhost:5432/banasat?schema=public

# JWT - Üretimde mutlaka güçlü, rastgele değerlerle değiştirin!
JWT_ACCESS_SECRET=degistir_bu_access_secret_uzun_ve_rastgele_olmali
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=degistir_bu_refresh_secret_uzun_ve_rastgele_olmali
JWT_REFRESH_EXPIRES_IN=7d

# Bcrypt
BCRYPT_SALT_ROUNDS=12
```

### Web — `.env.local` (proje kökü)

```dotenv
# Web istemcinin bağlanacağı backend API adresi
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### Veritabanı (opsiyonel) — `.env` (proje kökü, docker-compose için)

```dotenv
POSTGRES_USER=banasat
POSTGRES_PASSWORD=banasat_dev_password
POSTGRES_DB=banasat
POSTGRES_PORT=5432
PGADMIN_EMAIL=admin@banasat.com
PGADMIN_PASSWORD=admin
PGADMIN_PORT=5050
```

### Mobil — `MOBILE/app.json`

Mobil uygulama `.env` kullanmaz; API adresi `app.json` içindeki `expo.extra.apiUrl` alanından okunur:

```json
{
  "expo": {
    "extra": {
      "apiUrl": "http://192.168.1.35:4000/api"
    }
  }
}
```

> Emülatörde `apiUrl` için Android `http://10.0.2.2:4000/api`, fiziksel cihazda bilgisayarın LAN IP'si kullanılır. Değişiklik sonrası Expo'yu `npx expo start -c` ile yeniden başlatın.

## Faydalı Komutlar

**Web (kök):**

| Komut | Açıklama |
|-------|----------|
| `npm run dev` | Geliştirme sunucusu (http://localhost:3000) |
| `npm run build` | Üretim derlemesi |
| `npm run start` | Üretim sunucusu |
| `npm run lint` | Lint |

**Backend (`Backend/`):**

| Komut | Açıklama |
|-------|----------|
| `npm run start:dev` | İzlemeli geliştirme sunucusu |
| `npm run prisma:generate` | Prisma client üret |
| `npm run prisma:deploy` | Migration'ları uygula |
| `npm run prisma:studio` | Prisma Studio (DB görsel arayüz) |
| `npm run db:seed` | Örnek verileri yükle |
| `npm run build` | Derleme |

**Mobil (`MOBILE/`):**

| Komut | Açıklama |
|-------|----------|
| `npx expo start -c` | Metro bundler (cache temizleyerek) |
| `npm run android` | Android'de aç |
| `npm run ios` | iOS'ta aç |

## Notlar ve Sık Karşılaşılan Sorunlar

- **Aynı veritabanı:** Web ve mobil aynı backend'i kullandığından, web'de açılan hesapla mobilde de giriş yapılabilir.
- **Mobilde giriş yapılamıyor / görseller gelmiyor:** `app.json > extra.apiUrl` değerinin bilgisayarın LAN IP'sine ayarlı olduğundan ve Expo'nun `-c` ile yeniden başlatıldığından emin olun. Windows Firewall 4000 portuna gelen bağlantıları engelliyorsa izin verin.
- **Görsel yolları:** Backend görselleri `APP_URL` ile tam URL olarak kaydeder. Mobil istemci, host'u yok sayıp `/uploads/...` yolunu kendi `apiUrl` köküyle birleştirir; bu sayede LAN IP üzerinden görseller yüklenir.
- **Migration takılması:** `prisma migrate dev` etkileşimlidir. Otomatik akışlarda `prisma migrate deploy` kullanın; ardından `prisma generate` çalıştırın.
