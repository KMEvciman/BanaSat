// Sadece rakamları al, baştaki sıfırları temizle.
export function digitsOnly(s: string): string {
  return s.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
}
// Ham rakam dizisini binlik ayraçlı (tr-TR) gösterime çevirir.
export function formatThousands(s: string): string {
  const d = digitsOnly(s);
  if (!d) return "";
  return Number(d).toLocaleString("tr-TR");
}
