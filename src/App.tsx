import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CatalogPage } from './pages/CatalogPage';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ThankYouPage } from './pages/ThankYouPage';
import { Footer } from './components/Footer';
import { ActivePage, CartItem, Product, PlacedOrder } from './types';
import { PRODUCTS } from './data/products';

const CART_STORAGE_KEY = 'nocturne_atelier_cart';

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('catalog');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [lastOrder, setLastOrder] = useState<PlacedOrder | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize cart from localStorage with graceful fallback
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse cart from localStorage:', e);
    }
    // Pre-populate with first specimen so the shop feels immediately alive and testable
    return [
      {
        id: PRODUCTS[0].id,
        product: PRODUCTS[0],
        quantity: 1
      }
    ];
  });

  // Sync cart to localStorage whenever it updates
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Failed to save cart to localStorage:', e);
    }
  }, [cartItems]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Add product to cart
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.id);
      if (existing) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevItems, { id: product.id, product, quantity }];
    });
    showToast(`«${product.name}» (${quantity} шт.) добавлен в корзину.`);
  };

  // Buy now: add to cart and immediately go to checkout
  const handleBuyNow = (product: Product, quantity: number = 1) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.id);
      if (existing) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevItems, { id: product.id, product, quantity }];
    });
    setActivePage('checkout');
  };

  // Update item quantity in cart
  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prevItems) => {
      return prevItems
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  // Remove item from cart
  const handleRemoveItem = (productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    showToast('Экспонат удален из корзины.');
  };

  // Clear cart
  const handleClearCart = () => {
    setCartItems([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (e) {
      // ignore
    }
    showToast('Корзина очищена.');
  };

  // Select product to view details
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setActivePage('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // On successful Telegram order completion
  const handleOrderSuccess = (order: PlacedOrder) => {
    setLastOrder(order);
    setCartItems([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (e) {
      // ignore
    }
    setActivePage('thank-you');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Заказ успешно зарегистрирован и отправлен в Telegram!');
  };

  // Return to catalog
  const handleReturnToCatalog = () => {
    setActivePage('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#0B0014] text-[#F2F2F2] flex flex-col selection:bg-[#6A0DAD] selection:text-[#F2F2F2]">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-[#160726] border border-[#6A0DAD] text-[#F2F2F2] p-3.5 rounded-[0.25rem] shadow-[0_12px_32px_-4px_rgba(106,13,173,0.4)] flex items-center justify-between gap-3 text-xs tracking-wide">
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-[#A79BB7] hover:text-[#F2F2F2] font-bold text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <Header
        activePage={activePage}
        setActivePage={(page) => {
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        cartCount={totalCartCount}
      />

      {/* Page Routing */}
      <main className="flex-1">
        {activePage === 'catalog' && (
          <CatalogPage
            onSelectProduct={handleSelectProduct}
            onAddToCart={(product) => handleAddToCart(product, 1)}
          />
        )}

        {activePage === 'product' && selectedProduct && (
          <ProductPage
            product={selectedProduct}
            onBack={handleReturnToCatalog}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        )}

        {activePage === 'cart' && (
          <CartPage
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onContinueShopping={handleReturnToCatalog}
            onProceedToCheckout={() => {
              setActivePage('checkout');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activePage === 'checkout' && (
          <CheckoutPage
            cartItems={cartItems}
            onBackToCart={() => {
              setActivePage('cart');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOrderSuccess={handleOrderSuccess}
          />
        )}

        {activePage === 'thank-you' && (
          <ThankYouPage
            order={lastOrder}
            onReturnToCatalog={handleReturnToCatalog}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
