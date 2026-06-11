"use client";

import {
  Lock, Truck, CreditCard, BadgeCheck, ArrowRight, CheckCircle2, ShoppingBag, ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/context/AuthContext";
import { ordersApi } from "@/lib/api/services";
import type { Order } from "@/lib/api/types";

function OdemeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const { user, isLoggedIn, loading: authLoading } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");

  // Form alanları (simülasyon).
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNo, setCardNo] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  useEffect(() => {
    if (!authLoading && !isLoggedIn) { router.replace("/giris"); return; }
    if (!orderId) { setNotFound(true); setLoading(false); return; }
    if (!isLoggedIn) return;
    ordersApi.detail(orderId)
      .then((o) => {
        setOrder(o);
        if (o.status !== "ODEME_BEKLENIYOR") setDone(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [authLoading, isLoggedIn, orderId, router]);

  useEffect(() => {
    if (user) { setName(user.name ?? ""); setPhone(user.phone ?? ""); }
  }, [user]);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order || processing) return;
    if (!agreed) { setError("Devam etmek için sözleşmeyi onaylayınız."); return; }
    setError("");
    setProcessing(true);
    try {
      await ordersApi.pay(order.id);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ödeme tamamlanamadı.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 w-full bg-white dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-40 py-8 md:py-12">
          <nav className="flex mb-6 text-sm font-medium text-gray-500 dark:text-gray-400">
            <ol className="flex items-center gap-2">
              <li><Link href="/siparislerim" className="hover:text-primary transition-colors">Siparişlerim</Link></li>
              <li><ChevronRight size={16} /></li>
              <li className="text-gray-900 dark:text-white font-semibold">Ödeme</li>
            </ol>
          </nav>

          {loading ? (
            <div className="h-64 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
          ) : notFound || !order ? (
            <div className="text-center py-20">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sipariş bulunamadı</h1>
              <Link href="/siparislerim" className="text-primary font-semibold hover:underline">Siparişlerime dön</Link>
            </div>
          ) : done ? (
            /* Başarılı ödeme ekranı */
            <div className="max-w-xl mx-auto text-center py-12">
              <div className="size-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                <CheckCircle2 size={44} />
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-2">Ödeme Tamamlandı</h1>
              <p className="text-gray-500 dark:text-gray-400 mb-2">
                <span className="font-bold text-gray-900 dark:text-white">{order.offer.listing.title}</span> için alışverişiniz başarıyla tamamlandı.
              </p>
              <p className="text-sm text-gray-400 mb-8">Tutar: {order.amount.toLocaleString("tr-TR")} ₺ · Satıcı: {order.offer.seller.name}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/siparislerim" className="flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:bg-primary/85 transition-all">
                  <ShoppingBag size={18} /> Siparişlerime Git
                </Link>
                <Link href="/" className="flex items-center justify-center gap-2 h-12 px-6 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  Ana Sayfa
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Güvenli Ödeme</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Siparişinizi tamamlamak için teslimat ve ödeme bilgilerinizi giriniz.</p>
              </div>

              {error && (
                <div className="mb-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 px-4 py-3 text-sm text-red-700 dark:text-red-400">{error}</div>
              )}

              <form onSubmit={handlePay} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Sol: Formlar */}
                <div className="lg:col-span-8 space-y-6">
                  <section className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
                      <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"><Truck size={20} /></div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Teslimat Bilgileri</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <Field label="Ad Soyad"><input value={name} onChange={(e) => setName(e.target.value)} required className={inputCls} placeholder="Ad Soyad" /></Field>
                      <Field label="Telefon"><input value={phone} onChange={(e) => setPhone(e.target.value)} required className={inputCls} placeholder="05XX XXX XX XX" /></Field>
                      <div className="md:col-span-2">
                        <Field label="Açık Adres"><textarea value={address} onChange={(e) => setAddress(e.target.value)} required rows={3} className={`${inputCls} h-auto py-3 resize-none`} placeholder="Mahalle, cadde, sokak, kapı no..." /></Field>
                      </div>
                    </div>
                  </section>

                  <section className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
                      <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"><CreditCard size={20} /></div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Kart Bilgileri</h2>
                    </div>
                    <div className="space-y-5">
                      <Field label="Kart Üzerindeki İsim"><input value={cardName} onChange={(e) => setCardName(e.target.value)} required className={`${inputCls} uppercase`} placeholder="AD SOYAD" /></Field>
                      <Field label="Kart Numarası"><input value={cardNo} onChange={(e) => setCardNo(e.target.value)} required maxLength={19} className={`${inputCls} font-mono tracking-wider`} placeholder="0000 0000 0000 0000" /></Field>
                      <div className="grid grid-cols-2 gap-5">
                        <Field label="Son Kullanma"><input value={cardExp} onChange={(e) => setCardExp(e.target.value)} required maxLength={5} className={`${inputCls} text-center`} placeholder="AA/YY" /></Field>
                        <Field label="CVV"><input value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} required maxLength={4} className={`${inputCls} text-center`} placeholder="123" /></Field>
                      </div>
                      <p className="flex items-center gap-1.5 text-xs text-gray-400"><Lock size={14} /> Bu bir simülasyondur; gerçek bir ödeme alınmaz.</p>
                    </div>
                  </section>
                </div>

                {/* Sağ: Özet */}
                <div className="lg:col-span-4">
                  <div className="lg:sticky lg:top-[120px] bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Sipariş Özeti</h3>
                    </div>
                    <div className="p-6">
                      <div className="flex gap-4 mb-6">
                        <div className="size-16 rounded-lg bg-cover bg-center bg-gray-100 dark:bg-gray-700 shrink-0 border border-gray-200 dark:border-gray-600"
                          style={{ backgroundImage: `url("${order.offer.listing.coverImageUrl || "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=200&q=80"}")` }} />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-tight mb-1 line-clamp-2">{order.offer.listing.title}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Satıcı: <span className="text-primary font-medium">{order.offer.seller.name}</span></p>
                          <p className="flex items-center gap-1 text-xs text-primary mt-1"><BadgeCheck size={14} /> Anlaşma sağlandı</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-end pt-4 border-t border-gray-100 dark:border-gray-800">
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Toplam Tutar</p>
                        <div className="text-2xl font-bold text-primary tracking-tight">{order.amount.toLocaleString("tr-TR")} ₺</div>
                      </div>

                      <label className="mt-6 mb-4 flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 size-4 rounded border-gray-300 text-primary focus:ring-primary dark:bg-gray-800 dark:border-gray-600" />
                        <span className="text-xs text-gray-500 dark:text-gray-400 leading-snug">Mesafeli Satış Sözleşmesi&apos;ni okudum, onaylıyorum.</span>
                      </label>

                      <button type="submit" disabled={processing} className="w-full bg-primary hover:bg-primary/85 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                        {processing ? "İşleniyor..." : <>Ödemeyi Tamamla <ArrowRight size={20} /></>}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white h-12 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm placeholder:text-gray-400 outline-none";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-gray-900 dark:text-gray-200">{label}</label>
      {children}
    </div>
  );
}

export default function OdemeEkrani() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Yükleniyor...</div>}>
      <OdemeContent />
    </Suspense>
  );
}
