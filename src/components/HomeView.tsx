/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Compass, ShoppingBag, Eye, ShieldCheck, Sun, HelpCircle, PhoneCall, Sparkles, Flame, Percent } from 'lucide-react';
import { Product } from '../types';
import PremiumSplitHero from './PremiumSplitHero';

interface HomeViewProps {
  setCurrentTab: (tab: string) => void;
  products: Product[];
  onSelect: (product: Product) => void;
  campaignSubtitle: string;
  language?: 'FR' | 'EN';
}

export default function HomeView({
  setCurrentTab,
  products,
  onSelect,
  campaignSubtitle,
  language = 'FR',
}: HomeViewProps) {
  // Filter bestsellers or new arrivals
  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);

  const isFR = language === 'FR';

  const t = {
    capsuleBadge: isFR ? "CAPSULE ST. TROPEZ" : "ST. TROPEZ CAPSULE",
    heroTitle: isFR ? "L'Été Commence Ici" : "Summer Starts Here",
    tagline: isFR ? "✨ LES CYCLADES GRECQUES & LA RIVIERA FRANÇAISE ✨" : "✨ GREEK CYCLADES & FRENCH COSTA COLLECTION ✨",
    
    leftCampaign: isFR ? "Campagne Hommes" : "Summer Campaign",
    leftDesc: isFR ? "Découvrez nos sélections exclusives de shorts de bain premium pour l’été." : "Explore our exclusive premium swim shorts selected for summer.",
    leftBtn: isFR ? "DÉCOUVRIR LES HOMMES" : "DISCOVER HOMMES",
    
    rightCampaign: isFR ? "Campagne Femmes" : "Summer Campaign",
    rightDesc: isFR ? "Découvrez nos maillots une pièce d’exception et maillots de bain de marque." : "Explore our stunning cutout one-pieces and luxury branded swimwear.",
    rightBtn: isFR ? "DÉCOUVRIR LES FEMMES" : "DISCOVER FEMMES",
    
    valProp1Title: isFR ? "Qualité d'Exception" : "Premium Quality",
    valProp1Desc: isFR ? "Finitions de luxe et composants robustes résistants au sel marin de nos maillots de bain." : "Luxury stitch hardware and salt-water resistant premium swimwear dyes.",
    
    valProp2Title: isFR ? "Design Exclusif" : "Trendy Collections",
    valProp2Desc: isFR ? "Modèles dessinés pour passer sans transition de la piscine aux plus grands restaurants." : "Designed to transition effortlessly from loungers on pool decks to high-fashion dinners.",
    
    valProp3Title: isFR ? "Livraison Express" : "Fast Delivery",
    valProp3Desc: isFR ? "Envois hautement prioritaires, directement livrés dans votre hôtel en 2 à 3 jours." : "Orders dispatched under high-priority, reaching hotels or resorts in 2 to 3 days.",
    
    valProp4Title: isFR ? "Éditions Limitées" : "Weekly Releases",
    valProp4Desc: isFR ? "Nouveautés hebdomadaires exclusives en petites séries pour conserver votre allure unique." : "Exclusive limited-quantity beach drop arrivals keeping your resort wardrobe distinct.",
    
    collectionsLabel: isFR ? "Créations de Prestige" : "Curated Resort Edits",
    collectionsTitle: isFR ? "Collections Vedettes" : "Featured Collections",
    shopCollection: isFR ? "Découvrir la Collection \u2192" : "Shop Collection \u2192",
    
    partnersLabel: isFR ? "Vitrine des Marques Estivales Phares" : "Trending Summer Brands Showcase",
    
    conciergeLabel: isFR ? "★ Stylistes Privés 24h/24" : "★ 24/7 Wardrobe Stylists",
    conciergeTitle: isFR ? "Besoin d'aide pour votre style ?" : "Need Help Choosing Your Style?",
    conciergeDesc: isFR ? "Aucune inquiétude. Notre service de conciergerie haut de gamme basé à Alger vous conseille instantanément par chat pour adapter tailles et couleurs à vos envies." : "No problem. Let our luxury Algerian concierge recommend the exact swimming cutouts or sizes to matching colors over live chat advice anytime.",
    conciergeBtn: isFR ? "CONTACTEZ-NOUS" : "CONTACT US",
    chatBtn: isFR ? "DISCUTER VIA WHATSAPP" : "CHAT VIA WHATSAPP",
  };

  // Collections groupings for navigation
  const collectionsList = isFR ? [
    {
      title: "Shorts de bain de marque",
      desc: "Shorts de bain premium sélectionnés pour l’été.",
      image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=500&q=80",
      tab: "hommes"
    },
    {
      title: "Shorts de bain premium",
      desc: "Cordons satinés, tissu anti-sable à séchage rapide.",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80",
      tab: "hommes"
    },
    {
      title: "Maillots une pièce",
      desc: "Coupes asymétriques et finitions d'exception — Bientôt disponible.",
      image: "https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?auto=format&fit=crop&w=500&q=80",
      tab: "femmes"
    },
    {
      title: "Maillots deux pièces",
      desc: "Bikinis de prestige et silhouettes raffinées — Bientôt disponible.",
      image: "https://images.unsplash.com/photo-1527519394129-0028a88c3a10?auto=format&fit=crop&w=500&q=80",
      tab: "femmes"
    },
    {
      title: "Maillots de bain",
      desc: "Notre sélection exclusive haut de gamme — Bientôt disponible.",
      image: "https://images.unsplash.com/photo-1515462277126-270d878326e5?auto=format&fit=crop&w=500&q=80",
      tab: "femmes"
    }
  ] : [
    {
      title: "Branded Swim Shorts",
      desc: "Premium branded swim shorts selected for summer.",
      image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=500&q=80",
      tab: "hommes"
    },
    {
      title: "Men's Swim Shorts",
      desc: "Satin drawstrings, quick-dry sand-proof fabric.",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80",
      tab: "hommes"
    },
    {
      title: "Women's One-Piece",
      desc: "Asymmetric premium swimwear cuts — Coming soon.",
      image: "https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?auto=format&fit=crop&w=500&q=80",
      tab: "femmes"
    },
    {
      title: "Women's Two-Piece",
      desc: "Resort-inspired high-end bikinis — Coming soon.",
      image: "https://images.unsplash.com/photo-1527519394129-0028a88c3a10?auto=format&fit=crop&w=500&q=80",
      tab: "femmes"
    },
    {
      title: "Women's Swimwear",
      desc: "Our exclusive luxury brand line — Coming soon.",
      image: "https://images.unsplash.com/photo-1515462277126-270d878326e5?auto=format&fit=crop&w=500&q=80",
      tab: "femmes"
    }
  ];

  return (
    <div className="space-y-16 pb-16 animate-fade-in" id="home-view-root">
      
      {/* 1. DYNAMIC SPLIT-SCREEN LUXURY HERO BANNER */}
      <PremiumSplitHero setCurrentTab={setCurrentTab} language={language} />

      {/* 2. WHY CHOOSE ARENA MODE VALUE PROPS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="why-choose-us-section">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6.5 rounded-2xl border border-[#E6DFD0]/40 flex items-start gap-4 shadow-xs hover:shadow-lg transition-luxury group">
            <div className="p-3 rounded-xl bg-[#FF7F50]/10 text-[#FF7F50] transition-transform duration-300 group-hover:-translate-y-1">
              <Sparkles className="h-5.5 w-5.5" />
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-widest text-[#1A1A2E] mb-1">
                {t.valProp1Title}
              </h4>
              <p className="text-gray-500 text-xs leading-relaxed font-semibold">
                {t.valProp1Desc}
              </p>
            </div>
          </div>

          <div className="bg-white p-6.5 rounded-2xl border border-[#E6DFD0]/40 flex items-start gap-4 shadow-xs hover:shadow-lg transition-luxury group">
            <div className="p-3 rounded-xl bg-[#40E0D0]/15 text-[#40E0D0] transition-transform duration-300 group-hover:-translate-y-1">
              <Flame className="h-5.5 w-5.5" />
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-widest text-[#1A1A2E] mb-1">
                {t.valProp2Title}
              </h4>
              <p className="text-gray-500 text-xs leading-relaxed font-semibold">
                {t.valProp2Desc}
              </p>
            </div>
          </div>

          <div className="bg-white p-6.5 rounded-2xl border border-[#E6DFD0]/40 flex items-start gap-4 shadow-xs hover:shadow-lg transition-luxury group">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 transition-transform duration-300 group-hover:-translate-y-1">
              <ShieldCheck className="h-5.5 w-5.5" />
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-widest text-[#1A1A2E] mb-1">
                {t.valProp3Title}
              </h4>
              <p className="text-gray-500 text-xs leading-relaxed font-semibold">
                {t.valProp3Desc}
              </p>
            </div>
          </div>

          <div className="bg-white p-6.5 rounded-2xl border border-[#E6DFD0]/40 flex items-start gap-4 shadow-xs hover:shadow-lg transition-luxury group">
            <div className="p-3 rounded-xl bg-[#E6DFD0]/60 text-gray-700 transition-transform duration-300 group-hover:-translate-y-1">
              <Percent className="h-5.5 w-5.5" />
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-widest text-[#1A1A2E] mb-1">
                {t.valProp4Title}
              </h4>
              <p className="text-gray-500 text-xs leading-relaxed font-semibold">
                {t.valProp4Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. LUXURY TRENDING BRANDS BARROW */}
      <section className="bg-[#F5F2ED] py-12 border-y border-[#E6DFD0]/40" id="trending-luxury-brands">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[10px] text-center font-mono font-bold tracking-widest text-gray-400 uppercase block mb-6">
            {t.partnersLabel}
          </span>
          <div className="flex flex-col md:flex-row items-center justify-around gap-10 opacity-75">
            <div className="text-center font-serif text-2xl font-semibold tracking-widest text-[#1A1A2E] uppercase border-b border-[#E6DFD0] pb-1 cursor-default select-none hover:scale-105 hover:text-[#FF7F50] transition-transform duration-300">
              LOUIS VUITTON
            </div>
            <div className="text-center font-serif text-2xl font-bold tracking-widest text-[#1A1A2E] uppercase pb-1 cursor-default select-none hover:scale-105 hover:text-[#40E0D0] transition-transform duration-300">
              BURBERRY
            </div>
            <div className="text-center font-serif text-2xl font-medium tracking-widest text-[#1A1A2E] uppercase tracking-normal cursor-default select-none hover:scale-105 hover:text-[#FF7F50] transition-transform duration-300">
              F E N D I
            </div>
          </div>
        </div>
      </section>



    </div>
  );
}
