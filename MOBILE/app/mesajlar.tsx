import { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  Search, Send, ArrowLeft, HandCoins, Check, X, Ban, Tag,
  CheckSquare, Square, Pencil, Wallet, CheckCircle2,
} from "lucide-react-native";
import TopBar from "@/components/TopBar";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { messagesApi, listingsApi } from "@/lib/api/services";
import { resolveImageUrl, resolveAvatarUrl, PLACEHOLDER_IMAGE } from "@/lib/api/adapters";
import type {
  Conversation,
  ConversationDetail,
  OfferStatus,
  OfferBlockOptions,
  Listing,
} from "@/lib/api/types";

const PRIMARY = "#5BB678";

/** Saat:dakika biçimi (tr-TR). */
function fmtTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

// Teklif durumu için etiket + arka plan/metin sınıfları (web ile birebir).
const OFFER_STATUS_META: Record<OfferStatus, { label: string; badgeBg: string; badgeText: string }> = {
  BEKLEMEDE: { label: "Beklemede", badgeBg: "bg-amber-100 dark:bg-amber-500/15", badgeText: "text-amber-700 dark:text-amber-400" },
  KABUL: { label: "Kabul Edildi", badgeBg: "bg-primary/15", badgeText: "text-primary" },
  RED: { label: "Reddedildi", badgeBg: "bg-red-100 dark:bg-red-500/15", badgeText: "text-red-600 dark:text-red-400" },
  GERI_CEKILDI: { label: "Geri Çekildi", badgeBg: "bg-slate-200 dark:bg-slate-700", badgeText: "text-slate-500 dark:text-slate-400" },
};

export default function Mesajlar() {
  const router = useRouter();
  const params = useLocalSearchParams<{ c?: string; listing?: string; seller?: string }>();
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const { mode } = useTheme();
  const isDark = mode === "dark";
  const iconColor = isDark ? "#d4d4d4" : "#525252";
  const scrollRef = useRef<ScrollView>(null);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [detail, setDetail] = useState<ConversationDetail | null>(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  // Sohbet-içi teklif modalı durumu.
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [offerPrice, setOfferPrice] = useState("");
  const [offerNote, setOfferNote] = useState("");
  const [offerSubmitting, setOfferSubmitting] = useState(false);
  const [actionBusy, setActionBusy] = useState<string | null>(null);

  // Teklif engelleme modalı durumu.
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [blockOptions, setBlockOptions] = useState<OfferBlockOptions | null>(null);
  const [selectedBlockIds, setSelectedBlockIds] = useState<string[]>([]);
  const [blockSaving, setBlockSaving] = useState(false);

  // Talep seçim (teklif vermek için) pop-up durumu.
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerListings, setPickerListings] = useState<Listing[]>([]);
  const [pickerLoading, setPickerLoading] = useState(false);

  const initRef = useRef(false);

  // Giriş yapılmamışsa giriş sayfasına yönlendir.
  useEffect(() => {
    if (!authLoading && !isLoggedIn) router.replace("/giris");
  }, [authLoading, isLoggedIn]);

  const loadConversations = useCallback(() => {
    messagesApi.list().then(setConversations).catch(() => {});
  }, []);

  useEffect(() => { loadConversations(); }, [loadConversations]);

  // Query parametrelerini işle: ?c=<id> veya ?c=new&listing=&seller=
  useEffect(() => {
    if (initRef.current) return;
    const c = params.c;
    if (!c) return;
    initRef.current = true;
    if (c === "new" && params.listing) {
      // Yeni sohbet: konuşmayı oluştur/getir, ardından aç.
      messagesApi
        .createOrGet({ listingId: params.listing, participantId: params.seller })
        .then((conv) => { setActiveId(conv.id); loadConversations(); })
        .catch(() => {});
    } else {
      setActiveId(c);
    }
  }, [params.c, params.listing, params.seller, loadConversations]);

  const loadDetail = useCallback((id: string) => {
    messagesApi.detail(id).then((d) => {
      setDetail(d);
      messagesApi.markRead(id).then(loadConversations).catch(() => {});
    }).catch(() => {});
  }, [loadConversations]);

  // Aktif konuşma değişince yükle + 15sn polling.
  useEffect(() => {
    if (!activeId) { setDetail(null); return; }
    loadDetail(activeId);
    const interval = setInterval(() => {
      messagesApi.detail(activeId).then(setDetail).catch(() => {});
    }, 15000);
    return () => clearInterval(interval);
  }, [activeId, loadDetail]);

  // Yeni mesajda en alta kaydır.
  useEffect(() => {
    if (detail?.messages.length) {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
    }
  }, [detail?.messages.length]);

  const handleSend = async () => {
    if (!message.trim() || !activeId || sending) return;
    setSending(true);
    const content = message.trim();
    setMessage("");
    try {
      await messagesApi.send(activeId, content);
      loadDetail(activeId);
      loadConversations();
    } catch {
      setMessage(content); // başarısızsa geri koy
    } finally {
      setSending(false);
    }
  };

  const activeConv = conversations.find((c) => c.id === activeId);

  // Roller: detail.buyer = ilan sahibi (alıcı), detail.seller = teklif veren (satıcı).
  const isSeller = !!detail && detail.seller.id === user?.id;
  const isBuyer = !!detail && detail.buyer.id === user?.id;

  // Son teklif mesajının id'si (aksiyon butonları yalnızca bunda çıkar).
  const lastOfferMsgId = (() => {
    if (!detail) return null;
    for (let i = detail.messages.length - 1; i >= 0; i--) {
      if (detail.messages[i].type === "OFFER") return detail.messages[i].id;
    }
    return null;
  })();

  // Teklif modalını aç. Karşı teklifte mevcut fiyatı ön doldur.
  const openOfferModal = (prefill?: { price?: number | null }) => {
    setOfferPrice(prefill?.price != null ? String(prefill.price) : "");
    setOfferNote("");
    setOfferModalOpen(true);
  };

  // "Teklif Ver": talep oluşturan kullanıcının (karşı taraf) taleplerini getir.
  const openListingPicker = async () => {
    if (!detail) return;
    setPickerOpen(true);
    setPickerLoading(true);
    try {
      const res = await listingsApi.list({ ownerId: detail.buyer.id, status: "AKTIF", limit: 50 });
      setPickerListings(res.items);
    } catch {
      setPickerListings([]);
    } finally {
      setPickerLoading(false);
    }
  };

  // Pop-up'tan bir talep seçilince: o talebin konuşmasını aç ve teklif modalını göster.
  const handlePickListing = async (listingId: string) => {
    try {
      const conv = await messagesApi.createOrGet({ listingId });
      setPickerOpen(false);
      setActiveId(conv.id);
      setTimeout(() => openOfferModal(), 50);
    } catch {
      // sessizce geç
    }
  };

  // Sohbet içinden teklif / karşı-teklif gönder.
  const handleSendOffer = async () => {
    if (!activeId || offerSubmitting) return;
    const price = Number(offerPrice);
    if (!price || price < 1) return;
    setOfferSubmitting(true);
    try {
      await messagesApi.sendOffer(activeId, { price, note: offerNote.trim() || undefined });
      setOfferModalOpen(false);
      setOfferPrice(""); setOfferNote("");
      loadDetail(activeId);
      loadConversations();
    } catch {
      // sessizce geç
    } finally {
      setOfferSubmitting(false);
    }
  };

  // Güncel teklifi kabul/reddet (son teklifi gönderen hariç).
  const handleOfferAction = async (msgId: string, action: "accept" | "reject") => {
    if (actionBusy || !activeId) return;
    setActionBusy(msgId);
    try {
      await (action === "accept" ? messagesApi.acceptOffer(activeId) : messagesApi.rejectOffer(activeId));
      loadDetail(activeId);
      loadConversations();
    } catch {
      // sessizce geç
    } finally {
      setActionBusy(null);
    }
  };

  // Alıcı, engelleme modalını açar (ilanları + mevcut engel durumunu yükler).
  const openBlockModal = async () => {
    if (!activeId) return;
    setBlockModalOpen(true);
    try {
      const opts = await messagesApi.offerBlockOptions(activeId);
      setBlockOptions(opts);
      setSelectedBlockIds(opts.listings.filter((l) => l.blocked).map((l) => l.id));
    } catch {
      setBlockOptions({ sellerId: "", listings: [] });
    }
  };

  const toggleBlockListing = (id: string) => {
    setSelectedBlockIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const allBlockSelected =
    !!blockOptions && blockOptions.listings.length > 0 && selectedBlockIds.length === blockOptions.listings.length;

  const toggleSelectAllBlocks = () => {
    if (!blockOptions) return;
    setSelectedBlockIds(allBlockSelected ? [] : blockOptions.listings.map((l) => l.id));
  };

  // Engelleme seçimini kaydet.
  const handleSaveBlocks = async () => {
    if (!activeId || blockSaving) return;
    setBlockSaving(true);
    try {
      await messagesApi.setOfferBlocks(activeId, selectedBlockIds);
      setBlockModalOpen(false);
      loadDetail(activeId);
    } catch {
      // sessizce geç
    } finally {
      setBlockSaving(false);
    }
  };

  // Karşı taraf bilgisi (başlık + liste).
  const counterpartName = detail
    ? detail.buyer.id === user?.id ? detail.seller.name : detail.buyer.name
    : activeConv?.counterpart.name ?? "";
  const counterpartAvatar = (() => {
    if (detail) {
      const cp = detail.buyer.id === user?.id ? detail.seller : detail.buyer;
      return resolveAvatarUrl(cp.avatarUrl, cp.name);
    }
    return resolveAvatarUrl(activeConv?.counterpart.avatarUrl, counterpartName || "U");
  })();

  // Giriş yapılmamışsa içerik gösterme.
  if (!isLoggedIn) {
    return <View className="flex-1 bg-background-light dark:bg-background-dark"><TopBar /></View>;
  }

  // --- Konuşma listesi ---
  const conversationList = (
    <View className="flex-1">
      <View className="px-4 pt-4 pb-2">
        <Text className="text-2xl font-black text-gray-900 dark:text-white mb-3">Mesajlar</Text>
        <View className="flex-row items-center h-11 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-3">
          <Search size={18} color="#94a3b8" />
          <TextInput
            className="flex-1 ml-2 text-sm text-gray-900 dark:text-white"
            placeholder="Görüşmelerde ara..."
            placeholderTextColor="#94a3b8"
          />
        </View>
      </View>
      <ScrollView contentContainerStyle={{ padding: 12, gap: 6 }}>
        {conversations.length === 0 && (
          <Text className="text-sm text-gray-400 text-center mt-8 px-4">
            Henüz mesajınız yok. Bir ilana teklif verip ya da ilan sahibiyle iletişime geçerek mesajlaşma başlatabilirsiniz.
          </Text>
        )}
        {conversations.map((conv) => (
          <Pressable
            key={conv.id}
            onPress={() => setActiveId(conv.id)}
            className="flex-row items-center gap-3 p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
          >
            <Image
              source={{ uri: resolveAvatarUrl(conv.counterpart.avatarUrl, conv.counterpart.name) }}
              className="h-12 w-12 rounded-full"
            />
            <View className="flex-1 min-w-0">
              <View className="flex-row justify-between items-center mb-0.5">
                <Text numberOfLines={1} className="flex-1 text-sm font-semibold text-gray-900 dark:text-white">{conv.counterpart.name}</Text>
                {conv.lastMessage && <Text className="text-gray-400 text-xs ml-2">{fmtTime(conv.lastMessage.createdAt)}</Text>}
              </View>
              <Text numberOfLines={1} className="text-sm text-gray-500 dark:text-gray-400">{conv.lastMessage?.content ?? "Yeni görüşme"}</Text>
              <Text numberOfLines={1} className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{conv.listing?.title ?? "İlan kaldırılmış"}</Text>
            </View>
            {conv.unreadCount > 0 && (
              <View className="min-w-5 h-5 px-1.5 items-center justify-center bg-red-500 rounded-full">
                <Text className="text-white text-[10px] font-bold">{conv.unreadCount}</Text>
              </View>
            )}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );

  // --- Sohbet görünümü ---
  const chatView = (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* Başlık */}
      <View className="flex-row items-center gap-3 px-3 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <Pressable onPress={() => setActiveId(null)} className="size-9 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
          <ArrowLeft size={18} color={iconColor} />
        </Pressable>
        <Image source={{ uri: counterpartAvatar }} className="h-10 w-10 rounded-full" />
        <View className="flex-1 min-w-0">
          <Text numberOfLines={1} className="text-base font-bold text-gray-900 dark:text-white">{counterpartName}</Text>
          <Text numberOfLines={1} className="text-xs text-gray-500 dark:text-gray-400">{detail?.listing?.title ?? activeConv?.listing?.title ?? "İlan kaldırılmış"}</Text>
        </View>
        {/* Alıcı: engelleme */}
        {isBuyer && (
          <Pressable onPress={openBlockModal} className="flex-row items-center gap-1.5 rounded-xl px-3 h-9 bg-red-50 dark:bg-red-500/10">
            <Ban size={18} color="#dc2626" />
          </Pressable>
        )}
        {/* Satıcı: yeni teklif başlat (engelli değilse) */}
        {isSeller && !detail?.offersBlocked && (
          <Pressable onPress={openListingPicker} className="flex-row items-center gap-1.5 rounded-xl px-3 h-9" style={{ backgroundColor: PRIMARY }}>
            <HandCoins size={18} color="#fff" />
          </Pressable>
        )}
      </View>

      {/* Mesajlar */}
      <ScrollView ref={scrollRef} className="flex-1 bg-[#fafafa] dark:bg-black" contentContainerStyle={{ padding: 12, gap: 12 }}>
        {detail?.messages.map((m) => {
          const mine = m.senderId === user?.id;

          // OFFER tipi mesaj: teklif kartı.
          if (m.type === "OFFER") {
            const status = m.offer?.status ?? "BEKLEMEDE";
            const meta = OFFER_STATUS_META[status];
            const isLatest = m.id === lastOfferMsgId;
            const pending = isLatest && status === "BEKLEMEDE" && !detail?.offersBlocked;
            const canRespond = pending && !mine;
            const canUpdate = pending && mine;
            const busy = actionBusy === m.id;
            const listingTitle = detail?.listing?.title;
            return (
              <View key={m.id} className={`w-full ${mine ? "items-end" : "items-start"}`}>
                <View className="w-full max-w-md rounded-2xl border border-primary/30 bg-white dark:bg-gray-900 overflow-hidden">
                  {/* Başlık şeridi */}
                  <View className="flex-row items-center gap-2 bg-primary/10 px-4 py-3">
                    <HandCoins size={18} color={PRIMARY} />
                    <Text className="text-sm font-bold text-primary">{mine ? "Gönderdiğiniz Teklif" : "Gelen Teklif"}</Text>
                    <View className={`ml-auto px-2.5 py-1 rounded-full ${isLatest ? meta.badgeBg : "bg-slate-100 dark:bg-slate-800"}`}>
                      <Text className={`text-[11px] font-semibold ${isLatest ? meta.badgeText : "text-slate-400 dark:text-slate-500"}`}>
                        {isLatest ? meta.label : "Önceki teklif"}
                      </Text>
                    </View>
                  </View>
                  {/* İlgili ilan */}
                  {listingTitle && (
                    <Pressable
                      onPress={() => detail?.listing && router.push(`/ilan/${detail.listing.id}`)}
                      className="flex-row items-center gap-2 px-4 py-2.5 border-b border-gray-100 dark:border-gray-800"
                    >
                      <Tag size={14} color="#94a3b8" />
                      <Text numberOfLines={1} className="flex-1 text-xs text-gray-500 dark:text-gray-400">
                        İlan: <Text className="font-semibold text-gray-700 dark:text-gray-200">{listingTitle}</Text>
                      </Text>
                    </Pressable>
                  )}
                  {/* Gövde */}
                  <View className="px-4 py-4">
                    <Text className="text-3xl font-black text-gray-900 dark:text-white">₺{(m.offerPrice ?? 0).toLocaleString("tr-TR")}</Text>
                    {m.offerDeliveryTime && (
                      <Text className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                        Teslim süresi: <Text className="font-semibold text-gray-700 dark:text-gray-200">{m.offerDeliveryTime}</Text>
                      </Text>
                    )}
                    {m.offerNote && (
                      <Text className="mt-3 text-sm text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-gray-800 pt-3">{m.offerNote}</Text>
                    )}

                    {/* Yanıtlayan taraf: karşı teklif + reddet/kabul */}
                    {canRespond && (
                      <View className="mt-4 gap-2.5">
                        <Pressable
                          onPress={() => openOfferModal({ price: m.offerPrice })}
                          disabled={busy}
                          className="flex-row items-center justify-center gap-2 rounded-xl border border-primary/40 h-11"
                        >
                          <HandCoins size={17} color={PRIMARY} />
                          <Text className="text-primary text-sm font-semibold">Karşı Teklif Ver</Text>
                        </Pressable>
                        <View className="flex-row gap-2.5">
                          <Pressable
                            onPress={() => handleOfferAction(m.id, "reject")}
                            disabled={busy}
                            className="flex-1 flex-row items-center justify-center gap-2 rounded-xl border border-red-300 dark:border-red-500/40 h-11"
                          >
                            <X size={17} color="#dc2626" />
                            <Text className="text-red-600 dark:text-red-400 text-sm font-semibold">Reddet</Text>
                          </Pressable>
                          <Pressable
                            onPress={() => handleOfferAction(m.id, "accept")}
                            disabled={busy}
                            className="flex-1 flex-row items-center justify-center gap-2 rounded-xl h-11"
                            style={{ backgroundColor: PRIMARY }}
                          >
                            <Check size={17} color="#fff" />
                            <Text className="text-white text-sm font-semibold">Kabul Et</Text>
                          </Pressable>
                        </View>
                      </View>
                    )}

                    {/* Teklifi gönderen: kendi teklifini güncelleyebilir */}
                    {canUpdate && (
                      <Pressable
                        onPress={() => openOfferModal({ price: m.offerPrice })}
                        className="mt-4 flex-row items-center justify-center gap-2 rounded-xl border border-gray-300 dark:border-gray-600 h-11"
                      >
                        <Pencil size={16} color={iconColor} />
                        <Text className="text-gray-600 dark:text-gray-300 text-sm font-semibold">Teklifi Güncelle</Text>
                      </Pressable>
                    )}

                    {/* Kabul edildi: alıcı ödemeye geçer */}
                    {isLatest && status === "KABUL" && isBuyer && m.offer?.order?.status === "ODEME_BEKLENIYOR" && (
                      <Pressable
                        onPress={() => m.offer?.order && router.push(`/odeme?order=${m.offer.order.id}`)}
                        className="mt-4 flex-row items-center justify-center gap-2 rounded-xl h-11"
                        style={{ backgroundColor: PRIMARY }}
                      >
                        <Wallet size={17} color="#fff" />
                        <Text className="text-white text-sm font-semibold">Ödemeye Geç</Text>
                      </Pressable>
                    )}
                    {isLatest && status === "KABUL" && m.offer?.order && m.offer.order.status !== "ODEME_BEKLENIYOR" && (
                      <View className="mt-4 flex-row items-center justify-center gap-1.5">
                        <CheckCircle2 size={16} color={PRIMARY} />
                        <Text className="text-sm font-semibold text-primary">Ödeme tamamlandı</Text>
                      </View>
                    )}
                    {/* Satıcı: ödeme bekleniyor bilgisi */}
                    {isLatest && status === "KABUL" && !isBuyer && m.offer?.order?.status === "ODEME_BEKLENIYOR" && (
                      <View className="mt-4 flex-row items-center justify-center gap-1.5">
                        <Wallet size={16} color="#d97706" />
                        <Text className="text-sm font-medium text-amber-600 dark:text-amber-400">Alıcının ödemesi bekleniyor</Text>
                      </View>
                    )}
                  </View>
                  {/* Alt zaman */}
                  <View className="px-4 pb-3">
                    <Text className="text-[11px] text-gray-400">{fmtTime(m.createdAt)}</Text>
                  </View>
                </View>
              </View>
            );
          }

          // TEXT mesaj balonu.
          return (
            <View key={m.id} className={`max-w-[85%] ${mine ? "self-end" : "self-start"}`}>
              <View className={`p-3 rounded-2xl ${mine ? "bg-primary rounded-br-none" : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-bl-none"}`}>
                <Text className={`text-sm leading-relaxed ${mine ? "text-white" : "text-gray-800 dark:text-gray-200"}`}>{m.content}</Text>
              </View>
              <Text className={`text-xs text-gray-400 mt-1 ${mine ? "text-right mr-1" : "ml-1"}`}>{fmtTime(m.createdAt)}</Text>
            </View>
          );
        })}
        {detail && detail.messages.length === 0 && (
          <Text className="text-sm text-gray-400 text-center mt-10">Henüz mesaj yok. İlk mesajı siz gönderin.</Text>
        )}
      </ScrollView>

      {/* Mesaj girişi */}
      <View className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-3">
        {detail?.offersBlocked && (
          <View className="mb-3 flex-row items-center gap-2 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 px-4 py-2">
            <Ban size={16} color="#dc2626" />
            <Text className="flex-1 text-sm text-red-600 dark:text-red-400">
              {isBuyer ? "Bu kullanıcının teklif göndermesini engellediniz." : "İlan sahibi yeni teklif gönderiminizi kapattı."}
            </Text>
          </View>
        )}
        <View className="flex-row items-end gap-2">
          <View className="flex-1 bg-background-light dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-2">
            <TextInput
              value={message}
              onChangeText={setMessage}
              multiline
              className="text-sm text-gray-900 dark:text-white max-h-32"
              placeholder="Bir mesaj yazın..."
              placeholderTextColor="#94a3b8"
            />
          </View>
          <Pressable
            onPress={handleSend}
            disabled={sending || !message.trim()}
            className="h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: PRIMARY, opacity: sending || !message.trim() ? 0.5 : 1 }}
          >
            <Send size={20} color="#fff" />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <TopBar />
      {activeId ? chatView : conversationList}

      {/* Sohbet-içi teklif modalı */}
      <Modal visible={offerModalOpen} transparent animationType="slide" onRequestClose={() => setOfferModalOpen(false)}>
        <Pressable className="flex-1 bg-black/50 justify-end" onPress={() => setOfferModalOpen(false)}>
          <Pressable className="bg-white dark:bg-gray-900 rounded-t-2xl" onPress={(e) => e.stopPropagation()}>
            <View className="flex-row items-center gap-2 px-5 py-4 border-b border-gray-200 dark:border-gray-800">
              <HandCoins size={20} color={PRIMARY} />
              <Text className="text-lg font-bold text-gray-900 dark:text-white">Teklif Ver</Text>
              <Pressable onPress={() => setOfferModalOpen(false)} className="ml-auto"><X size={20} color={iconColor} /></Pressable>
            </View>
            <View className="p-5 gap-4">
              <View>
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Fiyat (₺)</Text>
                <TextInput
                  value={offerPrice}
                  onChangeText={setOfferPrice}
                  keyboardType="numeric"
                  placeholder="Örn. 5000"
                  placeholderTextColor="#94a3b8"
                  className="rounded-xl border border-gray-200 dark:border-gray-700 bg-background-light dark:bg-background-dark px-4 h-11 text-gray-900 dark:text-white"
                />
              </View>
              <View>
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Not (opsiyonel)</Text>
                <TextInput
                  value={offerNote}
                  onChangeText={setOfferNote}
                  multiline
                  placeholder="Teklifinizle ilgili detaylar..."
                  placeholderTextColor="#94a3b8"
                  className="rounded-xl border border-gray-200 dark:border-gray-700 bg-background-light dark:bg-background-dark px-4 py-2.5 text-gray-900 dark:text-white min-h-[80px]"
                  style={{ textAlignVertical: "top" }}
                />
              </View>
              <Pressable
                onPress={handleSendOffer}
                disabled={offerSubmitting || !offerPrice}
                className="h-11 rounded-xl items-center justify-center"
                style={{ backgroundColor: PRIMARY, opacity: offerSubmitting || !offerPrice ? 0.5 : 1 }}
              >
                <Text className="text-white font-semibold">{offerSubmitting ? "Gönderiliyor..." : "Teklifi Gönder"}</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Teklif engelleme modalı */}
      <Modal visible={blockModalOpen} transparent animationType="slide" onRequestClose={() => setBlockModalOpen(false)}>
        <Pressable className="flex-1 bg-black/50 justify-end" onPress={() => setBlockModalOpen(false)}>
          <Pressable className="bg-white dark:bg-gray-900 rounded-t-2xl max-h-[85%]" onPress={(e) => e.stopPropagation()}>
            <View className="flex-row items-center gap-2 px-5 py-4 border-b border-gray-200 dark:border-gray-800">
              <Ban size={20} color="#ef4444" />
              <Text className="flex-1 text-base font-bold text-gray-900 dark:text-white">Hangi ilanınıza teklif vermesini engellemek istersiniz?</Text>
              <Pressable onPress={() => setBlockModalOpen(false)}><X size={20} color={iconColor} /></Pressable>
            </View>

            {/* Hepsini seç */}
            <View className="px-5 py-3 border-b border-gray-100 dark:border-gray-800">
              <Pressable
                onPress={toggleSelectAllBlocks}
                disabled={!blockOptions || blockOptions.listings.length === 0}
                className="flex-row items-center gap-2"
                style={{ opacity: !blockOptions || blockOptions.listings.length === 0 ? 0.4 : 1 }}
              >
                {allBlockSelected ? <CheckSquare size={18} color={PRIMARY} /> : <Square size={18} color={PRIMARY} />}
                <Text className="text-sm font-semibold text-primary">Hepsini Seç</Text>
              </Pressable>
            </View>

            {/* İlan listesi */}
            <ScrollView contentContainerStyle={{ padding: 12, gap: 4 }}>
              {!blockOptions && <Text className="text-sm text-gray-400 text-center py-8">Yükleniyor...</Text>}
              {blockOptions && blockOptions.listings.length === 0 && (
                <Text className="text-sm text-gray-400 text-center py-8">Henüz ilanınız yok.</Text>
              )}
              {blockOptions?.listings.map((l) => {
                const selected = selectedBlockIds.includes(l.id);
                return (
                  <Pressable
                    key={l.id}
                    onPress={() => toggleBlockListing(l.id)}
                    className={`flex-row items-center gap-3 p-2.5 rounded-xl border ${selected ? "border-primary/40 bg-primary/5" : "border-transparent"}`}
                  >
                    {selected ? <CheckSquare size={20} color={PRIMARY} /> : <Square size={20} color="#cbd5e1" />}
                    <Image source={{ uri: resolveImageUrl(l.coverImageUrl) }} className="h-11 w-11 rounded-lg" />
                    <View className="flex-1 min-w-0">
                      <Text numberOfLines={1} className="text-sm font-semibold text-gray-900 dark:text-white">{l.title}</Text>
                      <Text className="text-[11px] text-gray-400">{l.status}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Alt butonlar */}
            <View className="flex-row items-center justify-end gap-3 px-5 py-4 border-t border-gray-200 dark:border-gray-800">
              <Pressable onPress={() => setBlockModalOpen(false)} className="px-5 h-11 rounded-xl border border-gray-200 dark:border-gray-700 items-center justify-center">
                <Text className="text-gray-600 dark:text-gray-300 font-semibold">İptal</Text>
              </Pressable>
              <Pressable
                onPress={handleSaveBlocks}
                disabled={blockSaving || !blockOptions}
                className="flex-row items-center gap-2 px-5 h-11 rounded-xl bg-red-500 items-center justify-center"
                style={{ opacity: blockSaving || !blockOptions ? 0.5 : 1 }}
              >
                <Ban size={18} color="#fff" />
                <Text className="text-white font-semibold">{blockSaving ? "Kaydediliyor..." : "Engelle"}</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Talep seçim pop-up'ı (satıcı teklif verir) */}
      <Modal visible={pickerOpen} transparent animationType="slide" onRequestClose={() => setPickerOpen(false)}>
        <Pressable className="flex-1 bg-black/50 justify-end" onPress={() => setPickerOpen(false)}>
          <Pressable className="bg-white dark:bg-gray-900 rounded-t-2xl max-h-[85%]" onPress={(e) => e.stopPropagation()}>
            <View className="flex-row items-center gap-2 px-5 py-4 border-b border-gray-200 dark:border-gray-800">
              <HandCoins size={20} color={PRIMARY} />
              <Text className="flex-1 text-base font-bold text-gray-900 dark:text-white">Hangi talebe teklif vermek istersiniz?</Text>
              <Pressable onPress={() => setPickerOpen(false)}><X size={20} color={iconColor} /></Pressable>
            </View>
            <ScrollView contentContainerStyle={{ padding: 12, gap: 4 }}>
              {pickerLoading && <Text className="text-sm text-gray-400 text-center py-8">Yükleniyor...</Text>}
              {!pickerLoading && pickerListings.length === 0 && (
                <Text className="text-sm text-gray-400 text-center py-8">Bu kullanıcının aktif talebi yok.</Text>
              )}
              {pickerListings.map((l) => (
                <Pressable
                  key={l.id}
                  onPress={() => handlePickListing(l.id)}
                  className="flex-row items-center gap-3 p-2.5 rounded-xl border border-transparent"
                >
                  <Image source={{ uri: resolveImageUrl(l.coverImageUrl) }} className="h-12 w-12 rounded-lg" />
                  <View className="flex-1 min-w-0">
                    <Text numberOfLines={1} className="text-sm font-semibold text-gray-900 dark:text-white">{l.title}</Text>
                    <Text numberOfLines={1} className="text-xs text-gray-500 dark:text-gray-400">{l.category.name} · {l.budgetLabel}</Text>
                  </View>
                  <HandCoins size={18} color={PRIMARY} />
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
