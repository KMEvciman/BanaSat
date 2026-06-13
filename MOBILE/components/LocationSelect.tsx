import { useEffect, useState } from "react";
import { View, Text, Pressable, Modal, ScrollView } from "react-native";
import { ChevronDown, X } from "lucide-react-native";
import { locationsApi } from "@/lib/api/services";
import type { ProvinceOption } from "@/lib/api/types";

let cache: ProvinceOption[] | null = null;

interface Props {
  province: string;
  district: string;
  onChange: (province: string, district: string) => void;
}

/** İl/ilçe bağımlı iki seçim (modal listeli). */
export default function LocationSelect({ province, district, onChange }: Props) {
  const [provinces, setProvinces] = useState<ProvinceOption[]>(cache ?? []);
  const [open, setOpen] = useState<null | "il" | "ilce">(null);

  useEffect(() => {
    if (cache) { setProvinces(cache); return; }
    locationsApi.list().then((d) => { cache = d; setProvinces(d); }).catch(() => {});
  }, []);

  const districts = provinces.find((p) => p.name === province)?.districts ?? [];
  const options = open === "il" ? provinces.map((p) => p.name) : districts.map((d) => d.name);

  return (
    <View className="flex-row gap-3">
      <Picker label={province || "İl seçiniz"} active={!!province} onPress={() => setOpen("il")} />
      <Picker
        label={district || (province ? "İlçe seçiniz" : "Önce il")}
        active={!!district}
        disabled={!province}
        onPress={() => province && setOpen("ilce")}
      />

      <Modal visible={open !== null} transparent animationType="slide" onRequestClose={() => setOpen(null)}>
        <Pressable className="flex-1 bg-black/50 justify-end" onPress={() => setOpen(null)}>
          <Pressable className="bg-white dark:bg-gray-900 rounded-t-2xl max-h-[70%]" onPress={(e) => e.stopPropagation()}>
            <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <Text className="text-lg font-bold text-gray-900 dark:text-white">{open === "il" ? "İl Seçin" : "İlçe Seçin"}</Text>
              <Pressable onPress={() => setOpen(null)} hitSlop={8}><X size={20} color="#737373" /></Pressable>
            </View>
            <ScrollView>
              {options.map((name) => (
                <Pressable
                  key={name}
                  onPress={() => {
                    if (open === "il") onChange(name, "");
                    else onChange(province, name);
                    setOpen(null);
                  }}
                  className="px-5 py-3 border-b border-gray-50 dark:border-gray-800"
                >
                  <Text className="text-gray-800 dark:text-gray-200">{name}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function Picker({ label, active, disabled, onPress }: { label: string; active: boolean; disabled?: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`flex-1 flex-row items-center justify-between h-12 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 ${disabled ? "opacity-50" : ""}`}
    >
      <Text className={active ? "text-gray-900 dark:text-white" : "text-gray-400"} numberOfLines={1}>{label}</Text>
      <ChevronDown size={18} color="#9ca3af" />
    </Pressable>
  );
}
