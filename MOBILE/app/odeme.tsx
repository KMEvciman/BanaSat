import { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, Image, TextInput } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  Lock, Truck, CreditCard, BadgeCheck, ArrowRight, CheckCircle2, ShoppingBag,
} from "lucide-react-native";
import TopBar from "@/components/TopBar";
import { useAuth } from "@/context/AuthContext";
import { ordersApi } from "@/lib/api/services";
import { resolveImageUrl } from "@/lib/api/adapters";
import type { Order } from "@/lib/api/types";

const PRIMARY = "#5BB678";

export default function OdemeEkrani() {
  const router = useRouter();
  const params = useLocalSearchParams<{ order?: string }>();
  const orderId = typeof params.order === "string" ? params.order : undefined;
  const { user, isLoggedIn, loading: authLoading } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");

  // Form alanları (simülasyon).
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNo, setCardNo] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  useEffect(() => {
    if (!authLoading && !isLoggedIn) { router.replace("/giris"); return; }
    if (!orderId) { setNotFound(true); setLoading(false); return; }
    if (!isLoggedIn) return;
    ordersApi.detail(orderId)
      .then((o) => {
        setOrder(o);
        if (o.status !== "ODEME_BEKLENIYOR") setDone(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [authLoading, isLoggedIn, orderId]);

  // Kullanıcı bilgisini forma ön-doldur.
  useEffect(() => {
    if (user) { setName(user.name ?? ""); setPhone(user.phone ?? ""); }
  }, [user]);

  // Ödeme simülasyonu: backend pay çağrısı yapılır, başarılıysa başarı ekranı.
  const handlePay = async () => {
    if (!order || processing) return;
    if (!agreed) { setError("Devam etmek için sözleşmeyi onaylayınız."); return; }
    setError("");
    setProcessing(true);
    try {
      await ordersApi.pay(order.id);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ödeme tamamlanamadı.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <TopBar />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {/* Kırıntı menü */}
        <View className="flex-row items-center gap-1 mb-6">
          <Pressable onPress={() => router.push("/siparislerim" as never)}>
            <Text className="text-sm font-medium text-gray-500 dark:text-gray-400">Siparişlerim</Text>
          </Pressable>
          <Text className="text-sm text-gray-400"> / </Text>
          <Text className="text-sm font-semibold text-gray-900 dark:text-white">Ödeme</Text>
        </View>

        {loading ? (
          <Text className="text-gray-400 text-center mt-10">Yükleniyor...</Text>
        ) : notFound || !order ? (
          <View className="items-center py-20">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sipariş bulunamadı</Text>
            <Pressable onPress={() => router.replace("/siparislerim" as never)}>
              <Text className="font-semibold" style={{ color: PRIMARY }}>Siparişlerime dön</Text>
            </Pressable>
          </View>
        ) : done ? (
          /* Başarılı ödeme ekranı */
          <View className="items-center py-12">
            <View className="size-20 rounded-full items-center justify-center mb-6" style={{ backgroundColor: "rgba(91,182,120,0.1)" }}>
              <CheckCircle2 size={44} color={PRIMARY} />
            </View>
            <Text className="text-2xl font-black text-gray-900 dark:text-white mb-2">Ödeme Tamamlandı</Text>
            <Text className="text-center text-gray-500 dark:text-gray-400 mb-2">
              <Text className="font-bold text-gray-900 dark:text-white">{order.offer.listing.title}</Text> için alışverişiniz başarıyla tamamlandı.
            </Text>
            <Text className="text-sm text-gray-400 mb-8 text-center">Tutar: {order.amount.toLocaleString("tr-TR")} ₺ · Satıcı: {order.offer.seller.name}</Text>
            <View className="w-full gap-3">
              <Pressable onPress={() => router.replace("/siparislerim" as never)} className="flex-row items-center justify-center gap-2 h-12 px-6 rounded-xl" style={{ backgroundColor: PRIMARY }}>
                <ShoppingBag size={18} color="#fff" />
                <Text className="text-white font-bold">Siparişlerime Git</Text>
              </Pressable>
              <Pressable onPress={() => router.replace("/" as never)} className="flex-row items-center justify-center gap-2 h-12 px-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <Text className="text-gray-700 dark:text-gray-200 font-semibold">Ana Sayfa</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <>
            <View className="mb-6">
              <Text className="text-2xl font-black text-gray-900 dark:text-white">Güvenli Ödeme</Text>
              <Text className="text-gray-500 dark:text-gray-400 mt-2">Siparişinizi tamamlamak için teslimat ve ödeme bilgilerinizi giriniz.</Text>
            </View>

            {error ? (
              <View className="mb-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 px-4 py-3">
                <Text className="text-sm text-red-700 dark:text-red-400">{error}</Text>
              </View>
            ) : null}

            {/* Sipariş özeti */}
            <View className="card-outline bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden mb-6">
              <View className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <Text className="text-lg font-bold text-gray-900 dark:text-white">Sipariş Özeti</Text>
              </View>
              <View className="p-5">
                <View className="flex-row gap-4 mb-5">
                  <Image source={{ uri: resolveImageUrl(order.offer.listing.coverImageUrl) }} className="size-16 rounded-lg" resizeMode="cover" />
                  <View className="flex-1">
                    <Text numberOfLines={2} className="text-sm font-bold text-gray-900 dark:text-white mb-1">{order.offer.listing.title}</Text>
                    <Text className="text-xs text-gray-500 dark:text-gray-400">Satıcı: <Text style={{ color: PRIMARY }} className="font-medium">{order.offer.seller.name}</Text></Text>
                    <View className="flex-row items-center gap-1 mt-1">
                      <BadgeCheck size={14} color={PRIMARY} />
                      <Text className="text-xs" style={{ color: PRIMARY }}>Anlaşma sağlandı</Text>
                    </View>
                  </View>
                </View>
                <View className="flex-row items-end justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                  <Text className="text-xs text-gray-500 font-medium uppercase">Toplam Tutar</Text>
                  <Text className="text-2xl font-black" style={{ color: PRIMARY }}>{order.amount.toLocaleString("tr-TR")} ₺</Text>
                </View>
              </View>
            </View>

            {/* Teslimat bilgileri */}
            <View className="card-outline bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 mb-6">
              <View className="flex-row items-center gap-3 mb-5 pb-4 border-b border-gray-100 dark:border-gray-800">
                <View className="size-10 rounded-full items-center justify-center" style={{ backgroundColor: "rgba(91,182,120,0.1)" }}>
                  <Truck size={20} color={PRIMARY} />
                </View>
                <Text className="text-lg font-bold text-gray-900 dark:text-white">Teslimat Bilgileri</Text>
              </View>
              <View className="gap-4">
                <Field label="Ad Soyad"><Input value={name} onChangeText={setName} placeholder="Ad Soyad" /></Field>
                <Field label="Telefon"><Input value={phone} onChangeText={setPhone} placeholder="05XX XXX XX XX" keyboardType="phone-pad" /></Field>
                <Field label="Açık Adres"><Input value={address} onChangeText={setAddress} placeholder="Mahalle, cadde, sokak, kapı no..." multiline /></Field>
              </View>
            </View>

            {/* Kart bilgileri */}
            <View className="card-outline bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 mb-6">
              <View className="flex-row items-center gap-3 mb-5 pb-4 border-b border-gray-100 dark:border-gray-800">
                <View className="size-10 rounded-full items-center justify-center" style={{ backgroundColor: "rgba(91,182,120,0.1)" }}>
                  <CreditCard size={20} color={PRIMARY} />
                </View>
                <Text className="text-lg font-bold text-gray-900 dark:text-white">Kart Bilgileri</Text>
              </View>
              <View className="gap-4">
                <Field label="Kart Üzerindeki İsim"><Input value={cardName} onChangeText={setCardName} placeholder="AD SOYAD" autoCapitalize="characters" /></Field>
                <Field label="Kart Numarası"><Input value={cardNo} onChangeText={setCardNo} placeholder="0000 0000 0000 0000" keyboardType="numeric" maxLength={19} /></Field>
                <View className="flex-row gap-4">
                  <View className="flex-1"><Field label="Son Kullanma"><Input value={cardExp} onChangeText={setCardExp} placeholder="AA/YY" maxLength={5} /></Field></View>
                  <View className="flex-1"><Field label="CVV"><Input value={cardCvv} onChangeText={setCardCvv} placeholder="123" keyboardType="numeric" maxLength={4} /></Field></View>
                </View>
                <View className="flex-row items-center gap-1.5">
                  <Lock size={14} color="#9ca3af" />
                  <Text className="text-xs text-gray-400">Bu bir simülasyondur; gerçek bir ödeme alınmaz.</Text>
                </View>
              </View>
            </View>

            {/* Sözleşme onayı */}
            <Pressable onPress={() => setAgreed((v) => !v)} className="flex-row items-start gap-3 mb-4">
              <View className={`size-5 rounded border items-center justify-center ${agreed ? "border-transparent" : "border-gray-300 dark:border-gray-600"}`} style={agreed ? { backgroundColor: PRIMARY } : undefined}>
                {agreed && <CheckCircle2 size={14} color="#fff" />}
              </View>
              <Text className="flex-1 text-xs text-gray-500 dark:text-gray-400">Mesafeli Satış Sözleşmesi'ni okudum, onaylıyorum.</Text>
            </Pressable>

            {/* Ödemeyi tamamla */}
            <Pressable onPress={handlePay} disabled={processing} className="flex-row items-center justify-center gap-2 h-13 py-3.5 rounded-xl" style={{ backgroundColor: PRIMARY, opacity: processing ? 0.6 : 1 }}>
              {processing ? (
                <Text className="text-white font-bold">İşleniyor...</Text>
              ) : (
                <>
                  <Text className="text-white font-bold">Ödemeyi Tamamla</Text>
                  <ArrowRight size={20} color="#fff" />
                </>
              )}
            </Pressable>
          </>
        )}
      </ScrollView>
    </View>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View className="gap-2">
      <Text className="text-sm font-semibold text-gray-900 dark:text-gray-200">{label}</Text>
      {children}
    </View>
  );
}

function Input(props: React.ComponentProps<typeof TextInput>) {
  const { multiline, style, ...rest } = props;
  return (
    <TextInput
      placeholderTextColor="#9ca3af"
      multiline={multiline}
      className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4"
      style={[multiline ? { minHeight: 80, paddingTop: 12, textAlignVertical: "top" } : { height: 48 }, style]}
      {...rest}
    />
  );
}
