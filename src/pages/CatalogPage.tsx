import React, { useState, useMemo } from 'react';
import { Search, Eye, Sparkles, SlidersHorizontal, Flame, ShieldAlert, ShoppingBag, Check } from 'lucide-react';
import { Product, ProductCategory, formatTenge } from '../types';
import { PRODUCTS } from '../data/products';
import { soundEngine } from '../utils/ambientAudio';

interface CatalogPageProps {
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({
  onSelectProduct,
  onAddToCart,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const categories: { key: ProductCategory; label: string; count: number }[] = [
    { key: 'all', label: 'Все экспонаты', count: PRODUCTS.length },
    { key: 'mannequins', label: 'Манекены', count: PRODUCTS.filter(p => p.category === 'mannequins').length },
    { key: 'waxworks', label: 'Восковые фигуры', count: PRODUCTS.filter(p => p.category === 'waxworks').length },
    { key: 'relics', label: 'Реликвии и гримуары', count: PRODUCTS.filter(p => p.category === 'relics').length },
    { key: 'props', label: 'Реквизит', count: PRODUCTS.filter(p => p.category === 'props').length },
  ];

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesGrade = selectedGrade === 'all' || item.dangerRating === selectedGrade;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.materials.some(m => m.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesGrade && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });
  }, [selectedCategory, selectedGrade, searchQuery, sortBy]);

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playWaxSealChime();
    onAddToCart(product);
    setRecentlyAddedId(product.id);
    setTimeout(() => {
      setRecentlyAddedId(null);
    }, 1800);
  };

  return (
    <div className="w-full pb-20">
      {/* Editorial Hero Banner */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-[rgba(167,155,183,0.12)] bg-gradient-to-b from-[#11041F]/70 via-[#0B0014] to-[#0B0014]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#6A0DAD]/15 blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#160726] border border-[#6A0DAD]/40 rounded-[0.25rem] text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-[#dfb7ff]">
            <Sparkles className="w-3 h-3 text-[#dfb7ff]" />
            <span>Подземная галерея редких артефактов и манекенов</span>
          </div>

          <h1 className="font-serif-display text-3xl sm:text-5xl md:text-6xl font-semibold text-[#F2F2F2] tracking-tight leading-[1.15]">
            Анатомические манекены и оккультный реквизит
          </h1>

          <p className="text-[#A79BB7] text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-normal">
            Ручная отливка из очищенного фармацевтического воска, фарфора и кованого железа. Конфиденциальная доставка по Алматы и всему Казахстану под покровом ночи — строго до первого луча рассвета.
          </p>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-4">
        <div className="space-y-4">
          {/* Search and Sort Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Search Input styled strictly according to spec */}
            <div className="relative flex-1 max-w-xl">
              <div className="relative flex items-center bg-[#160726] rounded-[0.25rem] border border-[rgba(167,155,183,0.2)] focus-within:border-[#6A0DAD] focus-within:shadow-[0_0_16px_rgba(106,13,173,0.35)] transition-all">
                <Search className="w-4 h-4 text-[#A79BB7] ml-3.5 pointer-events-none shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск по названию, материалам (воск, шелк, латунь) или артикулу..."
                  className="w-full bg-[#0B0014]/60 text-xs sm:text-sm text-[#F2F2F2] placeholder-[#A79BB7]/60 py-2.5 pl-3 pr-4 rounded-[0.25rem] focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mr-3 text-xs text-[#A79BB7] hover:text-[#F2F2F2]"
                  >
                    Очистить
                  </button>
                )}
              </div>
            </div>

            {/* Classification & Sort Controls */}
            <div className="flex items-center gap-2 self-stretch sm:self-auto text-xs">
              <div className="flex-1 sm:flex-initial flex items-center gap-1.5 bg-[#160726] px-3 py-2 rounded-[0.25rem] border border-[rgba(167,155,183,0.15)]">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#dfb7ff] shrink-0" />
                <span className="text-[#A79BB7] text-[10px] sm:text-[11px] uppercase tracking-wider hidden xs:inline">Класс:</span>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="bg-transparent text-[#F2F2F2] text-xs focus:outline-none cursor-pointer w-full"
                >
                  <option value="all" className="bg-[#160726]">Все классы</option>
                  <option value="Галерейный класс" className="bg-[#160726]">Галерейный класс</option>
                  <option value="Запретная реликвия" className="bg-[#160726]">Запретная реликвия</option>
                  <option value="Сосуд" className="bg-[#160726]">Сосуд</option>
                </select>
              </div>

              <div className="flex-1 sm:flex-initial flex items-center gap-1.5 bg-[#160726] px-3 py-2 rounded-[0.25rem] border border-[rgba(167,155,183,0.15)]">
                <span className="text-[#A79BB7] text-[10px] sm:text-[11px] uppercase tracking-wider hidden xs:inline">Цена:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'featured' | 'price-asc' | 'price-desc')}
                  className="bg-transparent text-[#F2F2F2] text-xs focus:outline-none cursor-pointer w-full"
                >
                  <option value="featured" className="bg-[#160726]">Рекомендованные</option>
                  <option value="price-asc" className="bg-[#160726]">Сначала дешевле</option>
                  <option value="price-desc" className="bg-[#160726]">Сначала дороже</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Filter Chips / Selectors */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`cursor-pointer px-3 py-1.5 rounded-[0.25rem] text-[11px] sm:text-xs tracking-[0.06em] transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'border border-[#6A0DAD] bg-[#6A0DAD]/20 text-[#F2F2F2] shadow-[0_0_12px_rgba(106,13,173,0.3)]'
                      : 'bg-[#11041F] text-[#A79BB7] border border-[rgba(167,155,183,0.12)] hover:border-[rgba(167,155,183,0.25)] hover:text-[#F2F2F2]'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] ${isActive ? 'text-[#dfb7ff]' : 'text-[#A79BB7]/60'}`}>
                    ({cat.count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center bg-[#160726] rounded-[0.25rem] border border-[rgba(167,155,183,0.12)]">
            <p className="font-serif-display text-2xl text-[#F2F2F2] mb-2">Экспонаты не найдены</p>
            <p className="text-[#A79BB7] text-xs sm:text-sm max-w-md mx-auto mb-6">
              По вашему запросу в каталоге ничего не обнаружено. Измените параметры фильтрации или поисковый запрос.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedGrade('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-[#220B3B] text-[#dfb7ff] text-xs uppercase tracking-widest rounded-[0.25rem] hover:bg-[#6A0DAD]/40 border border-[#6A0DAD]/60"
            >
              Сбросить фильтры
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredProducts.map((product) => {
              const isAdded = recentlyAddedId === product.id;
              return (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="group cursor-pointer relative flex flex-col bg-[#160726] rounded-[0.25rem] border border-[rgba(167,155,183,0.12)] hover:border-[#6A0DAD]/60 transition-all duration-300 hover:shadow-[0_12px_32px_-4px_rgba(106,13,173,0.25)] overflow-hidden"
                >
                  {/* Image Frame Top: Edge-to-edge frame top with bottom gradient fade melting directly into card body */}
                  <div className="relative w-full h-72 sm:h-80 overflow-hidden bg-[#0c0f0f]">
                    <img
                      src={product.primaryImage}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-90 group-hover:brightness-100"
                      loading="lazy"
                    />

                    {/* Gradient overlay melting into card body */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#160726] via-[#160726]/40 to-transparent" />

                    {/* Top tags */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      {/* Inventory ID in tracked label-sm */}
                      <span className="font-mono text-[10px] tracking-[0.14em] uppercase px-2 py-0.5 rounded-[0.125rem] bg-[#0B0014]/85 text-[#dfb7ff] border border-[#6A0DAD]/40 backdrop-blur-sm">
                        {product.id}
                      </span>

                      {/* Danger rating badge */}
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-[0.125rem] bg-[#0B0014]/85 backdrop-blur-sm border border-[rgba(167,155,183,0.2)] text-[10px] uppercase tracking-wider text-[#ffdad4]">
                        {product.dangerRating === 'Сосуд' ? (
                          <Flame className="w-3 h-3 text-[#C80000]" />
                        ) : product.dangerRating === 'Запретная реликвия' ? (
                          <ShieldAlert className="w-3 h-3 text-[#dfb7ff]" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#dfb7ff]" />
                        )}
                        <span>{product.dangerRating}</span>
                      </div>
                    </div>

                    {/* View quick eye icon */}
                    <div className="absolute bottom-3 right-3 p-2 rounded-[0.25rem] bg-[#220B3B]/90 text-[#dfb7ff] border border-[#6A0DAD]/50 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <Eye className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
                    <div>
                      {/* Edition & Category */}
                      <div className="flex items-center gap-2 text-[11px] text-[#A79BB7] uppercase tracking-[0.08em] mb-1">
                        <span>{product.edition}</span>
                        <span aria-hidden="true" className="opacity-40">·</span>
                        <span className="text-[#dfb7ff]">{product.categoryLabel}</span>
                      </div>

                      {/* Title in Playfair Display */}
                      <h3 className="font-serif-display text-lg sm:text-xl font-medium text-[#F2F2F2] group-hover:text-[#dfb7ff] transition-colors leading-snug">
                        {product.name}
                      </h3>

                      {/* Subtitle */}
                      <p className="text-xs text-[#A79BB7] line-clamp-2 mt-1 font-normal leading-relaxed">
                        {product.subtitle}
                      </p>

                      {/* Materials preview */}
                      <div className="mt-2.5 pt-2.5 border-t border-[rgba(167,155,183,0.08)] flex flex-wrap gap-1">
                        {product.materials.slice(0, 2).map((mat, i) => (
                          <span
                            key={i}
                            className="text-[10px] text-[#A79BB7]/80 bg-[#11041F] px-1.5 py-0.5 rounded-[0.125rem]"
                          >
                            {mat}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Price and Action Buttons */}
                    <div className="pt-2 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#A79BB7] block">
                          Стоимость
                        </span>
                        <div className="flex items-baseline gap-2">
                          <span className="font-serif-display text-base sm:text-lg font-bold text-[#F2F2F2]">
                            {formatTenge(product.price)}
                          </span>
                          {product.oldPrice && (
                            <span className="text-xs text-[#A79BB7]/60 line-through">
                              {formatTenge(product.oldPrice)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Secondary Button: Подробнее */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectProduct(product);
                          }}
                          className="cursor-pointer px-2.5 py-2 rounded-[0.25rem] bg-[#160726] hover:bg-[#220B3B] border border-[#6A0DAD] text-[#F2F2F2] text-xs tracking-wider transition-all"
                        >
                          Обзор
                        </button>

                        {/* Primary CTA: В корзину (Haunting Crimson) */}
                        <button
                          type="button"
                          onClick={(e) => handleQuickAdd(product, e)}
                          className={`cursor-pointer px-3 sm:px-3.5 py-2 rounded-[0.25rem] bg-[#C80000] hover:bg-[#b00000] text-[#F2F2F2] text-xs font-semibold tracking-wider transition-all glow-crimson active:scale-95 flex items-center gap-1.5 ${
                            isAdded ? 'bg-[#4b007e] text-[#dfb7ff]' : ''
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>В корзине</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>В корзину</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
