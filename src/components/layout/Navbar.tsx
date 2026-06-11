"use client";

import Link from "next/link";
import {
  Search,
  User,
  Settings,
  LogOut,
  ClipboardList,
  HandCoins,
  ChevronDown,
  LogIn,
  UserPlus,
  MessageSquare,
  Menu,
  X,
  ShoppingBag,
} from "lucide-react";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { messagesApi } from "@/lib/api/services";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const navLinks = [
  { href: "/taleplerim", label: "Taleplerim", icon: ClipboardList },
  { href: "/tekliflerim", label: "Tekliflerim", icon: HandCoins },
];

const categories = [
  // Ürün (alım-satım) kategorileri
  "Telefon & Aksesuar",
  "Bilgisayar & Tablet",
  "Elektronik",
  "Beyaz Eşya",
  "Küçük Ev Aletleri",
  "Oyun & Konsol",
  "Mobilya",
  "Ev & Yaşam",
  "Giyim & Moda",
  "Anne & Bebek",
  "Spor & Outdoor",
  "Hobi & Oyuncak",
  "Kitap, Film & Müzik",
  "Otomotiv & Yedek Parça",
  "Bahçe & Yapı Market",
  "Kozmetik & Kişisel Bakım",
  "Evcil Hayvan Ürünleri",
  // Hizmet kategorileri (ikincil)
  "Nakliye & Taşımacılık",
  "Tadilat & Usta",
  "Eğitim & Özel Ders",
  "Diğer Hizmetler",
];

export default function Navbar({ hideCategories = false }: { hideCategories?: boolean }) {
  const { isLoggedIn, user, logout } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Okunmamış mesaj sayısını periyodik olarak çek (giriş yapmış kullanıcı için).
  useEffect(() => {
    if (!isLoggedIn) {
      setUnreadCount(0);
      return;
    }
    let active = true;
    const fetchUnread = () => {
      messagesApi
        .list()
        .then((convs) => {
          if (active) setUnreadCount(convs.reduce((sum, c) => sum + c.unreadCount, 0));
        })
        .catch(() => {});
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 15000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [isLoggedIn]);

  // Close mobile menu on route change (link click)
  const closeMobile = () => setIsMobileMenuOpen(false);

  // Arama: başlık/konum/açıklamaya göre kategoriler sayfasında ara.
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchTerm.trim();
    setIsMobileMenuOpen(false);
    router.push(q ? `/kategoriler?ara=${encodeURIComponent(q)}` : "/kategoriler");
  };

  return (
    <>
      <div className="w-full bg-white dark:bg-background-dark border-b border-gray-200 dark:border-gray-800 fixed top-0 left-0 right-0 z-50">

        {/* ===== MOBILE NAVBAR (lg altı) ===== */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Theme Toggle - left */}
            <ThemeToggle />

            {/* Logo centered */}
            <Link href="/" className="absolute left-1/2 -translate-x-1/2" onClick={closeMobile}>
              <img src="/banasat_logo.png" alt="BanaSat" className="h-7 w-auto" />
            </Link>

            {/* Hamburger - right */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="size-10 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile Dropdown Menu */}
          {isMobileMenuOpen && (
            <div className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-background-dark max-h-[calc(100vh-56px)] overflow-y-auto">
              {/* Search */}
              <div className="px-4 py-3">
                <form onSubmit={handleSearch} className="flex items-stretch rounded-xl h-10 border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="text-gray-400 flex bg-gray-50 dark:bg-gray-800 items-center justify-center pl-4">
                    <Search size={18} />
                  </div>
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 w-full bg-gray-50 dark:bg-gray-800 outline-none px-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400"
                    placeholder="İlan veya hizmet ara..."
                    type="text"
                  />
                </form>
              </div>

              {/* Nav Links */}
              <div className="px-4 pb-2 flex flex-col gap-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMobile}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <Icon size={18} className="text-gray-400" />
                      {link.label}
                    </Link>
                  );
                })}

                {isLoggedIn ? (
                  <>
                    <Link
                      href="/mesajlar"
                      onClick={closeMobile}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <MessageSquare size={18} className="text-gray-400" />
                      Mesajlar
                      {unreadCount > 0 && (
                        <span className="ml-auto min-w-[20px] h-5 px-1.5 flex items-center justify-center bg-red-500 text-white text-[11px] font-bold rounded-full">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </Link>
                    <Link
                      href="/talep-olustur"
                      onClick={closeMobile}
                      className="flex items-center justify-center gap-2 h-11 mt-1 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/85 transition-colors"
                    >
                      Talep Oluştur
                    </Link>

                    <div className="border-t border-gray-100 dark:border-gray-800 my-2"></div>

                    <Link href="/profil" onClick={closeMobile} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <User size={18} className="text-gray-400" />
                      Profil
                    </Link>
                    <Link href="/ayarlar" onClick={closeMobile} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <Settings size={18} className="text-gray-400" />
                      Ayarlar
                    </Link>
                    <button
                      onClick={() => { closeMobile(); logout(); }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors w-full"
                    >
                      <LogOut size={18} />
                      Çıkış Yap
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2 mt-2">
                    <Link href="/giris" onClick={closeMobile} className="flex-1 flex items-center justify-center gap-1.5 h-11 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <LogIn size={16} />
                      Giriş Yap
                    </Link>
                    <Link href="/kayit" onClick={closeMobile} className="flex-1 flex items-center justify-center gap-1.5 h-11 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/85 transition-colors">
                      <UserPlus size={16} />
                      Kayıt Ol
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Categories */}
              {!hideCategories && (
                <div className="border-t border-gray-100 dark:border-gray-800">
                  <button
                    onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}
                    className="flex items-center justify-between w-full px-8 py-3 text-sm font-bold text-gray-900 dark:text-white"
                  >
                    Kategoriler
                    <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isMobileCategoriesOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isMobileCategoriesOpen && (
                    <div className="px-4 pb-4 flex flex-wrap gap-1.5">
                      {categories.map((cat) => (
                        <Link
                          key={cat}
                          href={`/kategoriler?q=${encodeURIComponent(cat)}`}
                          onClick={closeMobile}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-all"
                        >
                          {cat}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ===== DESKTOP NAVBAR (lg ve üstü) ===== */}
        <div className="hidden lg:block">
          <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-40 py-3">
            <header className="flex items-center justify-between gap-6">
              {/* Logo & Search */}
              <div className="flex items-center gap-6">
                <Link href="/" className="flex items-center gap-2 text-primary shrink-0">
                  <img src="/banasat_logo.png" alt="BanaSat" className="h-8 w-auto" />
                </Link>

                <label className="flex flex-col min-w-40 h-10 w-96 relative group">
                  <form onSubmit={handleSearch} className="flex w-full flex-1 items-stretch rounded-xl h-full border border-gray-200 dark:border-gray-700 group-focus-within:border-primary/50 transition-colors overflow-hidden">
                    <div className="text-gray-400 flex bg-gray-50 dark:bg-gray-800/50 items-center justify-center pl-4 border-r-0">
                      <Search size={18} />
                    </div>
                    <input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden text-gray-900 dark:text-white focus:outline-none border-none bg-gray-50 dark:bg-gray-800/50 h-full placeholder:text-gray-400 px-3 text-sm font-medium"
                      placeholder="İlan veya hizmet ara..."
                      type="text"
                    />
                  </form>
                </label>
              </div>

              {/* Desktop Nav Links */}
              <nav className="flex items-center gap-5">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-semibold text-gray-600 transition-colors hover:text-primary dark:text-gray-300 whitespace-nowrap"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* User Actions */}
              <div className="flex items-center gap-3 shrink-0">
                {isLoggedIn ? (
                  <>
                    <Link
                      href="/talep-olustur"
                      className="flex items-center justify-center rounded-xl h-10 px-5 bg-primary hover:bg-primary/85 transition-colors text-white text-sm font-bold shadow-md hover:shadow-lg shadow-primary/20"
                    >
                      Talep Oluştur
                    </Link>

                    <div className="h-6 w-px bg-gray-200 dark:bg-gray-800"></div>

                    <ThemeToggle />

                    <Link
                      href="/mesajlar"
                      className="relative flex items-center justify-center rounded-xl size-10 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
                      aria-label="Mesajlar"
                      title="Mesajlar"
                    >
                      <MessageSquare size={18} />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white dark:border-background-dark">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </Link>

                    {/* Profile Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                      <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-2 p-1 pr-3 rounded-full border border-gray-200 dark:border-gray-800 hover:border-primary/50 transition-colors outline-none"
                      >
                        <div
                          className="bg-center bg-no-repeat bg-cover rounded-full size-8"
                          style={{
                            backgroundImage: user?.avatarUrl
                              ? `url("${user.avatarUrl}")`
                              : `url("https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "U")}&background=5BB678&color=fff")`,
                          }}
                        ></div>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 max-w-[120px] truncate">
                          {user?.name || "Kullanıcı"}
                        </span>
                      </button>

                      {isProfileOpen && (
                        <div className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl py-2 z-50">
                          <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 mb-1">
                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.name || "Kullanıcı"}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email || "user@banasat.com"}</p>
                          </div>
                          <Link href="/siparislerim" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <ShoppingBag size={16} /> Siparişlerim
                          </Link>
                          <Link href="/profil" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <User size={16} /> Profil
                          </Link>
                          <Link href="/ayarlar" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <Settings size={16} /> Ayarlar
                          </Link>
                          <div className="border-t border-gray-100 dark:border-gray-800 mt-1 pt-1">
                            <button onClick={() => { setIsProfileOpen(false); logout(); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                              <LogOut size={16} /> Çıkış Yap
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <ThemeToggle />
                    <Link href="/giris" className="flex items-center justify-center gap-1.5 rounded-xl h-10 px-5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <LogIn size={16} /> Giriş Yap
                    </Link>
                    <Link href="/kayit" className="flex items-center justify-center gap-1.5 rounded-xl h-10 px-5 bg-primary hover:bg-primary/85 transition-colors text-white text-sm font-bold shadow-md hover:shadow-lg shadow-primary/20">
                      <UserPlus size={16} /> Kayıt Ol
                    </Link>
                  </>
                )}
              </div>
            </header>
          </div>

          {/* Desktop Category Bar */}
          {!hideCategories && (
            <div className="w-full border-t border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-900/40">
              <div className="flex items-start px-4 py-2 gap-2">
                <span className="shrink-0 px-3.5 py-1.5 text-xs font-bold text-gray-900 dark:text-white whitespace-nowrap">
                  Kategoriler
                </span>
                <div className={`flex flex-wrap gap-1 flex-1 ${isCategoriesOpen ? "" : "max-h-[32px] overflow-hidden"}`}>
                  {categories.map((cat) => (
                    <Link
                      key={cat}
                      href={`/kategoriler?q=${encodeURIComponent(cat)}`}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white hover:shadow-sm transition-all whitespace-nowrap"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
                <button
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  className="shrink-0 mt-0.5 size-7 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all shadow-sm"
                  aria-label={isCategoriesOpen ? "Kategorileri daralt" : "Tüm kategorileri göster"}
                >
                  <ChevronDown size={16} className={`transition-transform duration-200 ${isCategoriesOpen ? "rotate-180" : ""}`} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Spacer */}
      <div className={hideCategories ? "h-[56px] lg:h-[56px]" : "h-[56px] lg:h-[88px]"} />
    </>
  );
}
