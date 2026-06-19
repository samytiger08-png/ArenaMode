/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Star, ShoppingCart, ShoppingBag, Heart, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: React.Key;
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: { name: string; class: string }) => void;
}

export default function ProductCard({
  product,
  onSelect,
  onAddToCart,
}: ProductCardProps): React.JSX.Element {
  // Use first color and first size as defaults for fast adding to cart
  const defaultSize = product.sizes[0] || 'M';
  const defaultColor = product.colors[0] || { name: 'Sunset', class: 'bg-orange-500' };

  return (
    <div 
      className="group bg-white rounded-2xl overflow-hidden border border-[#E6DFD0]/25 hover:border-[#FF7F50]/50 transition-luxury flex flex-col h-full shadow-sm hover:shadow-xl relative cursor-pointer"
      id={`product-card-${product.id}`}
      onClick={() => onSelect(product)}
    >
      {/* Badge Section */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        {product.inNewArrivals && (
          <span className="bg-[#40E0D0] text-[#1A1A2E] text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full shadow-sm">
            NOUVEAUTÉ
          </span>
        )}
        {product.featured && (
          <span className="bg-[#FF7F50] text-white text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full shadow-sm">
            BEST SELLER
          </span>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="bg-amber-500 text-white text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full shadow-sm animate-pulse">
            PLUS QUE {product.stock} DISPO!
          </span>
        )}
        {product.stock === 0 && (
          <span className="bg-gray-500 text-white text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full shadow-sm">
            RUPTURE DE STOCK
          </span>
        )}
      </div>

      {/* Heart indicator decoration */}
      <div className="absolute top-3 right-3 z-10" onClick={(e) => e.stopPropagation()}>
        <button className="p-2 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-500 hover:text-[#FF7F50] rounded-full transition-luxury shadow-md hover:scale-110 active:scale-95 cursor-pointer">
          <Heart className="h-4 w-4" />
        </button>
      </div>

      {/* Image Container */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-50">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
          referrerPolicy="no-referrer"
          id={`product-image-${product.id}`}
        />
        
        {/* Hover overlay utility menu */}
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-305 flex items-center justify-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="flex items-center gap-2 bg-white text-[#1A1A2E] font-semibold text-xs tracking-widest uppercase px-4 py-2.5 rounded-xl hover:bg-[#FF7F50] hover:text-white transition-luxury shadow-lg active:scale-95 cursor-pointer"
            title="Voir le produit"
          >
            <ArrowRight className="h-4 w-4" />
            <span>Découvrir le produit</span>
          </button>
          
          {product.stock > 0 && (
            <button
               onClick={(e) => {
                 e.stopPropagation();
                 onAddToCart(product, defaultSize, defaultColor);
               }}
               className="p-2.5 bg-gradient-to-r from-[#FF7F50] to-[#FFA384] text-white rounded-xl hover:from-[#40E0D0] hover:to-[#40E0D0] hover:text-[#1A1A2E] transition-colors duration-300 shadow-lg active:scale-95 cursor-pointer"
               title="Ajouter au Panier"
            >
              <ShoppingCart className="h-4.5 w-4.5" />
            </button>
          )}
        </div>
      </div>

      {/* Details Area */}
      <div className="p-3 sm:p-4.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title with maximum 2 lines and explicit height for alignment */}
          <h3 className="font-serif font-semibold text-[#1A1A2E] group-hover:text-[#FF7F50] transition-colors duration-300 line-clamp-2 h-9 sm:h-12 text-xs sm:text-sm md:text-base leading-tight">
            {product.name}
          </h3>
        </div>

        {/* Price & Add Area */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-gray-100 pt-2.5 mt-2 gap-2">
          {/* Price & Rating */}
          <div className="flex sm:flex-col items-baseline sm:items-start justify-between sm:justify-start gap-1">
            <span className="text-sm sm:text-base md:text-lg font-bold font-mono text-[#1A1A2E]">
              {product.price.toLocaleString()} DA
            </span>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-[10px] font-bold text-gray-650">{product.rating.toFixed(1)}</span>
            </div>
          </div>

          <div className="flex w-full sm:w-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(product);
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-1 bg-[#1A1A2E] hover:bg-[#FF7F50] text-[#FFFFFF] px-2.5 py-1.5 sm:px-3.5 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-black tracking-wider transition-all duration-300 shadow-sm active:scale-95 cursor-pointer"
            >
              <span>Voir le produit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
