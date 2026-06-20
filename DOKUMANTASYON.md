# Dokümantasyon

## Fiyat/Bütçe giriş alanlarında binlik ayraç (tr-TR)

Fiyat ve bütçe giriş alanlarında kullanıcı yazarken binlik ayraç (nokta) gösterimi eklendi.
Örnek: kullanıcı `4000` yazınca alanda `4.000` görünür.

### Mantık
- State'lerde her zaman HAM rakam (ayraçsız) tutulur.
- Görüntülemede `formatThousands(state)` ile binlik ayraçlı gösterilir.
- Giriş değişiminde `digitsOnly(text)` ile state'e sadece rakam yazılır.
- Validasyon ve API gönderimi `Number(hamState)` ile yapılır (mevcut gönderim mantığı değişmedi).

### Ortak yardımcılar
İki dosya aynı içeriğe sahip:
- Mobil: `MOBILE/lib/format.ts`
- Web: `src/lib/format.ts`

İçerik:
- `digitsOnly(s)`: sadece rakamları alır, baştaki sıfırları temizler.
- `formatThousands(s)`: ham rakam dizisini `tr-TR` binlik ayraçlı gösterime çevirir.

### Güncellenen giriş alanları
Mobil (React Native):
- `MOBILE/app/talep-olustur.tsx` — bütçe
- `MOBILE/app/ilan/[id].tsx` — teklif fiyatı
- `MOBILE/app/tekliflerim.tsx` — teklif düzenleme modalı fiyatı
- `MOBILE/app/mesajlar.tsx` — teklif gönderme modalı fiyatı (offerPrice)

Web (Next.js):
- `src/app/talep-olustur/page.tsx` — bütçe (mevcut mantık format.ts ile sadeleştirildi)
- `src/app/ilan/[id]/page.tsx` — teklif fiyatı
- `src/app/tekliflerim/page.tsx` — teklif düzenleme modalı fiyatı
- `src/app/mesajlar/page.tsx` — teklif gönderme fiyatı

Not: Web tarafında ilgili input'ların `type="number"` olanları `inputMode="numeric"` olarak değiştirildi
(binlik ayraç metin gösterimi için gerekli). Mevcut gösterim alanları (toLocaleString ile gösterilen yerler)
değiştirilmedi.
