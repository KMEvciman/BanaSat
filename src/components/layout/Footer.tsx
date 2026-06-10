import Link from "next/link";
import { Globe, AtSign } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-background-dark border-t border-gray-200 dark:border-gray-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-40 flex flex-col gap-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-4 col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 text-primary">
              <img src="/banasat_logo.png" alt="BanaSat" className="h-6 w-auto" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Türkiye&apos;nin ilk alıcı odaklı pazar yeri. İhtiyacını anlat, teklifler sana gelsin.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-gray-900 dark:text-white font-bold">Kurumsal</h4>
            <ul className="flex flex-col gap-2 text-sm text-gray-500 dark:text-gray-400">
              <li>
                <Link className="hover:text-primary transition-colors" href="#">Hakkımızda</Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="#">Kariyer</Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="#">İletişim</Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-gray-900 dark:text-white font-bold">Kategoriler</h4>
            <ul className="flex flex-col gap-2 text-sm text-gray-500 dark:text-gray-400">
              <li>
                <Link className="hover:text-primary transition-colors" href="/kategoriler?q=Telefon%20%26%20Aksesuar">Telefon & Aksesuar</Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="/kategoriler?q=Elektronik">Elektronik</Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="/kategoriler?q=Beyaz%20E%C5%9Fya">Beyaz Eşya</Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="/kategoriler?q=Mobilya">Mobilya</Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-gray-900 dark:text-white font-bold">Destek</h4>
            <ul className="flex flex-col gap-2 text-sm text-gray-500 dark:text-gray-400">
              <li>
                <Link className="hover:text-primary transition-colors" href="#">Yardım Merkezi</Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="#">Güvenli Ödeme</Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="#">Satıcı Rehberi</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-8 gap-4">
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} BanaSat. Tüm hakları saklıdır.</p>
          <div className="flex gap-4">
            <Link className="text-gray-400 hover:text-primary transition-colors" href="#">
              <Globe size={20} />
            </Link>
            <Link className="text-gray-400 hover:text-primary transition-colors" href="#">
              <AtSign size={20} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
