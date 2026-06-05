# BanaSat Backend

Alıcı odaklı pazar yeri **BanaSat**'ın backend servisi.
**NestJS + Prisma + PostgreSQL** üzerine kuruludur.

## Teknoloji Yığını

| Katman          | Teknoloji                          |
| --------------- | ---------------------------------- |
| Framework       | NestJS 10                          |
| ORM             | Prisma 5                           |
| Veritabanı      | PostgreSQL 16 (Docker)             |
| Kimlik Doğrulama| JWT (access + refresh), Passport   |
| Doğrulama       | class-validator / class-transformer|
| Güvenlik        | helmet, bcrypt, CORS               |

## Mimari

```
Backend/
├── prisma/
│   ├── schema.prisma     # Tüm veri modeli (tek kaynak)
│   └── seed.ts           # Başlangıç verileri (kategoriler)
├── src/
│   ├── main.ts           # Uygulama giriş noktası (global pipe/filter/interceptor)
│   ├── app.module.ts     # Kök modül
│   ├── config/           # Ortam değişkeni şeması ve yükleme
│   ├── common/           # Paylaşılan: filter, interceptor, decorator, dto
│   ├── prisma/           # PrismaService (DB erişimi)
│   ├── health/           # /api/health uç noktası
│   └── modules/          # Özellik modülleri (auth, users, listings, offers, messages)
└── ...
```

**Tasarım ilkeleri:**

- Her özellik kendi modülünde: `controller` (HTTP) → `service` (iş mantığı) → `prisma` (veri).
- Tüm girdiler DTO + `class-validator` ile doğrulanır.
- Tüm yanıtlar `{ success, data }`, tüm hatalar `{ success: false, statusCode, message }` formatında.
- Sırlar (secret) ve yapılandırma ortam değişkenlerinden gelir, kod içine gömülmez.

## Kurulum

### 1. Veritabanını başlat (proje kök dizininde)

```bash
docker compose up -d
```

### 2. Bağımlılıkları yükle

```bash
cd Backend
npm install
```

### 3. Ortam değişkenleri

`.env.example` dosyasını `.env` olarak kopyalayın (varsayılan değerler Docker ile uyumludur).

### 4. Veritabanı şemasını uygula ve seed çalıştır

```bash
npm run prisma:migrate   # Tabloları oluştur
npm run db:seed          # Kategorileri ekle
```

### 5. Geliştirme sunucusunu başlat

```bash
npm run start:dev
```

Backend `http://localhost:4000/api` adresinde çalışır.
Sağlık kontrolü: `http://localhost:4000/api/health`

## Faydalı Komutlar

| Komut                    | Açıklama                              |
| ------------------------ | ------------------------------------- |
| `npm run start:dev`      | Geliştirme (hot reload)               |
| `npm run build`          | Üretim derlemesi                      |
| `npm run prisma:studio`  | Veritabanını görsel arayüzde incele   |
| `npm run prisma:migrate` | Yeni migration oluştur ve uygula      |
| `npm run db:seed`        | Başlangıç verilerini yükle            |
| `npm run lint`           | Kod kontrolü                          |
```
