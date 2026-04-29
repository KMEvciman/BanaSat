"use client";

import Link from "next/link";
import { ArrowRightLeft, MessageSquare, Search, User, Settings, LogOut, FileText } from "lucide-react";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { useState, useRef, useEffect } from "react";

const navLinks = [
  { href: "/talep-detay", label: "Talep Detay" },
  { href: "/teklif-karsilastir", label: "Teklifler" },
  { href: "/odeme", label: "Ödeme" },
  { href: "/satici/teklif-ver", label: "Satıcı Paneli" },
];

export default function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full bg-white dark:bg-background-dark border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-40 py-3">
        <header className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
          
          {/* Logo & Search */}
          <div className="flex items-center justify-between w-full md:w-auto gap-8">
            <Link href="/" className="flex items-center gap-2 text-primary">
              <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
                <ArrowRightLeft size={20} />
              </div>
              <h2 className="text-gray-900 dark:text-white text-xl font-bold leading-tight tracking-tight mt-0.5">
                BanaSat
              </h2>
            </Link>
            
            <label className="hidden md:flex flex-col min-w-40 h-10 w-full md:w-80 relative group">
              <div className="flex w-full flex-1 items-stretch rounded-xl h-full border border-gray-200 dark:border-gray-700 group-focus-within:border-primary/50 transition-colors overflow-hidden">
                <div className="text-gray-400 flex bg-gray-50 dark:bg-gray-800/50 items-center justify-center pl-4 border-r-0">
                  <Search size={18} />
                </div>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden text-gray-900 dark:text-white focus:outline-none border-none bg-gray-50 dark:bg-gray-800/50 h-full placeholder:text-gray-400 px-3 text-sm font-medium"
                  placeholder="Hangi hizmeti arıyorsunuz?"
                  type="text"
                />
              </div>
            </label>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-gray-600 transition-colors hover:text-primary dark:text-gray-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex flex-wrap items-center justify-end w-full md:w-auto gap-4">
            
            <Link href="/talep-olustur" className="flex-1 md:flex-none flex items-center justify-center rounded-xl h-10 px-5 bg-primary hover:bg-blue-600 transition-colors text-white text-sm font-bold shadow-md hover:shadow-lg shadow-primary/20">
              Talep Oluştur
            </Link>

            <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 hidden md:block"></div>

            <Link
              href="/mesajlar"
              className="flex items-center justify-center rounded-xl size-10 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
              aria-label="Mesajlar"
              title="Mesajlar"
            >
              <MessageSquare size={18} />
            </Link>
            
            <ThemeToggle />

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 rounded-full border border-gray-200 dark:border-gray-800 hover:border-primary/50 transition-colors outline-none"
              >
                <div
                  className="bg-center bg-no-repeat bg-cover rounded-full size-8"
                  style={{ backgroundImage: 'url("https://ui-avatars.com/api/?name=Kullanici+Adi&background=random")' }}
                ></div>
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 top-12 w-48 bg-white dark:bg-[#1a202c] border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 mb-1">
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">Kullanıcı Adı</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">user@banasat.com</p>
                  </div>
                  
                  <Link href="/taleplerim" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <FileText size={16} />
                    Sipariş ve Taleplerim
                  </Link>
                  <Link href="#" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <User size={16} />
                    Profil
                  </Link>
                  <Link href="#" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <Settings size={16} />
                    Ayarlar
                  </Link>
                  
                  <div className="border-t border-gray-100 dark:border-gray-800 mt-1 pt-1">
                    <button onClick={() => setIsProfileOpen(false)} className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                      <LogOut size={16} />
                      Çıkış Yap
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Mobile Nav Links */}
          <nav className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4 lg:hidden mt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex h-9 items-center justify-center rounded-lg bg-gray-50 px-3 text-center text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-100 dark:bg-gray-800/50 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Search */}
          <label className="flex md:hidden flex-col h-10 w-full mt-2">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-full border border-gray-200 dark:border-gray-700">
              <div className="text-gray-400 flex bg-gray-50 dark:bg-gray-800 items-center justify-center pl-4 rounded-l-xl">
                <Search size={18} />
              </div>
              <input
                className="flex-1 w-full bg-gray-50 dark:bg-gray-800 outline-none px-3 text-sm rounded-r-xl"
                placeholder="Hangi hizmeti arıyorsunuz?"
                type="text"
              />
            </div>
          </label>
        </header>
      </div>
    </div>
  );
}
