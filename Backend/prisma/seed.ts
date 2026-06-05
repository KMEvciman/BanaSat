import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Türkçe metni URL-dostu slug'a çevirir.
 * "Yazılım & IT" -> "yazilim-it"
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

// Frontend ile birebir uyumlu kategori listesi (isim + ikon anahtarı)
const categories: { name: string; icon: string }[] = [
  { name: 'Elektronik', icon: 'Laptop' },
  { name: 'Yazılım & IT', icon: 'Code' },
  { name: 'Grafik Tasarım', icon: 'Palette' },
  { name: 'Nakliye & Taşımacılık', icon: 'Truck' },
  { name: 'Eğitim & Özel Ders', icon: 'GraduationCap' },
  { name: 'Temizlik', icon: 'SprayCan' },
  { name: 'Tadilat & Dekorasyon', icon: 'Hammer' },
  { name: 'Mobilya', icon: 'Sofa' },
  { name: 'Otomotiv', icon: 'Car' },
  { name: 'Sağlık & Güzellik', icon: 'Heart' },
  { name: 'Hukuk & Danışmanlık', icon: 'Scale' },
  { name: 'Emlak', icon: 'Building' },
  { name: 'Etkinlik & Organizasyon', icon: 'PartyPopper' },
  { name: 'Fotoğraf & Video', icon: 'Camera' },
  { name: 'Müzik & Ses', icon: 'Music' },
  { name: 'Çeviri & Redaksiyon', icon: 'Languages' },
  { name: 'Giyim & Moda', icon: 'Shirt' },
  { name: 'Bahçe & Peyzaj', icon: 'TreePine' },
  { name: 'Evcil Hayvan', icon: 'PawPrint' },
  { name: 'Spor & Fitness', icon: 'Dumbbell' },
  { name: 'Yemek & Catering', icon: 'UtensilsCrossed' },
  { name: 'Matbaa & Baskı', icon: 'Printer' },
  { name: 'Sigorta', icon: 'Shield' },
  { name: 'Kargo & Kurye', icon: 'Package' },
];

async function main() {
  console.log('Seed başlıyor...');

  for (const cat of categories) {
    const slug = slugify(cat.name);
    await prisma.category.upsert({
      where: { slug },
      update: { name: cat.name, icon: cat.icon },
      create: { name: cat.name, slug, icon: cat.icon },
    });
  }

  console.log(`${categories.length} kategori eklendi/güncellendi.`);
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
