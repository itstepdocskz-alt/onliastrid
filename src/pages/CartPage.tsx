import React from 'react';
import { Trash2, Plus, Minus, ArrowLeft, ArrowRight, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';
import { CartItem, formatTenge } from '../types';
import { soundEngine } from '../utils/ambientAudio';

interface CartPageProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onContinueShopping: () => void;
  onProceedToCheckout: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onContinueShopping,
  onProceedToCheckout
}) => {
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Delivery is complementary nocturnal express delivery
  const deliveryCost = 0;
  const grandTotal = subtotal + deliveryCost;

  if (cartItems.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#160726] border border-[#6A0DAD]/40 flex items-center justify-center mx-auto text-[#dfb7ff] shadow-[0_0_20px_rgba(106,13,173,0.3)]">
          <ShoppingBag className="w-8 h-8 opacity-80" />
        </div>

        <div className="space-y-2">
          <h2 className="font-serif-display text-2xl sm:text-3xl font-semibold text-[#F2F2F2]">
            Ваша корзина пуста
          </h2>
          <p className="text-xs sm:text-sm text-[#A79BB7] max-w-md mx-auto leading-relaxed">
            Вы пока не выбрали ни одного экспоната или анатомического манекена для ночной доставки.
          </p>
        </div>

        <button
          onClick={onContinueShopping}
          className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 rounded-[0.25rem] bg-[#C80000] hover:bg-[#b00000] text-[#F2F2F2] text-xs uppercase tracking-wider font-semibold transition-all glow-crimson"
        >
          <span>Перейти в каталог экспонатов</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-24">
      {/* Page Title & Back */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[rgba(167,155,183,0.15)] gap-4">
        <div>
          <button
            onClick={onContinueShopping}
            className="cursor-pointer mb-2 inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#A79BB7] hover:text-[#F2F2F2] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#dfb7ff]" />
            <span>Вернуться в каталог</span>
          </button>
          <h1 className="font-serif-display text-2xl sm:text-3xl font-semibold text-[#F2F2F2]">
            Корзина заказчика
          </h1>
          <p className="text-xs text-[#A79BB7] mt-0.5">
            Экспонаты, подготовленные к бронированию и ночной доставке ({totalItemsCount})
          </p>
        </div>

        <button
          onClick={() => {
            soundEngine.playWaxSealChime();
            onClearCart();
          }}
          className="cursor-pointer self-start sm:self-auto text-xs text-[#A79BB7] hover:text-[#C80000] transition-colors flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Очистить корзину</span>
        </button>
      </div>

      {/* Main Cart Content Grid: Items on Left, Summary on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-8">
        {/* Items List (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 bg-[#160726] rounded-[0.25rem] border border-[rgba(167,155,183,0.15)] flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between transition-all hover:border-[#6A0DAD]/50"
            >
              {/* Product Info with Image */}
              <div className="flex gap-4 items-center min-w-0 flex-1">
                <img
                  src={item.product.primaryImage}
                  alt={item.product.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-[0.125rem] bg-[#0c0f0f] shrink-0 border border-[rgba(167,155,183,0.2)]"
                />
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2 text-[10px] uppercase font-mono text-[#dfb7ff]">
                    <span>{item.product.id}</span>
                    <span>·</span>
                    <span className="text-[#A79BB7]">{item.product.categoryLabel}</span>
                  </div>
                  <h3 className="font-serif-display text-sm sm:text-base font-medium text-[#F2F2F2] truncate">
                    {item.product.name}
                  </h3>
                  <p className="text-xs text-[#A79BB7] truncate">
                    {item.product.subtitle}
                  </p>
                  <p className="font-serif-display text-sm font-semibold text-[#F2F2F2] pt-1">
                    {formatTenge(item.product.price)}
                  </p>
                </div>
              </div>

              {/* Quantity Stepper & Subtotal & Delete */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-[rgba(167,155,183,0.08)]">
                {/* Stepper */}
                <div className="flex items-center bg-[#0B0014] rounded-[0.25rem] border border-[rgba(167,155,183,0.25)]">
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    className="p-2 text-[#A79BB7] hover:text-[#F2F2F2] cursor-pointer"
                    title="Уменьшить"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono text-xs px-2.5 text-[#F2F2F2]">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    className="p-2 text-[#A79BB7] hover:text-[#F2F2F2] cursor-pointer"
                    title="Увеличить"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Line Item Total */}
                <div className="text-right min-w-[100px]">
                  <span className="text-[10px] uppercase tracking-wider text-[#A79BB7] block sm:hidden">
                    Сумма:
                  </span>
                  <span className="font-serif-display text-base font-bold text-[#F2F2F2]">
                    {formatTenge(item.product.price * item.quantity)}
                  </span>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="cursor-pointer text-[#A79BB7] hover:text-[#C80000] p-1.5 transition-colors"
                  title="Удалить экспонат"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Block (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 bg-[#160726] rounded-[0.25rem] border border-[rgba(167,155,183,0.18)] shadow-[0_12px_32px_-4px_rgba(106,13,173,0.2)] space-y-5">
            <h2 className="font-serif-display text-xl font-semibold text-[#F2F2F2]">
              Сводка заказа
            </h2>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-[#A79BB7]">
                <span>Выбрано позиций:</span>
                <span className="font-mono text-[#F2F2F2]">{totalItemsCount} шт.</span>
              </div>

              <div className="flex justify-between text-[#A79BB7]">
                <span>Стоимость экспонатов:</span>
                <span className="font-mono text-[#F2F2F2]">{formatTenge(subtotal)}</span>
              </div>

              <div className="flex justify-between text-[#A79BB7]">
                <span className="flex items-center gap-1 text-[#ffdad4]">
                  <Truck className="w-3.5 h-3.5 text-[#C80000]" />
                  Ночная доставка до рассвета:
                </span>
                <span className="text-[#dfb7ff] font-medium">Бесплатно</span>
              </div>

              <div className="pt-3 border-t border-[rgba(167,155,183,0.15)] flex justify-between items-baseline">
                <span className="text-sm font-semibold text-[#F2F2F2]">Итого к оплате:</span>
                <span className="font-serif-display text-2xl font-bold text-[#F2F2F2]">
                  {formatTenge(grandTotal)}
                </span>
              </div>
            </div>

            {/* CTA Button: Proceed to Checkout */}
            <button
              onClick={() => {
                soundEngine.playWaxSealChime();
                onProceedToCheckout();
              }}
              className="cursor-pointer w-full py-3 px-4 rounded-[0.25rem] bg-[#C80000] hover:bg-[#b00000] text-[#F2F2F2] text-xs uppercase tracking-wider font-semibold transition-all glow-crimson active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Перейти к оформлению</span>
              <ArrowRight className="w-4 h-4 text-[#ffdad4]" />
            </button>

            <div className="p-3 bg-[#11041F] rounded-[0.25rem] border border-[rgba(167,155,183,0.1)] flex items-start gap-2.5 text-[11px] text-[#A79BB7] leading-relaxed">
              <ShieldCheck className="w-4 h-4 text-[#6A0DAD] shrink-0 mt-0.5" />
              <span>
                Оплата при передаче курьеру или по согласованию с куратором Ателье. Без онлайн-списаний.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
