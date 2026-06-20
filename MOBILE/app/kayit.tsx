import { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Mail, Lock, User as UserIcon, Phone, ArrowRight } from "lucide-react-native";
import TopBar from "@/components/TopBar";
import KeyboardAware from "@/components/KeyboardAware";
import LocationSelect from "@/components/LocationSelect";
import { useAuth } from "@/context/AuthContext";

const PRIMARY = "#5BB678";

export default function Kayit() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setError("");
    if (password !== confirm) { setError("Parolalar eşleşmiyor."); return; }
    setBusy(true);
    try {
      await register(name.trim(), email.trim(), password, phone || undefined, province || undefined, district || undefined);
      router.replace("/");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kayıt başarısız.");
    } finally { setBusy(false); }
  };

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <TopBar />
      <KeyboardAware>
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20, paddingTop: 32, paddingBottom: 48 }} keyboardShouldPersistTaps="handled">
        <Text className="text-3xl font-black text-gray-900 dark:text-white text-center">Hesap Oluştur</Text>
        <Text className="text-gray-500 dark:text-gray-400 text-center mt-2 mb-8">Ücretsiz kayıt ol</Text>

        {!!error && (
          <View className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 px-4 py-3 mb-4">
            <Text className="text-red-700 dark:text-red-400 text-sm">{error}</Text>
          </View>
        )}

        <Field icon={<UserIcon size={18} color="#9ca3af" />}>
          <TextInput value={name} onChangeText={setName} placeholder="Ad Soyad" placeholderTextColor="#9ca3af" className="flex-1 text-gray-900 dark:text-white" />
        </Field>
        <Field icon={<Mail size={18} color="#9ca3af" />}>
          <TextInput value={email} onChangeText={setEmail} placeholder="E-posta" placeholderTextColor="#9ca3af" autoCapitalize="none" keyboardType="email-address" className="flex-1 text-gray-900 dark:text-white" />
        </Field>
        <Field icon={<Phone size={18} color="#9ca3af" />}>
          <TextInput value={phone} onChangeText={setPhone} placeholder="Telefon (opsiyonel)" placeholderTextColor="#9ca3af" keyboardType="phone-pad" className="flex-1 text-gray-900 dark:text-white" />
        </Field>

        <Text className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Konum (İl / İlçe)</Text>
        <View className="mb-4">
          <LocationSelect province={province} district={district} onChange={(p, d) => { setProvince(p); setDistrict(d); }} />
        </View>

        <Field icon={<Lock size={18} color="#9ca3af" />}>
          <TextInput value={password} onChangeText={setPassword} placeholder="Şifre (en az 8 karakter)" placeholderTextColor="#9ca3af" secureTextEntry className="flex-1 text-gray-900 dark:text-white" />
        </Field>
        <Field icon={<Lock size={18} color="#9ca3af" />}>
          <TextInput value={confirm} onChangeText={setConfirm} placeholder="Şifre Tekrar" placeholderTextColor="#9ca3af" secureTextEntry className="flex-1 text-gray-900 dark:text-white" />
        </Field>

        <Pressable onPress={submit} disabled={busy} className="h-12 rounded-xl flex-row items-center justify-center gap-2 mt-2" style={{ backgroundColor: PRIMARY, opacity: busy ? 0.6 : 1 }}>
          {busy ? <ActivityIndicator color="#fff" /> : <><Text className="text-white font-bold">Kayıt Ol</Text><ArrowRight size={18} color="#fff" /></>}
        </Pressable>

        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-500 dark:text-gray-400">Zaten hesabın var mı? </Text>
          <Pressable onPress={() => router.replace("/giris")}><Text className="font-semibold" style={{ color: PRIMARY }}>Giriş Yap</Text></Pressable>
        </View>
        </ScrollView>
      </KeyboardAware>
    </View>
  );
}

function Field({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <View className="flex-row items-center gap-2 h-12 px-3 mb-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      {icon}
      {children}
    </View>
  );
}
