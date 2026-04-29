"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
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
} from "lucide-react";

export default function Profil() {
  const router = useRouter();
  const { isLoggedIn, user, updateProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/giris");
      return;
    }
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone);
      setBio(user.bio);
      setLocation(user.location);
      setAvatarPreview(user.avatar);
    }
  }, [isLoggedIn, user, router]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setAvatarPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      email,
      phone,
      bio,
      location,
      avatar: avatarPreview,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
                      className="absolute bottom-1 right-1 size-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary/85 transition-colors border-2 border-white dark:border-gray-800"
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
                      <span className="text-sm font-bold text-gray-900 dark:text-white">9</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Verilen Teklif</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">7</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Tamamlanan İşlem</span>
                      <span className="text-sm font-bold text-primary">3</span>
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

                  {/* Phone & Location */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-gray-900 dark:text-gray-200">
                        Konum
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                          <MapPin size={18} />
                        </div>
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white h-12 pl-10 pr-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-400"
                          placeholder="Şehir, Ülke"
                        />
                      </div>
                    </div>
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
                      className="flex items-center justify-center gap-2 h-12 px-8 bg-primary hover:bg-primary/85 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg shadow-primary/20"
                    >
                      <Save size={18} />
                      Değişiklikleri Kaydet
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
