
import { Timestamp } from 'firebase/firestore';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: {
    src: string;
    alt: string;
    width?: number; // Make width optional
    height?: number; // Make height optional
    hint: string;
  };
  category: 'T-Shirts' | 'Jeans' | 'Dresses' | 'Jackets' | 'Hoodies' | 'Footwear' | 'Shirts' | 'Shorts' | 'Trousers' | 'Tops' | 'Skirts' | 'Accessories';
  stock: number;
  slug: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type OrderItem = {
  productId: string;
  name: string;
  quantity: number;
  price: number;
};

export type ShippingAddress = {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

export type Order = {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  orderDate: Timestamp;
  shippingAddress: ShippingAddress;
};
