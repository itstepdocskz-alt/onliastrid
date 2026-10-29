import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, ShieldCheck, ShoppingBag, Eye, Compass, ArrowLeft, Radio } from 'lucide-react';
import { ActivePage } from '../types';
import { soundEngine } from '../utils/ambientAudio';

interface HeaderProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  cartCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  setActivePage,
  cartCount,
}) => {
  const [audioActive, setAudioActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState('03:42:19');

  // Countdown to dawn (approx 05:48 AM)
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const dawn = new Date();
      dawn.setHours(5, 48, 0, 0);
      if (now.getTime() > dawn.getTime()) {
        dawn.setDate(dawn.getDate() + 1);
      }
      const diffMs = dawn.getTime() - now.getTime();
      const hrs = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
      setTimeLeft(
        `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAudioToggle = () => {
    const isNowPlaying = soundEngine.toggle();
    setAudioActive(isNowPlaying);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0014]/95 backdrop-blur-md border-b border-[rgba(167,155,183,0.15)]">
      {/* Top micro ticker for nocturnal delivery */}
      <div className="w-full bg-[#11041F] border-b border-[rgba(167,155,183,0.08)] py-1.5 px-3 sm:px-4 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 text-[#ffb4a8]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C80000] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C80000]"></span>
              </span>
              <span className="tracking-[0.08em] uppercase font-semibold text-[10px] sm:text-[11px] text-[#ffdad4]">
                Ночная доставка активна
              </span>
            </div>
            <span className="text-[#A79BB7]/40 hidden xs:inline">·</span>
            <span className="text-[#A79BB7] hidden xs:inline text-[10px] sm:text-[11px]">
              До рассвета: <span className="font-mono text-[#F2F2F2]">{timeLeft}</span>
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-[11px] text-[#A79BB7]">
            <span className="hidden md:flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#6A0DAD]" />
              Конфиденциальный курьер по Казахстану
            </span>
            <button
              onClick={handleAudioToggle}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                audioActive ? 'text-[#dfb7ff]' : 'hover:text-[#F2F2F2]'
              }`}
              title="Фоновый эмбиент мастерской"
            >
              {audioActive ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#dfb7ff] animate-pulse" />
                  <span className="text-[10px] uppercase tracking-wider text-[#dfb7ff]">Звук: Вкл</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 opacity-60" />
                  <span className="text-[10px] uppercase tracking-wider hidden sm:inline">Эмбиент Ателье</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
        {/* Brand identity */}
        <div 
          onClick={() => setActivePage('catalog')}
          className="cursor-pointer group flex items-center gap-2.5 sm:gap-3 select-none"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-[0.25rem] bg-[#160726] border border-[#6A0DAD]/60 flex items-center justify-center text-[#dfb7ff] group-hover:border-[#6A0DAD] group-hover:shadow-[0_0_12px_rgba(106,13,173,0.4)] transition-all">
            <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500 text-[#dfb7ff]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif-display text-lg sm:text-2xl font-semibold tracking-[0.12em] text-[#F2F2F2] group-hover:text-[#dfb7ff] transition-colors leading-tight">
                NOCTURNE ATELIER
              </span>
            </div>
            <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.16em] text-[#A79BB7] font-medium hidden xs:block">
              Эксклюзивные манекены и реликвии
            </p>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => setActivePage('catalog')}
            className={`cursor-pointer px-3 py-1.5 rounded-[0.25rem] text-xs uppercase tracking-[0.08em] transition-all flex items-center gap-1.5 ${
              activePage === 'catalog'
                ? 'bg-[#160726] text-[#F2F2F2] border border-[#6A0DAD]/60'
                : 'text-[#A79BB7] hover:text-[#F2F2F2]'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-[#6A0DAD]" />
            <span className="hidden sm:inline">Каталог</span>
          </button>

          {/* Cart Button with Counter */}
          <button
            onClick={() => setActivePage('cart')}
            className={`cursor-pointer relative flex items-center gap-2 px-3.5 py-2 rounded-[0.25rem] transition-all group ${
              activePage === 'cart' || activePage === 'checkout'
                ? 'bg-[#220B3B] border border-[#6A0DAD] text-[#F2F2F2] shadow-[0_0_16px_rgba(106,13,173,0.3)]'
                : 'bg-[#160726] hover:bg-[#220B3B] border border-[rgba(167,155,183,0.2)] text-[#F2F2F2]'
            }`}
            title="Открыть корзину"
          >
            <ShoppingBag className="w-4 h-4 text-[#dfb7ff] group-hover:scale-110 transition-transform" />
            <span className="text-xs uppercase tracking-[0.08em] font-medium hidden sm:inline">
              Корзина
            </span>
            {cartCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-[#C80000] text-[#F2F2F2] text-[10px] font-bold tracking-tight shadow-[0_0_8px_rgba(200,0,0,0.6)]">
                {cartCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};
