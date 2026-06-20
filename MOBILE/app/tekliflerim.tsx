import { useEffect, useState, useMemo, useCallback } from "react";
import { View, Text, ScrollView, Pressable, Image, Modal, TextInput, Alert, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { X, Trash2, Pencil, Save } from "lucide-react-native";
import TopBar from "@/components/TopBar";
import { useKeyboardHeight } from "@/components/KeyboardAware";
import { useAuth } from "@/context/AuthContext";
import { offersApi } from "@/lib/api/services";
import { PLACEHOLDER_IMAGE } from "@/lib/api/adapters";
import type { Offer, OfferStatus } from "@/lib/api/types";
import { digitsOnly, formatThousands } from "@/lib/format";

const PRIMARY = "#5BB678";
const filters = [
  { value: "tumu", label: "Tümü" },
  { value: "BEKLEMEDE", label: "Beklemede" },
  { value: "KABUL", label: "Kabul" },
  { value: "RED", label: "Red" },
  { value: "GERI_CEKILDI", label: "Geri Çekildi" },
];
const statusLabel: Record<OfferStatus, string> = { BEKLEMEDE: "Beklemede", KABUL: "Kabul Edildi", RED: "Reddedildi", GERI_CEKILDI: "Geri Çekildi" };
const statusCls: Record<OfferStatus, string> = {
  BEKLEMEDE: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
  KABUL: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400",
  RED: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
  GERI_CEKILDI: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
};

export default function Tekliflerim() {
  const router = useRouter();
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const { width } = useWindowDimensions();
  const cardW = (width - 16 * 2 - 12) / 2;

  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("tumu");
  const [sel, setSel] = useState<Offer | null>(null);

  useEffect(() => { if (!authLoading && !isLoggedIn) router.replace("/giris"); }, [authLoading, isLoggedIn]);

  const load = useCallback(() => {
    setLoading(true);
    offersApi.mine({ limit: 100 }).then((r) => setOffers(r.items)).catch(() => {}).finally(() => setLoading(false));
  }, []);
  useEffect(() => { if (user) load(); }, [user, load]);

  const filtered = useMemo(() => filter === "tumu" ? offers : offers.filter((o) => o.status === filter), [offers, filter]);

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <TopBar />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <Text className="text-2xl font-black text-gray-900 dark:text-white mb-4">Tekliflerim</Text>

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
          <Text className="text-gray-500 dark:text-gray-400 text-center mt-10">Teklif bulunamadı.</Text>
        ) : (
          <View className="flex-row flex-wrap" style={{ gap: 12 }}>
            {filtered.map((o) => (
              <Pressable key={o.id} onPress={() => setSel(o)} style={{ width: cardW }} className="card-outline bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <View className="relative h-28 w-full">
                  <Image source={{ uri: o.listing.coverImageUrl || PLACEHOLDER_IMAGE }} className="w-full h-full" resizeMode="cover" />
                  <View className={`absolute top-2 left-2 px-2 py-0.5 rounded-full ${statusCls[o.status]}`}><Text className={`text-[10px] font-semibold ${statusCls[o.status].split(" ").filter(c => c.startsWith("text")).join(" ")}`}>{statusLabel[o.status]}</Text></View>
                </View>
                <View className="p-3 gap-1.5">
                  <Text numberOfLines={1} className="text-sm font-bold text-gray-900 dark:text-white">{o.listing.title}</Text>
                  <Text className="text-xs text-gray-400">Teklifiniz</Text>
                  <Text className="text-sm font-bold" style={{ color: PRIMARY }}>{o.price.toLocaleString("tr-TR")} ₺</Text>
                  <View className="mt-1 rounded-lg py-1.5 items-center" style={{ backgroundColor: "rgba(91,182,120,0.12)" }}>
                    <Text className="text-xs font-semibold" style={{ color: PRIMARY }}>Teklifi Gör</Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>

      {sel && <OfferModal offer={sel} onClose={() => setSel(null)} onChanged={(updated) => {
        if (updated) setOffers((p) => p.map((x) => x.id === updated.id ? updated : x));
        else setOffers((p) => p.filter((x) => x.id !== sel.id));
        setSel(updated ?? null);
      }} />}
    </View>
  );
}

function OfferModal({ offer, onClose, onChanged }: { offer: Offer; onClose: () => void; onChanged: (o: Offer | null) => void }) {
  const [editing, setEditing] = useState(false);
  const [price, setPrice] = useState(String(offer.price));
  const [note, setNote] = useState(offer.note);
  const [busy, setBusy] = useState(false);
  const kbHeight = useKeyboardHeight();

  const save = async () => {
    if (!price || Number(price) < 1 || busy) return;
    setBusy(true);
    try { const u = await offersApi.update(offer.id, { price: Number(price), note: note.trim() }); onChanged(u); setEditing(false); }
    catch {} finally { setBusy(false); }
  };
  const withdraw = async () => { try { const u = await offersApi.withdraw(offer.id); onChanged(u); } catch {} };
  const remove = () => Alert.alert("Teklifi sil", "Emin misiniz?", [
    { text: "Vazgeç", style: "cancel" },
    { text: "Sil", style: "destructive", onPress: async () => { try { await offersApi.remove(offer.id); onChanged(null); } catch {} } },
  ]);

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/50 justify-end" style={{ paddingBottom: kbHeight }} onPress={onClose}>
        <Pressable className="bg-white dark:bg-gray-900 rounded-t-2xl max-h-[88%]" onPress={(e) => e.stopPropagation()}>
          <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <Text className="text-lg font-bold text-gray-900 dark:text-white">Teklif Detayı</Text>
            <Pressable onPress={onClose}><X size={20} color="#737373" /></Pressable>
          </View>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 20, gap: 16 }}>
            <View className="flex-row gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <Image source={{ uri: offer.listing.coverImageUrl || PLACEHOLDER_IMAGE }} className="size-14 rounded-lg" />
              <View className="flex-1">
                <Text numberOfLines={1} className="font-bold text-gray-900 dark:text-white">{offer.listing.title}</Text>
                <Text className="text-xs text-gray-500 mt-1">Talep Sahibi: {offer.listing.owner.name}</Text>
              </View>
            </View>

            <View className="items-center rounded-xl p-4" style={{ backgroundColor: "rgba(91,182,120,0.08)" }}>
              <Text className="text-xs text-gray-500 mb-1">Verdiğiniz Teklif</Text>
              {editing ? (
                <TextInput value={formatThousands(price)} onChangeText={(t) => setPrice(digitsOnly(t))} keyboardType="numeric" className="w-full text-center text-2xl font-black rounded-lg h-12 border border-primary/30 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" style={{ color: PRIMARY }} />
              ) : (
                <Text className="text-3xl font-black" style={{ color: PRIMARY }}>{offer.price.toLocaleString("tr-TR")} ₺</Text>
              )}
              <Text className="text-xs text-gray-400 mt-1">Talep Bütçesi: {offer.listing.budgetLabel}</Text>
            </View>

            <View>
              <Text className="font-semibold text-gray-900 dark:text-white mb-2">Teklif Notunuz</Text>
              {editing ? (
                <TextInput value={note} onChangeText={setNote} multiline className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white min-h-[80px]" style={{ textAlignVertical: "top" }} />
              ) : (
                <View className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50"><Text className="text-gray-700 dark:text-gray-300">{offer.note}</Text></View>
              )}
            </View>

            {offer.status === "BEKLEMEDE" && (
              editing ? (
                <View className="flex-row gap-3">
                  <Pressable onPress={() => setEditing(false)} className="flex-1 h-11 rounded-xl border border-gray-200 dark:border-gray-700 items-center justify-center"><Text className="text-gray-600 dark:text-gray-300 font-semibold">Vazgeç</Text></Pressable>
                  <Pressable onPress={save} disabled={busy} className="flex-1 h-11 rounded-xl items-center justify-center flex-row gap-2" style={{ backgroundColor: PRIMARY }}><Save size={16} color="#fff" /><Text className="text-white font-semibold">{busy ? "..." : "Kaydet"}</Text></Pressable>
                </View>
              ) : (
                <View className="flex-row gap-3">
                  <Pressable onPress={() => setEditing(true)} className="flex-1 h-11 rounded-xl items-center justify-center flex-row gap-2" style={{ backgroundColor: "rgba(91,182,120,0.12)" }}><Pencil size={16} color={PRIMARY} /><Text className="font-semibold" style={{ color: PRIMARY }}>Düzenle</Text></Pressable>
                  <Pressable onPress={withdraw} className="flex-1 h-11 rounded-xl bg-amber-50 dark:bg-amber-900/20 items-center justify-center"><Text className="text-amber-700 dark:text-amber-400 font-semibold">Geri Çek</Text></Pressable>
                </View>
              )
            )}

            <Pressable onPress={remove} className="h-11 rounded-xl border border-red-300 dark:border-red-500/40 items-center justify-center flex-row gap-2"><Trash2 size={16} color="#ef4444" /><Text className="text-red-600 dark:text-red-400 font-semibold">Teklifi Sil</Text></Pressable>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
