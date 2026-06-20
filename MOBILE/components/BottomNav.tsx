import { View, Text, Pressable } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Home, ClipboardList, HandCoins, User as UserIcon } from "lucide-react-native";
import { useAuth } from "@/context/AuthContext";
import { useKeyboardHeight } from "@/components/KeyboardAware";

const PRIMARY = "#5BB678";

// Giriş yaptıktan sonra her sayfada sabit duran alt navigasyon çubuğu.
const TABS = [
  { href: "/", label: "Ana Sayfa", icon: Home },
  { href: "/taleplerim", label: "Taleplerim", icon: ClipboardList },
  { href: "/tekliflerim", label: "Tekliflerim", icon: HandCoins },
  { href: "/profil", label: "Profil", icon: UserIcon },
] as const;

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn } = useAuth();
  const keyboardHeight = useKeyboardHeight();

  // Giriş yapılmamışsa ya da klavye açıkken alt bar gösterilmez
  // (klavye açıkken gizlenmesi alttaki boşluğu önler).
  if (!isLoggedIn || keyboardHeight > 0) return null;

  return (
    <SafeAreaView edges={["bottom"]} className="bg-white dark:bg-background-dark border-t border-gray-200 dark:border-gray-800">
      <View className="flex-row items-center justify-around h-14">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          const Icon = tab.icon;
          const color = active ? PRIMARY : "#9ca3af";
          return (
            <Pressable
              key={tab.href}
              onPress={() => router.push(tab.href as never)}
              className="flex-1 items-center justify-center gap-0.5"
              hitSlop={4}
            >
              <Icon size={22} color={color} />
              <Text style={{ color }} className="text-[10px] font-semibold">{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}
