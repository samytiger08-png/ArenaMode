/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, RefreshCw, Star, ArrowUpDown } from 'lucide-react';
import { Product } from '../types';
import ProductCard from './ProductCard';

const BRAND_ORDER = ['Burberry', 'Fendi', 'Gucci', 'Casa Blanca', 'Casablanca', 'Chanel', 'Christian Dior'];

function getBrandValue(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('burberry')) return 'Burberry';
  if (n.includes('fendi')) return 'Fendi';
  if (n.includes('gucci')) return 'Gucci';
  if (n.includes('casa blanca') || n.includes('casablanca')) return 'Casa Blanca';
  if (n.includes('chanel')) return 'Chanel';
  if (n.includes('dior')) return 'Christian Dior';
  return 'Other';
}

const getBrandSortIndex = (name: string) => {
  const brand = getBrandValue(name);
  if (brand === 'Burberry') return 0;
  if (brand === 'Fendi') return 1;
  if (brand === 'Gucci') return 2;
  if (brand === 'Casa Blanca') return 3;
  if (brand === 'Chanel') return 4;
  if (brand === 'Christian Dior') return 5;
  return 6;
};

interface CatalogViewProps {
  isMen: boolean;
  products: Product[];
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: { name: string; class: string }) => void;
}

export default function CatalogView({
  isMen,
  products,
  onSelect,
  onAddToCart,
}: CatalogViewProps) {
  // Filters state
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');
  const [selectedColor, setSelectedColor] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [sortBy, setSortBy] = useState('default'); // 'default' | 'price-asc' | 'price-desc' | 'rating'

  // Categories list based on gender
  const categories = useMemo(() => {
    if (isMen) {
      return [
        { id: 'All', label: 'All' },
        { id: 'men_swim_shorts', label: 'Shorts de bain' }
      ];
    } else {
      return [
        { id: 'All', label: 'All' },
        { id: 'women_one_piece', label: 'Maillots une pièce' },
        { id: 'women_two_piece', label: 'Maillots deux pièces' },
        { id: 'women_beachwear', label: 'Robes de plage' }
      ];
    }
  }, [isMen]);

  const sizes = isMen ? ['All', 'S', 'M', 'L', 'XL'] : ['All', 'XS', 'S', 'M', 'L', 'XL'];

  // Reset Filters trigger
  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedSize('All');
    setSelectedColor('All');
    setSelectedBrand('All');
    setSortBy('default');
  };

  const productsFilteredByOtherSelectors = useMemo(() => {
    // Filter by everything EXCEPT brand
    let list = products.filter((p) => (isMen ? p.isMen : p.isWomen));

    if (selectedCategory !== 'All') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (selectedSize !== 'All') {
      list = list.filter((p) => p.sizes.includes(selectedSize));
    }

    return list;
  }, [products, isMen, selectedCategory, selectedSize]);

  // Filter & Sort Products logic
  const filteredProducts = useMemo(() => {
    let list = [...productsFilteredByOtherSelectors];

    // Filter by Brand
    if (selectedBrand !== 'All') {
      list = list.filter((p) => getBrandValue(p.name) === selectedBrand);
    }

    // 4. Sort
    if (sortBy === 'price-asc') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list = [...list].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'default') {
      // Group/sort by Brand
      list = [...list].sort((a, b) => {
        const indexA = getBrandSortIndex(a.name);
        const indexB = getBrandSortIndex(b.name);
        if (indexA !== indexB) {
          return indexA - indexB;
        }
        return a.name.localeCompare(b.name);
      });
    }

    return list;
  }, [productsFilteredByOtherSelectors, selectedBrand, sortBy]);

  // Find the first product for each brand in filtered list
  const firstProductIdsOfBrand = useMemo(() => {
    const map: Record<string, string> = {};
    const BRAND_KEYS = ['Burberry', 'Fendi', 'Gucci', 'Casa Blanca', 'Chanel', 'Christian Dior'];
    BRAND_KEYS.forEach((brand) => {
      const lowerBrand = brand.toLowerCase().replace(/\s+/g, '');
      const found = productsFilteredByOtherSelectors.find(p => {
        const pBrand = getBrandValue(p.name).toLowerCase().replace(/\s+/g, '');
        return pBrand === lowerBrand;
      });
      if (found) {
        map[brand] = found.id;
      }
    });
    return map;
  }, [productsFilteredByOtherSelectors]);

  const scrollToBrand = (brandName: string) => {
    const brandLower = brandName.toLowerCase().replace(/\s+/g, '-');
    const targetId = `brand-${brandLower}`;
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in" id="catalog-view-root">
      
      {/* 1. HERO BANNER HEADER */}
      <div 
        className="w-full bg-[#1A1A2E] rounded-3xl p-8 md:p-12 text-white mb-10 relative overflow-hidden shadow-md text-left"
        id="catalog-banner-header"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-[#FF7F50]/20 via-[#1A1A2E] to-[#40E0D0]/25 z-0" />
        <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none hidden md:block">
          <SlidersHorizontal className="h-64 w-64 text-white" />
        </div>

        <div className="relative z-10 max-w-lg space-y-3">
          <span className="text-[10px] font-mono font-black tracking-widest text-[#40E0D0] uppercase bg-[#40E0D0]/15 px-3 py-1 rounded-full inline-block">
            {isMen ? "Men's Collection" : "Women's Collection"}
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-black text-white uppercase tracking-tight leading-none text-white">
            {isMen ? "Shorts de bain premium" : "Maillots de bain premium"}
          </h2>
          <p className="text-gray-300 text-xs md:text-sm font-semibold leading-relaxed text-gray-200">
            {isMen 
              ? "Shorts de bain de marque, sélectionnés pour l’été. Modèles premium à séchage rapide conçus pour la plage et le soleil."
              : "Maillots une pièce et deux pièces, sélection premium pour l’été."}
          </p>
        </div>
      </div>

      {/* 2. MAIN LAYOUT: FILTERS BAR + PRODUCT GRID */}
      <div className="flex flex-col lg:flex-row gap-8" id="catalog-main-split">
        
        {/* Left Side: Traditional Boutique Filters Panel */}
        <aside className="w-full lg:w-1/4 shrink-0 space-y-6" id="catalog-filters-sidebar">
          <div className="bg-white p-6 rounded-2xl border border-[#E6DFD0]/35 shadow-sm space-y-6 sticky top-28">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <span className="text-sm font-black text-[#1A1A2E] tracking-wider uppercase flex items-center gap-2">
                <SlidersHorizontal className="h-4.5 w-4.5 text-[#FF7F50]" />
                Filter Swimwear
              </span>
              <button 
                onClick={resetFilters} 
                className="text-gray-400 hover:text-[#1a1a2e] text-xs font-bold font-mono tracking-widest uppercase flex items-center gap-1 transition-colors"
                title="Reset Filters"
              >
                <RefreshCw className="h-3 w-3" />
                Reset
              </button>
            </div>

            {/* A. CATEGORIES TABS */}
            <div className="space-y-2">
              <span className="text-[11px] font-black text-gray-400 tracking-wider uppercase block">
                Category
              </span>
              <div className="flex flex-wrap lg:flex-col gap-1.5" id="category-filter-tags">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-[#FF7F50] text-white font-extrabold shadow-sm' 
                          : 'bg-gray-100 text-[#1a1a2e] hover:bg-gray-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* B. SIZES CHECKS */}
            <div className="space-y-2">
              <span className="text-[11px] font-black text-gray-400 tracking-wider uppercase block">
                Select Size
              </span>
              <div className="flex flex-wrap gap-1.5" id="size-filter-dots">
                {sizes.map((sz) => {
                  const isSelected = selectedSize === sz;
                  return (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`h-10 w-10 text-xs font-black rounded-xl uppercase transition-all flex items-center justify-center border cursor-pointer ${
                        isSelected
                          ? 'bg-[#1A1A2E] border-[#1A1A2E] text-white shadow-sm'
                          : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* C. MARQUE SECTION */}
            <div className="space-y-2">
              <span className="text-[11px] font-black text-gray-400 tracking-wider uppercase block">
                MARQUE
              </span>
              <div className="flex flex-wrap gap-1.5" id="brand-shortcuts-list">
                {['Burberry', 'Fendi', 'Gucci', 'Casa Blanca', 'Chanel', 'Christian Dior'].map((brand) => {
                  const available = !!firstProductIdsOfBrand[brand];
                  const isSelected = selectedBrand === brand;
                  return (
                    <button
                      key={brand}
                      onClick={() => {
                        if (available) {
                          setSelectedBrand(isSelected ? 'All' : brand);
                        }
                      }}
                      disabled={!available}
                      className={`text-xs px-3 py-2 rounded-xl font-bold uppercase tracking-wider transition-all border text-center ${
                        available
                          ? isSelected
                            ? 'bg-[#1A1A2E] border-[#1A1A2E] text-white shadow-sm cursor-pointer'
                            : 'bg-white border-gray-200 text-[#1A1A2E] hover:border-[#FF7F50] hover:text-[#FF7F50] cursor-pointer active:scale-95'
                          : 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed opacity-50'
                      }`}
                    >
                      {brand}
                    </button>
                  );
                })}
              </div>
            </div>


          </div>
        </aside>

        {/* Right Side: Active Products Grid Area */}
        <section className="flex-1 space-y-6" id="catalog-products-area">
          {/* Sorter bar metrics */}
          <div className="bg-white p-4.5 rounded-2xl border border-[#E6DFD0]/30 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-gray-500 text-xs font-bold uppercase tracking-wide">
              Showing <strong className="text-gray-900">{filteredProducts.length}</strong> items in resort categories
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4.5 w-4.5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-100 text-[#1A1A2E] border-none text-xs font-bold tracking-wider uppercase rounded-xl py-2 pl-3 pr-8 focus:ring-[#FF7F50] cursor-pointer"
              >
                <option value="default">Default Sort</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated Only</option>
              </select>
            </div>
          </div>

          {/* Catalog grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-[#E6DFD0]/30 shadow-xs" id="no-products-placeholder">
              <div className="h-14 w-14 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <SlidersHorizontal className="h-6 w-6" />
              </div>
              <h3 className="font-serif font-black text-lg text-gray-700 uppercase">Aucun vêtement ne correspond</h3>
              <p className="text-gray-400 text-xs mt-1 font-semibold">Essayez de réinitialiser vos filtres !</p>
              <button
                onClick={resetFilters}
                className="mt-6 bg-[#1A1A2E] text-white hover:bg-[#FF7F50] px-6 py-3 rounded-xl text-xs font-black tracking-widest uppercase transition-colors font-mono cursor-pointer"
              >
                RÉINITIALISER LES FILTRES
              </button>
            </div>
          ) : (
            <div className={isMen ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" : "grid grid-cols-2 gap-4 sm:gap-6"} id="catalog-clothing-grid">
              {filteredProducts.map((p) => {
                const pBrand = getBrandValue(p.name);
                const isFirstOfBrand = firstProductIdsOfBrand[pBrand] === p.id;
                const anchorId = isFirstOfBrand ? `brand-${pBrand.toLowerCase().replace(/\s+/g, '-')}` : undefined;
                return (
                  <div key={p.id} id={anchorId} className="scroll-mt-28">
                    <ProductCard
                      product={p}
                      onSelect={onSelect}
                      onAddToCart={onAddToCart}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
