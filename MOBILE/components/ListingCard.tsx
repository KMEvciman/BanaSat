import { View, Text, Image, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Flame } from "lucide-react-native";
import type { CardListing } from "@/lib/api/types";

const PRIMARY = "#5BB678";

/** Web'deki ListingCard'ın mobil karşılığı. */
export default function ListingCard({ listing, width }: { listing: CardListing; width?: number }) {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push(`/ilan/${listing.id}` as never)}
      style={width ? { width } : undefined}
      className="card-outline bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
    >
      <View className="relative h-32 w-full">
        <Image source={{ uri: listing.image }} className="w-full h-full" resizeMode="cover" />
        {listing.offers >= 8 && (
          <View className="absolute top-2 left-2 flex-row items-center gap-1 bg-orange-500/15 px-2 py-0.5 rounded-full">
            <Flame size={12} color="#f97316" />
            <Text className="text-orange-500 text-[10px] font-semibold">Popüler</Text>
          </View>
        )}
        <View className="absolute bottom-2 right-2 bg-white/85 dark:bg-black/70 px-2 py-0.5 rounded-md max-w-[60%]">
          <Text numberOfLines={1} className="text-[10px] font-semibold" style={{ color: PRIMARY }}>{listing.category}</Text>
        </View>
      </View>

      <View className="p-3 gap-2">
        <Text numberOfLines={1} className="text-gray-900 dark:text-white text-sm font-bold">{listing.title}</Text>
        <Text numberOfLines={2} className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">{listing.description}</Text>

        <View className="flex-row items-center justify-between py-2 border-y border-gray-100 dark:border-gray-800">
          <View>
            <Text className="text-gray-400 text-[9px] uppercase font-semibold">Bütçe</Text>
            <Text className="text-gray-900 dark:text-white text-xs font-bold mt-0.5">{listing.budget}</Text>
          </View>
          <View className="items-end">
            <Text className="text-gray-400 text-[9px] uppercase font-semibold">Durum</Text>
            <Text className={`text-xs font-semibold mt-0.5 ${listing.offers > 0 ? "text-green-600 dark:text-green-400" : "text-gray-400"}`}>
              {listing.offers > 0 ? `${listing.offers} teklif` : "Henüz yok"}
            </Text>
          </View>
        </View>

        <View className="rounded-lg py-2 items-center" style={{ backgroundColor: PRIMARY }}>
          <Text className="text-white text-xs font-semibold">{listing.offers === 0 ? "İlk Teklifi Ver" : "Teklif Ver"}</Text>
        </View>
      </View>
    </Pressable>
  );
}
