"use client";

import Navbar from "@/components/layout/Navbar";
import { 
  Search, 
  Star, 
  Tag, 
  Paperclip, 
  Gavel, 
  Send 
} from "lucide-react";
import { useEffect, useRef } from "react";

export default function Mesajlar() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, []);

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display h-screen w-full flex flex-col overflow-hidden antialiased selection:bg-primary/30">
      <Navbar hideCategories />
      <div className="flex flex-1 overflow-hidden">
      {/* Sidebar: Conversation List */}
      <aside className="hidden md:flex w-[320px] lg:w-[380px] flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900 shrink-0 z-20">
        {/* Sidebar Header: Search */}
        <div className="px-5 pt-6 pb-2">
          <h1 className="text-2xl font-bold mb-4 tracking-tight">Mesajlar</h1>
          <label className="flex flex-col w-full">
            <div className="flex w-full items-stretch rounded-xl h-12 bg-background-light dark:bg-background-dark/50 border border-slate-200 dark:border-slate-700 focus-within:border-primary transition-colors overflow-hidden">
              <div className="text-slate-400 flex items-center justify-center pl-4 pr-2">
                <Search size={20} />
              </div>
              <input
                className="flex w-full min-w-0 flex-1 resize-none bg-transparent outline-none border-none focus:ring-0 text-slate-900 dark:text-white h-full placeholder:text-slate-400 px-0 text-sm font-normal"
                placeholder="Görüşmelerde ara..."
              />
            </div>
          </label>
        </div>

        {/* Sidebar Filters: Chips */}
        <div className="px-5 py-2 flex gap-2 overflow-x-auto no-scrollbar scrollbar-hide">
          <button className="flex h-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 dark:bg-white px-4 transition-transform active:scale-95 outline-none block">
            <p className="text-white dark:text-slate-900 text-xs font-medium">Tüm Mesajlar</p>
          </button>
          <button className="flex h-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors outline-none block">
            <p className="text-slate-600 dark:text-slate-300 text-xs font-medium">Okunmamış</p>
          </button>
          <button className="flex h-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors outline-none block">
            <p className="text-slate-600 dark:text-slate-300 text-xs font-medium">Arşiv</p>
          </button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {/* Active Item */}
          <div className="group flex items-center gap-3 p-3 rounded-xl bg-primary/10 dark:bg-primary/20 border border-primary/20 cursor-pointer relative">
            <div className="absolute right-3 top-3 w-2.5 h-2.5 bg-primary rounded-full"></div>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12 shrink-0 border border-white/20"
              style={{ backgroundImage: 'url("https://ui-avatars.com/api/?name=Ahmet+Yilmaz&background=random")' }}
            ></div>
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex justify-between items-center mb-0.5">
                <p className="text-slate-900 dark:text-white text-sm font-semibold truncate">Ahmet Yılmaz</p>
                <span className="text-primary text-xs font-medium">14:30</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-sm truncate font-medium">Fiyatta son ne olur?</p>
              <p className="text-slate-400 dark:text-slate-500 text-[11px] mt-1">iPhone 13 Pro Max İsteği</p>
            </div>
          </div>

          {/* Inactive Item */}
          <div className="group flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 cursor-pointer transition-colors border border-transparent">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12 shrink-0 bg-slate-200"
              style={{ backgroundImage: 'url("https://ui-avatars.com/api/?name=Tekno+Store&background=random")' }}
            ></div>
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex justify-between items-center mb-0.5">
                <p className="text-slate-900 dark:text-white text-sm font-semibold truncate">Tekno Store</p>
                <span className="text-slate-400 text-xs">Dün</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm truncate">Kargoya verildi, takip no...</p>
              <p className="text-slate-400 dark:text-slate-500 text-[11px] mt-1">Macbook Air M2 İsteği</p>
            </div>
          </div>

          {/* Inactive Item */}
          <div className="group flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 cursor-pointer transition-colors border border-transparent">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12 shrink-0 bg-slate-200"
              style={{ backgroundImage: 'url("https://ui-avatars.com/api/?name=Zeynep+Demir&background=random")' }}
            ></div>
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex justify-between items-center mb-0.5">
                <p className="text-slate-900 dark:text-white text-sm font-semibold truncate">Zeynep Demir</p>
                <span className="text-slate-400 text-xs">Pzt</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm truncate">Teşekkürler, iyi satışlar.</p>
              <p className="text-slate-400 dark:text-slate-500 text-[11px] mt-1">Sony Kulaklık İsteği</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full relative min-w-0 bg-background-light dark:bg-background-dark">
        {/* Sticky Header */}
        <header className="shrink-0 bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-0 sm:h-20 sticky top-0 z-10 shadow-sm gap-3">
          {/* Left: User Profile */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12"
                style={{ backgroundImage: 'url("https://ui-avatars.com/api/?name=Ahmet+Yilmaz&background=random")' }}
              ></div>
              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-[#1e2433]"></div>
            </div>
            <div className="flex flex-col">
              <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">Ahmet Yılmaz</h2>
              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <Star size={14} className="text-amber-500 fill-amber-500" />
                <span className="font-medium text-slate-700 dark:text-slate-300">4.8</span>
                <span>(12 İşlem)</span>
              </div>
            </div>
          </div>

          {/* Right: Deal Context */}
          <div className="hidden sm:flex flex-col items-end">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-900/40 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:text-amber-200">
                Pazarlık Aşamasında
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-slate-500 dark:text-slate-400">Son Teklif:</span>
              <span className="text-xl font-bold text-primary tracking-tight">₺28.000</span>
            </div>
          </div>
        </header>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6 flex flex-col bg-[#fafafa] dark:bg-black">
          {/* Date Separator */}
          <div className="flex justify-center">
            <span className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs px-3 py-1 rounded-full font-medium">Bugün</span>
          </div>

          {/* Message: Incoming */}
          <div className="flex items-end gap-3 max-w-[90%] sm:max-w-[80%]">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-8 w-8 shrink-0 mb-1"
              style={{ backgroundImage: 'url("https://ui-avatars.com/api/?name=Ahmet+Yilmaz&background=random")' }}
            ></div>
            <div className="flex flex-col gap-1">
              <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl rounded-bl-none shadow-sm">
                <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
                  Merhaba, ilanınızı gördüm. İstediğiniz iPhone 13 Pro Max için elimde temiz, garantisi devam eden bir cihaz var.
                </p>
              </div>
              <span className="text-xs text-slate-400 ml-1">10:42</span>
            </div>
          </div>

          {/* Message: Outgoing */}
          <div className="flex items-end gap-3 max-w-[90%] sm:max-w-[80%] self-end flex-row-reverse">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-8 w-8 shrink-0 mb-1"
              style={{ backgroundImage: 'url("https://ui-avatars.com/api/?name=Ben&background=random")' }}
            ></div>
            <div className="flex flex-col gap-1 items-end">
              <div className="bg-primary p-4 rounded-2xl rounded-br-none shadow-md shadow-blue-500/10">
                <p className="text-white text-sm leading-relaxed">
                  Selamlar Ahmet Bey. Cihazın pil sağlığı ne durumda? Kozmetik olarak herhangi bir çiziği var mı?
                </p>
              </div>
              <span className="text-xs text-slate-400 mr-1">10:45</span>
            </div>
          </div>

          {/* System Message: Offer */}
          <div className="flex justify-center w-full my-4">
            <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 flex flex-col items-center gap-2 max-w-sm text-center">
              <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-primary flex items-center justify-center">
                <Tag size={18} />
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                <span className="font-semibold">Ahmet Yılmaz</span> yeni bir teklif sundu.
              </p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">₺28.000</p>
              <div className="flex gap-2 w-full mt-1">
                <button className="flex-1 py-1.5 text-xs font-medium text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400 rounded hover:bg-green-100 dark:hover:bg-green-900/40 transition outline-none block">Kabul Et</button>
                <button className="flex-1 py-1.5 text-xs font-medium text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded hover:bg-red-100 dark:hover:bg-red-900/40 transition outline-none block">Reddet</button>
              </div>
            </div>
          </div>

          {/* Message: Incoming with Attachment */}
          <div className="flex items-end gap-3 max-w-[90%] sm:max-w-[80%]">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-8 w-8 shrink-0 mb-1"
              style={{ backgroundImage: 'url("https://ui-avatars.com/api/?name=Ahmet+Yilmaz&background=random")' }}
            ></div>
            <div className="flex flex-col gap-1">
              <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl rounded-bl-none shadow-sm">
                <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
                  Pil sağlığı %92. Fotoğrafları ekledim, sıfır ayarında diyebilirim. Fiyat için de teklifimi gönderdim, sizin için uygun mudur?
                </p>
                {/* Attachment Preview */}
                <div className="mt-3 flex gap-2">
                  <div
                    className="w-20 h-20 rounded-lg bg-slate-100 dark:bg-slate-800 bg-cover bg-center border border-slate-200 dark:border-slate-700"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1592899677974-c460ce17e4bf?auto=format&fit=crop&q=80&w=200")' }}
                  ></div>
                  <div
                    className="w-20 h-20 rounded-lg bg-slate-100 dark:bg-slate-800 bg-cover bg-center border border-slate-200 dark:border-slate-700"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1603791239531-1dda55e194a6?auto=format&fit=crop&q=80&w=200")' }}
                  ></div>
                </div>
              </div>
              <span className="text-xs text-slate-400 ml-1">14:30</span>
            </div>
          </div>

          <div className="h-2"></div>
        </div>

        {/* Action Bar (Footer) */}
        <div className="shrink-0 bg-white dark:bg-gray-900 border-t border-slate-200 dark:border-slate-800 p-4">
          <div className="max-w-4xl mx-auto flex items-end gap-3">
            {/* Attachment Button */}
            <button className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors outline-none block" title="Dosya Ekle">
              <Paperclip size={24} />
            </button>
            
            {/* Text Input */}
            <div className="flex-1 bg-background-light dark:bg-background-dark border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center px-4 py-2 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
              <textarea
                ref={textareaRef}
                onInput={handleInput}
                className="w-full bg-transparent border-none outline-none focus:ring-0 p-0 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 resize-none max-h-32"
                placeholder="Bir mesaj yazın..."
                rows={1}
                style={{ minHeight: "24px" }}
              ></textarea>
            </div>
            
            {/* Action Buttons Group */}
            <div className="flex items-center gap-2">
              <button className="hidden lg:flex h-10 px-4 items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-primary transition-all shadow-sm outline-none block" title="Karşı Teklif Yap">
                <Gavel size={20} />
                <span>Karşı Teklif</span>
              </button>
              <button className="lg:hidden h-10 w-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-primary transition-colors outline-none block">
                <Gavel size={20} />
              </button>
              <button className="h-10 w-10 flex items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-blue-500/30 hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all outline-none block">
                <Send size={20} className="ml-0.5" />
              </button>
            </div>
          </div>
          <div className="text-center mt-2">
            <p className="text-[10px] text-slate-400 dark:text-slate-600">Enter tuşu gönderir, Shift + Enter yeni satıra geçer.</p>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}
