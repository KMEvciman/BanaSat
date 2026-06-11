"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ordersApi } from "@/lib/api/services";
import type { Order, OrderStatus } from "@/lib/api/types";
import { ShoppingBag, Package, Wallet } from "lucide-react";

// Sipariş durumu etiket + renk eşlemesi.
const STATUS_META: Record<OrderStatus, { label: string; cls: string }> = {
  ODEME_BEKLENIYOR: { label: "Ödeme Bekleniyor", cls: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400" },
  ODENDI: { label: "Ödendi", cls: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400" },
  HAZIRLANIYOR: { label: "Hazırlanıyor", cls: "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400" },
  KARGODA: { label: "Kargoda", cls: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400" },
  TESLIM_EDILDI: { label: "Teslim Edildi", cls: "bg-primary/15 text-primary" },
  IPTAL: { label: "İptal", cls: "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400" },
};

type Tab = "purchases" | "sales";

export default function Siparislerim() {
  const router = useRouter();
  const { isLoggedIn, loading: authLoading } = useAuth();

  const [tab, setTab] = useState<Tab>("purchases");
  const [purchases, setPurchases] = useState<Order[]>([]);
  const [sales, setSales] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      ordersApi.myPurchases().catch(() => []),
      ordersApi.mySales().catch(() => []),
    ])
      .then(([p, s]) => { setPurchases(p); setSales(s); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) { router.push("/giris"); return; }
    if (isLoggedIn) load();
  }, [authLoading, isLoggedIn, load, router]);

  // Ödeme simülasyonu (alıcı, ödeme bekleyen sipariş).
  const handlePay = async (id: string) => {
    if (payingId) return;
    setPayingId(id);
    try {
      await ordersApi.pay(id);
      load();
    } catch {
      // sessizce geç
    } finally {
      setPayingId(null);
    }
  };

  const list = tab === "purchases" ? purchases : sales;

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full bg-background-light dark:bg-background-dark">
        <div className="max-w-5xl mx-auto px-4 md:px-10 py-6 md:py-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><ShoppingBag size={22} /></div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">Siparişlerim</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Anlaşılan tekliflerden oluşan siparişleriniz</p>
            </div>
          </div>

          {/* Sekmeler */}
          <div className="flex gap-2 mb-6 border-b border-gray-100 dark:border-gray-800">
            <TabButton active={tab === "purchases"} onClick={() => setTab("purchases")} label="Alımlarım" count={purchases.length} />
            <TabButton active={tab === "sales"} onClick={() => setTab("sales")} label="Satışlarım" count={sales.length} />
          </div>

          {loading ? (
            <div className="grid gap-4">
              {[1, 2].map((i) => <div key={i} className="h-32 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />)}
            </div>
          ) : list.length === 0 ? (
            <div className="text-center py-20">
              <Package size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">{tab === "purchases" ? "Henüz bir alımınız yok." : "Henüz bir satışınız yok."}</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {list.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  isBuyer={tab === "purchases"}
                  paying={payingId === order.id}
                  onPay={() => handlePay(order.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function TabButton({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count: number }) {
  return (
    <button
      onClick={onClick}
      className={`relative px-4 py-3 text-sm font-semibold transition-colors ${active ? "text-primary" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
    >
      {label} <span className="ml-1 text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-full">{count}</span>
      {active && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />}
    </button>
  );
}

function OrderCard({ order, isBuyer, paying, onPay }: { order: Order; isBuyer: boolean; paying: boolean; onPay: () => void }) {
  const meta = STATUS_META[order.status];
  const counterpart = isBuyer ? order.offer.seller : order.buyer;
  const listing = order.offer.listing;

  return (
    <article className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
      <div className="flex flex-col sm:flex-row">
        <Link href={`/ilan/${listing.id}`} className="sm:w-44 h-32 sm:h-auto shrink-0 bg-cover bg-center bg-gray-100 dark:bg-gray-800"
          style={{ backgroundImage: `url("${listing.coverImageUrl || "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=400&q=80"}")` }}
        />
        <div className="flex-1 p-5 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-primary uppercase tracking-wide">{listing.category.name}</span>
              <Link href={`/ilan/${listing.id}`} className="block font-bold text-gray-900 dark:text-white hover:text-primary transition-colors truncate">{listing.title}</Link>
            </div>
            <span className={`shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full ${meta.cls}`}>{meta.label}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="size-6 rounded-full bg-cover bg-center" style={{ backgroundImage: `url("${counterpart.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(counterpart.name)}&background=5BB678&color=fff`}")` }} />
            <span>{isBuyer ? "Satıcı" : "Alıcı"}: <span className="font-semibold text-gray-700 dark:text-gray-200">{counterpart.name}</span></span>
          </div>

          <div className="flex items-end justify-between gap-3 mt-auto pt-2 border-t border-gray-100 dark:border-gray-800">
            <div>
              <p className="text-xs text-gray-500">Tutar</p>
              <p className="text-2xl font-black text-primary tracking-tight">{order.amount.toLocaleString("tr-TR")} ₺</p>
            </div>
            {isBuyer && order.status === "ODEME_BEKLENIYOR" && (
              <button
                onClick={onPay}
                disabled={paying}
                className="flex items-center gap-2 h-11 px-5 rounded-xl bg-primary text-white text-sm font-semibold shadow-lg shadow-primary/30 hover:bg-primary/85 active:scale-95 transition-all disabled:opacity-50"
              >
                <Wallet size={17} /> {paying ? "İşleniyor..." : "Ödemeyi Tamamla"}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
