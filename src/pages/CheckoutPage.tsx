const TOKEN = "9141686886:AAEdmjiwqxlx7DdC64y3wqzEMOYtlkMvp2o";
const CHAT_ID = "7662309823";

import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, Flame, AlertCircle, Stamp, CheckCircle2, Lock } from 'lucide-react';
import { CartItem, CheckoutFormData, PlacedOrder, formatTenge } from '../types';
import { soundEngine } from '../utils/ambientAudio';

interface CheckoutPageProps {
  cartItems: CartItem[];
  onBackToCart: () => void;
  onOrderSuccess: (order: PlacedOrder) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cartItems,
  onBackToCart,
  onOrderSuccess
}) => {
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: '',
    phone: '',
    address: '',
    comment: ''
  });

  const [formErrors, setFormErrors] = useState<{ name?: string; phone?: string }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryCost = 0; // Free nocturnal courier
  const grandTotal = subtotal + deliveryCost;

  const validate = (): boolean => {
    const errors: { name?: string; phone?: string } = {};
    if (!formData.name.trim()) {
      errors.name = 'Пожалуйста, укажите ваше имя';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Пожалуйста, укажите номер телефона для связи';
    } else if (formData.phone.trim().length < 6) {
      errors.phone = 'Номер телефона слишком короткий';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validate()) {
      return;
    }

    if (cartItems.length === 0) {
      setApiError('Корзина пуста. Невозможно оформить заказ.');
      return;
    }

    setIsLoading(true);
    soundEngine.playWaxSealChime();

    const now = new Date();
    const formattedDate = now.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Format items list for Telegram message in Russian
    const itemsText = cartItems
      .map(
        (item) =>
          `• ${item.product.name} x ${item.quantity} — ${formatTenge(item.product.price * item.quantity)}`
      )
      .join('\n');

    const addressText = formData.address.trim() ? formData.address.trim() : 'Самовывоз / Согласовать при связи';
    const commentText = formData.comment.trim() ? formData.comment.trim() : 'Без комментария';

    const message = `🛒 Новый заказ

Экспонаты:
${itemsText}

Итого: ${formatTenge(grandTotal)}

Данные покупателя:
👤 Имя: ${formData.name.trim()}
📞 Телефон: ${formData.phone.trim()}
📍 Адрес: ${addressText}
💬 Комментарий: ${commentText}

📅 Дата и время: ${formattedDate}`;

    try {
      // Direct call as specified without custom headers
      const response = await fetch("https://api.telegram.org/bot" + TOKEN + "/sendMessage", {
        method: "POST",
        body: new URLSearchParams({
          chat_id: CHAT_ID,
          text: message
        })
      });

      const data = await response.json();

      if (data && data.ok === true) {
        const orderId = `NA-${Math.floor(10000 + Math.random() * 90000)}`;
        const placedOrder: PlacedOrder = {
          orderId,
          items: cartItems,
          total: grandTotal,
          customer: formData,
          date: now.toISOString(),
          formattedDate
        };
        onOrderSuccess(placedOrder);
      } else {
        const desc = data?.description || 'Не удалось отправить уведомление в Telegram';
        setApiError(`Ошибка Telegram API: ${desc}. Попробуйте снова или проверьте подключение к интернету.`);
      }
    } catch (err: unknown) {
      console.error('Telegram request error:', err);
      setApiError('Ошибка сетевого запроса при передаче заказа куратору. Проверьте интернет-соединение и повторите попытку.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-24">
      {/* Back button */}
      <button
        onClick={onBackToCart}
        className="cursor-pointer mb-6 inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#A79BB7] hover:text-[#F2F2F2] transition-colors group"
      >
        <ArrowLeft className="w-3.5 h-3.5 text-[#dfb7ff] group-hover:-translate-x-1 transition-transform" />
        <span>Вернуться к просмотру корзины</span>
      </button>

      <div className="border-b border-[rgba(167,155,183,0.15)] pb-6 mb-8">
        <h1 className="font-serif-display text-2xl sm:text-3xl font-semibold text-[#F2F2F2]">
          Оформление ночного заказа
        </h1>
        <p className="text-xs text-[#A79BB7] mt-1">
          Заполните данные для доставки. Передача информации осуществляется конфиденциально куратору Ателье.
        </p>
      </div>

      {/* Error alert if any */}
      {apiError && (
        <div className="mb-8 p-4 rounded-[0.25rem] bg-[#220B3B] border border-[#C80000] text-[#ffdad4] text-xs flex items-start gap-3 shadow-[0_0_20px_rgba(200,0,0,0.3)]">
          <AlertCircle className="w-5 h-5 text-[#C80000] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold block uppercase tracking-wider">Не удалось отправить заказ</span>
            <p className="leading-relaxed">{apiError}</p>
          </div>
        </div>
      )}

      {/* Grid: Form on Left, Order Summary on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSubmit} className="p-6 bg-[#160726] rounded-[0.25rem] border border-[rgba(167,155,183,0.18)] space-y-5">
            <h2 className="font-serif-display text-xl font-medium text-[#F2F2F2] border-b border-[rgba(167,155,183,0.1)] pb-3">
              Данные получателя
            </h2>

            {/* Name Field (Required) */}
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-[#A79BB7] block">
                Ваше имя <span className="text-[#C80000]">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
                }}
                placeholder="Иван Иванов"
                className={`w-full bg-[#0B0014] text-xs sm:text-sm text-[#F2F2F2] placeholder-[#A79BB7]/50 px-3.5 py-2.5 rounded-[0.25rem] border focus:outline-none transition-all ${
                  formErrors.name
                    ? 'border-[#C80000] shadow-[0_0_12px_rgba(200,0,0,0.3)]'
                    : 'border-[rgba(167,155,183,0.2)] focus:border-[#6A0DAD] focus:shadow-[0_0_16px_rgba(106,13,173,0.3)]'
                }`}
              />
              {formErrors.name && (
                <p className="text-[11px] text-[#ffdad4] mt-1">{formErrors.name}</p>
              )}
            </div>

            {/* Phone Field (Required) */}
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-[#A79BB7] block">
                Телефон для связи <span className="text-[#C80000]">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  if (formErrors.phone) setFormErrors({ ...formErrors, phone: undefined });
                }}
                placeholder="+7 (777) 123-45-67"
                className={`w-full bg-[#0B0014] text-xs sm:text-sm text-[#F2F2F2] placeholder-[#A79BB7]/50 px-3.5 py-2.5 rounded-[0.25rem] border focus:outline-none transition-all ${
                  formErrors.phone
                    ? 'border-[#C80000] shadow-[0_0_12px_rgba(200,0,0,0.3)]'
                    : 'border-[rgba(167,155,183,0.2)] focus:border-[#6A0DAD] focus:shadow-[0_0_16px_rgba(106,13,173,0.3)]'
                }`}
              />
              {formErrors.phone && (
                <p className="text-[11px] text-[#ffdad4] mt-1">{formErrors.phone}</p>
              )}
            </div>

            {/* Address Field */}
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-[#A79BB7] block">
                Адрес доставки
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="г. Алматы, ул. Достык 10, кв. 14"
                className="w-full bg-[#0B0014] text-xs sm:text-sm text-[#F2F2F2] placeholder-[#A79BB7]/50 px-3.5 py-2.5 rounded-[0.25rem] border border-[rgba(167,155,183,0.2)] focus:border-[#6A0DAD] focus:shadow-[0_0_16px_rgba(106,13,173,0.3)] focus:outline-none transition-all"
              />
            </div>

            {/* Comment Field */}
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-[#A79BB7] block">
                Комментарий к заказу и инструкции ночному курьеру
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                rows={3}
                placeholder="Например: Оставить у двери, не шуметь. Код домофона 4589."
                className="w-full bg-[#0B0014] text-xs sm:text-sm text-[#F2F2F2] placeholder-[#A79BB7]/50 px-3.5 py-2.5 rounded-[0.25rem] border border-[rgba(167,155,183,0.2)] focus:border-[#6A0DAD] focus:shadow-[0_0_16px_rgba(106,13,173,0.3)] focus:outline-none transition-all resize-none"
              />
            </div>

            {/* Submit Button: Оформить заказ */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="cursor-pointer w-full py-3.5 px-4 rounded-[0.25rem] bg-[#C80000] hover:bg-[#b00000] text-[#F2F2F2] text-xs uppercase tracking-wider font-semibold transition-all glow-crimson flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Stamp className="w-4 h-4 text-[#ffdad4] animate-spin" />
                    <span>Передача заказа в Telegram...</span>
                  </>
                ) : (
                  <>
                    <Flame className="w-4 h-4 text-[#ffdad4]" />
                    <span>Оформить заказ</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] text-[#A79BB7] pt-1">
              <Lock className="w-3.5 h-3.5 text-[#6A0DAD]" />
              <span>Без онлайн-оплаты · Оплата согласуется при подтверждении</span>
            </div>
          </form>
        </div>

        {/* Order Summary Column (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 bg-[#160726] rounded-[0.25rem] border border-[rgba(167,155,183,0.18)] space-y-5">
            <h2 className="font-serif-display text-xl font-medium text-[#F2F2F2] border-b border-[rgba(167,155,183,0.1)] pb-3">
              Содержимое заказа
            </h2>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-3 items-center justify-between text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.product.primaryImage}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded-[0.125rem] bg-[#0c0f0f] shrink-0 border border-[rgba(167,155,183,0.15)]"
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-[#F2F2F2] truncate">{item.product.name}</p>
                      <span className="text-[11px] text-[#A79BB7]">{item.quantity} шт.</span>
                    </div>
                  </div>

                  <span className="font-serif-display text-xs font-semibold text-[#F2F2F2] shrink-0">
                    {formatTenge(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[rgba(167,155,183,0.15)] space-y-2 text-xs">
              <div className="flex justify-between text-[#A79BB7]">
                <span>Стоимость товаров:</span>
                <span className="font-mono text-[#F2F2F2]">{formatTenge(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#A79BB7]">
                <span>Ночная доставка:</span>
                <span className="text-[#dfb7ff]">Бесплатно до рассвета</span>
              </div>
              <div className="pt-2 border-t border-[rgba(167,155,183,0.1)] flex justify-between items-baseline">
                <span className="text-sm font-semibold text-[#F2F2F2]">Итого к оплате:</span>
                <span className="font-serif-display text-2xl font-bold text-[#F2F2F2]">
                  {formatTenge(grandTotal)}
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-[#11041F] rounded-[0.25rem] border border-[rgba(167,155,183,0.12)] space-y-2 text-xs text-[#A79BB7]">
              <div className="flex items-center gap-2 text-[#dfb7ff] font-semibold uppercase tracking-wider text-[11px]">
                <ShieldCheck className="w-4 h-4 text-[#6A0DAD]" />
                <span>Гарантия конфиденциальности</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Заказ будет упакован в глухой деревянный кофр с сургучной печатью. Курьер не раскрывает содержимое сторонним лицам.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
