# BanaSat Mobile (React Native / Expo)

Web projesiyle **aynı backend ve database**'i kullanan mobil uygulama. Tasarım web'in birebir mobil uyarlamasıdır (NativeWind + aynı `#5BB678` teması).

## Kurulum

```bash
cd MOBILE
npm install
npx expo start
```

- Android emülatör: `a`
- iOS simülatör (macOS): `i`
- Fiziksel cihaz: Expo Go ile QR okut

## Backend bağlantısı (ÖNEMLİ)

API adresi `app.json > expo.extra.apiUrl` içinde tanımlı.

- **Android emülatör:** `http://10.0.2.2:4000/api` (varsayılan)
- **iOS simülatör:** `http://localhost:4000/api`
- **Fiziksel cihaz:** bilgisayarın LAN IP'si, örn. `http://192.168.1.20:4000/api`

Backend `cd Backend && npm run start:dev` ile ayakta olmalı (Docker DB açık).

## Yapı

- `lib/api/` — web'den taşınan API katmanı (client async SecureStore'a uyarlandı)
- `context/` — AuthContext + ThemeContext
- `components/` — TopBar (navbar), ListingCard, LocationSelect
- `app/` — expo-router ekranları (web route'larının karşılığı)

## Durum

Tamamlanan: altyapı, API katmanı, tema/auth, ana sayfa, giriş, kayıt.
Devam edecek: ilan detay, talep oluştur, taleplerim, tekliflerim, mesajlar, siparişler, ödeme, profil, kategoriler, kullanıcı profili.
