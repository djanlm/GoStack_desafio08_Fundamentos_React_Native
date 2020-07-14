import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // TODO LOAD ITEMS FROM ASYNC STORAGE
      const storedProducts = await AsyncStorage.getItem(
        '@GoMarketPlace:products',
      );
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      }
    }

    loadProducts();
  }, []);

  const increment = useCallback(
    async id => {
      const updatedProducts = products.map(item => {
        if (item.id === id) {
          return { ...item, quantity: item.quantity + 1 };
          // item.quantity += 1;
        }
        return item;
      });
      setProducts(updatedProducts);
      await AsyncStorage.setItem(
        '@GoMarketPlace:products',
        JSON.stringify(updatedProducts),
      );
    },
    [products],
  );

  const addToCart = useCallback(
    async product => {
      // TODO ADD A NEW ITEM TO THE CART
      const productAlreadyAdded = products.find(item => item.id === product.id);
      // caso o produto adicionado já esteja no carrinho, ele não será adicionado, mas seu quantity será incrementado

      if (productAlreadyAdded) {
        const updatedProduct = {
          ...productAlreadyAdded,
          quantity: productAlreadyAdded.quantity + 1,
        }; // spread as outras variaveis e atualiza o quantity
        setProducts([...products, updatedProduct]);
      } else {
        const newProduct = { ...product, quantity: 1 }; // adiciona a variavel quantity ao novo produto
        setProducts([...products, newProduct]);
        await AsyncStorage.setItem(
          '@GoMarketPlace:products',
          JSON.stringify(products),
        );
      }
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      const updatedProducts = products.map(item => {
        if (item.id === id) {
          if (item.quantity > 1) {
            return { ...item, quantity: item.quantity - 1 };
          }
          // item.quantity += 1;
        }
        return item;
      });
      setProducts(updatedProducts);
      await AsyncStorage.setItem(
        '@GoMarketPlace:products',
        JSON.stringify(updatedProducts),
      );
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
