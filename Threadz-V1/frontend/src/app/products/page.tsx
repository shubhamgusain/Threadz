"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";

interface ProductVariant {
  color_hex: string;
  color_name: string;
}

interface Product {
  product_id: string;
  name: string;
  category: string;
  base_price: number;
  variants: ProductVariant[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Blank Garments Catalog</h1>
        <p className="text-lg text-slate-600 max-w-2xl">
          Choose from our selection of premium, ethically-sourced garments. Each piece is designed to be the perfect canvas for your custom creations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map(product => {
          // Extract unique colors to display swatches
          const uniqueColors = Array.from(
            new Map(product.variants.map(v => [v.color_hex, v])).values()
          );

          return (
            <Link href={`/products/${product.product_id}`} key={product.product_id}>
              <div className="group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="aspect-[4/3] bg-slate-100 relative flex items-center justify-center p-8">
                   {/* Placeholder for real product image, since we'll use 3D on the detail page, we just put an icon here */}
                   <ShoppingBag className="w-24 h-24 text-slate-300 group-hover:scale-110 transition-transform duration-500" />
                   
                   <div className="absolute bottom-4 left-4 flex gap-1">
                     {uniqueColors.map(color => (
                       <div 
                         key={color.color_hex} 
                         className="w-5 h-5 rounded-full border border-slate-200 shadow-sm"
                         style={{ backgroundColor: color.color_hex }}
                         title={color.color_name}
                       />
                     ))}
                   </div>
                   
                   <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-700 shadow-sm uppercase tracking-wider">
                     {product.category}
                   </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-slate-900 leading-tight pr-4">{product.name}</h3>
                    <span className="text-lg font-bold text-indigo-600 whitespace-nowrap">
                      ${(product.base_price / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center text-sm font-medium text-slate-500 group-hover:text-indigo-600 transition-colors mt-4">
                     Customize in 3D <ArrowRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
