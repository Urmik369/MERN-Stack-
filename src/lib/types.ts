export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
    hint: string;
  };
  category: 'T-Shirts' | 'Jeans' | 'Dresses' | 'Jackets' | 'Hoodies' | 'Footwear' | 'Shirts' | 'Shorts' | 'Trousers' | 'Tops';
  stock: number;
  slug: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};
