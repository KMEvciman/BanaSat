import { useEffect, useMemo, useState } from "react";
import {
  View, Text, ScrollView, TextInput, Pressable, Modal,
  RefreshControl, useWindowDimensions,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import {
  Search, ArrowUpDown, ChevronDown, LayoutGrid, X,
  Smartphone, Laptop, Cpu, Tv, WashingMachine, Microwave, Gamepad2, Sofa,
  Home, Shirt, Baby, Dumbbell, Puzzle, BookOpen, Car, Hammer, Sparkles,
  PawPrint, Truck, Wrench, GraduationCap, Package,
} from "lucide-react-native";
import TopBar from "@/components/TopBar";
import KeyboardAware from "@/components/KeyboardAware";
import ListingCard from "@/components/ListingCard";
import { categoriesApi, listingsApi, locationsApi } from "@/lib/api/services";
import { listingToCard } from "@/lib/api/adapters";
import type { Category, CardListing, Listing, ProvinceOption } from "@/lib/api/types";

const PRIMARY = "#5BB678";

// API'den gelen ikon anahtarını lucide bileşenine eşler (web ile birebir).
const iconMap: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  Smartphone, Laptop, Cpu, Tv, WashingMachine, Microwave, Gamepad2, Sofa,
  Home, Shirt, Baby, Dumbbell, Puzzle, BookOpen, Car, Hammer, Sparkles,
  PawPrint, Truck, Wrench, GraduationCap, Package,
};

const sortOptions = [
  { value: "newest", label: "En Yeni" },
  { value: "most-offers", label: "En Çok Teklif" },
  { value: "most-views", label: "En Çok Görüntülenen" },
];

export default function Kategoriler() {
  // ?ara= (arama metni) ve ?il= (province) query desteği (web ile aynı).
  const params = useLocalSearchParams<{ ara?: string; il?: string; q?: string }>();
  const initialAra = typeof params.ara === "string" ? params.ara : "";
  const initialIl = typeof params.il === "string" ? params.il : "";
  const initialQuery = typeof params.q === "string" ? params.q : "";

  const { width } = useWindowDimensions();
  const cardW = (width - 16 * 2 - 12) / 2; // 2 sütun, 16 padding, 12 gap

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>("tumu");
  const [showCategory, setShowCategory] = useState(false);
  const [listings, setListings] = useState<CardListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialAra);
  const [sortBy, setSortBy] = useState("newest");
  const [showSort, setShowSort] = useState(false);
  const [provinces, setProvinces] = useState<ProvinceOption[]>([]);
  const [province, setProvince] = useState(initialIl);
  const [showProvince, setShowProvince] = useState(false);

  // İl listesini yükle (filtre için).
  useEffect(() => {
    locationsApi.list().then(setProvinces).catch(() => {});
  }, []);

  // Navbar aramasından gelen ?ara parametresini senkronize et.
  useEffect(() => {
    setSearchQuery(initialAra);
  }, [initialAra]);

  // Kategorileri yükle; URL'deki ?q (isim/slug) ile eşleşen kategoriyi seç.
  useEffect(() => {
    categoriesApi.list().then((cats) => {
      setCategories(cats);
      if (initialQuery) {
        const match = cats.find((c) => c.name === initialQuery || c.slug === initialQuery);
        if (match) setSelectedSlug(match.slug);
      }
    }).catch(() => {});
  }, [initialQuery]);

  // Seçili kategori/sıralama/il/aramaya göre ilanları çek (backend search param).
  useEffect(() => {
    let active = true;
    setLoading(true);
    // Yazarken her tuşta istek atmamak için kısa bir gecikme uygula.
    const t = setTimeout(() => {
      listingsApi
        .list({
          status: "AKTIF",
          limit: 100,
          sort: sortBy,
          search: searchQuery.trim() || undefined,
          categorySlug: selectedSlug === "tumu" ? undefined : selectedSlug,
          province: province || undefined,
        })
        .then((res) => { if (active) setListings(res.items.map(listingToCard)); })
        .catch(() => { if (active) setListings([]); })
        .finally(() => { if (active) setLoading(false); });
    }, 300);
    return () => { active = false; clearTimeout(t); };
  }, [selectedSlug, sortBy, province, searchQuery]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await listingsApi.list({
        status: "AKTIF",
        limit: 100,
        sort: sortBy,
        search: searchQuery.trim() || undefined,
        categorySlug: selectedSlug === "tumu" ? undefined : selectedSlug,
        province: province || undefined,
      });
      setListings(res.items.map(listingToCard));
    } catch { /* yoksay */ }
    setRefreshing(false);
  };

  const selectedName = useMemo(
    () =>
      selectedSlug === "tumu"
        ? "Tüm Kategoriler"
        : categories.find((c) => c.slug === selectedSlug)?.name ?? "Kategori",
    [selectedSlug, categories],
  );

  const sortLabel = sortOptions.find((s) => s.value === sortBy)?.label ?? "";

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <TopBar />
      <KeyboardAware>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        keyboardShouldPersistTaps="handled"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={PRIMARY} />}
      >
        {/* Başlık */}
        <View className="px-4 pt-6 mb-4">
          <Text className="text-2xl font-black text-gray-900 dark:text-white">Kategoriler</Text>
          <Text className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {selectedSlug === "tumu"
              ? "Tüm kategorilerdeki ilanları keşfedin."
              : `${selectedName} kategorisindeki ilanlar`}
          </Text>
        </View>

        {/* Arama + Kategori + İl + Sıralama */}
        <View className="px-4 gap-3 mb-4">
          {/* Arama kutusu (başlık/konum/açıklama - backend search) */}
          <View className="flex-row items-center h-11 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3">
            <Search size={18} color="#9ca3af" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="İlan ara..."
              placeholderTextColor="#9ca3af"
              className="flex-1 ml-2 text-sm text-gray-900 dark:text-white"
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery("")} hitSlop={8}>
                <X size={16} color="#9ca3af" />
              </Pressable>
            )}
          </View>

          {/* Kategori dropdown (tüm kategorilere kolay erişim) */}
          <Pressable
            onPress={() => setShowCategory(true)}
            className="flex-row items-center justify-between h-11 px-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
          >
            <View className="flex-row items-center gap-2 flex-1">
              <LayoutGrid size={18} color={PRIMARY} />
              <Text numberOfLines={1} className="text-gray-900 dark:text-white text-sm font-medium flex-1">{selectedName}</Text>
            </View>
            <ChevronDown size={16} color="#9ca3af" />
          </Pressable>

          <View className="flex-row gap-3">
            {/* İl filtresi */}
            <Pressable
              onPress={() => setShowProvince(true)}
              className="flex-1 flex-row items-center justify-between h-11 px-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
            >
              <Text numberOfLines={1} className={province ? "text-gray-900 dark:text-white text-sm font-medium" : "text-gray-400 text-sm"}>
                {province || "Tüm İller"}
              </Text>
              <ChevronDown size={16} color="#9ca3af" />
            </Pressable>

            {/* Sıralama */}
            <Pressable
              onPress={() => setShowSort(true)}
              className="flex-1 flex-row items-center justify-center gap-2 h-11 px-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
            >
              <ArrowUpDown size={16} color="#737373" />
              <Text className="text-gray-700 dark:text-gray-300 text-sm font-medium">{sortLabel}</Text>
              <ChevronDown size={16} color="#9ca3af" />
            </Pressable>
          </View>
        </View>

        {/* Sonuç sayısı */}
        <View className="px-4 mb-3">
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            <Text className="font-semibold text-gray-900 dark:text-white">{listings.length}</Text> ilan bulundu
          </Text>
        </View>

        {/* Sonuç grid'i (2 sütun) */}
        {loading ? (
          <View className="px-4 flex-row flex-wrap" style={{ gap: 12 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <View key={i} style={{ width: cardW }} className="h-72 rounded-xl bg-gray-100 dark:bg-gray-800" />
            ))}
          </View>
        ) : listings.length > 0 ? (
          <View className="px-4 flex-row flex-wrap" style={{ gap: 12 }}>
            {listings.map((l) => <ListingCard key={l.id} listing={l} width={cardW} />)}
          </View>
        ) : (
          <View className="items-center justify-center py-20 px-8">
            <View className="size-16 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center mb-4">
              <Search size={28} color="#9ca3af" />
            </View>
            <Text className="text-lg font-bold text-gray-900 dark:text-white mb-1">İlan bulunamadı</Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Bu kategoride henüz aktif ilan yok.
            </Text>
          </View>
        )}
      </ScrollView>
      </KeyboardAware>

      {/* İl seçim modalı */}
      <PickerModal
        visible={showProvince}
        title="İl Seçin"
        onClose={() => setShowProvince(false)}
        options={[{ key: "", label: "Tüm İller" }, ...provinces.map((p) => ({ key: p.name, label: p.name }))]}
        selected={province}
        onSelect={(key) => { setProvince(key); setShowProvince(false); }}
      />

      {/* Kategori seçim modalı (dropdown) */}
      <PickerModal
        visible={showCategory}
        title="Kategori Seçin"
        onClose={() => setShowCategory(false)}
        options={[{ key: "tumu", label: "Tüm Kategoriler" }, ...categories.map((c) => ({ key: c.slug, label: c.name }))]}
        selected={selectedSlug}
        onSelect={(key) => { setSelectedSlug(key); setShowCategory(false); }}
      />

      {/* Sıralama modalı */}
      <PickerModal
        visible={showSort}
        title="Sıralama"
        onClose={() => setShowSort(false)}
        options={sortOptions.map((s) => ({ key: s.value, label: s.label }))}
        selected={sortBy}
        onSelect={(key) => { setSortBy(key); setShowSort(false); }}
      />
    </View>
  );
}

/** Yatay kategori chip'i. */
function Chip({ label, icon, count, active, onPress }: {
  label: string; icon: React.ReactNode; count?: number; active: boolean; onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={active ? { backgroundColor: PRIMARY } : undefined}
      className={`flex-row items-center gap-2 px-4 py-2 rounded-lg ${
        active ? "" : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
      }`}
    >
      {icon}
      <Text className={`text-sm font-medium ${active ? "text-white" : "text-gray-600 dark:text-gray-400"}`}>{label}</Text>
      {count != null && (
        <View className={`px-1.5 py-0.5 rounded-full ${active ? "bg-white/20" : "bg-gray-100 dark:bg-gray-800"}`}>
          <Text className={`text-xs ${active ? "text-white" : "text-gray-500"}`}>{count}</Text>
        </View>
      )}
    </Pressable>
  );
}

/** Alttan açılan tek seçimli liste modalı (il/sıralama). */
function PickerModal({ visible, title, options, selected, onSelect, onClose }: {
  visible: boolean;
  title: string;
  options: { key: string; label: string }[];
  selected: string;
  onSelect: (key: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/50 justify-end" onPress={onClose}>
        <Pressable className="bg-white dark:bg-gray-900 rounded-t-2xl max-h-[70%]" onPress={(e) => e.stopPropagation()}>
          <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <Text className="text-lg font-bold text-gray-900 dark:text-white">{title}</Text>
            <Pressable onPress={onClose} hitSlop={8}><X size={20} color="#737373" /></Pressable>
          </View>
          <ScrollView>
            {options.map((opt) => {
              const active = opt.key === selected;
              return (
                <Pressable
                  key={opt.key || "all"}
                  onPress={() => onSelect(opt.key)}
                  className="px-5 py-3 border-b border-gray-50 dark:border-gray-800"
                >
                  <Text
                    style={active ? { color: PRIMARY } : undefined}
                    className={active ? "font-semibold" : "text-gray-800 dark:text-gray-200"}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
