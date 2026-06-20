"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { usersApi, listingsApi, offersApi, ordersApi } from "@/lib/api/services";
import LocationSelect from "@/components/LocationSelect";
import type { Address } from "@/lib/api/types";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Camera,
  Mail,
  Phone,
  MapPin,
  UserRound,
  FileText,
  Save,
  Trash2,
  CheckCircle,
  Plus,
  Home,
  Star,
} from "lucide-react";

export default function Profil() {
  const router = useRouter();
  const { isLoggedIn, user, loading: authLoading, updateProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Adres yönetimi
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [addrTitle, setAddrTitle] = useState("");
  const [addrProvince, setAddrProvince] = useState("");
  const [addrDistrict, setAddrDistrict] = useState("");
  const [addrFull, setAddrFull] = useState("");
  const [addrBusy, setAddrBusy] = useState(false);

  const loadAddresses = useCallback(() => {
    usersApi.listAddresses().then(setAddresses).catch(() => {});
  }, []);

  // Hesap özeti (gerçek veri): toplam talep, verilen teklif, tamamlanan işlem.
  const [stats, setStats] = useState({ listings: 0, offers: 0, completed: 0 });
  const loadStats = useCallback((userId: string) => {
    Promise.all([
      listingsApi.list({ ownerId: userId, limit: 1 }).then((r) => r.meta.total).catch(() => 0),
      offersApi.mine({ limit: 1 }).then((r) => r.meta.total).catch(() => 0),
      ordersApi.myPurchases().catch(() => []),
      ordersApi.mySales().catch(() => []),
    ]).then(([listings, offers, purchases, sales]) => {
      const isDone = (s: string) => s === "ODENDI" || s === "TESLIM_EDILDI";
      const completed = [...purchases, ...sales].filter((o) => isDone(o.status)).length;
      setStats({ listings, offers, completed });
    });
  }, []);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push("/giris");
      return;
    }
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone ?? "");
      setBio(user.bio ?? "");
      setLocation(user.location ?? "");
      setProvince(user.province ?? "");
      setDistrict(user.district ?? "");
      setAvatarPreview(user.avatarUrl);
      loadAddresses();
      loadStats(user.id);
    }
  }, [authLoading, isLoggedIn, user, router, loadAddresses, loadStats]);

  // Dosya seçilince anında yükle.
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const updated = await usersApi.uploadAvatar(file);
      setAvatarPreview(updated.avatarUrl);
      updateProfile({ avatarUrl: updated.avatarUrl });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fotoğraf yüklenemedi.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const updated = await usersApi.updateProfile({
        name, email, phone, bio,
        province: province || undefined,
        district: district || undefined,
        location: province ? `${province}${district ? " / " + district : ""}` : location,
      });
      updateProfile(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Profil güncellenemedi.");
    } finally {
      setSubmitting(false);
    }
  };

  // Yeni adres ekle.
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrTitle.trim() || !addrProvince || !addrDistrict || addrBusy) return;
    setAddrBusy(true);
    try {
      await usersApi.createAddress({
        title: addrTitle.trim(),
        province: addrProvince,
        district: addrDistrict,
        fullAddress: addrFull.trim() || undefined,
      });
      setAddrTitle(""); setAddrProvince(""); setAddrDistrict(""); setAddrFull("");
      setShowAddrForm(false);
      loadAddresses();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Adres eklenemedi.");
    } finally {
      setAddrBusy(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!window.confirm("Bu adresi silmek istediğinize emin misiniz?")) return;
    try {
      await usersApi.removeAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch {
      // sessizce geç
    }
  };

  const handleMakeDefault = async (id: string) => {
    try {
      await usersApi.updateAddress(id, { isDefault: true });
      loadAddresses();
    } catch {
      // sessizce geç
    }
  };

  const avatarUrl =
    avatarPreview ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "U")}&background=5BB678&color=fff&size=200`;

  if (!isLoggedIn) return null;

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-40 py-8 md:py-12">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Profil Düzenle
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Kişisel bilgilerinizi güncelleyin ve profil fotoğrafınızı değiştirin.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
              {/* Left Column: Avatar */}
              <div className="flex flex-col gap-6">
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 flex flex-col items-center gap-5">
                  {/* Avatar */}
                  <div className="relative group">
                    <div
                      className="size-32 rounded-full bg-center bg-no-repeat bg-cover border-4 border-white dark:border-gray-800 shadow-lg"
                      style={{ backgroundImage: `url("${avatarUrl}")` }}
                    ></div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="absolute bottom-1 right-1 size-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary/85 transition-colors border-2 border-white dark:border-gray-800 disabled:opacity-60"
                    >
                      <Camera size={18} />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </div>

                  <div className="text-center">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{name || "İsim"}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{email}</p>
                  </div>

                  {avatarPreview && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors"
                    >
                      <Trash2 size={14} />
                      Fotoğrafı Kaldır
                    </button>
                  )}

                  <p className="text-xs text-gray-400 dark:text-gray-500 text-center leading-relaxed">
                    JPG, PNG veya GIF formatında, en fazla 5MB boyutunda bir fotoğraf yükleyebilirsiniz.
                  </p>
                </div>

                {/* Stats Card */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Hesap Özeti</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Toplam Talep</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{stats.listings}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Verilen Teklif</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{stats.offers}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Tamamlanan İşlem</span>
                      <span className="text-sm font-bold text-primary">{stats.completed}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Üyelik Tarihi</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">Nisan 2026</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Form */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 md:p-8">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
                  Kişisel Bilgiler
                </h3>

                {error && (
                  <div className="mb-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 px-4 py-3 text-sm text-red-700 dark:text-red-400">
                    {error}
                  </div>
                )}

                <div className="flex flex-col gap-6">
                  {/* Name */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-gray-900 dark:text-gray-200">
                        Ad Soyad
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                          <UserRound size={18} />
                        </div>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white h-12 pl-10 pr-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-400"
                          placeholder="Adınız Soyadınız"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-gray-900 dark:text-gray-200">
                        E-posta Adresi
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                          <Mail size={18} />
                        </div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white h-12 pl-10 pr-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-400"
                          placeholder="ornek@email.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-900 dark:text-gray-200">
                      Telefon Numarası
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <Phone size={18} />
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white h-12 pl-10 pr-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-400"
                        placeholder="05XX XXX XX XX"
                      />
                    </div>
                  </div>

                  {/* İl / İlçe */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-900 dark:text-gray-200 flex items-center gap-1.5">
                      <MapPin size={16} className="text-gray-400" /> Konum (İl / İlçe)
                    </label>
                    <LocationSelect
                      province={province}
                      district={district}
                      onChange={(p, d) => { setProvince(p); setDistrict(d); }}
                      showLabels={false}
                      selectClassName="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white h-12 px-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>

                  {/* Bio */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-900 dark:text-gray-200">
                      Hakkımda
                    </label>
                    <div className="relative">
                      <div className="absolute top-3.5 left-3.5 pointer-events-none text-gray-400">
                        <FileText size={18} />
                      </div>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={4}
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white pl-10 pr-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-400 resize-none"
                        placeholder="Kendinizden kısaca bahsedin..."
                      />
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 text-right">{bio.length}/500</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                    {saved ? (
                      <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
                        <CheckCircle size={18} />
                        Değişiklikler kaydedildi
                      </div>
                    ) : (
                      <div></div>
                    )}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex items-center justify-center gap-2 h-12 px-8 bg-primary hover:bg-primary/85 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <Save size={18} />
                      {submitting ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>

          {/* Adreslerim */}
          <div className="mt-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 md:p-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <Home size={20} className="text-primary" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Adreslerim</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddrForm((v) => !v)}
                className="flex items-center gap-1.5 rounded-xl bg-primary px-4 h-10 text-white text-sm font-semibold hover:bg-primary/85 active:scale-95 transition-all"
              >
                <Plus size={18} /> Adres Ekle
              </button>
            </div>

            {/* Yeni adres formu */}
            {showAddrForm && (
              <form onSubmit={handleAddAddress} className="mb-6 rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
                <input
                  value={addrTitle}
                  onChange={(e) => setAddrTitle(e.target.value)}
                  required
                  placeholder="Adres başlığı (Ev, İş vb.)"
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white h-11 px-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
                <LocationSelect
                  province={addrProvince}
                  district={addrDistrict}
                  onChange={(p, d) => { setAddrProvince(p); setAddrDistrict(d); }}
                  showLabels={false}
                  selectClassName="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white h-11 px-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
                <textarea
                  value={addrFull}
                  onChange={(e) => setAddrFull(e.target.value)}
                  rows={2}
                  placeholder="Açık adres (mahalle, sokak, no...) - opsiyonel"
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                />
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setShowAddrForm(false)} className="px-5 h-11 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">İptal</button>
                  <button type="submit" disabled={addrBusy} className="px-5 h-11 rounded-xl bg-primary text-white font-semibold hover:bg-primary/85 active:scale-95 transition-all disabled:opacity-50">{addrBusy ? "Ekleniyor..." : "Kaydet"}</button>
                </div>
              </form>
            )}

            {/* Adres listesi */}
            {addresses.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">Henüz kayıtlı adresiniz yok.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((a) => (
                  <div key={a.id} className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 dark:text-white text-sm">{a.title}</span>
                        {a.isDefault && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/15 text-primary">Varsayılan</span>}
                      </div>
                      <div className="flex items-center gap-1">
                        {!a.isDefault && (
                          <button type="button" onClick={() => handleMakeDefault(a.id)} title="Varsayılan yap" className="size-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors">
                            <Star size={16} />
                          </button>
                        )}
                        <button type="button" onClick={() => handleDeleteAddress(a.id)} title="Sil" className="size-8 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                      <MapPin size={14} className="text-gray-400 shrink-0" /> {a.province} / {a.district}
                    </p>
                    {a.fullAddress && <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{a.fullAddress}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
