"use client";

import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { Search, Paperclip, Send, ArrowLeft, HandCoins, Check, X, Ban, Tag, CheckSquare, Square, Pencil, Wallet, CheckCircle2 } from "lucide-react";
import { useEffect, useRef, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { messagesApi, listingsApi } from "@/lib/api/services";
import type { Conversation, ConversationDetail, OfferStatus, OfferBlockOptions, Listing } from "@/lib/api/types";

function fmtTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

// Teklif durumu için renk/etiket eşlemesi.
const OFFER_STATUS_META: Record<OfferStatus, { label: string; cls: string }> = {
  BEKLEMEDE: { label: "Beklemede", cls: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400" },
  KABUL: { label: "Kabul Edildi", cls: "bg-primary/15 text-primary" },
  RED: { label: "Reddedildi", cls: "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400" },
  GERI_CEKILDI: { label: "Geri Çekildi", cls: "bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400" },
};

function MesajlarContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Giriş yapılmamışsa (veya çıkış yapılınca) ana sayfaya yönlendir.
  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.replace("/");
    }
  }, [authLoading, isLoggedIn, router]);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(searchParams.get("c"));
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

  const loadConversations = useCallback(() => {
    messagesApi.list().then(setConversations).catch(() => {});
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Masaüstünde ilk konuşmayı otomatik seç.
  useEffect(() => {
    if (!activeId && conversations.length > 0 && typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches) {
      setActiveId(conversations[0].id);
    }
  }, [conversations, activeId]);

  const loadDetail = useCallback((id: string) => {
    messagesApi.detail(id).then((d) => {
      setDetail(d);
      messagesApi.markRead(id).then(loadConversations).catch(() => {});
    }).catch(() => {});
  }, [loadConversations]);

  // Aktif konuşma değişince yükle + hafif polling (karşı tarafın mesajları için).
  useEffect(() => {
    if (!activeId) { setDetail(null); return; }
    loadDetail(activeId);
    const interval = setInterval(() => {
      messagesApi.detail(activeId).then(setDetail).catch(() => {});
    }, 5000);
    return () => clearInterval(interval);
  }, [activeId, loadDetail]);

  // Yeni mesajda en alta kaydır.
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [detail?.messages.length]);

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !activeId || sending) return;
    setSending(true);
    const content = message.trim();
    setMessage("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
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
      // Konuşma değişimi yüklendikten sonra teklif modalını aç.
      setTimeout(() => openOfferModal(), 50);
    } catch {
      // sessizce geç
    }
  };

  // Sohbet içinden teklif / karşı-teklif gönder.
  const handleSendOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeId || offerSubmitting) return;
    const price = Number(offerPrice);
    if (!price || price < 1) return;
    setOfferSubmitting(true);
    try {
      await messagesApi.sendOffer(activeId, {
        price,
        note: offerNote.trim() || undefined,
      });
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
    setSelectedBlockIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
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

  const counterpartName = detail
    ? (detail.buyer.id === user?.id ? detail.seller.name : detail.buyer.name)
    : activeConv?.counterpart.name ?? "";
  const counterpartAvatar = (() => {
    if (detail) {
      const cp = detail.buyer.id === user?.id ? detail.seller : detail.buyer;
      return cp.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(cp.name)}&background=random`;
    }
    return activeConv?.counterpart.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(counterpartName || "U")}&background=random`;
  })();

  // Konuşma listesi
  const conversationList = (
    <>
      <div className="px-4 sm:px-5 pt-5 pb-2">
        <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 tracking-tight">Mesajlar</h1>
        <div className="flex w-full items-stretch rounded-xl h-10 sm:h-12 bg-background-light dark:bg-background-dark/50 border border-slate-200 dark:border-slate-700 focus-within:border-primary transition-colors overflow-hidden">
          <div className="text-slate-400 flex items-center justify-center pl-3 sm:pl-4 pr-2"><Search size={18} /></div>
          <input className="flex w-full min-w-0 flex-1 bg-transparent outline-none border-none focus:ring-0 text-slate-900 dark:text-white h-full placeholder:text-slate-400 px-0 text-sm" placeholder="Görüşmelerde ara..." />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-2 sm:px-3 py-2 space-y-1">
        {conversations.length === 0 && (
          <p className="text-sm text-slate-400 text-center mt-8 px-4">Henüz mesajınız yok. Bir ilana teklif verip ya da ilan sahibiyle iletişime geçerek mesajlaşma başlatabilirsiniz.</p>
        )}
        {conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => setActiveId(conv.id)}
            className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer relative transition-colors ${activeId === conv.id ? "bg-primary/10 dark:bg-primary/20 border border-primary/20" : "hover:bg-slate-100 dark:hover:bg-slate-800/50 border border-transparent"}`}
          >
            {conv.unreadCount > 0 && <div className="absolute right-3 top-3 min-w-5 h-5 px-1.5 flex items-center justify-center bg-red-500 rounded-full text-white text-[10px] font-bold shadow-sm">{conv.unreadCount}</div>}
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12 shrink-0 border border-white/20" style={{ backgroundImage: `url("${conv.counterpart.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(conv.counterpart.name)}&background=random`}")` }}></div>
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex justify-between items-center mb-0.5">
                <p className="text-slate-900 dark:text-white text-sm font-semibold truncate">{conv.counterpart.name}</p>
                {conv.lastMessage && <span className="text-slate-400 text-xs shrink-0 ml-2">{fmtTime(conv.lastMessage.createdAt)}</span>}
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm truncate">{conv.lastMessage?.content ?? "Yeni görüşme"}</p>
              <p className="text-slate-400 dark:text-slate-500 text-[11px] mt-1 truncate">{conv.listing?.title ?? "İlan kaldırılmış"}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  // Sohbet görünümü
  const chatView = (
    <>
      <header className="shrink-0 bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-3 sm:px-6 py-3 sm:h-20 gap-3">
        <button onClick={() => setActiveId(null)} className="md:hidden size-9 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 shrink-0">
          <ArrowLeft size={18} />
        </button>
        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-10 w-10 sm:h-12 sm:w-12" style={{ backgroundImage: `url("${counterpartAvatar}")` }}></div>
        <div className="flex flex-col min-w-0">
          <h2 className="text-slate-900 dark:text-white text-base sm:text-lg font-bold leading-tight truncate">{counterpartName}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{detail?.listing?.title ?? activeConv?.listing?.title ?? "İlan kaldırılmış"}</p>
        </div>
        <div className="ml-auto flex items-center gap-2 shrink-0">
          {/* Alıcı: satıcının hangi ilanlara teklif vermesini engelleyeceğini seçer */}
          {isBuyer && (
            <button
              onClick={openBlockModal}
              title="Teklif vermesini engelle"
              className="flex items-center gap-1.5 rounded-xl px-3 h-9 sm:h-10 text-sm font-semibold transition-all active:scale-95 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
            >
              <Ban size={18} />
              <span className="hidden sm:inline">Teklifi Engelle</span>
            </button>
          )}
          {/* Satıcı: yeni teklif başlat (engelli değilse) */}
          {isSeller && !detail?.offersBlocked && (
            <button
              onClick={openListingPicker}
              className="flex items-center gap-1.5 rounded-xl bg-primary px-3 sm:px-4 h-9 sm:h-10 text-white text-sm font-semibold shadow-lg shadow-primary/30 hover:bg-primary/85 active:scale-95 transition-all"
            >
              <HandCoins size={18} />
              <span className="hidden sm:inline">Teklif Ver</span>
            </button>
          )}
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 flex flex-col bg-[#fafafa] dark:bg-black">
        {detail?.messages.map((m) => {
          const mine = m.senderId === user?.id;

          // OFFER tipi mesaj: teklif kartı olarak göster.
          if (m.type === "OFFER") {
            const status = m.offer?.status ?? "BEKLEMEDE";
            const meta = OFFER_STATUS_META[status];
            const isLatest = m.id === lastOfferMsgId;
            const pending = isLatest && status === "BEKLEMEDE" && !detail?.offersBlocked;
            // Karşı taraf yanıtlar (kabul/reddet/karşı teklif), gönderen güncelleyebilir.
            const canRespond = pending && !mine;
            const canUpdate = pending && mine;
            const busy = actionBusy === m.id;
            const listingTitle = detail?.listing?.title;
            return (
              <div key={m.id} className={`flex w-full ${mine ? "justify-end" : "justify-start"}`}>
                <div className="w-full max-w-md rounded-2xl border border-primary/30 bg-white dark:bg-gray-900 shadow-md overflow-hidden">
                  {/* Başlık şeridi */}
                  <div className="flex items-center gap-2 bg-primary/10 px-5 py-3">
                    <HandCoins size={18} className="text-primary" />
                    <span className="text-sm font-bold text-primary">{mine ? "Gönderdiğiniz Teklif" : "Gelen Teklif"}</span>
                    <span className={`ml-auto text-[11px] font-semibold px-2.5 py-1 rounded-full ${isLatest ? meta.cls : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"}`}>
                      {isLatest ? meta.label : "Önceki teklif"}
                    </span>
                  </div>
                  {/* İlgili ilan */}
                  {listingTitle && (
                    <Link
                      href={`/ilan/${detail!.listing!.id}`}
                      className="flex items-center gap-2 px-5 py-2.5 border-b border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 hover:text-primary transition-colors"
                    >
                      <Tag size={14} className="shrink-0" />
                      <span className="truncate">İlan: <span className="font-semibold text-slate-700 dark:text-slate-200">{listingTitle}</span></span>
                    </Link>
                  )}
                  {/* Gövde */}
                  <div className="px-5 py-4">
                    <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      ₺{(m.offerPrice ?? 0).toLocaleString("tr-TR")}
                    </p>
                    {m.offerDeliveryTime && (
                      <div className="mt-3 text-sm">
                        <span className="text-slate-500 dark:text-slate-400">
                          Teslim süresi: <span className="font-semibold text-slate-700 dark:text-slate-200">{m.offerDeliveryTime}</span>
                        </span>
                      </div>
                    )}
                    {m.offerNote && (
                      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line border-t border-slate-100 dark:border-slate-800 pt-3">{m.offerNote}</p>
                    )}

                    {/* Yanıtlayan taraf: karşı teklif (üstte tam genişlik) + reddet/kabul */}
                    {canRespond && (
                      <div className="mt-4 space-y-2.5">
                        <button
                          onClick={() => openOfferModal({ price: m.offerPrice })}
                          disabled={busy}
                          className="w-full flex items-center justify-center gap-2 rounded-xl border border-primary/40 text-primary text-sm font-semibold h-11 hover:bg-primary/10 active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                          <HandCoins size={17} /> Karşı Teklif Ver
                        </button>
                        <div className="grid grid-cols-2 gap-2.5">
                          <button
                            onClick={() => handleOfferAction(m.id, "reject")}
                            disabled={busy}
                            className="flex items-center justify-center gap-2 rounded-xl border border-red-300 dark:border-red-500/40 text-red-600 dark:text-red-400 text-sm font-semibold h-11 hover:bg-red-50 dark:hover:bg-red-500/10 active:scale-[0.98] transition-all disabled:opacity-50"
                          >
                            <X size={17} /> Reddet
                          </button>
                          <button
                            onClick={() => handleOfferAction(m.id, "accept")}
                            disabled={busy}
                            className="flex items-center justify-center gap-2 rounded-xl bg-primary text-white text-sm font-semibold h-11 shadow-md shadow-primary/30 hover:bg-primary/85 active:scale-[0.98] transition-all disabled:opacity-50"
                          >
                            <Check size={17} /> Kabul Et
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Teklifi gönderen: kendi teklifini güncelleyebilir */}
                    {canUpdate && (
                      <button
                        onClick={() => openOfferModal({ price: m.offerPrice })}
                        className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-semibold h-11 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.98] transition-all"
                      >
                        <Pencil size={16} /> Teklifi Güncelle
                      </button>
                    )}

                    {/* Kabul edildi: talep sahibi (alıcı) ödemeye geçebilir */}
                    {isLatest && status === "KABUL" && isBuyer && m.offer?.order?.status === "ODEME_BEKLENIYOR" && (
                      <Link
                        href={`/odeme?order=${m.offer.order.id}`}
                        className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-white text-sm font-semibold h-11 shadow-md shadow-primary/30 hover:bg-primary/85 active:scale-[0.98] transition-all"
                      >
                        <Wallet size={17} /> Ödemeye Geç
                      </Link>
                    )}
                    {isLatest && status === "KABUL" && m.offer?.order && m.offer.order.status !== "ODEME_BEKLENIYOR" && (
                      <p className="mt-4 flex items-center justify-center gap-1.5 text-sm font-semibold text-primary">
                        <CheckCircle2 size={16} /> Ödeme tamamlandı
                      </p>
                    )}
                    {/* Satıcı tarafı: ödeme bekleniyor bilgisi (buton değil) */}
                    {isLatest && status === "KABUL" && !isBuyer && m.offer?.order?.status === "ODEME_BEKLENIYOR" && (
                      <p className="mt-4 flex items-center justify-center gap-1.5 text-sm font-medium text-amber-600 dark:text-amber-400">
                        <Wallet size={16} /> Alıcının ödemesi bekleniyor
                      </p>
                    )}
                  </div>
                  {/* Alt zaman bilgisi */}
                  <div className="px-5 pb-3">
                    <span className="text-[11px] text-slate-400">{fmtTime(m.createdAt)}</span>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div key={m.id} className={`flex items-end gap-2 max-w-[85%] sm:max-w-[70%] ${mine ? "self-end flex-row-reverse" : ""}`}>
              <div className="flex flex-col gap-1">
                <div className={`p-3 rounded-2xl shadow-sm ${mine ? "bg-primary text-white rounded-br-none" : "bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none"}`}>
                  <p className="text-sm leading-relaxed whitespace-pre-line">{m.content}</p>
                </div>
                <span className={`text-xs text-slate-400 ${mine ? "mr-1 text-right" : "ml-1"}`}>{fmtTime(m.createdAt)}</span>
              </div>
            </div>
          );
        })}
        {detail && detail.messages.length === 0 && (
          <p className="text-sm text-slate-400 text-center my-auto">Henüz mesaj yok. İlk mesajı siz gönderin.</p>
        )}
      </div>

      <form onSubmit={handleSend} className="shrink-0 bg-white dark:bg-gray-900 border-t border-slate-200 dark:border-slate-800 p-3 sm:p-4">
        {detail?.offersBlocked && (
          <div className="max-w-4xl mx-auto mb-3 flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 px-4 py-2 text-sm text-red-600 dark:text-red-400">
            <Ban size={16} className="shrink-0" />
            <span>{isBuyer ? "Bu kullanıcının teklif göndermesini engellediniz." : "İlan sahibi yeni teklif gönderiminizi kapattı."}</span>
          </div>
        )}
        <div className="max-w-4xl mx-auto flex items-end gap-2 sm:gap-3">
          <button type="button" className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="Dosya Ekle">
            <Paperclip size={22} />
          </button>
          <div className="flex-1 bg-background-light dark:bg-background-dark border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center px-3 sm:px-4 py-2 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onInput={handleInput}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(e); } }}
              className="w-full bg-transparent border-none outline-none focus:ring-0 p-0 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 resize-none max-h-32"
              placeholder="Bir mesaj yazın..."
              rows={1}
            />
          </div>
          <button type="submit" disabled={sending || !message.trim()} className="h-10 w-10 flex items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary/85 active:scale-95 transition-all disabled:opacity-50">
            <Send size={20} className="ml-0.5" />
          </button>
        </div>
      </form>

      {/* Sohbet-içi teklif modalı (yalnızca satıcı) */}
      {offerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setOfferModalOpen(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 shadow-xl border border-slate-200 dark:border-slate-700" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-200 dark:border-slate-800">
              <HandCoins size={20} className="text-primary" />
              <h3 className="text-lg font-bold">Teklif Ver</h3>
              <button onClick={() => setOfferModalOpen(false)} className="ml-auto size-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"><X size={18} /></button>
            </div>
            <form onSubmit={handleSendOffer} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Fiyat (₺)</label>
                <input
                  type="number" min={1} value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)}
                  required placeholder="Örn. 5000"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-background-light dark:bg-background-dark/50 px-4 h-11 outline-none focus:border-primary text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Not (opsiyonel)</label>
                <textarea
                  value={offerNote} onChange={(e) => setOfferNote(e.target.value)} rows={3}
                  placeholder="Teklifinizle ilgili detaylar..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-background-light dark:bg-background-dark/50 px-4 py-2.5 outline-none focus:border-primary text-slate-900 dark:text-white resize-none"
                />
              </div>
              <button
                type="submit" disabled={offerSubmitting || !offerPrice}
                className="w-full h-11 rounded-xl bg-primary text-white font-semibold shadow-lg shadow-primary/30 hover:bg-primary/85 active:scale-95 transition-all disabled:opacity-50"
              >
                {offerSubmitting ? "Gönderiliyor..." : "Teklifi Gönder"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Teklif engelleme modalı (yalnızca alıcı/ilan sahibi) */}
      {blockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setBlockModalOpen(false)}>
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-900 shadow-xl border border-slate-200 dark:border-slate-700 flex flex-col max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-200 dark:border-slate-800">
              <Ban size={20} className="text-red-500" />
              <h3 className="text-base sm:text-lg font-bold">Hangi ilanınıza teklif vermesini engellemek istersiniz?</h3>
              <button onClick={() => setBlockModalOpen(false)} className="ml-auto size-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 shrink-0"><X size={18} /></button>
            </div>

            {/* Hepsini seç */}
            <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800">
              <button
                onClick={toggleSelectAllBlocks}
                disabled={!blockOptions || blockOptions.listings.length === 0}
                className="flex items-center gap-2 text-sm font-semibold text-primary disabled:opacity-40"
              >
                {allBlockSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                Hepsini Seç
              </button>
            </div>

            {/* İlan listesi */}
            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
              {!blockOptions && <p className="text-sm text-slate-400 text-center py-8">Yükleniyor...</p>}
              {blockOptions && blockOptions.listings.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-8">Henüz ilanınız yok.</p>
              )}
              {blockOptions?.listings.map((l) => {
                const selected = selectedBlockIds.includes(l.id);
                return (
                  <button
                    key={l.id}
                    onClick={() => toggleBlockListing(l.id)}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl border text-left transition-colors ${selected ? "border-primary/40 bg-primary/5" : "border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50"}`}
                  >
                    <span className="shrink-0 text-primary">{selected ? <CheckSquare size={20} /> : <Square size={20} className="text-slate-300 dark:text-slate-600" />}</span>
                    <div
                      className="size-11 rounded-lg bg-cover bg-center bg-slate-100 dark:bg-slate-800 shrink-0"
                      style={{ backgroundImage: `url("${l.coverImageUrl || "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=200&q=80"}")` }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{l.title}</p>
                      <p className="text-[11px] text-slate-400">{l.status}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Alt butonlar */}
            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setBlockModalOpen(false)}
                className="px-5 h-11 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleSaveBlocks}
                disabled={blockSaving || !blockOptions}
                className="px-5 h-11 rounded-xl bg-red-500 text-white font-semibold shadow-lg shadow-red-500/30 hover:bg-red-600 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <Ban size={18} /> {blockSaving ? "Kaydediliyor..." : "Engelle"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Talep seçim pop-up'ı: teklif vermek için karşı tarafın talepleri */}
      {pickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setPickerOpen(false)}>
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-900 shadow-xl border border-slate-200 dark:border-slate-700 flex flex-col max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-200 dark:border-slate-800">
              <HandCoins size={20} className="text-primary" />
              <h3 className="text-base sm:text-lg font-bold">Hangi talebe teklif vermek istersiniz?</h3>
              <button onClick={() => setPickerOpen(false)} className="ml-auto size-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 shrink-0"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
              {pickerLoading && <p className="text-sm text-slate-400 text-center py-8">Yükleniyor...</p>}
              {!pickerLoading && pickerListings.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-8">Bu kullanıcının aktif talebi yok.</p>
              )}
              {pickerListings.map((l) => (
                <button
                  key={l.id}
                  onClick={() => handlePickListing(l.id)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-transparent hover:border-primary/40 hover:bg-primary/5 text-left transition-colors"
                >
                  <div
                    className="size-12 rounded-lg bg-cover bg-center bg-slate-100 dark:bg-slate-800 shrink-0"
                    style={{ backgroundImage: `url("${l.coverImageUrl || "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=200&q=80"}")` }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{l.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{l.category.name} · {l.budgetLabel}</p>
                  </div>
                  <HandCoins size={18} className="text-primary shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );

  const emptyChat = (
    <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-600">
      <p className="text-sm">Bir konuşma seçin</p>
    </div>
  );

  // Giriş yapılmamışsa içerik gösterme (çıkış sonrası sızıntıyı engeller).
  if (!isLoggedIn) return null;

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white h-screen w-full flex flex-col overflow-hidden">
      <Navbar hideCategories />
      <div className="flex flex-1 overflow-hidden">
        {/* Masaüstü: sidebar */}
        <aside className="hidden md:flex w-[320px] lg:w-[380px] flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900 shrink-0">
          {conversationList}
        </aside>
        <main className="hidden md:flex flex-1 flex-col h-full min-w-0 bg-background-light dark:bg-background-dark">
          {activeId ? chatView : emptyChat}
        </main>

        {/* Mobil: liste VEYA chat */}
        <div className="md:hidden flex-1 flex flex-col overflow-hidden">
          {activeId ? (
            <main className="flex-1 flex flex-col h-full min-w-0 bg-background-light dark:bg-background-dark">{chatView}</main>
          ) : (
            <div className="flex flex-col flex-1 bg-white dark:bg-gray-900 overflow-hidden">{conversationList}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Mesajlar() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center text-gray-400">Yükleniyor...</div>}>
      <MesajlarContent />
    </Suspense>
  );
}
