// src/context/products-context.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/data/product-schema";
import productService from "@/services/productService"; // Assume you have implemented this service

interface ProductsContextType {
  products: Product[];
  refreshProducts: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  const refreshProducts = async () => {
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  return (
    <ProductsContext.Provider value={{ products, refreshProducts }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
};
