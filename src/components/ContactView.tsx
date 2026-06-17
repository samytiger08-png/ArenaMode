/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Phone, Instagram, Send } from 'lucide-react';

export default function ContactView() {
  const contactList = [
    {
      title: "Resort Hotline",
      val: "0552360078",
      desc: "Ligne directe de conciergerie pour votre style d'été.",
      icon: <Phone className="h-5.5 w-5.5 text-[#FF7F50]" />,
      actionText: "CALL NOW",
      href: "tel:0552360078"
    },
    {
      title: "TikTok Account",
      val: "@arena.modee",
      desc: "Reels d'inspiration maillots de bain et styles d'été.",
      icon: <Send className="h-5.5 w-5.5 text-[#40E0D0]" />,
      actionText: "VIEW TIKTOK",
      href: "https://www.tiktok.com/@arena.modee?_r=1&_t=ZN-9759sE5HhME"
    },
    {
      title: "Instagram",
      val: "@arenamodee",
      desc: "Présentation quotidienne de nos maillots de bain de marque.",
      icon: <Instagram className="h-5.5 w-5.5 text-pink-500" />,
      actionText: "VIEW PROFILE",
      href: "https://www.instagram.com/arenamodee?igsh=ODY5ZjVxNncwcmZ4"
    },
    {
      title: "WhatsApp Desk",
      val: "0552360078",
      desc: "Chattez en direct avec un conseiller en maillots de bain basé à Alger.",
      icon: <Phone className="h-5.5 w-5.5 text-emerald-500" />,
      actionText: "START CHAT",
      href: "https://wa.me/213552360078"
    }
  ];

  const faqList = [
    {
      q: "D'où sont expédiés les colis ?",
      a: "Toutes nos commandes de maillots et shorts premium sont expédiées directement depuis notre centre d'Alger (Dar El Beida) en livraison prioritaire."
    },
    {
      q: "Puis-je retourner un article si la taille ne convient pas ?",
      a: "Absolument. Arena Mode propose des échanges de taille sous 30 jours. Les articles de maillots de bain doivent conserver leurs doublures d’hygiène et leurs étiquettes d'origine intactes."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in space-y-16" id="contact-view-root">
      
      {/* 1. CONTACT BANNER DETAILS */}
      <section className="text-center max-w-xl mx-auto space-y-3" id="contact-top-intro">
        <span className="text-xs font-mono font-black tracking-widest text-[#FF7F50] uppercase leading-none">
          Concierge Services
        </span>
        <h2 className="text-3xl md:text-5xl font-serif font-black text-[#1A1A2E] uppercase tracking-tight">
          Get In Touch
        </h2>
        <p className="text-gray-500 font-sans text-xs md:text-sm font-semibold max-w-sm mx-auto leading-relaxed">
          We're here to help. Reach out to our Algerian-based summer assistants for immediate answers on size fits, delivery, or stock availability.
        </p>
      </section>

      {/* 2. CHANNELS CARDS GRID */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="contact-channels-grid">
        {contactList.map((ch, idx) => (
          <div 
            key={idx}
            className="bg-white p-6 rounded-2xl border border-[#E6DFD0]/30 flex flex-col justify-between h-full hover:shadow-lg transition-luxury"
          >
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-xl inline-block shadow-sm">
                {ch.icon}
              </div>
              <h4 className="font-serif font-bold text-[#1A1A2E] text-base leading-none">
                {ch.title}
              </h4>
              <p className="text-xs text-gray-400 font-medium leading-normal">
                {ch.desc}
              </p>
              <span className="text-sm font-bold font-mono text-gray-800 break-all block">
                {ch.val}
              </span>
            </div>

            <a
              href={ch.href}
              target="_blank"
              rel="noreferrer"
              className="mt-5 w-full text-center bg-gray-100 hover:bg-[#1A1A2E] hover:text-white text-[#1A1A2E] py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-colors inline-block cursor-pointer font-bold"
            >
              {ch.actionText}
            </a>
          </div>
        ))}
      </section>



    </div>
  );
}
