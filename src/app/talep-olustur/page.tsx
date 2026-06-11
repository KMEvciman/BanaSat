"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { categoriesApi, listingsApi } from "@/lib/api/services";
import LocationSelect from "@/components/LocationSelect";
import type { Category } from "@/lib/api/types";
import {
  ChevronDown,
  ArrowRight,
  Lightbulb,
  CheckCircle,
  ListChecks,
  Camera,
} from "lucide-react";

export default function TalepOlustur() {
  const router = useRouter();
  const { isLoggedIn, loading: authLoading } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [budgetLabel, setBudgetLabel] = useState("");
  const [budgetWarning, setBudgetWarning] = useState(false);
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Giriş yapılmamışsa giriş sayfasına yönlendir.
  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.replace("/giris");
    }
  }, [authLoading, isLoggedIn, router]);

  // Kategorileri yükle.
  useEffect(() => {
    categoriesApi.list().then(setCategories).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const listing = await listingsApi.create({
        title,
        description,
        fullDescription,
        categoryId,
        budgetLabel: budgetLabel ? `${Number(budgetLabel).toLocaleString("tr-TR")} ₺` : "",
        location: province ? `${province}${district ? " / " + district : ""}` : undefined,
        province: province || undefined,
        district: district || undefined,
        coverImageUrl: coverImageUrl || undefined,
      });
      router.push(`/ilan/${listing.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Talep oluşturulamadı.");
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full bg-white dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-40 py-8 md:py-16 flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col gap-2 text-center md:text-left">
            <h1 className="text-gray-900 dark:text-white tracking-tight text-3xl font-bold leading-tight">
              Yeni Talep Oluştur
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-base">
              Satıcılardan en iyi teklifleri almak için detayları girin.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
            {/* Form */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8">
              <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 px-4 py-3 text-sm text-red-700 dark:text-red-400">
                    {error}
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <label className="text-gray-900 dark:text-gray-200 text-sm font-medium">
                    Talep Başlığı <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    minLength={5}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3 text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400"
                    placeholder="Örn. iPhone 15 Pro Max 256GB arıyorum"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-gray-900 dark:text-gray-200 text-sm font-medium">
                    Kategori <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      required
                      className="w-full appearance-none rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3 text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer"
                    >
                      <option value="" disabled>
                        Kategori Seçiniz
                      </option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={20} className="absolute right-4 top-3.5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-gray-900 dark:text-gray-200 text-sm font-medium">
                    Kısa Açıklama <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    minLength={10}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3 text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400"
                    placeholder="Kartta görünecek kısa özet"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-gray-900 dark:text-gray-200 text-sm font-medium">
                    Detaylı Açıklama <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={fullDescription}
                    onChange={(e) => setFullDescription(e.target.value)}
                    required
                    minLength={20}
                    className="w-full min-h-[140px] rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3 text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400 resize-y"
                    placeholder="İhtiyacınızın detaylarını, tercihlerinizi ve koşulları yazın..."
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-gray-900 dark:text-gray-200 text-sm font-medium">
                    Bütçe (₺) <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={budgetLabel ? Number(budgetLabel).toLocaleString("tr-TR") : ""}
                    onChange={(e) => {
                      const raw = e.target.value;
                      const digits = raw.replace(/\D/g, "");
                      setBudgetWarning(raw.trim() !== "" && /[^\d.\s]/.test(raw));
                      setBudgetLabel(digits);
                    }}
                    inputMode="numeric"
                    required
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3 text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400"
                    placeholder="Örn. 60000"
                  />
                  {budgetWarning && (
                    <p className="text-xs text-red-500">Yalnızca sayı girebilirsiniz.</p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-gray-900 dark:text-gray-200 text-sm font-medium">Konum (İl / İlçe)</label>
                  <LocationSelect
                    province={province}
                    district={district}
                    onChange={(p, d) => { setProvince(p); setDistrict(d); }}
                    showLabels={false}
                    selectClassName="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3 text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-gray-900 dark:text-gray-200 text-sm font-medium">
                    Kapak Görseli URL (Opsiyonel)
                  </label>
                  <input
                    value={coverImageUrl}
                    onChange={(e) => setCoverImageUrl(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3 text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400"
                    placeholder="https://..."
                  />
                </div>

                <div className="flex items-center justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
                  <button
                    disabled={submitting}
                    className="bg-primary hover:bg-primary/85 text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
                    type="submit"
                  >
                    {submitting ? "Oluşturuluyor..." : "Talebi Yayınla"}
                    {!submitting && <ArrowRight size={20} />}
                  </button>
                </div>
              </form>
            </div>

            {/* Tips */}
            <div className="flex flex-col gap-6">
              <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl p-6 relative overflow-hidden">
                <Lightbulb size={120} className="absolute -right-6 -top-6 text-primary/10 pointer-events-none select-none" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 relative z-10">
                  Nasıl iyi bir talep oluşturulur?
                </h3>
                <div className="flex flex-col gap-5 relative z-10">
                  <Tip icon={<CheckCircle size={18} />} title="Net Olun" text="Model ve marka belirtmek satıcıların işini kolaylaştırır." />
                  <Tip icon={<ListChecks size={18} />} title="Detay Verin" text="Daha fazla detay 3 kat daha fazla teklif getirir." />
                  <Tip icon={<Camera size={18} />} title="Görsel Ekleyin" text="Kapak görseli ilanınızın dikkat çekmesini sağlar." />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Tip({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 size-8 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-primary shadow-sm">
        {icon}
      </div>
      <div className="flex flex-col">
        <h4 className="text-sm font-bold text-gray-900 dark:text-white">{title}</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
