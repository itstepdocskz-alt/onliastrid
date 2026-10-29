import React from 'react';
import { CheckCircle2, Compass, ArrowRight, ShieldCheck, Clock, MapPin, Phone, User, Radio } from 'lucide-react';
import { PlacedOrder, formatTenge } from '../types';

interface ThankYouPageProps {
  order: PlacedOrder | null;
  onReturnToCatalog: () => void;
}

export const ThankYouPage: React.FC<ThankYouPageProps> = ({
  order,
  onReturnToCatalog
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 pb-24">
      {/* Thank you card */}
      <div className="p-6 sm:p-10 bg-[#160726] rounded-[0.25rem] border border-[#6A0DAD]/60 shadow-[0_12px_32px_-4px_rgba(106,13,173,0.35)] space-y-8 text-center sm:text-left">
        {/* Header icon and congratulations */}
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-[#220B3B] border-2 border-[#6A0DAD] flex items-center justify-center text-[#dfb7ff] shadow-[0_0_24px_rgba(106,13,173,0.5)] shrink-0">
            <CheckCircle2 className="w-8 h-8 text-[#dfb7ff]" />
          </div>

          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[0.125rem] bg-[#11041F] border border-[#6A0DAD]/40 text-[10px] uppercase tracking-widest text-[#dfb7ff]">
              <span>Заказ подтвержден в Telegram</span>
            </div>
            <h1 className="font-serif-display text-2xl sm:text-3xl md:text-4xl font-semibold text-[#F2F2F2]">
              Благодарим за приобретение
            </h1>
            <p className="text-xs sm:text-sm text-[#A79BB7]">
              Ваш заказ зарегистрирован в закрытом реестре Ателье и передан куратору.
            </p>
          </div>
        </div>

        {/* Order Identifier & Delivery Radar Callout */}
        <div className="p-4 sm:p-5 bg-[#11041F] rounded-[0.25rem] border border-[rgba(167,155,183,0.15)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase tracking-wider text-[#A79BB7] block">
              Номер ночного заказа
            </span>
            <span className="font-mono text-xl sm:text-2xl font-bold text-[#dfb7ff]">
              {order ? order.orderId : 'NA-89211'}
            </span>
            <span className="text-[11px] text-[#A79BB7] block">
              {order ? order.formattedDate : 'Зарегистрирован только что'}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-[#160726] px-3.5 py-2 rounded-[0.25rem] border border-[#C80000]/40 text-xs text-[#ffdad4]">
            <Radio className="w-4 h-4 text-[#C80000] animate-pulse" />
            <div>
              <span className="font-semibold block uppercase tracking-wider text-[10px]">
                Доставка до рассвета
              </span>
              <span className="text-[11px] text-[#A79BB7]">
                Курьер свяжется для подтверждения передачи
              </span>
            </div>
          </div>
        </div>

        {/* Order details summary if order exists */}
        {order && (
          <div className="space-y-6 pt-4 border-t border-[rgba(167,155,183,0.1)] text-left">
            <div>
              <h3 className="font-serif-display text-lg font-medium text-[#F2F2F2] mb-3">
                Заказанные экспонаты
              </h3>
              <div className="space-y-2.5">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-[#11041F]/60 rounded-[0.25rem] border border-[rgba(167,155,183,0.08)] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product.primaryImage}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded-[0.125rem] bg-[#0c0f0f] border border-[rgba(167,155,183,0.15)]"
                      />
                      <div>
                        <p className="font-medium text-[#F2F2F2]">{item.product.name}</p>
                        <span className="text-[11px] text-[#A79BB7]">
                          {item.quantity} шт. × {formatTenge(item.product.price)}
                        </span>
                      </div>
                    </div>
                    <span className="font-serif-display text-sm font-semibold text-[#F2F2F2]">
                      {formatTenge(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recipient summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
              <div className="bg-[#11041F]/60 p-3 rounded-[0.25rem] border border-[rgba(167,155,183,0.08)] space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#A79BB7] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#dfb7ff]" /> Получатель
                </span>
                <p className="font-medium text-[#F2F2F2]">{order.customer.name}</p>
                <p className="text-[#A79BB7]">{order.customer.phone}</p>
              </div>

              <div className="bg-[#11041F]/60 p-3 rounded-[0.25rem] border border-[rgba(167,155,183,0.08)] space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#A79BB7] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#dfb7ff]" /> Адрес и комментарий
                </span>
                <p className="font-medium text-[#F2F2F2]">
                  {order.customer.address || 'Адрес согласуется при звонке'}
                </p>
                {order.customer.comment && (
                  <p className="text-[#A79BB7] italic font-serif-display">
                    "{order.customer.comment}"
                  </p>
                )}
              </div>
            </div>

            {/* Total */}
            <div className="pt-4 border-t border-[rgba(167,155,183,0.12)] flex items-center justify-between">
              <span className="text-sm font-medium text-[#A79BB7]">Итоговая сумма заказа:</span>
              <span className="font-serif-display text-2xl font-bold text-[#F2F2F2]">
                {formatTenge(order.total)}
              </span>
            </div>
          </div>
        )}

        {/* Action button to return to catalog */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={onReturnToCatalog}
            className="cursor-pointer w-full sm:w-auto px-6 py-3 rounded-[0.25rem] bg-[#C80000] hover:bg-[#b00000] text-[#F2F2F2] text-xs uppercase tracking-wider font-semibold transition-all glow-crimson flex items-center justify-center gap-2"
          >
            <span>Вернуться в каталог</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-[11px] text-[#A79BB7]">
            <ShieldCheck className="w-4 h-4 text-[#6A0DAD]" />
            <span>Ночной курьерский протокол безопасности соблюден</span>
          </div>
        </div>
      </div>
    </div>
  );
};
