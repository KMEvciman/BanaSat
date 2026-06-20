import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Image,
  ActivityIndicator,
  Modal,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import {
  Camera,
  Mail,
  Phone,
  MapPin,
  UserRound,
  FileText,
  Save,
  Trash2,
  CheckCircle,
  Plus,
  Home,
  Star,
  Lock,
  X,
} from "lucide-react-native";
import TopBar from "@/components/TopBar";
import KeyboardAware, { useKeyboardHeight } from "@/components/KeyboardAware";
import LocationSelect from "@/components/LocationSelect";
import { useAuth } from "@/context/AuthContext";
import { usersApi } from "@/lib/api/services";
import { resolveAvatarUrl } from "@/lib/api/adapters";
import type { Address } from "@/lib/api/types";

const PRIMARY = "#5BB678";

export default function Profil() {
  const router = useRouter();
  const { isLoggedIn, user, loading: authLoading, updateProfile } = useAuth();
  const kbHeight = useKeyboardHeight();

  // Profil alanları
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Şifre değiştirme
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSaved, setPwSaved] = useState(false);
  const [pwBusy, setPwBusy] = useState(false);

  // Adres yönetimi
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addrModal, setAddrModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addrTitle, setAddrTitle] = useState("");
  const [addrProvince, setAddrProvince] = useState("");
  const [addrDistrict, setAddrDistrict] = useState("");
  const [addrFull, setAddrFull] = useState("");
  const [addrBusy, setAddrBusy] = useState(false);

  const loadAddresses = useCallback(() => {
    usersApi.listAddresses().then(setAddresses).catch(() => {});
  }, []);

  // Giriş yoksa yönlendir; varsa formu doldur.
  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.replace("/giris");
      return;
    }
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone ?? "");
      setBio(user.bio ?? "");
      setLocation(user.location ?? "");
      setProvince(user.province ?? "");
      setDistrict(user.district ?? "");
      setAvatarPreview(user.avatarUrl);
      loadAddresses();
    }
  }, [authLoading, isLoggedIn, user, loadAddresses]);

  // Galeriden görsel seç ve anında yükle.
  const handleAvatarPick = async () => {
    setError("");
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      setError("Galeri izni gerekli.");
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (res.canceled || !res.assets?.[0]) return;
    const a = res.assets[0];
    setUploading(true);
    try {
      const name = a.fileName || `avatar_${Date.now()}.jpg`;
      const type = a.mimeType || "image/jpeg";
      const updated = await usersApi.uploadAvatar({ uri: a.uri, name, type });
      setAvatarPreview(updated.avatarUrl);
      updateProfile({ avatarUrl: updated.avatarUrl });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fotoğraf yüklenemedi.");
    } finally {
      setUploading(false);
    }
  };

  // Profil bilgilerini kaydet.
  const handleSubmit = async () => {
    setError("");
    setSubmitting(true);
    try {
      const updated = await usersApi.updateProfile({
        name,
        email,
        phone,
        bio,
        province: province || undefined,
        district: district || undefined,
        location: province ? `${province}${district ? " / " + district : ""}` : location,
      });
      updateProfile(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Profil güncellenemedi.");
    } finally {
      setSubmitting(false);
    }
  };

  // Şifre değiştir.
  const handleChangePassword = async () => {
    setPwError("");
    setPwSaved(false);
    if (!currentPassword || !newPassword) {
      setPwError("Tüm alanları doldurun.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("Yeni parolalar eşleşmiyor.");
      return;
    }
    setPwBusy(true);
    try {
      await usersApi.changePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPwSaved(true);
      setTimeout(() => setPwSaved(false), 3000);
    } catch (err) {
      setPwError(err instanceof Error ? err.message : "Şifre değiştirilemedi.");
    } finally {
      setPwBusy(false);
    }
  };

  // Adres modalını aç (ekle / düzenle).
  const openAddrModal = (addr?: Address) => {
    setError("");
    if (addr) {
      setEditingId(addr.id);
      setAddrTitle(addr.title);
      setAddrProvince(addr.province);
      setAddrDistrict(addr.district);
      setAddrFull(addr.fullAddress ?? "");
    } else {
      setEditingId(null);
      setAddrTitle("");
      setAddrProvince("");
      setAddrDistrict("");
      setAddrFull("");
    }
    setAddrModal(true);
  };

  // Adres kaydet (yeni veya güncelle).
  const handleSaveAddress = async () => {
    if (!addrTitle.trim() || !addrProvince || !addrDistrict || addrBusy) return;
    setAddrBusy(true);
    try {
      if (editingId) {
        await usersApi.updateAddress(editingId, {
          title: addrTitle.trim(),
          province: addrProvince,
          district: addrDistrict,
          fullAddress: addrFull.trim() || undefined,
        });
      } else {
        await usersApi.createAddress({
          title: addrTitle.trim(),
          province: addrProvince,
          district: addrDistrict,
          fullAddress: addrFull.trim() || undefined,
        });
      }
      setAddrModal(false);
      loadAddresses();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Adres kaydedilemedi.");
    } finally {
      setAddrBusy(false);
    }
  };

  // Adres sil.
  const handleDeleteAddress = (id: string) => {
    Alert.alert("Adresi sil", "Bu adresi silmek istediğinize emin misiniz?", [
      { text: "İptal", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          try {
            await usersApi.removeAddress(id);
            setAddresses((prev) => prev.filter((a) => a.id !== id));
          } catch {
            // sessizce geç
          }
        },
      },
    ]);
  };

  // Varsayılan adres yap.
  const handleMakeDefault = async (id: string) => {
    try {
      await usersApi.updateAddress(id, { isDefault: true });
      loadAddresses();
    } catch {
      // sessizce geç
    }
  };

  const avatarUrl = resolveAvatarUrl(avatarPreview, name || "U");

  if (!isLoggedIn) return null;

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <TopBar />
      <KeyboardAware>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 48 }} keyboardShouldPersistTaps="handled">
        {/* Başlık */}
        <Text className="text-2xl font-black text-gray-900 dark:text-white">Profil Düzenle</Text>
        <Text className="text-gray-500 dark:text-gray-400 mt-1 mb-6">
          Kişisel bilgilerinizi güncelleyin ve profil fotoğrafınızı değiştirin.
        </Text>

        {!!error && (
          <View className="mb-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 px-4 py-3">
            <Text className="text-red-700 dark:text-red-400 text-sm">{error}</Text>
          </View>
        )}

        {/* Avatar kartı */}
        <View className="card-outline bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 items-center gap-4 mb-6">
          <View className="relative">
            <Image
              source={{ uri: avatarUrl }}
              className="size-28 rounded-full border-4 border-white dark:border-gray-800"
            />
            <Pressable
              onPress={handleAvatarPick}
              disabled={uploading}
              className="absolute bottom-0 right-0 size-10 rounded-full items-center justify-center border-2 border-white dark:border-gray-800"
              style={{ backgroundColor: PRIMARY, opacity: uploading ? 0.6 : 1 }}
            >
              {uploading ? <ActivityIndicator color="#fff" size="small" /> : <Camera size={18} color="#fff" />}
            </Pressable>
          </View>
          <View className="items-center">
            <Text className="text-lg font-bold text-gray-900 dark:text-white">{name || "İsim"}</Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400">{email}</Text>
          </View>
          <Text className="text-xs text-gray-400 dark:text-gray-500 text-center leading-relaxed">
            JPG, PNG veya GIF formatında, en fazla 5MB boyutunda bir fotoğraf yükleyebilirsiniz.
          </Text>
        </View>

        {/* Kişisel bilgiler kartı */}
        <View className="card-outline bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 mb-6">
          <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
            Kişisel Bilgiler
          </Text>

          <Label text="Ad Soyad" />
          <Field icon={<UserRound size={18} color="#9ca3af" />}>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Adınız Soyadınız"
              placeholderTextColor="#9ca3af"
              className="flex-1 text-gray-900 dark:text-white"
            />
          </Field>

          <Label text="E-posta Adresi" />
          <Field icon={<Mail size={18} color="#9ca3af" />}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="ornek@email.com"
              placeholderTextColor="#9ca3af"
              autoCapitalize="none"
              keyboardType="email-address"
              className="flex-1 text-gray-900 dark:text-white"
            />
          </Field>

          <Label text="Telefon Numarası" />
          <Field icon={<Phone size={18} color="#9ca3af" />}>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="05XX XXX XX XX"
              placeholderTextColor="#9ca3af"
              keyboardType="phone-pad"
              className="flex-1 text-gray-900 dark:text-white"
            />
          </Field>

          <View className="flex-row items-center gap-1.5 mt-4 mb-1.5">
            <MapPin size={16} color="#9ca3af" />
            <Text className="text-sm font-semibold text-gray-700 dark:text-gray-200">Konum (İl / İlçe)</Text>
          </View>
          <LocationSelect
            province={province}
            district={district}
            onChange={(p, d) => {
              setProvince(p);
              setDistrict(d);
            }}
          />

          <Label text="Hakkımda" />
          <View className="flex-row items-start gap-2 px-3 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <FileText size={18} color="#9ca3af" />
            <TextInput
              value={bio}
              onChangeText={(t) => setBio(t.slice(0, 500))}
              placeholder="Kendinizden kısaca bahsedin..."
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={4}
              className="flex-1 text-gray-900 dark:text-white min-h-[80px]"
              style={{ textAlignVertical: "top" }}
            />
          </View>
          <Text className="text-xs text-gray-400 dark:text-gray-500 text-right mt-1">{bio.length}/500</Text>

          {saved && (
            <View className="flex-row items-center gap-2 mt-4">
              <CheckCircle size={18} color="#16a34a" />
              <Text className="text-sm font-medium text-green-600 dark:text-green-400">
                Değişiklikler kaydedildi
              </Text>
            </View>
          )}

          <Pressable
            onPress={handleSubmit}
            disabled={submitting}
            className="h-12 rounded-xl flex-row items-center justify-center gap-2 mt-4"
            style={{ backgroundColor: PRIMARY, opacity: submitting ? 0.6 : 1 }}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Save size={18} color="#fff" />
                <Text className="text-white font-bold">Değişiklikleri Kaydet</Text>
              </>
            )}
          </Pressable>
        </View>

        {/* Şifre değiştirme kartı */}
        <View className="card-outline bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 mb-6">
          <View className="flex-row items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
            <Lock size={20} color={PRIMARY} />
            <Text className="text-lg font-bold text-gray-900 dark:text-white">Şifre Değiştir</Text>
          </View>

          {!!pwError && (
            <View className="mb-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 px-4 py-3">
              <Text className="text-red-700 dark:text-red-400 text-sm">{pwError}</Text>
            </View>
          )}

          <Label text="Mevcut Şifre" />
          <Field icon={<Lock size={18} color="#9ca3af" />}>
            <TextInput
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Mevcut şifreniz"
              placeholderTextColor="#9ca3af"
              secureTextEntry
              className="flex-1 text-gray-900 dark:text-white"
            />
          </Field>

          <Label text="Yeni Şifre" />
          <Field icon={<Lock size={18} color="#9ca3af" />}>
            <TextInput
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="En az 8 karakter"
              placeholderTextColor="#9ca3af"
              secureTextEntry
              className="flex-1 text-gray-900 dark:text-white"
            />
          </Field>

          <Label text="Yeni Şifre Tekrar" />
          <Field icon={<Lock size={18} color="#9ca3af" />}>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Yeni şifreyi tekrar girin"
              placeholderTextColor="#9ca3af"
              secureTextEntry
              className="flex-1 text-gray-900 dark:text-white"
            />
          </Field>

          {pwSaved && (
            <View className="flex-row items-center gap-2 mt-4">
              <CheckCircle size={18} color="#16a34a" />
              <Text className="text-sm font-medium text-green-600 dark:text-green-400">Şifre güncellendi</Text>
            </View>
          )}

          <Pressable
            onPress={handleChangePassword}
            disabled={pwBusy}
            className="h-12 rounded-xl flex-row items-center justify-center gap-2 mt-4"
            style={{ backgroundColor: PRIMARY, opacity: pwBusy ? 0.6 : 1 }}
          >
            {pwBusy ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Lock size={18} color="#fff" />
                <Text className="text-white font-bold">Şifreyi Güncelle</Text>
              </>
            )}
          </Pressable>
        </View>

        {/* Adreslerim kartı */}
        <View className="card-outline bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <View className="flex-row items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
            <View className="flex-row items-center gap-2">
              <Home size={20} color={PRIMARY} />
              <Text className="text-lg font-bold text-gray-900 dark:text-white">Adreslerim</Text>
            </View>
            <Pressable
              onPress={() => openAddrModal()}
              className="flex-row items-center gap-1.5 rounded-xl px-4 h-10"
              style={{ backgroundColor: PRIMARY }}
            >
              <Plus size={18} color="#fff" />
              <Text className="text-white text-sm font-semibold">Adres Ekle</Text>
            </Pressable>
          </View>

          {addresses.length === 0 ? (
            <Text className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
              Henüz kayıtlı adresiniz yok.
            </Text>
          ) : (
            <View className="gap-3">
              {addresses.map((a) => (
                <View
                  key={a.id}
                  className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 gap-2"
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-2 flex-1">
                      <Text className="font-bold text-gray-900 dark:text-white text-sm">{a.title}</Text>
                      {a.isDefault && (
                        <View className="px-2 py-0.5 rounded-full" style={{ backgroundColor: "#5BB67826" }}>
                          <Text className="text-[10px] font-semibold" style={{ color: PRIMARY }}>
                            Varsayılan
                          </Text>
                        </View>
                      )}
                    </View>
                    <View className="flex-row items-center gap-1">
                      {!a.isDefault && (
                        <Pressable
                          onPress={() => handleMakeDefault(a.id)}
                          hitSlop={6}
                          className="size-8 items-center justify-center rounded-lg"
                        >
                          <Star size={16} color="#9ca3af" />
                        </Pressable>
                      )}
                      <Pressable
                        onPress={() => openAddrModal(a)}
                        hitSlop={6}
                        className="size-8 items-center justify-center rounded-lg"
                      >
                        <FileText size={16} color="#9ca3af" />
                      </Pressable>
                      <Pressable
                        onPress={() => handleDeleteAddress(a.id)}
                        hitSlop={6}
                        className="size-8 items-center justify-center rounded-lg"
                      >
                        <Trash2 size={16} color="#ef4444" />
                      </Pressable>
                    </View>
                  </View>
                  <View className="flex-row items-center gap-1.5">
                    <MapPin size={14} color="#9ca3af" />
                    <Text className="text-sm text-gray-600 dark:text-gray-300">
                      {a.province} / {a.district}
                    </Text>
                  </View>
                  {!!a.fullAddress && (
                    <Text className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      {a.fullAddress}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
      </KeyboardAware>

      {/* Adres ekle/düzenle modalı */}
      <Modal visible={addrModal} transparent animationType="slide" onRequestClose={() => setAddrModal(false)}>
        <Pressable className="flex-1 bg-black/50 justify-end" style={{ paddingBottom: kbHeight }} onPress={() => setAddrModal(false)}>
          <Pressable
            className="bg-white dark:bg-gray-900 rounded-t-2xl max-h-[85%]"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <Text className="text-lg font-bold text-gray-900 dark:text-white">
                {editingId ? "Adresi Düzenle" : "Yeni Adres"}
              </Text>
              <Pressable onPress={() => setAddrModal(false)} hitSlop={8}>
                <X size={20} color="#737373" />
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
              <Label text="Adres Başlığı" />
              <Field>
                <TextInput
                  value={addrTitle}
                  onChangeText={setAddrTitle}
                  placeholder="Adres başlığı (Ev, İş vb.)"
                  placeholderTextColor="#9ca3af"
                  className="flex-1 text-gray-900 dark:text-white"
                />
              </Field>

              <Label text="Konum (İl / İlçe)" />
              <LocationSelect
                province={addrProvince}
                district={addrDistrict}
                onChange={(p, d) => {
                  setAddrProvince(p);
                  setAddrDistrict(d);
                }}
              />

              <Label text="Açık Adres (opsiyonel)" />
              <View className="flex-row items-start gap-2 px-3 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <TextInput
                  value={addrFull}
                  onChangeText={setAddrFull}
                  placeholder="Mahalle, sokak, no..."
                  placeholderTextColor="#9ca3af"
                  multiline
                  numberOfLines={2}
                  className="flex-1 text-gray-900 dark:text-white min-h-[56px]"
                  style={{ textAlignVertical: "top" }}
                />
              </View>

              <View className="flex-row gap-3 mt-6">
                <Pressable
                  onPress={() => setAddrModal(false)}
                  className="flex-1 h-12 rounded-xl items-center justify-center border border-gray-200 dark:border-gray-700"
                >
                  <Text className="text-gray-600 dark:text-gray-300 font-semibold">İptal</Text>
                </Pressable>
                <Pressable
                  onPress={handleSaveAddress}
                  disabled={addrBusy}
                  className="flex-1 h-12 rounded-xl items-center justify-center"
                  style={{ backgroundColor: PRIMARY, opacity: addrBusy ? 0.6 : 1 }}
                >
                  {addrBusy ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-white font-bold">Kaydet</Text>
                  )}
                </Pressable>
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function Label({ text }: { text: string }) {
  return <Text className="text-sm font-semibold text-gray-700 dark:text-gray-200 mt-4 mb-1.5">{text}</Text>;
}

function Field({ icon, children }: { icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <View className="flex-row items-center gap-2 h-12 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      {icon}
      {children}
    </View>
  );
}
