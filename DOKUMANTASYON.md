# BanaSat - Değişiklik Dokümantasyonu

Bu dosya, proje genelinde (web + mobil + backend) yapılan önemli değişikliklerin
tek kaynaktan kaydıdır. Kurulum ve genel bilgi için `README.md` dosyasına bakın.

---

## Fiyat/Bütçe giriş alanlarında binlik ayraç (tr-TR)

Fiyat ve bütçe giriş alanlarında kullanıcı yazarken binlik ayraç (nokta) gösterilir.
Örnek: `4000` yazınca alanda `4.000` görünür.

**Mantık:**
- State'lerde her zaman HAM rakam (ayraçsız) tutulur.
- Görüntülemede `formatThousands(state)` ile binlik ayraçlı gösterilir.
- Girişte `digitsOnly(text)` ile state'e sadece rakam yazılır.
- Validasyon ve API gönderimi `Number(hamState)` ile yapılır.

**Ortak yardımcılar** (aynı içerik): `MOBILE/lib/format.ts` ve `src/lib/format.ts`
- `digitsOnly(s)`: sadece rakamları alır, baştaki sıfırları temizler.
- `formatThousands(s)`: ham rakamı `tr-TR` binlik ayraçlı gösterime çevirir.

**Güncellenen alanlar:**
- Mobil: `talep-olustur.tsx` (bütçe), `ilan/[id].tsx` (teklif), `tekliflerim.tsx` (düzenleme), `mesajlar.tsx` (teklif gönderme)
- Web: `talep-olustur`, `ilan/[id]`, `tekliflerim`, `mesajlar` sayfaları

---

## Ödeme formu input davranışları (web + mobil)

**Web (`src/app/odeme/page.tsx`):**
- Kart Numarası: sadece rakam, max 16 hane, otomatik 4'er gruplama + boşluk ("1234 5678 9012 3456").
- Son Kullanma: "AA/YY"; ay yazılınca otomatik "/", ay 01-12 dışı kabul edilmez, max 5 karakter.
- CVV: sadece rakam, tam 3 hane.
- İlgili input'lara `inputMode="numeric"` eklendi.

**Mobil (`MOBILE/app/odeme.tsx`):**
- Kart Numarası: sadece rakam, max 16 hane, 4'er gruplama + boşluk.
- Son Kullanma: klavye yerine Ay (01-12) ve Yıl (içinde bulunulan yıldan +15 yıl, son iki hane) için
  ayrı liste (alttan açılan PickerModal) seçimi. Değerler `expMonth`/`expYear` state'lerinde.
- CVV: sadece rakam, tam 3 hane.

---

## Kategoriler sayfası

**Web (`src/app/kategoriler/page.tsx`):** Yatay kaydırılan kategori chip listesi kaldırıldı,
yerine kategori seçim dropdown'ı (select) eklendi. `selectedSlug` mantığı ve filtreleme korundu.

**Mobil (`MOBILE/app/kategoriler.tsx`):** Kategori erişimi için alttan açılan PickerModal dropdown'ı eklendi.

---

## Mobil klavye yönetimi (KeyboardAware)

SDK 54 + Android edge-to-edge ile `adjustResize`/`KeyboardAvoidingView` güvenilir çalışmadığından,
klavye yüksekliğini izleyip içeriğin altına o kadar boşluk ekleyen `KeyboardAware` bileşeni ve
`useKeyboardHeight` hook'u (`MOBILE/components/KeyboardAware.tsx`) kullanıldı.

- Form ekranları (`giris`, `kayit`, `talep-olustur`, `profil`, `ilan/[id]`, `odeme`, `kategoriler`, `mesajlar`, `tekliflerim`)
  kaydırılabilir içerik `KeyboardAware` ile sarıldı; TopBar dışarıda bırakıldı.
- Bottom-sheet modal'larda `flex-1` sarmalayıcı yerine modal dış katmanına `useKeyboardHeight` ile padding verildi.
- Alt navigasyon (BottomNav) klavye açıkken gizlenir (alttaki boşluğu önlemek için).

---

## Mobil görsel URL çözümü

Backend görselleri `APP_URL` ile tam URL olarak kaydeder (ör. `http://localhost:4000/uploads/...`).
`localhost` mobil cihazda çalışmadığından, `MOBILE/lib/api/adapters.ts` içindeki `resolveImageUrl` /
`resolveAvatarUrl`, gelen URL'deki host'u yok sayıp `/uploads/...` yolunu mobilin `apiUrl` köküyle
(LAN IP) birleştirir.

---

## Profil "Hesap Özeti" (web)

Sabit (mock) 9/7/3 değerleri gerçek veriye bağlandı (`src/app/profil/page.tsx`):
- Toplam Talep: `listingsApi.list({ ownerId })` → meta.total
- Verilen Teklif: `offersApi.mine()` → meta.total
- Tamamlanan İşlem: alım + satım siparişlerinden ODENDI/TESLIM_EDILDI olanların toplamı

---

## Diğer

- Web mesajlarda dosya ekleme (ataç) butonu kaldırıldı.
- Web Navbar'dan "Ayarlar" bağlantıları kaldırıldı.
- Mobilde giriş yapılmamış kullanıcı doğrudan giriş ekranına yönlendirilir.
- Mobil alt navigasyon (Ana Sayfa / Taleplerim / Tekliflerim / Profil) ve hamburger menüde logo hizalaması.
