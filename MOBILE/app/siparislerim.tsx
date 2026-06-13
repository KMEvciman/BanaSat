import { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, Pressable, Image, Modal } from "react-native";
import { useRouter } from "expo-router";
import {
  ShoppingBag, Package, Wallet, Info, X, EyeOff, Calendar, Truck,
} from "lucide-react-native";
import TopBar from "@/components/TopBar";
import { useAuth } from "@/context/AuthContext";
import { ordersApi } from "@/lib/api/services";
import { resolveImageUrl, resolveAvatarUrl } from "@/lib/api/adapters";
import type { Order, OrderStatus } from "@/lib/api/types";

const PRIMARY = "#5BB678";

// Sipariş durumu etiket + renk eşlemesi. (Bu projede ödeme = tamamlandı.)
const STATUS_META: Record<OrderStatus, { label: string; cls: string }> = {
  ODEME_BEKLENIYOR: { label: "Ödeme Bekleniyor", cls: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400" },
  ODENDI: { label: "Tamamlandı", cls: "bg-primary/15 text-primary" },
  HAZIRLANIYOR: { label: "Hazırlanıyor", cls: "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400" },
  KARGODA: { label: "Kargoda", cls: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400" },
  TESLIM_EDILDI: { label: "Tamamlandı", cls: "bg-primary/15 text-primary" },
  IPTAL: { label: "İptal", cls: "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400" },
};

// Tamamlanmış durum kontrolü (ödendi ya da teslim edildi).
const isCompleted = (s: OrderStatus) => s === "ODENDI" || s === "TESLIM_EDILDI";

// Rozet metin rengini className'den ayıkla (durum renkleriyle uyumlu kalsın).
const statusTextCls = (cls: string) =>
  cls.split(" ").filter((c) => c.includes("text-")).join(" ");

type Tab = "purchases" | "sales";

export default function Siparislerim() {
  const router = useRouter();
  const { isLoggedIn, loading: authLoading } = useAuth();

  const [tab, setTab] = useState<Tab>("purchases");
  const [purchases, setPurchases] = useState<Order[]>([]);
  const [sales, setSales] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);

  // Alımlar ve satışları paralel çek.
  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      ordersApi.myPurchases().catch(() => [] as Order[]),
      ordersApi.mySales().catch(() => [] as Order[]),
    ])
      .then(([p, s]) => { setPurchases(p); setSales(s); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) { router.replace("/giris"); return; }
    if (isLoggedIn) load();
  }, [authLoading, isLoggedIn, load]);

  const list = tab === "purchases" ? purchases : sales;

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <TopBar />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {/* Başlık */}
        <View className="flex-row items-center gap-3 mb-6">
          <View className="size-11 rounded-xl items-center justify-center" style={{ backgroundColor: "rgba(91,182,120,0.1)" }}>
            <ShoppingBag size={22} color={PRIMARY} />
          </View>
          <View className="flex-1">
            <Text className="text-2xl font-black text-gray-900 dark:text-white">Siparişlerim</Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400">Anlaşılan tekliflerden oluşan siparişleriniz</Text>
          </View>
        </View>

        {/* Sekmeler */}
        <View className="flex-row gap-2 mb-6 border-b border-gray-100 dark:border-gray-800">
          <TabButton active={tab === "purchases"} onPress={() => setTab("purchases")} label="Alımlarım" count={purchases.length} />
          <TabButton active={tab === "sales"} onPress={() => setTab("sales")} label="Satışlarım" count={sales.length} />
        </View>

        {loading ? (
          <Text className="text-gray-400 text-center mt-10">Yükleniyor...</Text>
        ) : list.length === 0 ? (
          <View className="items-center py-20">
            <Package size={48} color="#d1d5db" />
            <Text className="text-gray-500 dark:text-gray-400 mt-4">
              {tab === "purchases" ? "Henüz bir alımınız yok." : "Henüz bir satışınız yok."}
            </Text>
          </View>
        ) : (
          <View className="gap-4">
            {list.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                isBuyer={tab === "purchases"}
                onDetails={() => setDetailOrder(order)}
                onPay={() => router.push(`/odeme?order=${order.id}` as never)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {detailOrder && (
        <OrderDetailModal order={detailOrder} isBuyer={tab === "purchases"} onClose={() => setDetailOrder(null)} />
      )}
    </View>
  );
}

function TabButton({ active, onPress, label, count }: { active: boolean; onPress: () => void; label: string; count: number }) {
  return (
    <Pressable onPress={onPress} className="relative px-4 py-3">
      <View className="flex-row items-center gap-1">
        <Text className={`text-sm font-semibold ${active ? "text-primary" : "text-gray-500 dark:text-gray-400"}`} style={active ? { color: PRIMARY } : undefined}>{label}</Text>
        <View className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-full">
          <Text className="text-xs text-gray-500 dark:text-gray-400">{count}</Text>
        </View>
      </View>
      {active && <View className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ backgroundColor: PRIMARY }} />}
    </Pressable>
  );
}

function OrderCard({ order, isBuyer, onDetails, onPay }: { order: Order; isBuyer: boolean; onDetails: () => void; onPay: () => void }) {
  const meta = STATUS_META[order.status];
  const counterpart = isBuyer ? order.offer.seller : order.buyer;
  const listing = order.offer.listing;

  return (
    <View className="card-outline bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <Image source={{ uri: resolveImageUrl(listing.coverImageUrl) }} className="w-full h-32" resizeMode="cover" />
      <View className="p-4 gap-3">
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1">
            <Text className="text-[11px] font-semibold uppercase" style={{ color: PRIMARY }}>{listing.category.name}</Text>
            <Text numberOfLines={1} className="font-bold text-gray-900 dark:text-white">{listing.title}</Text>
          </View>
          <View className={`px-2.5 py-1 rounded-full ${meta.cls}`}>
            <Text className={`text-[11px] font-semibold ${statusTextCls(meta.cls)}`}>{meta.label}</Text>
          </View>
        </View>

        {/* Karşı taraf */}
        <View className="flex-row items-center gap-2">
          <Image source={{ uri: resolveAvatarUrl(counterpart.avatarUrl, counterpart.name) }} className="size-6 rounded-full" />
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            {isBuyer ? "Satıcı" : "Alıcı"}: <Text className="font-semibold text-gray-700 dark:text-gray-200">{counterpart.name}</Text>
          </Text>
        </View>

        <View className="flex-row items-end justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
          <View>
            <Text className="text-xs text-gray-500">Tutar</Text>
            <Text className="text-2xl font-black" style={{ color: PRIMARY }}>{order.amount.toLocaleString("tr-TR")} ₺</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Pressable onPress={onDetails} className="flex-row items-center gap-1.5 h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-700">
              <Info size={16} color="#737373" />
              <Text className="text-gray-600 dark:text-gray-300 text-sm font-semibold">Ayrıntılar</Text>
            </Pressable>
            {isBuyer && order.status === "ODEME_BEKLENIYOR" && (
              <Pressable onPress={onPay} className="flex-row items-center gap-2 h-10 px-5 rounded-xl" style={{ backgroundColor: PRIMARY }}>
                <Wallet size={17} color="#fff" />
                <Text className="text-white text-sm font-semibold">Ödemeye Geç</Text>
              </Pressable>
            )}
            {isCompleted(order.status) && (
              <View className="px-3 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: "rgba(91,182,120,0.15)" }}>
                <Text className="text-sm font-semibold" style={{ color: PRIMARY }}>Tamamlandı</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

// Geçmiş sipariş/talep ayrıntıları. İlanın artık aktif (görünür) olmadığını belirtir.
function OrderDetailModal({ order, isBuyer, onClose }: { order: Order; isBuyer: boolean; onClose: () => void }) {
  const meta = STATUS_META[order.status];
  const counterpart = isBuyer ? order.offer.seller : order.buyer;
  const listing = order.offer.listing;
  const completed = isCompleted(order.status);

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/50 justify-end" onPress={onClose}>
        <Pressable className="bg-white dark:bg-gray-900 rounded-t-2xl max-h-[88%]" onPress={(e) => e.stopPropagation()}>
          <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <Text className="text-lg font-bold text-gray-900 dark:text-white">Sipariş Ayrıntıları</Text>
            <Pressable onPress={onClose}><X size={20} color="#737373" /></Pressable>
          </View>

          <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
            {/* Pasif/arşiv uyarısı */}
            {completed && (
              <View className="flex-row items-center gap-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2.5">
                <EyeOff size={16} color="#9ca3af" />
                <Text className="flex-1 text-sm text-gray-500 dark:text-gray-400">Bu talep tamamlandı ve artık yayında (görünür) değil.</Text>
              </View>
            )}

            {/* İlan özeti (pasifse soluk) */}
            <View className={`flex-row gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 ${completed ? "opacity-70" : ""}`}>
              <Image source={{ uri: resolveImageUrl(listing.coverImageUrl) }} className="size-16 rounded-lg" resizeMode="cover" />
              <View className="flex-1">
                <Text className="text-[11px] font-semibold uppercase" style={{ color: PRIMARY }}>{listing.category.name}</Text>
                <Text numberOfLines={1} className="font-bold text-gray-900 dark:text-white">{listing.title}</Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">{isBuyer ? "Satıcı" : "Alıcı"}: {counterpart.name}</Text>
              </View>
            </View>

            {/* Bilgiler */}
            <View className="gap-3">
              <Row label="Durum" value={
                <View className={`px-2.5 py-1 rounded-full ${meta.cls}`}>
                  <Text className={`text-[11px] font-semibold ${statusTextCls(meta.cls)}`}>{meta.label}</Text>
                </View>
              } />
              <Row label="Tutar" value={<Text className="font-bold" style={{ color: PRIMARY }}>{order.amount.toLocaleString("tr-TR")} ₺</Text>} />
              <Row label="Teslim Süresi" value={
                <View className="flex-row items-center gap-1">
                  <Truck size={14} color="#737373" />
                  <Text className="text-gray-700 dark:text-gray-200">{order.offer.deliveryTime}</Text>
                </View>
              } />
              <Row label="Sipariş Tarihi" value={
                <View className="flex-row items-center gap-1">
                  <Calendar size={14} color="#737373" />
                  <Text className="text-gray-700 dark:text-gray-200">{new Date(order.createdAt).toLocaleDateString("tr-TR")}</Text>
                </View>
              } />
              {order.shippingName && (
                <Row label="Teslimat" value={<Text className="text-gray-700 dark:text-gray-200">{order.shippingName} · {order.shippingCity}</Text>} />
              )}
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-sm text-gray-500 dark:text-gray-400">{label}</Text>
      {value}
    </View>
  );
}
