import { useState, useEffect } from "react";
import { View, Text, Pressable, Modal, ScrollView } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronLeft, Menu, X, Sun, Moon, MessageSquare, ClipboardList,
  HandCoins, ShoppingBag, User as UserIcon, LogOut, LogIn, UserPlus, Plus,
} from "lucide-react-native";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { messagesApi } from "@/lib/api/services";

const PRIMARY = "#5BB678";

/** Web navbar'ının mobil karşılığı: logo + tema + menü (hamburger). */
export default function TopBar({ showBack = true }: { showBack?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const { mode, toggle } = useTheme();
  const { isLoggedIn, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const isDark = mode === "dark";
  const iconColor = isDark ? "#d4d4d4" : "#525252";

  useEffect(() => {
    if (!isLoggedIn) { setUnread(0); return; }
    let active = true;
    const fetchUnread = () =>
      messagesApi.list().then((c) => { if (active) setUnread(c.reduce((s, x) => s + x.unreadCount, 0)); }).catch(() => {});
    fetchUnread();
    const t = setInterval(fetchUnread, 15000);
    return () => { active = false; clearInterval(t); };
  }, [isLoggedIn]);

  const go = (href: string) => { setMenuOpen(false); router.push(href as never); };
  const onLogout = async () => { setMenuOpen(false); await logout(); router.replace("/"); };

  const atHome = pathname === "/";

  return (
    <SafeAreaView edges={["top"]} className="bg-white dark:bg-background-dark border-b border-gray-200 dark:border-gray-800">
      <View className="flex-row items-center justify-between px-4 h-14">
        {/* Sol: geri (ana sayfada gizli) */}
        <View className="w-20">
          {showBack && !atHome && (
            <Pressable onPress={() => router.back()} hitSlop={8}>
              <ChevronLeft size={26} color={iconColor} />
            </Pressable>
          )}
        </View>

        {/* Orta: logo */}
        <Pressable onPress={() => router.push("/")}>
          <Text className="text-xl font-black tracking-tight" style={{ color: PRIMARY }}>BanaSat</Text>
        </Pressable>

        {/* Sağ: tema + menü */}
        <View className="w-20 flex-row items-center justify-end gap-2">
          <Pressable onPress={toggle} hitSlop={8} className="size-9 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
            {isDark ? <Sun size={18} color={iconColor} /> : <Moon size={18} color={iconColor} />}
          </Pressable>
          <Pressable onPress={() => setMenuOpen(true)} hitSlop={8} className="size-9 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
            <Menu size={20} color={iconColor} />
            {isLoggedIn && unread > 0 && (
              <View className="absolute -top-1 -right-1 min-w-4 h-4 px-1 items-center justify-center bg-red-500 rounded-full">
                <Text className="text-white text-[10px] font-bold">{unread > 9 ? "9+" : unread}</Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      {/* Menü modalı (hamburger) */}
      <Modal visible={menuOpen} transparent animationType="fade" onRequestClose={() => setMenuOpen(false)}>
        <Pressable className="flex-1 bg-black/50" onPress={() => setMenuOpen(false)}>
          <Pressable className="mt-0 bg-white dark:bg-background-dark border-b border-gray-200 dark:border-gray-800" onPress={(e) => e.stopPropagation()}>
            <SafeAreaView edges={["top"]}>
              <View className="flex-row items-center justify-between px-4 h-14">
                <Text className="text-lg font-black" style={{ color: PRIMARY }}>Menü</Text>
                <Pressable onPress={() => setMenuOpen(false)} hitSlop={8}><X size={22} color={iconColor} /></Pressable>
              </View>
              <ScrollView className="max-h-[70vh] px-3 pb-4">
                {isLoggedIn ? (
                  <>
                    <MenuItem icon={<MessageSquare size={18} color={iconColor} />} label="Mesajlar" badge={unread} onPress={() => go("/mesajlar")} />
                    <MenuItem icon={<ClipboardList size={18} color={iconColor} />} label="Taleplerim" onPress={() => go("/taleplerim")} />
                    <MenuItem icon={<HandCoins size={18} color={iconColor} />} label="Tekliflerim" onPress={() => go("/tekliflerim")} />
                    <MenuItem icon={<ShoppingBag size={18} color={iconColor} />} label="Siparişlerim" onPress={() => go("/siparislerim")} />
                    <MenuItem icon={<UserIcon size={18} color={iconColor} />} label="Profil" onPress={() => go("/profil")} />
                    <Pressable onPress={() => go("/talep-olustur")} className="flex-row items-center justify-center gap-2 h-12 mt-2 rounded-xl" style={{ backgroundColor: PRIMARY }}>
                      <Plus size={18} color="#fff" />
                      <Text className="text-white font-bold">Talep Oluştur</Text>
                    </Pressable>
                    <Pressable onPress={onLogout} className="flex-row items-center gap-3 px-3 h-12 mt-2 rounded-xl">
                      <LogOut size={18} color="#ef4444" />
                      <Text className="text-red-500 font-semibold">Çıkış Yap</Text>
                    </Pressable>
                  </>
                ) : (
                  <View className="flex-row gap-2 py-2">
                    <Pressable onPress={() => go("/giris")} className="flex-1 flex-row items-center justify-center gap-2 h-12 rounded-xl border border-gray-200 dark:border-gray-700">
                      <LogIn size={16} color={iconColor} />
                      <Text className="text-gray-700 dark:text-gray-200 font-semibold">Giriş Yap</Text>
                    </Pressable>
                    <Pressable onPress={() => go("/kayit")} className="flex-1 flex-row items-center justify-center gap-2 h-12 rounded-xl" style={{ backgroundColor: PRIMARY }}>
                      <UserPlus size={16} color="#fff" />
                      <Text className="text-white font-bold">Kayıt Ol</Text>
                    </Pressable>
                  </View>
                )}
              </ScrollView>
            </SafeAreaView>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

function MenuItem({ icon, label, onPress, badge }: { icon: React.ReactNode; label: string; onPress: () => void; badge?: number }) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center gap-3 px-3 h-12 rounded-xl">
      {icon}
      <Text className="text-gray-700 dark:text-gray-200 font-semibold flex-1">{label}</Text>
      {badge != null && badge > 0 && (
        <View className="min-w-5 h-5 px-1.5 items-center justify-center bg-red-500 rounded-full">
          <Text className="text-white text-[10px] font-bold">{badge}</Text>
        </View>
      )}
    </Pressable>
  );
}
