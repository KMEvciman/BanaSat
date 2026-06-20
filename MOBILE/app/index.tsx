import { useEffect, useState } from "react";
import { View, Text, ScrollView, RefreshControl, useWindowDimensions, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { MapPin, FileText, MailCheck, BadgeCheck } from "lucide-react-native";
import TopBar from "@/components/TopBar";
import ListingCard from "@/components/ListingCard";
import { listingsApi, offersApi } from "@/lib/api/services";
import { listingToCard } from "@/lib/api/adapters";
import { useAuth } from "@/context/AuthContext";
import type { CardListing, Listing } from "@/lib/api/types";

const PRIMARY = "#5BB678";

export default function Home() {
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const cardW = (width - 16 * 2 - 12) / 2; // 2 sütun, 16 padding, 12 gap

  const [popular, setPopular] = useState<CardListing[]>([]);
  const [recent, setRecent] = useState<CardListing[]>([]);
  const [regional, setRegional] = useState<CardListing[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Giriş yapılmamışsa doğrudan giriş ekranına yönlendir.
  useEffect(() => {
    if (!authLoading && !isLoggedIn) router.replace("/giris");
  }, [authLoading, isLoggedIn]);

  const load = () =>
    Promise.all([
      listingsApi.list({ sort: "most-offers", limit: 8, status: "AKTIF" }),
      listingsApi.list({ sort: "newest", limit: 12, status: "AKTIF" }),
    ]).then(([pop, rec]) => {
      setPopular(pop.items.map(listingToCard));
      setRecent(rec.items.map(listingToCard));
    }).catch(() => {});

  useEffect(() => { load(); }, []);

  // Konuma + teklif geçmişine göre öneriler.
  useEffect(() => {
    if (!user?.province) { setRegional([]); return; }
    let active = true;
    const myProvince = user.province;
    (async () => {
      try {
        const mine = await offersApi.mine({ limit: 100 }).catch(() => null);
        const slugs = mine ? Array.from(new Set(mine.items.map((o) => o.listing.category.slug))) : [];
        let items: Listing[] = [];
        if (slugs.length > 0) {
          const results = await Promise.all(
            slugs.slice(0, 6).map((slug) =>
              listingsApi.list({ province: myProvince, categorySlug: slug, status: "AKTIF", limit: 8, sort: "newest" })
                .then((r) => r.items).catch(() => [] as Listing[])),
          );
          items = results.flat();
        }
        if (items.length === 0) {
          const r = await listingsApi.list({ province: myProvince, status: "AKTIF", limit: 8, sort: "newest" });
          items = r.items;
        }
        const seen = new Set<string>();
        const uniq: Listing[] = [];
        for (const l of items) {
          if (l.owner.id === user.id || seen.has(l.id)) continue;
          seen.add(l.id); uniq.push(l); if (uniq.length >= 8) break;
        }
        if (active) setRegional(uniq.map(listingToCard));
      } catch { /* yoksay */ }
    })();
    return () => { active = false; };
  }, [user?.province, user?.id]);

  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  // Giriş yoksa içerik render etme (yönlendirme yapılıyor).
  if (!isLoggedIn) {
    return <View className="flex-1 bg-background-light dark:bg-background-dark" />;
  }

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <TopBar />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={PRIMARY} />}
      >
        {/* Konumunda İlgini Çekebilecek İlanlar (yalnızca konumu olan) */}
        {!!user?.province && regional.length > 0 && (
          <Section
            title="Konumunda İlgini Çekebilecek İlanlar"
            subtitle={`${user.province}${user.district ? " / " + user.district : ""}`}
            location
            items={regional}
            cardW={cardW}
          />
        )}

        <Section title="En Popüler İlanlar" subtitle="Şu anda en çok teklif alan ilanlar" items={popular} cardW={cardW} />
        <Section title="Son Eklenen İlanlar" subtitle="Yeni yayınlanan taleplere göz atın" items={recent} cardW={cardW} />

        {/* Nasıl Çalışır */}
        <HowItWorks />

        {/* CTA */}
        <CTA onPress={() => router.push(isLoggedIn ? "/talep-olustur" : "/kayit")} />
      </ScrollView>
    </View>
  );
}

/** Nasıl Çalışır 3 adımlı bölüm. */
function HowItWorks() {
  const steps = [
    { icon: FileText, title: "1. İhtiyacını Anlat", desc: "Detaylı bir şekilde neye ihtiyacın olduğunu yaz, kategorini seç." },
    { icon: MailCheck, title: "2. Teklifleri Topla", desc: "Satıcılardan gelen rekabetçi teklifleri anında görüntüle." },
    { icon: BadgeCheck, title: "3. En İyisini Seç", desc: "Sana en uygun fiyatı ve güvenilir satıcıyı onayla, alışverişi tamamla." },
  ];
  return (
    <View className="mt-8 px-4 py-8 bg-primary/5 dark:bg-black">
      <Text className="text-gray-900 dark:text-white text-2xl font-bold text-center">Nasıl Çalışır?</Text>
      <Text className="text-gray-500 dark:text-gray-400 text-center text-sm mt-1 mb-6">
        Sadece 3 adımda ihtiyacınız olan ürüne en uygun fiyatla ulaşın.
      </Text>
      <View className="gap-4">
        {steps.map((s) => {
          const Icon = s.icon;
          return (
            <View key={s.title} className="flex-row items-center gap-4 card-outline bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
              <View className="size-14 rounded-2xl bg-primary/10 items-center justify-center">
                <Icon size={26} color={PRIMARY} />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 dark:text-white text-base font-bold">{s.title}</Text>
                <Text className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mt-0.5">{s.desc}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

/** Talep oluşturmaya yönlendiren çağrı bölümü. */
function CTA({ onPress }: { onPress: () => void }) {
  return (
    <View className="px-4 mt-8">
      <View className="rounded-3xl p-6 gap-4" style={{ backgroundColor: PRIMARY }}>
        <Text className="text-white text-2xl font-bold">Hâlâ aradığını bulamadın mı?</Text>
        <Text className="text-green-50 text-base leading-relaxed">
          Hemen ücretsiz bir talep oluştur, aradığın ürün veya hizmet ayağına gelsin.
        </Text>
        <Pressable onPress={onPress} className="h-12 rounded-xl items-center justify-center bg-white">
          <Text className="font-bold" style={{ color: PRIMARY }}>Ücretsiz Talep Oluştur</Text>
        </Pressable>
      </View>
    </View>
  );
}

function Section({ title, subtitle, items, cardW, location }: { title: string; subtitle: string; items: CardListing[]; cardW: number; location?: boolean }) {
  if (items.length === 0) return null;
  return (
    <View className="px-4 pt-6">
      {location && (
        <View className="flex-row items-center gap-1 mb-1">
          <MapPin size={14} color={PRIMARY} />
          <Text className="text-primary text-xs font-semibold" style={{ color: PRIMARY }}>{subtitle}</Text>
        </View>
      )}
      <Text className="text-gray-900 dark:text-white text-xl font-bold">{title}</Text>
      {!location && <Text className="text-gray-500 dark:text-gray-400 text-xs mb-3">{subtitle}</Text>}
      {location && <View className="mb-3" />}
      <View className="flex-row flex-wrap" style={{ gap: 12 }}>
        {items.map((l) => <ListingCard key={l.id} listing={l} width={cardW} />)}
      </View>
    </View>
  );
}
