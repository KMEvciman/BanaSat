import { useEffect, useState } from "react";
import { View, Text, ScrollView, RefreshControl, useWindowDimensions } from "react-native";
import { MapPin } from "lucide-react-native";
import TopBar from "@/components/TopBar";
import ListingCard from "@/components/ListingCard";
import { listingsApi, offersApi } from "@/lib/api/services";
import { listingToCard } from "@/lib/api/adapters";
import { useAuth } from "@/context/AuthContext";
import type { CardListing, Listing } from "@/lib/api/types";

export default function Home() {
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const cardW = (width - 16 * 2 - 12) / 2; // 2 sütun, 16 padding, 12 gap

  const [popular, setPopular] = useState<CardListing[]>([]);
  const [recent, setRecent] = useState<CardListing[]>([]);
  const [regional, setRegional] = useState<CardListing[]>([]);
  const [refreshing, setRefreshing] = useState(false);

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

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <TopBar />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#5BB678" />}
      >
        {/* Konumunda İlgini Çekebilecek İlanlar */}
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
      </ScrollView>
    </View>
  );
}

function Section({ title, subtitle, items, cardW, location }: { title: string; subtitle: string; items: CardListing[]; cardW: number; location?: boolean }) {
  if (items.length === 0) return null;
  return (
    <View className="px-4 pt-6">
      {location && (
        <View className="flex-row items-center gap-1 mb-1">
          <MapPin size={14} color="#5BB678" />
          <Text className="text-primary text-xs font-semibold" style={{ color: "#5BB678" }}>{subtitle}</Text>
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
