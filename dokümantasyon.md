# Dokümantasyon

## Ödeme formu input davranışları (src/app/odeme/page.tsx)
- Kart Numarası: girişte sadece rakam alınır, en fazla 16 hane; otomatik 4'er gruplanıp boşlukla gösterilir (örn. "1234 5678 9012 3456"). `handleCardNoChange` eklendi.
- Son Kullanma: "AA/YY" formatı; ay yazılınca otomatik "/" eklenir, ay 01-12 dışıysa kabul edilmez, en fazla 5 karakter. `handleCardExpChange` eklendi.
- CVV: sadece rakam, tam 3 hane (maxLength 3). `handleCardCvvChange` eklendi.
- İlgili input'lara `inputMode="numeric"` eklendi; mevcut tasarım/stil korundu.

## Kategoriler sayfası (src/app/kategoriler/page.tsx)
- Yatay kaydırılan kategori chip listesi kaldırıldı.
- Yerine kategori seçim dropdown'ı (select) eklendi; "Tüm Kategoriler" + her kategori (ilan sayısıyla) listelenir.
- `selectedSlug` state mantığı korundu; filtreleme işlevi aynen çalışıyor.
- Artık kullanılmayan `iconMap` ve ilgili lucide ikon importları temizlendi.

## Mobil ödeme formu kart alanları (MOBILE/app/odeme.tsx)
- Kart Numarası: `handleCardNoChange` eklendi; sadece rakam alınır, en fazla 16 hane, 4'er gruplanıp boşlukla gösterilir ("1234 5678 9012 3456").
- Son Kullanma: klavyeyle yazma yerine ay/yıl dropdown seçimi yapıldı. "Ay" (01-12) ve "Yıl" (içinde bulunulan yıldan itibaren 15 yıl, son iki hane) için iki ayrı buton; seçim alttan açılan `PickerModal` ile yapılır (kategoriler.tsx deseni referans alındı). Değerler `expMonth`/`expYear` state'lerinde tutulur.
- CVV: `handleCvvChange` eklendi; sadece rakam, en fazla 3 hane (maxLength 3).
- Mevcut Field/Input bileşenleri, PRIMARY (#5BB678) ve card-outline tasarımı korundu; KeyboardAware yapısı bozulmadı.
