import { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, Image, Pressable, TextInput, ActivityIndicator, Modal } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MapPin, Eye, Clock, Star, BadgeCheck, Check, MessageCircle, X } from "lucide-react-native";
import TopBar from "@/components/TopBar";
import KeyboardAware from "@/components/KeyboardAware";
import { useAuth } from "@/context/AuthContext";
import { listingsApi, offersApi, messagesApi } from "@/lib/api/services";
import { formatTimeLeft, PLACEHOLDER_IMAGE, resolveImageUrl, resolveAvatarUrl } from "@/lib/api/adapters";
import type { ListingDetail } from "@/lib/api/types";
import { digitsOnly, formatThousands } from "@/lib/format";

const PRIMARY = "#5BB678";

const statusMeta: Record<string, { label: string; cls: string }> = {
  AKTIF: { label: "Aktif", cls: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400" },
  BEKLEMEDE: { label: "Beklemede", cls: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400" },
  TAMAMLANDI: { label: "Tamamlandı", cls: "bg-primary/15 text-primary" },
  IPTAL: { label: "İptal", cls: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400" },
};

export default function IlanDetay() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();

  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lightbox, setLightbox] = useState<string | null>(null);

  const [price, setPrice] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    listingsApi.detail(String(id)).then(setListing).catch(() => setError("İlan bulunamadı.")).finally(() => setLoading(false));
  }, [id]);
  useEffect(() => { load(); }, [load]);

  const isOwner = !!user && !!listing && user.id === listing.owner.id;

  const submitOffer = async () => {
    if (!isLoggedIn) { router.push("/giris"); return; }
    if (!price || Number(price) < 1 || note.trim().length < 10) { setError("Fiyat ve en az 10 karakterlik not gerekli."); return; }
    setSubmitting(true); setError("");
    try {
      const conv = await messagesApi.createOrGet({ listingId: String(id) });
      await messagesApi.sendOffer(conv.id, { price: Number(price), note: note.trim() });
      router.push(`/mesajlar?c=${conv.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Teklif gönderilemedi.");
    } finally { setSubmitting(false); }
  };

  const offerAction = async (offerId: string, action: "accept" | "reject") => {
    try {
      if (action === "accept") await offersApi.accept(offerId); else await offersApi.reject(offerId);
      load();
    } catch (e) { setError(e instanceof Error ? e.message : "İşlem başarısız."); }
  };

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <TopBar />
      {loading ? (
        <View className="flex-1 items-center justify-center"><ActivityIndicator color={PRIMARY} /></View>
      ) : !listing ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-gray-900 dark:text-white text-lg font-bold">İlan bulunamadı</Text>
        </View>
      ) : (
        <KeyboardAware>
        <ScrollView contentContainerStyle={{ paddingBottom: 32 }} keyboardShouldPersistTaps="handled">
          {/* Kapak */}
          <Pressable onPress={() => setLightbox(resolveImageUrl(listing.coverImageUrl))}>
            <Image source={{ uri: resolveImageUrl(listing.coverImageUrl) }} className="w-full h-56" resizeMode="cover" />
          </Pressable>

          <View className="p-4 gap-4">
            {!!error && <Text className="text-red-500 text-sm">{error}</Text>}

            <View className="flex-row items-center gap-2">
              <View className={`px-2.5 py-1 rounded-full ${statusMeta[listing.status].cls}`}>
                <Text className={`text-xs font-semibold ${statusMeta[listing.status].cls.split(" ").filter(c => c.startsWith("text")).join(" ")}`}>{statusMeta[listing.status].label}</Text>
              </View>
              <Text className="text-primary text-xs font-bold" style={{ color: PRIMARY }}>{listing.category.name}</Text>
            </View>

            <Text className="text-2xl font-black text-gray-900 dark:text-white">{listing.title}</Text>

            <View className="flex-row flex-wrap gap-x-4 gap-y-1">
              {!!listing.location && <Meta icon={<MapPin size={14} color="#9ca3af" />} text={listing.location} />}
              <Meta icon={<Eye size={14} color="#9ca3af" />} text={`${listing.views} görüntülenme`} />
              <Meta icon={<Clock size={14} color="#9ca3af" />} text={formatTimeLeft(listing.deadline)} />
            </View>

            {/* Galeri */}
            {listing.images.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-1">
                {listing.images.map((img) => (
                  <Pressable key={img.id} onPress={() => setLightbox(resolveImageUrl(img.url))} className="mx-1">
                    <Image source={{ uri: resolveImageUrl(img.url) }} className="size-20 rounded-xl" />
                  </Pressable>
                ))}
              </ScrollView>
            )}

            {/* Bütçe */}
            <View className="card-outline bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 items-center">
              <Text className="text-xs text-gray-500 uppercase font-semibold">Bütçe</Text>
              <Text className="text-2xl font-black text-gray-900 dark:text-white mt-1">{listing.budgetLabel}</Text>
            </View>

            {/* Açıklama */}
            <View className="card-outline bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
              <Text className="text-xs uppercase text-gray-500 font-semibold mb-2">Detaylı Açıklama</Text>
              <Text className="text-gray-700 dark:text-gray-300 leading-relaxed">{listing.fullDescription}</Text>
            </View>

            {/* İlan sahibi */}
            <Pressable onPress={() => router.push(`/kullanici/${listing.owner.id}`)} className="card-outline bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 flex-row items-center gap-3">
              <Image source={{ uri: resolveAvatarUrl(listing.owner.avatarUrl, listing.owner.name) }} className="size-12 rounded-full" />
              <View className="flex-1">
                <View className="flex-row items-center gap-1">
                  <Text className="font-bold text-gray-900 dark:text-white">{listing.owner.name}</Text>
                  {listing.owner.isVerified && <BadgeCheck size={14} color={PRIMARY} />}
                </View>
                <View className="flex-row items-center gap-1 mt-0.5">
                  <Star size={13} color="#facc15" fill="#facc15" />
                  <Text className="text-xs text-gray-600 dark:text-gray-300">{listing.owner.ratingAvg} ({listing.owner.ratingCount})</Text>
                </View>
              </View>
            </Pressable>

            {/* Teklif verme (sahibi değilse + aktifse) */}
            {!isOwner && listing.status === "AKTIF" && (
              isLoggedIn ? (
                <View className="card-outline bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 gap-3">
                  <Text className="font-bold text-gray-900 dark:text-white">Teklif Ver</Text>
                  <TextInput value={formatThousands(price)} onChangeText={(t) => setPrice(digitsOnly(t))} keyboardType="numeric" placeholder="Fiyat (₺)" placeholderTextColor="#9ca3af" className="h-11 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
                  <TextInput value={note} onChangeText={setNote} placeholder="Teklif notunuz (en az 10 karakter)" placeholderTextColor="#9ca3af" multiline className="min-h-[80px] p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
                  <Pressable onPress={submitOffer} disabled={submitting} className="h-11 rounded-xl items-center justify-center" style={{ backgroundColor: PRIMARY, opacity: submitting ? 0.6 : 1 }}>
                    <Text className="text-white font-bold">{submitting ? "Gönderiliyor..." : "Teklifi Gönder"}</Text>
                  </Pressable>
                </View>
              ) : (
                <Pressable onPress={() => router.push("/giris")} className="h-12 rounded-xl items-center justify-center" style={{ backgroundColor: PRIMARY }}>
                  <Text className="text-white font-bold">Teklif vermek için giriş yap</Text>
                </Pressable>
              )
            )}

            {/* Gelen teklifler (yalnızca sahibi) */}
            {isOwner && (
              <View className="gap-3">
                <Text className="text-lg font-bold text-gray-900 dark:text-white">Gelen Teklifler ({listing.offers.length})</Text>
                {listing.offers.length === 0 && <Text className="text-gray-500 text-sm">Henüz teklif yok.</Text>}
                {listing.offers.map((o) => (
                  <View key={o.id} className="card-outline bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 gap-3">
                    <View className="flex-row items-center gap-3">
                      <Image source={{ uri: resolveAvatarUrl(o.seller.avatarUrl, o.seller.name) }} className="size-10 rounded-full" />
                      <View className="flex-1">
                        <Text className="font-bold text-gray-900 dark:text-white">{o.seller.name}</Text>
                        <Text className="text-xs text-gray-500">{o.deliveryTime}</Text>
                      </View>
                      <Text className="text-xl font-black" style={{ color: PRIMARY }}>{o.price.toLocaleString("tr-TR")} ₺</Text>
                    </View>
                    <Text className="text-sm text-gray-600 dark:text-gray-300">{o.note}</Text>
                    <View className="flex-row gap-2">
                      <Pressable onPress={() => router.push(`/mesajlar?c=new&listing=${listing.id}&seller=${o.seller.id}`)} className="flex-1 h-10 rounded-xl border border-gray-200 dark:border-gray-700 items-center justify-center flex-row gap-1">
                        <MessageCircle size={15} color="#737373" /><Text className="text-gray-700 dark:text-gray-200 text-sm font-semibold">Mesaj</Text>
                      </Pressable>
                      {o.status === "BEKLEMEDE" && (
                        <>
                          <Pressable onPress={() => offerAction(o.id, "reject")} className="flex-1 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 items-center justify-center"><Text className="text-red-600 dark:text-red-400 text-sm font-semibold">Reddet</Text></Pressable>
                          <Pressable onPress={() => offerAction(o.id, "accept")} className="flex-1 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: PRIMARY }}><Text className="text-white text-sm font-semibold">Kabul</Text></Pressable>
                        </>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
        </KeyboardAware>
      )}

      {/* Lightbox */}
      <Modal visible={!!lightbox} transparent animationType="fade" onRequestClose={() => setLightbox(null)}>
        <Pressable className="flex-1 bg-black/90 items-center justify-center" onPress={() => setLightbox(null)}>
          <Pressable onPress={() => setLightbox(null)} className="absolute top-12 right-5 z-10 size-10 items-center justify-center rounded-full bg-white/10"><X size={22} color="#fff" /></Pressable>
          {!!lightbox && <Image source={{ uri: lightbox }} style={{ width: "92%", height: "70%" }} resizeMode="contain" />}
        </Pressable>
      </Modal>
    </View>
  );
}

function Meta({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <View className="flex-row items-center gap-1">
      {icon}
      <Text className="text-xs text-gray-500 dark:text-gray-400">{text}</Text>
    </View>
  );
}
