import { PrismaClient } from '@prisma/client';
import { TURKEY_LOCATIONS } from '../src/common/data/turkey-locations';

const prisma = new PrismaClient();

/**
 * Türkçe metni URL-dostu slug'a çevirir.
 * "Telefon & Aksesuar" -> "telefon-aksesuar"
 */
function slugify(text: string): string {
  const map: Record<string, string> = {
    ç: 'c',
    ğ: 'g',
    ı: 'i',
    ö: 'o',
    ş: 's',
    ü: 'u',
  };
  return text
    .toLowerCase()
    .replace(/[çğıöşü]/g, (c) => map[c] ?? c)
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// Frontend ile birebir uyumlu kategori listesi (isim + ikon anahtarı).
// Öncelik alım-satım (ürün) kategorilerinde; hizmetler sona eklenir.
const categories: { name: string; icon: string }[] = [
  // Ürün (alım-satım) kategorileri
  { name: 'Telefon & Aksesuar', icon: 'Smartphone' },
  { name: 'Bilgisayar & Tablet', icon: 'Laptop' },
  { name: 'Elektronik', icon: 'Tv' },
  { name: 'Beyaz Eşya', icon: 'WashingMachine' },
  { name: 'Küçük Ev Aletleri', icon: 'Microwave' },
  { name: 'Oyun & Konsol', icon: 'Gamepad2' },
  { name: 'Mobilya', icon: 'Sofa' },
  { name: 'Ev & Yaşam', icon: 'Home' },
  { name: 'Giyim & Moda', icon: 'Shirt' },
  { name: 'Anne & Bebek', icon: 'Baby' },
  { name: 'Spor & Outdoor', icon: 'Dumbbell' },
  { name: 'Hobi & Oyuncak', icon: 'Puzzle' },
  { name: 'Kitap, Film & Müzik', icon: 'BookOpen' },
  { name: 'Otomotiv & Yedek Parça', icon: 'Car' },
  { name: 'Bahçe & Yapı Market', icon: 'Hammer' },
  { name: 'Kozmetik & Kişisel Bakım', icon: 'Sparkles' },
  { name: 'Evcil Hayvan Ürünleri', icon: 'PawPrint' },
  // Hizmet kategorileri (ikincil)
  { name: 'Nakliye & Taşımacılık', icon: 'Truck' },
  { name: 'Tadilat & Usta', icon: 'Wrench' },
  { name: 'Eğitim & Özel Ders', icon: 'GraduationCap' },
  { name: 'Diğer Hizmetler', icon: 'Package' },
];

async function main() {
  console.log('Seed başlıyor...');

  const validSlugs: string[] = [];
  for (const cat of categories) {
    const slug = slugify(cat.name);
    validSlugs.push(slug);
    await prisma.category.upsert({
      where: { slug },
      update: { name: cat.name, icon: cat.icon },
      create: { name: cat.name, slug, icon: cat.icon },
    });
  }

  // Güncel listede olmayan eski kategorilerden ilanı olmayanları temizle.
  const obsolete = await prisma.category.findMany({
    where: { slug: { notIn: validSlugs } },
    select: { id: true, _count: { select: { listings: true } } },
  });
  const deletable = obsolete.filter((c) => c._count.listings === 0).map((c) => c.id);
  if (deletable.length > 0) {
    await prisma.category.deleteMany({ where: { id: { in: deletable } } });
    console.log(`${deletable.length} eski (boş) kategori silindi.`);
  }

  console.log(`${categories.length} kategori eklendi/güncellendi.`);

  // İl ve ilçeleri yükle (idempotent).
  let districtCount = 0;
  for (const p of TURKEY_LOCATIONS) {
    const province = await prisma.province.upsert({
      where: { plate: p.plate },
      update: { name: p.province },
      create: { plate: p.plate, name: p.province },
    });
    for (const d of p.districts) {
      await prisma.district.upsert({
        where: { provinceId_name: { provinceId: province.id, name: d } },
        update: {},
        create: { name: d, provinceId: province.id },
      });
      districtCount++;
    }
  }
  console.log(`${TURKEY_LOCATIONS.length} il, ${districtCount} ilçe eklendi/güncellendi.`);

  console.log('Seed tamamlandı.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
