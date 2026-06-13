import { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, Pressable, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Star, BadgeCheck, MapPin, CalendarDays } from "lucide-react-native";
import TopBar from "@/components/TopBar";
import ListingCard from "@/components/ListingCard";
import { usersApi, reviewsApi, listingsApi } from "@/lib/api/services";
import { listingToCard, resolveAvatarUrl } from "@/lib/api/adapters";
import type { PublicProfile, Review, Listing } from "@/lib/api/types";

const PRIMARY = "#5BB678";

export default function KullaniciProfil() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    usersApi
      .publicProfile(String(id))
      .then((p) => {
        setProfile(p);
        // Profil yüklendikten sonra yorumları ve aktif ilanları paralel çek
        return Promise.all([
          reviewsApi.forUser(String(id)).catch(() => [] as Review[]),
          listingsApi
            .list({ ownerId: String(id), status: "AKTIF", limit: 12 })
            .catch(() => ({ items: [] as Listing[] })),
        ]);
      })
      .then(([revs, lst]) => {
        setReviews(revs as Review[]);
        setListings((lst as { items: Listing[] }).items);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <TopBar />
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={PRIMARY} />
        </View>
      ) : notFound || !profile ? (
        <View className="flex-1 items-center justify-center px-6 gap-3">
          <Text className="text-xl font-bold text-gray-900 dark:text-white">Kullanıcı Bulunamadı</Text>
          <Pressable onPress={() => router.replace("/")}>
            <Text className="font-semibold" style={{ color: PRIMARY }}>Ana Sayfaya Dön</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
          <View className="p-4 gap-6">
            {/* Profil başlığı */}
            <View className="card-outline bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 items-center gap-3">
              <Image
                source={{ uri: resolveAvatarUrl(profile.avatarUrl, profile.name) }}
                className="size-24 rounded-full"
              />
              <View className="items-center gap-1">
                <View className="flex-row items-center gap-1.5">
                  <Text className="text-xl font-black text-gray-900 dark:text-white">{profile.name}</Text>
                  {profile.isVerified && <BadgeCheck size={18} color={PRIMARY} />}
                </View>
                <View className="flex-row items-center gap-1">
                  <Star size={16} color="#facc15" fill="#facc15" />
                  <Text className="font-semibold text-gray-900 dark:text-white">{profile.ratingAvg}</Text>
                  <Text className="text-sm text-gray-500">({profile.ratingCount} değerlendirme)</Text>
                </View>
              </View>

              <View className="flex-row flex-wrap items-center justify-center gap-x-4 gap-y-1">
                {!!profile.location && (
                  <View className="flex-row items-center gap-1">
                    <MapPin size={14} color="#9ca3af" />
                    <Text className="text-xs text-gray-500 dark:text-gray-400">{profile.location}</Text>
                  </View>
                )}
                <View className="flex-row items-center gap-1">
                  <CalendarDays size={14} color="#9ca3af" />
                  <Text className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(profile.createdAt).toLocaleDateString("tr-TR", { month: "long", year: "numeric" })} tarihinden beri üye
                  </Text>
                </View>
              </View>

              {!!profile.bio && (
                <Text className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed text-center mt-1">
                  {profile.bio}
                </Text>
              )}
            </View>

            {/* Aktif ilanları */}
            <View className="gap-3">
              <Text className="text-lg font-bold text-gray-900 dark:text-white">
                Aktif İlanları ({listings.length})
              </Text>
              {listings.length > 0 ? (
                <View className="flex-row flex-wrap" style={{ marginHorizontal: -6 }}>
                  {listings.map((l) => (
                    <View key={l.id} style={{ width: "50%", paddingHorizontal: 6, marginBottom: 12 }}>
                      <ListingCard listing={listingToCard(l)} />
                    </View>
                  ))}
                </View>
              ) : (
                <Text className="text-sm text-gray-500 dark:text-gray-400">Aktif ilanı yok.</Text>
              )}
            </View>

            {/* Değerlendirmeler */}
            <View className="gap-3">
              <Text className="text-lg font-bold text-gray-900 dark:text-white">
                Değerlendirmeler ({reviews.length})
              </Text>
              {reviews.length > 0 ? (
                <View className="gap-3">
                  {reviews.map((r) => (
                    <View
                      key={r.id}
                      className="card-outline bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 gap-2"
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-2">
                          <Image
                            source={{ uri: resolveAvatarUrl(r.author.avatarUrl, r.author.name) }}
                            className="size-8 rounded-full"
                          />
                          <Text className="text-sm font-semibold text-gray-900 dark:text-white">{r.author.name}</Text>
                        </View>
                        <View className="flex-row items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              color={i < r.rating ? "#facc15" : "#d1d5db"}
                              fill={i < r.rating ? "#facc15" : "none"}
                            />
                          ))}
                        </View>
                      </View>
                      {!!r.comment && (
                        <Text className="text-sm text-gray-600 dark:text-gray-300">{r.comment}</Text>
                      )}
                      {!!r.order?.offer?.listing?.title && (
                        <Text className="text-xs text-gray-400">{r.order.offer.listing.title}</Text>
                      )}
                    </View>
                  ))}
                </View>
              ) : (
                <Text className="text-sm text-gray-500 dark:text-gray-400">Henüz değerlendirme yok.</Text>
              )}
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}
