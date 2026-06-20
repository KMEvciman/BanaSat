import { useEffect, useState } from "react";
import { View, Text, ScrollView, TextInput, Pressable, Image, ActivityIndicator, Modal } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { UploadCloud, X, ChevronDown, ArrowRight } from "lucide-react-native";
import TopBar from "@/components/TopBar";
import KeyboardAware from "@/components/KeyboardAware";
import LocationSelect from "@/components/LocationSelect";
import { useAuth } from "@/context/AuthContext";
import { categoriesApi, listingsApi, uploadsApi } from "@/lib/api/services";
import type { Category } from "@/lib/api/types";
import { digitsOnly, formatThousands } from "@/lib/format";

const PRIMARY = "#5BB678";

export default function TalepOlustur() {
  const router = useRouter();
  const { isLoggedIn, loading: authLoading } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [catOpen, setCatOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) router.replace("/giris");
  }, [authLoading, isLoggedIn]);

  useEffect(() => { categoriesApi.list().then(setCategories).catch(() => {}); }, []);

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) { setError("Galeri izni gerekli."); return; }
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (res.canceled || !res.assets?.[0]) return;
    const a = res.assets[0];
    setUploading(true); setError("");
    try {
      const name = a.fileName || `cover_${Date.now()}.jpg`;
      const type = a.mimeType || "image/jpeg";
      const { url } = await uploadsApi.image({ uri: a.uri, name, type });
      setCoverUrl(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Görsel yüklenemedi.");
    } finally { setUploading(false); }
  };

  const submit = async () => {
    setError("");
    if (!coverUrl) { setError("Lütfen bir kapak görseli yükleyiniz."); return; }
    if (!categoryId) { setError("Kategori seçiniz."); return; }
    setSubmitting(true);
    try {
      const listing = await listingsApi.create({
        title, description, fullDescription, categoryId,
        budgetLabel: budget ? `${Number(budget).toLocaleString("tr-TR")} ₺` : "",
        location: province ? `${province}${district ? " / " + district : ""}` : undefined,
        province: province || undefined,
        district: district || undefined,
        coverImageUrl: coverUrl,
      });
      router.replace(`/ilan/${listing.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Talep oluşturulamadı.");
      setSubmitting(false);
    }
  };

  const selectedCat = categories.find((c) => c.id === categoryId);

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <TopBar />
      <KeyboardAware>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 48 }} keyboardShouldPersistTaps="handled">
        <Text className="text-2xl font-black text-gray-900 dark:text-white mb-1">Yeni Talep Oluştur</Text>
        <Text className="text-gray-500 dark:text-gray-400 mb-5">Satıcılardan en iyi teklifleri almak için detayları girin.</Text>

        {!!error && (
          <View className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 px-4 py-3 mb-4"><Text className="text-red-700 dark:text-red-400 text-sm">{error}</Text></View>
        )}

        <Label text="Talep Başlığı" />
        <TextInput value={title} onChangeText={setTitle} placeholder="Örn. iPhone 15 Pro Max arıyorum" placeholderTextColor="#9ca3af" className={inputCls} />

        <Label text="Kategori" />
        <Pressable onPress={() => setCatOpen(true)} className={`${inputCls} flex-row items-center justify-between`}>
          <Text className={selectedCat ? "text-gray-900 dark:text-white" : "text-gray-400"}>{selectedCat?.name || "Kategori Seçiniz"}</Text>
          <ChevronDown size={18} color="#9ca3af" />
        </Pressable>

        <Label text="Kısa Açıklama" />
        <TextInput value={description} onChangeText={setDescription} placeholder="Kartta görünecek kısa özet" placeholderTextColor="#9ca3af" className={inputCls} />

        <Label text="Detaylı Açıklama" />
        <TextInput value={fullDescription} onChangeText={setFullDescription} placeholder="İhtiyacınızın detayları..." placeholderTextColor="#9ca3af" multiline className={`${inputCls} min-h-[110px]`} style={{ textAlignVertical: "top" }} />

        <Label text="Bütçe (₺)" />
        <TextInput value={formatThousands(budget)} onChangeText={(t) => setBudget(digitsOnly(t))} keyboardType="numeric" placeholder="Örn. 60000" placeholderTextColor="#9ca3af" className={inputCls} />

        <Label text="Konum (İl / İlçe)" />
        <LocationSelect province={province} district={district} onChange={(p, d) => { setProvince(p); setDistrict(d); }} />

        <Label text="Kapak Görseli" />
        {coverUrl ? (
          <View className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <Image source={{ uri: coverUrl }} className="w-full h-44" resizeMode="cover" />
            <Pressable onPress={() => setCoverUrl("")} className="absolute top-2 right-2 size-8 items-center justify-center rounded-full bg-black/60"><X size={16} color="#fff" /></Pressable>
          </View>
        ) : (
          <Pressable onPress={pickImage} disabled={uploading} className="h-36 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 items-center justify-center gap-2">
            <UploadCloud size={26} color={uploading ? PRIMARY : "#9ca3af"} />
            <Text className="text-sm font-medium text-gray-500 dark:text-gray-400">{uploading ? "Yükleniyor..." : "Bilgisayardan görsel seç"}</Text>
          </Pressable>
        )}

        <Pressable onPress={submit} disabled={submitting} className="h-12 rounded-xl flex-row items-center justify-center gap-2 mt-6" style={{ backgroundColor: PRIMARY, opacity: submitting ? 0.6 : 1 }}>
          {submitting ? <ActivityIndicator color="#fff" /> : <><Text className="text-white font-bold">Talebi Yayınla</Text><ArrowRight size={18} color="#fff" /></>}
        </Pressable>
        </ScrollView>
      </KeyboardAware>

      {/* Kategori seçim modalı */}
      <Modal visible={catOpen} transparent animationType="slide" onRequestClose={() => setCatOpen(false)}>
        <Pressable className="flex-1 bg-black/50 justify-end" onPress={() => setCatOpen(false)}>
          <Pressable className="bg-white dark:bg-gray-900 rounded-t-2xl max-h-[70%]" onPress={(e) => e.stopPropagation()}>
            <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <Text className="text-lg font-bold text-gray-900 dark:text-white">Kategori Seçin</Text>
              <Pressable onPress={() => setCatOpen(false)}><X size={20} color="#737373" /></Pressable>
            </View>
            <ScrollView>
              {categories.map((c) => (
                <Pressable key={c.id} onPress={() => { setCategoryId(c.id); setCatOpen(false); }} className="px-5 py-3 border-b border-gray-50 dark:border-gray-800">
                  <Text className="text-gray-800 dark:text-gray-200">{c.name}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const inputCls = "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3 mb-1";

function Label({ text }: { text: string }) {
  return <Text className="text-sm font-semibold text-gray-700 dark:text-gray-200 mt-4 mb-1.5">{text}</Text>;
}
