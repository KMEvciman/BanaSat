# BanaSat Mobil - Değişiklik Dokümantasyonu

## Klavye Sarmalaması (KeyboardAware)

Klavye açılınca içeriğin klavyenin üstünde toplanması için `KeyboardAware` bileşeni
üç form ekranına eklendi. Sarmalayıcı yalnızca kaydırılabilir içeriği (ScrollView)
sarar, TopBar dışarıda bırakılır. Kök ScrollView'lara `keyboardShouldPersistTaps="handled"`
eklendi.

### Düzenlenen dosyalar
- `app/ilan/[id].tsx`: Normal içerikteki ScrollView `KeyboardAware` ile sarıldı.
  Koşullu render (loading/!listing/normal) yapısı korundu. Lightbox Modal'ı
  `KeyboardAware` dışında bırakıldı. Teklif fiyatı/notu input'larına klavye açıkken
  scroll ile erişilebilir.
- `app/odeme.tsx`: ScrollView `KeyboardAware` ile sarıldı, `keyboardShouldPersistTaps="handled"` eklendi.
- `app/kategoriler.tsx`: ScrollView `KeyboardAware` ile sarıldı (zaten mevcut olan
  `keyboardShouldPersistTaps="handled"` korundu). Modallar sarmalayıcı dışında.

Mevcut tasarım ve mantık değiştirilmedi; yalnızca klavye sarmalaması eklendi.
TypeScript kontrolü temiz.
