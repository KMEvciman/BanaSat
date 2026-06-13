import { useEffect, useState, useMemo, useCallback } from "react";
import { View, Text, ScrollView, Pressable, Image, useWindowDimensions, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Plus, Trash2, Eye, MessageCircle } from "lucide-react-native";
import TopBar from "@/components/TopBar";
import { useAuth } from "@/context/AuthContext";
import { listingsApi } from "@/lib/api/services";
import { PLACEHOLDER_IMAGE } from "@/lib/api/adapters";
import type { Listing, ListingStatus } from "@/lib/api/types";

const PRIMARY = "#5BB678";
const filters: { value: string; label: string }[] = [
  { value: "tumu", label: "Tümü" },
  { value: "AKTIF", label: "Aktif" },
  { value: "BEKLEMEDE", label: "Beklemede" },
  { value: "TAMAMLANDI", label: "Tamamlandı" },
  { value: "IPTAL", label: "İptal" },
];
const statusCls: Record<ListingStatus, string> = {
  AKTIF: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400",
  BEKLEMEDE: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
  TAMAMLANDI: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  IPTAL: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
};

export default function Taleplerim() {
  const router = useRouter();
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const { width } = useWindowDimensions();
  const cardW = (width - 16 * 2 - 12) / 2;

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("tumu");

  useEffect(() => { if (!authLoading && !isLoggedIn) router.replace("/giris"); }, [authLoading, isLoggedIn]);

  const load = useCallback(() => {
    if (!user) return;
    setLoading(true);
    listingsApi.list({ ownerId: user.id, limit: 100 }).then((r) => setListings(r.items)).catch(() => {}).finally(() => setLoading(false));
  }, [user]);
  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => filter === "tumu" ? listings : listings.filter((l) => l.status === filter), [listings, filter]);

  const remove = (id: string) => {
    Alert.alert("Talebi sil", "Bu talebi silmek istediğinize emin misiniz?", [
      { text: "Vazgeç", style: "cancel" },
      { text: "Sil", style: "destructive", onPress: async () => {
        try { await listingsApi.remove(id); setListings((p) => p.filter((l) => l.id !== id)); } catch {}
      } },
    ]);
  };

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <TopBar />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-2xl font-black text-gray-900 dark:text-white">Taleplerim</Text>
          <Pressable onPress={() => router.push("/talep-olustur")} className="flex-row items-center gap-1.5 h-10 px-4 rounded-xl" style={{ backgroundColor: PRIMARY }}>
            <Plus size={16} color="#fff" /><Text className="text-white text-sm font-bold">Yeni</Text>
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4 -mx-1">
          {filters.map((f) => (
            <Pressable key={f.value} onPress={() => setFilter(f.value)} className={`mx-1 px-4 h-9 rounded-lg items-center justify-center ${filter === f.value ? "" : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"}`} style={filter === f.value ? { backgroundColor: PRIMARY } : undefined}>
              <Text className={`text-sm font-medium ${filter === f.value ? "text-white" : "text-gray-600 dark:text-gray-400"}`}>{f.label}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {loading ? (
          <Text className="text-gray-400 text-center mt-10">Yükleniyor...</Text>
        ) : filtered.length === 0 ? (
          <Text className="text-gray-500 dark:text-gray-400 text-center mt-10">Talep bulunamadı.</Text>
        ) : (
          <View className="flex-row flex-wrap" style={{ gap: 12 }}>
            {filtered.map((l) => (
              <Pressable key={l.id} onPress={() => router.push(`/ilan/${l.id}`)} style={{ width: cardW }} className="card-outline bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <View className="relative h-28 w-full">
                  <Image source={{ uri: l.coverImageUrl || PLACEHOLDER_IMAGE }} className="w-full h-full" resizeMode="cover" />
                  <View className={`absolute top-2 left-2 px-2 py-0.5 rounded-full ${statusCls[l.status]}`}><Text className={`text-[10px] font-semibold ${statusCls[l.status].split(" ").filter(c => c.startsWith("text")).join(" ")}`}>{l.status}</Text></View>
                  <Pressable onPress={() => remove(l.id)} className="absolute top-2 right-2 size-7 items-center justify-center rounded-full bg-black/50"><Trash2 size={13} color="#fff" /></Pressable>
                </View>
                <View className="p-3 gap-1.5">
                  <Text numberOfLines={1} className="text-sm font-bold text-gray-900 dark:text-white">{l.title}</Text>
                  <Text className="text-xs font-bold" style={{ color: PRIMARY }}>{l.budgetLabel}</Text>
                  <View className="flex-row items-center gap-3 mt-1">
                    <View className="flex-row items-center gap-1"><Eye size={12} color="#9ca3af" /><Text className="text-[11px] text-gray-400">{l.views}</Text></View>
                    <View className="flex-row items-center gap-1"><MessageCircle size={12} color="#9ca3af" /><Text className="text-[11px] text-gray-400">{l.offerCount}</Text></View>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
