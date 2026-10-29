import React, { useState } from 'react';
import { Compass, ShieldCheck, Mail, Check, Moon } from 'lucide-react';
import { soundEngine } from '../utils/ambientAudio';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    soundEngine.playWaxSealChime();
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="w-full bg-[#0B0014] border-t border-[rgba(167,155,183,0.15)] text-[#A79BB7] pt-12 sm:pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 pb-12 border-b border-[rgba(167,155,183,0.1)]">
          {/* Brand & Manifesto */}
          <div className="md:col-span-5 space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-[0.25rem] bg-[#160726] border border-[#6A0DAD]/60 flex items-center justify-center text-[#dfb7ff]">
                <Compass className="w-4 h-4 text-[#dfb7ff]" />
              </div>
              <span className="font-serif-display text-lg tracking-[0.12em] text-[#F2F2F2] font-semibold">
                NOCTURNE ATELIER
              </span>
            </div>

            <p className="text-xs leading-relaxed max-w-sm font-normal">
              Частное подземное ателье, посвященное анатомическим восковым фигурам, ростовым манекенам ручной работы и подлинным оккультным реликвиям. Доставка строго под покровом ночи до наступления рассвета.
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-3 text-[11px] text-[#dfb7ff]">
              <span className="flex items-center gap-1.5">
                <Moon className="w-3.5 h-3.5 text-[#6A0DAD]" />
                Часы работы: Закат – 04:30
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#6A0DAD]" />
                Конфиденциальный курьер по Казахстану
              </span>
            </div>
          </div>

          {/* Quick Curations */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-[0.12em] text-[#F2F2F2] font-semibold">
              Категории экспозиции
            </h4>
            <ul className="text-xs space-y-2">
              <li><span className="hover:text-[#F2F2F2] transition-colors cursor-pointer">Анатомические манекены</span></li>
              <li><span className="hover:text-[#F2F2F2] transition-colors cursor-pointer">Флорентийский воск</span></li>
              <li><span className="hover:text-[#F2F2F2] transition-colors cursor-pointer">Пиренейские гримуары</span></li>
              <li><span className="hover:text-[#F2F2F2] transition-colors cursor-pointer">Театральный реквизит Гран-Гиньоль</span></li>
              <li><span className="hover:text-[#F2F2F2] transition-colors cursor-pointer">Кованые семисвечники</span></li>
            </ul>
          </div>

          {/* Private Nocturnal Register (Newsletter) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs uppercase tracking-[0.12em] text-[#F2F2F2] font-semibold">
              Полуночный вестник
            </h4>
            <p className="text-xs leading-relaxed">
              Получайте закрытые уведомления об открытии новых восковых отливок и реликвий из наших архивных фондов.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2 pt-1">
              <div className="flex items-center bg-[#160726] rounded-[0.25rem] border border-[rgba(167,155,183,0.2)] focus-within:border-[#6A0DAD]">
                <Mail className="w-3.5 h-3.5 text-[#A79BB7] ml-3 shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ваш email для корреспонденции..."
                  className="w-full bg-transparent text-xs text-[#F2F2F2] placeholder-[#A79BB7]/60 py-2.5 px-2.5 focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="cursor-pointer px-3 py-2 mr-1 rounded-[0.125rem] bg-[#220B3B] hover:bg-[#6A0DAD] text-[#dfb7ff] hover:text-[#F2F2F2] text-[11px] uppercase tracking-wider font-medium transition-all shrink-0"
                >
                  Вступить
                </button>
              </div>

              {subscribed && (
                <p className="text-[11px] text-[#dfb7ff] flex items-center gap-1.5 pt-1">
                  <Check className="w-3.5 h-3.5 text-[#dfb7ff]" />
                  <span>Ваш адрес занесен в закрытый список заказчиков.</span>
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#A79BB7]/70 gap-4 text-center sm:text-left">
          <p>© 2026 Nocturne Atelier. Все права защищены. Цены указаны в тенге (₸).</p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <span className="hover:text-[#F2F2F2] cursor-pointer">Политика приватности</span>
            <span>·</span>
            <span className="hover:text-[#F2F2F2] cursor-pointer">Кодекс ночного курьера</span>
            <span>·</span>
            <span className="hover:text-[#F2F2F2] cursor-pointer">Сертификаты подлинности</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
