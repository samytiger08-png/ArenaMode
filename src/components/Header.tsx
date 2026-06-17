/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShoppingBag, Menu, X, Play, Sparkles, User, Sun } from 'lucide-react';
import { CartItem } from '../types';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  cart: CartItem[];
  setIsCartOpen: (open: boolean) => void;
  campaignText: string;
  language: 'FR' | 'EN';
  setLanguage: (lang: 'FR' | 'EN') => void;
}

export default function Header({
  currentTab,
  setCurrentTab,
  cart,
  setIsCartOpen,
  campaignText,
  language,
  setLanguage,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const navItems = [
    { id: 'home', label: language === 'FR' ? 'Accueil' : 'Home' },
    { id: 'hommes', label: 'Hommes' },
    { id: 'femmes', label: 'Femmes' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md shadow-sm border-b border-[#E6DFD0]/40">
      {/* Summer Promo Ticker */}
      <div className="w-full bg-gradient-to-r from-[#FF7F50] via-[#E6DFD0] to-[#40E0D0] py-2 px-4 text-center select-none overflow-hidden relative">
        <div className="absolute inset-0 bg-white/10 opacity-30 animate-pulse pointer-events-none" />
        <div className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-[#1A1A2E] tracking-wider uppercase animate-fade-in">
          <span className="flex items-center justify-center animate-spin" style={{ animationDuration: '10s' }}>
            <Sun className="h-4 w-4 text-[#1A1A2E]" />
          </span>
          <span>{campaignText}</span>
          <span className="flex items-center justify-center animate-spin" style={{ animationDuration: '10s' }}>
            <Sun className="h-4 w-4 text-[#1A1A2E]" />
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo Brand Brand */}
          <div 
            onClick={() => setCurrentTab('home')} 
            className="flex items-center gap-1.5 cursor-pointer group shrink-0 select-none"
            id="header-logo-container"
          >
            <div className="relative h-8 w-8 md:h-10 md:w-10 flex items-center justify-center rounded-lg md:rounded-xl bg-gradient-to-tr from-[#FF7F50] to-[#40E0D0] p-[2px] transition-transform duration-300 group-hover:rotate-12">
              <div className="h-full w-full bg-[#1A1A2E] rounded-[6px] md:rounded-[10px] flex items-center justify-center">
                <span className="text-white font-serif font-black text-sm md:text-lg tracking-tighter">A</span>
              </div>
              <Sparkles className="absolute -top-1 -right-1 h-3.5 w-3.5 md:h-4 md:w-4 text-[#FF7F50] animate-bounce" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base md:text-xl font-bold font-serif tracking-wider md:tracking-widest text-[#1A1A2E] uppercase flex items-center gap-0.5">
                ARENA<span className="text-[#FF7F50] font-sans font-black">MODE</span>
              </span>
              <span className="text-[8px] md:text-[10px] font-mono tracking-widest text-gray-400 font-medium uppercase mt-0.5 md:-mt-1">
                Summer Edit 2026
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8" id="desktop-nav-menu">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => setCurrentTab(item.id)}
                  className={`text-sm tracking-widest uppercase font-semibold transition-luxury hover:text-[#FF7F50] relative py-2 ${
                    isActive 
                      ? 'text-[#1A1A2E]' 
                      : 'text-gray-500'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span 
                      className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-[#FF7F50] to-[#40E0D0] animate-fade-in"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Widgets */}
          <div className="flex items-center gap-1.5 sm:gap-4 shrink-0" id="header-right-actions">
            {/* Language Switcher Dropdown */}
            <div className="relative" id="language-switcher-container">
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1 px-2 md:px-3 py-1.5 md:py-2 rounded-full border border-[#E6DFD0]/80 hover:border-[#FF7F50] bg-white transition-all text-[10px] md:text-xs font-black tracking-widest uppercase cursor-pointer text-[#1A1A2E]"
                title={language === 'FR' ? 'Changer de langue' : 'Switch Language'}
                id="lang-switcher-btn"
              >
                <span>{language}</span>
                <span className="text-[8px] md:text-[10px] text-gray-400">▼</span>
              </button>

              {isLangDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-44 bg-white border border-[#E6DFD0] rounded-2xl shadow-xl overflow-hidden py-1.5 z-50 animate-fade-in"
                  id="lang-dropdown-options"
                  onMouseLeave={() => setIsLangDropdownOpen(false)}
                >
                  <button
                    onClick={() => {
                      setLanguage('FR');
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs uppercase font-extrabold tracking-wider transition-colors hover:bg-gray-50 hover:text-[#FF7F50] ${
                      language === 'FR' ? 'text-[#FF7F50] bg-[#FF7F50]/5' : 'text-gray-700'
                    }`}
                  >
                    <span className="text-base">🇫🇷</span>
                    <span>Français</span>
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('EN');
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs uppercase font-extrabold tracking-wider transition-colors hover:bg-gray-50 hover:text-[#FF7F50] ${
                      language === 'EN' ? 'text-[#FF7F50] bg-[#FF7F50]/5' : 'text-gray-700'
                    }`}
                  >
                    <span className="text-base">🇬🇧</span>
                    <span>English</span>
                  </button>
                </div>
              )}
            </div>

            {/* Shopping Bag Button with anim */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-1.5 md:p-2.5 rounded-full text-gray-600 transition-luxury hover:bg-[#F5F2ED] relative group shrink-0"
              id="cart-trigger-btn"
              title="Open Shopping Cart"
            >
              <ShoppingBag className="h-[18px] w-[18px] md:h-[21px] md:w-[21px] transition-transform group-hover:scale-115 text-[#1A1A2E]" />
              {cartItemCount > 0 ? (
                <span className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 bg-[#FF7F50] text-white text-[8px] md:text-[10px] font-black h-4 w-4 md:h-5 md:w-5 bg-[#FF7F50] rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {cartItemCount}
                </span>
              ) : null}
            </button>

            {/* Hamburger Mobile Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 -mr-0.5 text-gray-600 hover:text-gray-900 focus:outline-none md:hidden bg-gray-100/70 rounded-lg shrink-0"
              id="mobile-menu-hamburger"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Backdrop & Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white/98 animate-fade-in" id="mobile-navigation-overlay">
          <div className="px-4 pt-4 pb-6 space-y-2.5">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-item-${item.id}`}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left py-3 px-4 rounded-xl text-base font-semibold uppercase tracking-wider transition-luxury flex items-center justify-between ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FF7F50]/10 to-[#40E0D0]/10 text-[#1A1A2E]'
                      : 'text-gray-600 hover:bg-[#F5F2ED]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <Play className="h-3 w-3 fill-current text-[#FF7F50]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
