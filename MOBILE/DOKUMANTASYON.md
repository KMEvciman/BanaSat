# BanaSat Mobil - Dokümantasyon

## Eklenen Ekranlar

### app/siparislerim.tsx
Web'deki `src/app/siparislerim/page.tsx` karşılığı. Web mantığı birebir korundu.
- "Alımlarım" / "Satışlarım" sekmeleri; veriler `ordersApi.myPurchases()` ve `ordersApi.mySales()` ile paralel çekilir.
- Giriş yapılmamışsa `useAuth` ile `/giris`'e yönlendirir.
- Durum `ODEME_BEKLENIYOR` ve kullanıcı alıcıysa "Ödemeye Geç" -> `/odeme?order=<id>`.
- `ODENDI` / `TESLIM_EDILDI` durumunda "Tamamlandı" rozeti.
- "Ayrıntılar" butonu, tekliflerim.tsx'teki alttan açılan modal desenini kullanarak sipariş detayını gösterir.
- Görseller `resolveImageUrl`, avatarlar `resolveAvatarUrl` ile çözülür.

### app/odeme.tsx
Web'deki `src/app/odeme/page.tsx` karşılığı.
- `useLocalSearchParams` ile `order` id alır, `ordersApi.detail(id)` ile sipariş özetini gösterir.
- Teslimat + kart bilgisi formu (sadece UI/mock; gerçek ödeme alınmaz).
- "Ödemeyi Tamamla" -> sözleşme onayı sonrası `ordersApi.pay(id)` (simülasyon) -> başarı ekranı -> `/siparislerim`.
- Sipariş bulunamazsa veya zaten ödenmişse uygun ekranlar gösterilir.

## Notlar
- Stil deseni `tekliflerim.tsx` ve `TopBar.tsx` ile uyumlu. PRIMARY = `#5BB678`.
- Kart deseni: `card-outline bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800`.
- Her iki ekran TypeScript hatasız (get_diagnostics ile doğrulandı).

### app/kullanici/[id].tsx
Web'deki `src/app/kullanici/[id]/page.tsx` karşılığı. Web mantığı birebir korundu.
- `useLocalSearchParams` ile `id` alır; `usersApi.publicProfile(id)` ile profil çekilir.
- Profil yüklendikten sonra `reviewsApi.forUser(id)` (yorumlar) ve `listingsApi.list({ ownerId: id, status: "AKTIF", limit: 12 })` (aktif ilanlar) paralel çekilir; her ikisi de hata durumunda boş listeye düşer.
- Profil başlığı: avatar, ad, doğrulama rozeti (BadgeCheck), puan/yorum sayısı (Star), konum (MapPin), katılım tarihi (CalendarDays), bio.
- Aktif ilanlar 2 sütunlu grid olarak `listingToCard` + `ListingCard` ile gösterilir.
- Değerlendirmeler listesi: yazar avatarı/adı, 5 yıldız puan, yorum ve ilgili ilan başlığı.
- Profil bulunamazsa "Kullanıcı Bulunamadı" + ana sayfaya dönüş.
- Görseller/avatarlar `resolveAvatarUrl` ile çözülür. TypeScript hatasız (get_diagnostics ile doğrulandı).

### app/kategoriler.tsx
Web'deki `src/app/kategoriler/page.tsx` karşılığı. Web mantığı birebir korundu.
- `useLocalSearchParams` ile `ara` (arama metni), `il` (province) ve `q` (kategori adı/slug) query destekler. `q` ile eşleşen kategori otomatik seçilir; `ara` arama kutusuna senkronize edilir.
- Kategori chip'leri yatay liste (`ScrollView horizontal`); web'deki `iconMap` aynen kullanıldı (lucide-react-native). Aktif chip PRIMARY arka plan, ilan sayısı rozeti.
- Arama kutusu backend `search` param ile çalışır (başlık/konum/açıklama); 300ms gecikmeli istek.
- İl filtresi ve sıralama (`En Yeni` / `En Çok Teklif` / `En Çok Görüntülenen`) alttan açılan `PickerModal` ile seçilir. İl listesi `locationsApi.list()`'ten gelir.
- İlanlar `listingsApi.list({ status, limit, sort, search, categorySlug, province })` ile çekilir, `listingToCard` ile karta dönüştürülür.
- Sonuç grid'i 2 sütun (`index.tsx` deseni; `cardW = (width - 32 - 12) / 2`), `ListingCard` kullanır. Yükleme iskeleti ve "İlan bulunamadı" boş durumu mevcut.
- En üstte `<TopBar />`, pull-to-refresh (`RefreshControl`) eklendi. TypeScript hatasız (get_diagnostics ile doğrulandı).
