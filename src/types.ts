export type ProductCategory = 'all' | 'mannequins' | 'waxworks' | 'relics' | 'props';

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: 'mannequins' | 'waxworks' | 'relics' | 'props';
  categoryLabel: string;
  price: number;
  oldPrice?: number;
  edition: string;
  dimensions: string;
  weight: string;
  materials: string[];
  description: string;
  provenance: string;
  authenticitySeal: string;
  primaryImage: string;
  galleryImages: string[];
  inStock: boolean;
  dangerRating: 'Галерейный класс' | 'Запретная реликвия' | 'Сосуд';
  specs: {
    articulation: string;
    preservation: string;
    pedestal: string;
    dispatchTime: string;
  };
}

export interface CartItem {
  id: string; // product id
  product: Product;
  quantity: number;
}

export interface CheckoutFormData {
  name: string;
  phone: string;
  address: string;
  comment: string;
}

export interface PlacedOrder {
  orderId: string;
  items: CartItem[];
  total: number;
  customer: CheckoutFormData;
  date: string;
  formattedDate: string;
}

export type ActivePage = 'catalog' | 'product' | 'cart' | 'checkout' | 'thank-you';

export const formatTenge = (amount: number): string => {
  return amount.toLocaleString('ru-RU') + ' ₸';
};
