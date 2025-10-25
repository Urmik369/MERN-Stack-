
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
