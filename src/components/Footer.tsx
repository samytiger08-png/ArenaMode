/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Phone, MapPin, Instagram } from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
  language?: 'FR' | 'EN';
}

export default function Footer({ setCurrentTab, language = 'FR' }: FooterProps) {
  const isFR = language === 'FR';

  const t = {
    shippingBanner: isFR ? "★ Livraison Express & Emballages Éco-Responsables Pour Vos Maillots de Bain" : "★ Express Shipping & Sustainably Packaged Premium Swimwear",
    fastCustoms: isFR ? "Dédouanement Rapide" : "Fast Customs cleared",
    secureSsl: isFR ? "Passerelle SSL Sécurisée" : "Secure SSL Gateway",
    brandDesc: isFR 
      ? "Arena Mode est une boutique de villégiature de luxe dédiée exclusivement aux maillots de bain de marque et shorts de bain premium pour voyageurs exigeants." 
      : "Arena Mode is a luxury resort boutique focused exclusively on premium branded swimwear and luxury swim shorts for high-priority travelers.",
    summerMens: isFR ? "HOMMES SWIM" : "HOMMES SWIM",
    summerWomens: isFR ? "FEMMES SWIM" : "FEMMES SWIM",
    custDesk: isFR ? "CONCIERGERIE CLIENT" : "CUSTOMER DESK",
    
    mensLink1: isFR ? "Shorts de Bain Premium" : "Premium Swim Shorts",
    mensLink2: isFR ? "Shorts de Bain de Marque" : "Branded Swim Shorts",
    mensLink3: isFR ? "Shorts de Bain Séchage Rapide" : "Quick-Dry Swim Shorts",
    mensLink4: isFR ? "Sélection d’Été Premium" : "Premium Summer Selection",
    
    womensLink1: isFR ? "Maillots de Bain Une Pièce" : "One-Piece Swimwear",
    womensLink2: isFR ? "Bikinis Deux Pièces" : "Two-Piece Bikinis",
    womensLink3: isFR ? "Maillots de Bain Premium" : "Premium Swimwear",
    womensLink4: isFR ? "Collection de Bikinis de Luxe" : "Luxury Bikini Collection",
    
    phoneDesk: isFR ? "0552360078 (Disponible sur WhatsApp)" : "0552360078 (WhatsApp available)",
    
    copyright: isFR ? "Tous droits réservés." : "All Rights Reserved.",
    privacy: isFR ? "Politique de Confidentialité" : "Privacy Policy",
    terms: isFR ? "Conditions de Vente Resort" : "Terms of Resort Sales",
    adminLink: isFR ? "Accéder à l'administration" : "Access Admin Panel",
  };

  return (
    <footer className="bg-[#1A1A2E] text-gray-400 font-sans border-t-4 border-[#FF7F50] mt-auto">
      {/* Main Grid Part */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Leftmost Column: Logo and Bio */}
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setCurrentTab('home')}>
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#FF7F50] to-[#40E0D0] p-[2px] rotate-6">
              <div className="h-full w-full bg-[#1A1A2E] rounded-[10px] flex items-center justify-center">
                <span className="text-white font-serif font-black text-sm">A</span>
              </div>
            </div>
            <span className="text-lg font-bold font-serif tracking-widest text-white uppercase">
              ARENA<span className="text-[#FF7F50] font-sans font-black">MODE</span>
            </span>
          </div>
          <p className="text-xs text-gray-400/85 leading-relaxed font-semibold">
            {t.brandDesc}
          </p>
          <div className="flex gap-3">
            <a href="https://www.instagram.com/arenamodee?igsh=ODY5ZjVxNncwcmZ4" target="_blank" rel="noreferrer" className="p-2 bg-gray-800 hover:bg-[#FF7F50] hover:text-white rounded-lg transition-colors flex items-center justify-center gap-1.5 text-xs font-bold text-gray-300 hover:text-white" title="Instagram">
              <Instagram className="h-4 w-4" />
              <span>Instagram</span>
            </a>
            <a href="https://www.tiktok.com/@arena.modee?_r=1&_t=ZN-9759sE5HhME" target="_blank" rel="noreferrer" className="p-2 bg-gray-800 hover:bg-[#40E0D0] hover:text-[#1A1A2E] rounded-lg transition-colors flex items-center justify-center gap-1.5 text-xs font-bold text-gray-300 hover:text-white" title="TikTok">
              <span>🎵</span>
              <span>TikTok</span>
            </a>
          </div>
        </div>

        {/* Column 2: Hommes Catalog quicklinks */}
        <div className="space-y-4">
          <h4 className="text-[#F5F2ED] text-xs font-black tracking-widest uppercase font-mono">
            {t.summerMens}
          </h4>
          <ul className="space-y-2 text-xs font-bold uppercase tracking-wider">
            <li>
              <button onClick={() => setCurrentTab('hommes')} className="hover:text-[#FF7F50] transition-colors text-left cursor-pointer">
                {t.mensLink1}
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentTab('hommes')} className="hover:text-[#FF7F50] transition-colors text-left cursor-pointer">
                {t.mensLink2}
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentTab('hommes')} className="hover:text-[#FF7F50] transition-colors text-left cursor-pointer">
                {t.mensLink3}
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentTab('hommes')} className="hover:text-[#FF7F50] transition-colors text-left cursor-pointer">
                {t.mensLink4}
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Femmes Catalog quicklinks */}
        <div className="space-y-4">
          <h4 className="text-[#F5F2ED] text-xs font-black tracking-widest uppercase font-mono">
            {t.summerWomens}
          </h4>
          <ul className="space-y-2 text-xs font-bold uppercase tracking-wider">
            <li>
              <button onClick={() => setCurrentTab('femmes')} className="hover:text-[#40E0D0] transition-colors text-left cursor-pointer">
                {t.womensLink1}
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentTab('femmes')} className="hover:text-[#40E0D0] transition-colors text-left cursor-pointer">
                {t.womensLink2}
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentTab('femmes')} className="hover:text-[#40E0D0] transition-colors text-left cursor-pointer">
                {t.womensLink3}
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentTab('femmes')} className="hover:text-[#40E0D0] transition-colors text-left cursor-pointer">
                {t.womensLink4}
              </button>
            </li>
          </ul>
        </div>

        {/* Column 4: Delivery Help info */}
        <div className="space-y-4">
          <h4 className="text-[#F5F2ED] text-xs font-black tracking-widest uppercase font-mono">
            {t.custDesk}
          </h4>
          <ul className="space-y-3 text-xs font-semibold">
            <li className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 text-[#FF7F50] shrink-0 mt-0.5" />
              <span>Alger, Dar El Beida, Karim Belkacem</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-[#40E0D0] shrink-0" />
              <span>{t.phoneDesk}</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Copyright lines */}
      <div className="border-t border-gray-800 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-gray-500 font-bold uppercase tracking-wider">
          <div className="text-center md:text-left">
            <span>&copy; {new Date().getFullYear()} Arena Mode SAS. Registered Luxury Brand. {t.copyright}</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <button onClick={() => setCurrentTab('contact')} className="hover:text-[#FF7F50] transition-colors cursor-pointer">{t.privacy}</button>
            <button onClick={() => setCurrentTab('contact')} className="hover:text-[#FF7F50] transition-colors cursor-pointer">{t.terms}</button>
            <button 
              onClick={() => setCurrentTab('admin')} 
              className="text-gray-600/60 hover:text-[#40E0D0] transition-colors text-[10px] font-normal tracking-wide lowercase italic border-l border-gray-800 pl-4 cursor-pointer flex items-center gap-1.5"
              title="Accéder à l'administration"
              id="discreet-admin-link"
            >
              <span>🔒</span>
              <span>{t.adminLink}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
