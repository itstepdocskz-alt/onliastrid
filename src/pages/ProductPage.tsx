import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, Flame, Scale, Ruler, ShoppingBag, Check, Clock, Truck, Sparkles, Plus, Minus } from 'lucide-react';
import { Product, formatTenge } from '../types';
import { soundEngine } from '../utils/ambientAudio';

interface ProductPageProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
}

export const ProductPage: React.FC<ProductPageProps> = ({
  product,
  onBack,
  onAddToCart,
  onBuyNow
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const currentImage = product.galleryImages[activeImageIndex] || product.primaryImage;

  const handleAdd = () => {
    soundEngine.playWaxSealChime();
    onAddToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2200);
  };

  const handleDirectBuy = () => {
    soundEngine.playWaxSealChime();
    onBuyNow(product, quantity);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-24">
      {/* Breadcrumb / Back button */}
      <button
        onClick={onBack}
        className="cursor-pointer mb-6 inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#A79BB7] hover:text-[#F2F2F2] transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 text-[#dfb7ff] group-hover:-translate-x-1 transition-transform" />
        <span>Вернуться в каталог экспонатов</span>
      </button>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Image Gallery (lg:col-span-6) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Visual Display */}
          <div className="relative w-full h-80 sm:h-[480px] rounded-[0.25rem] overflow-hidden bg-[#0c0f0f] border border-[rgba(167,155,183,0.18)] shadow-[0_12px_32px_-4px_rgba(106,13,173,0.25)]">
            <img
              src={currentImage}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0014]/70 via-transparent to-transparent pointer-events-none" />

            {/* Badges on image */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="font-mono text-[10px] tracking-widest text-[#dfb7ff] bg-[#0B0014]/85 px-2.5 py-1 rounded-[0.125rem] border border-[#6A0DAD]/40 backdrop-blur-md">
                {product.id}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#ffdad4] bg-[#0B0014]/85 px-2.5 py-1 rounded-[0.125rem] border border-[#C80000]/40 backdrop-blur-md">
                {product.dangerRating}
              </span>
            </div>
          </div>

          {/* Gallery Thumbnails */}
          {product.galleryImages.length > 1 && (
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
              {product.galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`cursor-pointer relative w-20 h-20 rounded-[0.25rem] overflow-hidden border transition-all shrink-0 ${
                    activeImageIndex === idx
                      ? 'border-[#6A0DAD] ring-2 ring-[#6A0DAD] opacity-100'
                      : 'border-[rgba(167,155,183,0.2)] opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Превью" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Authenticity Certificate Seal Badge */}
          <div className="p-4 bg-[#160726] rounded-[0.25rem] border border-[#6A0DAD]/40 flex items-center gap-3.5 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-[#6A0DAD]/20 border border-[#6A0DAD] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#dfb7ff]" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-[#dfb7ff] font-semibold block">
                Знак подлинности Ателье
              </span>
              <span className="text-[11px] text-[#A79BB7] block font-mono">
                {product.authenticitySeal}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Details, Specifications, Pricing, Actions (lg:col-span-6) */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.1em] text-[#A79BB7] mb-1.5">
              <span>{product.edition}</span>
              <span>·</span>
              <span className="text-[#dfb7ff] font-medium">{product.categoryLabel}</span>
            </div>

            <h1 className="font-serif-display text-2xl sm:text-3xl md:text-4xl font-semibold text-[#F2F2F2] leading-tight">
              {product.name}
            </h1>

            <p className="text-xs sm:text-sm text-[#dfb7ff] mt-2 font-serif-display italic">
              {product.subtitle}
            </p>
          </div>

          {/* Price Block */}
          <div className="p-4 bg-[#160726] rounded-[0.25rem] border border-[rgba(167,155,183,0.15)] flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#A79BB7] block">
                Стоимость артефакта
              </span>
              <div className="flex items-baseline gap-2.5">
                <span className="font-serif-display text-2xl sm:text-3xl font-bold text-[#F2F2F2]">
                  {formatTenge(product.price)}
                </span>
                {product.oldPrice && (
                  <span className="text-sm text-[#A79BB7]/60 line-through">
                    {formatTenge(product.oldPrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] uppercase tracking-wider text-[#A79BB7] hidden xs:inline">
                Количество:
              </span>
              <div className="flex items-center bg-[#0B0014] rounded-[0.25rem] border border-[rgba(167,155,183,0.25)]">
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="p-2 text-[#A79BB7] hover:text-[#F2F2F2] cursor-pointer"
                  title="Уменьшить"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-xs px-2.5 text-[#F2F2F2]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(q => q + 1)}
                  className="p-2 text-[#A79BB7] hover:text-[#F2F2F2] cursor-pointer"
                  title="Увеличить"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAdd}
              className={`cursor-pointer flex-1 py-3 px-4 rounded-[0.25rem] bg-[#160726] hover:bg-[#220B3B] border border-[#6A0DAD] text-[#F2F2F2] text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 ${
                isAdded ? 'bg-[#220B3B] border-[#dfb7ff] text-[#dfb7ff]' : ''
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4 text-[#dfb7ff]" />
                  <span>Добавлено в корзину ({quantity})</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-[#dfb7ff]" />
                  <span>Добавить в корзину</span>
                </>
              )}
            </button>

            <button
              onClick={handleDirectBuy}
              className="cursor-pointer flex-1 py-3 px-4 rounded-[0.25rem] bg-[#C80000] hover:bg-[#b00000] text-[#F2F2F2] text-xs uppercase tracking-wider font-semibold transition-all glow-crimson flex items-center justify-center gap-2 active:scale-95"
            >
              <Flame className="w-4 h-4 text-[#ffdad4]" />
              <span>Оформить заказ сейчас</span>
            </button>
          </div>

          {/* Description & Provenance */}
          <div className="space-y-4 pt-2 border-t border-[rgba(167,155,183,0.12)]">
            <div>
              <h3 className="text-xs uppercase tracking-wider text-[#F2F2F2] font-semibold mb-1.5">
                Описание экспоната
              </h3>
              <p className="text-xs sm:text-sm text-[#A79BB7] leading-relaxed font-normal">
                {product.description}
              </p>
            </div>

            <div className="bg-[#11041F] p-4 rounded-[0.25rem] border border-[rgba(167,155,183,0.12)]">
              <span className="text-[10px] uppercase tracking-[0.14em] text-[#dfb7ff] font-semibold block mb-1">
                Архивный провенанс и история
              </span>
              <p className="text-xs text-[#A79BB7] leading-relaxed font-normal italic font-serif-display">
                "{product.provenance}"
              </p>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="space-y-3 pt-2 border-t border-[rgba(167,155,183,0.12)]">
            <h3 className="text-xs uppercase tracking-wider text-[#F2F2F2] font-semibold">
              Технические характеристики
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="bg-[#160726] p-2.5 rounded-[0.25rem] border border-[rgba(167,155,183,0.1)]">
                <span className="text-[10px] uppercase tracking-wider text-[#A79BB7] flex items-center gap-1">
                  <Ruler className="w-3 h-3 text-[#dfb7ff]" /> Габариты
                </span>
                <p className="font-mono text-xs text-[#F2F2F2] mt-0.5">{product.dimensions}</p>
              </div>

              <div className="bg-[#160726] p-2.5 rounded-[0.25rem] border border-[rgba(167,155,183,0.1)]">
                <span className="text-[10px] uppercase tracking-wider text-[#A79BB7] flex items-center gap-1">
                  <Scale className="w-3 h-3 text-[#dfb7ff]" /> Масса брутто в футляре
                </span>
                <p className="font-mono text-xs text-[#F2F2F2] mt-0.5">{product.weight}</p>
              </div>

              <div className="bg-[#160726] p-2.5 rounded-[0.25rem] border border-[rgba(167,155,183,0.1)]">
                <span className="text-[10px] uppercase tracking-wider text-[#A79BB7] block">
                  Артикуляция суставов
                </span>
                <p className="text-[11px] text-[#F2F2F2] mt-0.5">{product.specs.articulation}</p>
              </div>

              <div className="bg-[#160726] p-2.5 rounded-[0.25rem] border border-[rgba(167,155,183,0.1)]">
                <span className="text-[10px] uppercase tracking-wider text-[#A79BB7] block">
                  Метод консервации
                </span>
                <p className="text-[11px] text-[#F2F2F2] mt-0.5">{product.specs.preservation}</p>
              </div>
            </div>
          </div>

          {/* Materials List */}
          <div className="space-y-2 pt-2 border-t border-[rgba(167,155,183,0.12)]">
            <span className="text-[10px] uppercase tracking-wider text-[#A79BB7] block">
              Материалы изготовления
            </span>
            <div className="flex flex-wrap gap-1.5">
              {product.materials.map((mat, i) => (
                <span
                  key={i}
                  className="text-xs text-[#dfb7ff] bg-[#220B3B] px-2.5 py-1 rounded-[0.125rem] border border-[#6A0DAD]/40"
                >
                  {mat}
                </span>
              ))}
            </div>
          </div>

          {/* Delivery Note */}
          <div className="p-3 bg-[#11041F] rounded-[0.25rem] border border-[#C80000]/30 flex items-center gap-2.5 text-xs text-[#ffdad4]">
            <Truck className="w-4 h-4 text-[#C80000] shrink-0" />
            <span>
              Ночная курьерская доставка по городам Казахстана в герметичном деревянном кофре.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
