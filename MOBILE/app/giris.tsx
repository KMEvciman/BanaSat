import { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react-native";
import TopBar from "@/components/TopBar";
import { useAuth } from "@/context/AuthContext";

const PRIMARY = "#5BB678";

export default function Giris() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setError(""); setBusy(true);
    try {
      await login(email.trim(), password);
      router.replace("/profil");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Giriş başarısız.");
    } finally { setBusy(false); }
  };

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <TopBar />
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 40 }}>
        <Text className="text-3xl font-black text-gray-900 dark:text-white text-center">Tekrar Hoş Geldin</Text>
        <Text className="text-gray-500 dark:text-gray-400 text-center mt-2 mb-8">Hesabına giriş yap</Text>

        {!!error && (
          <View className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 px-4 py-3 mb-4">
            <Text className="text-red-700 dark:text-red-400 text-sm">{error}</Text>
          </View>
        )}

        <Field icon={<Mail size={18} color="#9ca3af" />}>
          <TextInput value={email} onChangeText={setEmail} placeholder="E-posta" placeholderTextColor="#9ca3af" autoCapitalize="none" keyboardType="email-address" className="flex-1 text-gray-900 dark:text-white" />
        </Field>
        <Field icon={<Lock size={18} color="#9ca3af" />}>
          <TextInput value={password} onChangeText={setPassword} placeholder="Şifre" placeholderTextColor="#9ca3af" secureTextEntry={!show} className="flex-1 text-gray-900 dark:text-white" />
          <Pressable onPress={() => setShow(!show)} hitSlop={8}>{show ? <EyeOff size={18} color="#9ca3af" /> : <Eye size={18} color="#9ca3af" />}</Pressable>
        </Field>

        <Pressable onPress={submit} disabled={busy} className="h-12 rounded-xl flex-row items-center justify-center gap-2 mt-2" style={{ backgroundColor: PRIMARY, opacity: busy ? 0.6 : 1 }}>
          {busy ? <ActivityIndicator color="#fff" /> : <><Text className="text-white font-bold">Giriş Yap</Text><ArrowRight size={18} color="#fff" /></>}
        </Pressable>

        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-500 dark:text-gray-400">Hesabın yok mu? </Text>
          <Pressable onPress={() => router.replace("/kayit")}><Text className="font-semibold" style={{ color: PRIMARY }}>Kayıt Ol</Text></Pressable>
        </View>
      </ScrollView>
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
