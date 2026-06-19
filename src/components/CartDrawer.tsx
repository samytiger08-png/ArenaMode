/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Trash2, Plus, Minus, CreditCard, CheckCircle, ShoppingBag, ShieldCheck } from 'lucide-react';
import { CartItem } from '../types';
import { worldExpressFees, getCleanWilayaName, getUniqueWilayas, getCommunesForWilaya } from '../data';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onPlaceOrder: (customer: { 
    name: string; 
    phone: string; 
    wilaya: string; 
    commune: string;
    deliveryType: 'Stop Desk' | 'Domicile';
    deliveryFee: number;
    productPrice: number;
    totalPrice: number;
  }) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
}: CartDrawerProps) {
  if (!isOpen) return null;

  // Checkout process phases: 'cart' | 'checkout' | 'success'
  const [checkoutPhase, setCheckoutPhase] = useState<'cart' | 'checkout' | 'success'>('cart');
  
  // Custom Form: No email, no address textarea, only Wilaya dropdown & Commune
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formWilaya, setFormWilaya] = useState('');
  const [formCommune, setFormCommune] = useState('');
  const [deliveryType, setDeliveryType] = useState<'Stop Desk' | 'Domicile'>('Domicile');
  
  const [lastPlacedOrderId, setLastPlacedOrderId] = useState('');

  const uniqueWilayas = getUniqueWilayas();
  const selectedWilayaCode = formWilaya ? formWilaya.split(' - ')[0] : '';
  const filteredCommunes = getCommunesForWilaya(selectedWilayaCode);

  // Switch deliveryType if the selected wilaya has restrictions
  useEffect(() => {
    const cleanW = getCleanWilayaName(formWilaya);
    const fees = worldExpressFees[cleanW];
    if (fees) {
      if (fees.desk === null && fees.home !== null) {
        setDeliveryType('Domicile');
      } else if (fees.home === null && fees.desk !== null) {
        setDeliveryType('Stop Desk');
      }
    }
  }, [formWilaya]);

  // Calculate totals in DA
  const cleanWilayaName = getCleanWilayaName(formWilaya);
  const feesObj = worldExpressFees[cleanWilayaName] || { desk: null, home: null };
  const deliveryFee = deliveryType === 'Stop Desk' ? (feesObj.desk || 0) : (feesObj.home || 0);
  const isUnavailable = feesObj.desk === null && feesObj.home === null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const grandTotal = subtotal + (isUnavailable ? 0 : deliveryFee);

  // Form handle submit
  const handleCheckOutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim() || !formCommune.trim()) {
      alert('Veuillez remplir tous les champs du formulaire.');
      return;
    }

    if (isUnavailable) {
      alert("La livraison est indisponible pour cette wilaya.");
      return;
    }

    // Generate reference order code sample
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newOrderId = `AM-${randomNum}`;
    setLastPlacedOrderId(newOrderId);

    // Call state update in parent
    onPlaceOrder({
      name: formName,
      phone: formPhone,
      wilaya: formWilaya,
      commune: formCommune,
      deliveryType,
      deliveryFee,
      productPrice: subtotal,
      totalPrice: grandTotal
    });

    setCheckoutPhase('success');
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-fade-in"
      id="cart-drawer-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between relative border-l border-[#E6DFD0]/35 animate-slide-left text-left"
        id="cart-drawer-container"
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-gray-150 flex items-center justify-between bg-[#F5F2ED]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5.5 w-5.5 text-[#FF7F50] animate-pulse" />
            <span className="text-lg md:text-xl font-serif font-bold text-[#1A1A2E] tracking-wide uppercase">
              {checkoutPhase === 'cart' && 'Mon Panier'}
              {checkoutPhase === 'checkout' && 'Confirmation de la commande'}
              {checkoutPhase === 'success' && 'Commande Validée !'}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-950 rounded-full transition-luxury hover:bg-gray-100 cursor-pointer"
            id="close-cart-drawer-btn"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* --- PHASE 1: CART LISTING & REVIEW --- */}
        {checkoutPhase === 'cart' && (
          <div className="flex-grow flex flex-col justify-between overflow-hidden" id="phase-cart-list">
            {cart.length === 0 ? (
              <div className="flex-grow flex flex-col items-center justify-center p-8 text-center bg-[#F5F2ED]/30">
                <div className="h-16 w-16 bg-[#40E0D0]/10 text-[#40E0D0] rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <h3 className="font-serif font-semibold text-lg text-gray-700">Votre panier est vide</h3>
                <p className="text-gray-400 text-xs max-w-xs mt-1">Découvrez nos maillots de bain premium et faites votre choix !</p>
                <button
                  onClick={onClose}
                  className="mt-6 font-mono font-bold text-xs tracking-widest uppercase bg-[#1A1A2E] text-white py-3.5 px-6 rounded-xl hover:bg-[#FF7F50] transition-all cursor-pointer"
                >
                  DECOUVRIR LES ETES
                </button>
              </div>
            ) : (
              <div className="flex-grow flex flex-col justify-between overflow-hidden">
                {/* Scrollable list item area */}
                <div className="flex-grow overflow-y-auto p-5 space-y-4" id="cart-drawer-items">
                  {cart.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex gap-4 p-3 bg-gray-50/70 border border-gray-100 rounded-2xl transition-luxury hover:border-[#40E0D0]"
                    >
                      <div className="w-20 aspect-[3/4] rounded-xl overflow-hidden bg-white shrink-0 shadow-sm border border-gray-200">
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start gap-1">
                            <h4 className="font-serif font-bold text-[#1A1A2E] leading-tight text-sm md:text-base line-clamp-1">
                              {item.product.name}
                            </h4>
                            <button 
                              onClick={() => onRemoveItem(item.id)}
                              className="text-gray-400 hover:text-red-500 p-1 rounded-md transition-colors shrink-0 cursor-pointer"
                              title="Retirer cet article"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <span className="text-[10px] font-mono tracking-wider font-bold text-[#FF7F50] uppercase mt-0.5 block">
                            {item.product.category === 'men_swim_shorts' ? 'Shorts de bain premium' : 'Maillots de bain premium'}
                          </span>

                          {/* Attributes display */}
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 rounded font-bold">
                              Taille: {item.selectedSize}
                            </span>
                            <span className="flex items-center gap-1 text-[11px] font-semibold text-gray-500">
                              Couleur:
                              <span className={`h-3 w-3 rounded-full ${item.selectedColor.class} border border-gray-300 inline-block`} />
                              {item.selectedColor.name}
                            </span>
                          </div>
                        </div>

                        {/* Adjust item quantity & pricing */}
                        <div className="flex items-center justify-between border-t border-dashed border-gray-200 pt-2.5 mt-2">
                          <div className="flex items-center border border-gray-200 bg-white rounded-lg">
                            <button
                              onClick={() => onUpdateQuantity(item.id, -1)}
                              className="px-2 py-1 text-gray-400 hover:text-gray-900 text-xs font-bold cursor-pointer"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-2.5 text-xs font-bold font-mono text-gray-700">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, 1)}
                              className="px-2 py-1 text-gray-400 hover:text-gray-950 text-xs font-bold cursor-pointer"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          
                          <span className="text-sm font-bold font-mono text-[#1A1A2E]">
                            {(item.product.price * item.quantity).toLocaleString()} DA
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing summary block */}
                <div className="p-6 border-t border-gray-150 bg-gray-50/50 space-y-4 shrink-0">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between font-serif font-extrabold text-[#1A1A2E] text-base border-b pb-2">
                      <span>Total des articles</span>
                      <span className="font-mono text-lg">{subtotal.toLocaleString()} DA</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setCheckoutPhase('checkout')}
                    disabled={cart.length === 0}
                    className="w-full mt-2 flex items-center justify-center gap-2 bg-[#1A1A2E] hover:bg-[#FF7F50] hover:text-white text-white py-4 px-6 rounded-2xl font-black text-xs tracking-widest uppercase transition-all duration-300 shadow-md active:scale-[0.98] cursor-pointer"
                    id="checkout-bag-btn"
                  >
                    <span>PASSER A LA COMMANDE DIRECTE</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- PHASE 2: ALGERIAN DELIVERY INFO FORM --- */}
        {checkoutPhase === 'checkout' && (
          <form onSubmit={handleCheckOutSubmit} className="flex-grow flex flex-col justify-between overflow-hidden" id="phase-checkout-form">
            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200/50 space-y-1">
                <span className="text-xs font-black tracking-wider text-amber-800 uppercase block">🏍️ Info Livraison :</span>
                <p className="text-amber-700/80 text-[11px] leading-relaxed font-semibold">
                  World Express assure une livraison directe à domicile dans toutes les wilayas d’Algérie. Payez en espèces à la livraison après inspection de votre colis.
                </p>
              </div>

              <h3 className="font-serif font-black text-gray-800 text-xs tracking-widest uppercase border-b pb-2">
                Informations du destinataire
              </h3>

              {/* Input: Nom Complet */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black tracking-widest text-[#1A1A2E] uppercase">
                  Nom Complet <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Mohamed Benali"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-[#F5F2ED]/40 border border-gray-250 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-[#FF7F50]"
                />
              </div>

              {/* Input: Téléphone */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black tracking-widest text-[#1A1A2E] uppercase">
                  Numéro de téléphone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ex: 0552360078"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full bg-[#F5F2ED]/40 border border-gray-250 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-[#FF7F50]"
                />
              </div>

              {/* Input: Wilaya select */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black tracking-widest text-[#1A1A2E] uppercase">
                  Wilaya <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formWilaya}
                  onChange={(e) => {
                    setFormWilaya(e.target.value);
                    setFormCommune('');
                  }}
                  className="w-full bg-[#F5F2ED]/40 border border-gray-250 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-[#FF7F50] cursor-pointer"
                >
                  <option value="">-- Sélectionnez votre Wilaya --</option>
                  {uniqueWilayas.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>

              {/* Input: Commune */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black tracking-widest text-[#1A1A2E] uppercase">
                  Commune <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  disabled={!formWilaya}
                  value={formCommune}
                  onChange={(e) => setFormCommune(e.target.value)}
                  className="w-full bg-[#F5F2ED]/40 border border-gray-250 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-[#FF7F50] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <option value="">-- Sélectionnez votre Commune --</option>
                  {filteredCommunes.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Type de livraison */}
              {!isUnavailable && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black tracking-widest text-[#1A1A2E] uppercase">
                    Type de livraison <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {feesObj.desk !== null && (
                      <button
                        type="button"
                        onClick={() => setDeliveryType('Stop Desk')}
                        className={`px-3 py-2.5 rounded-xl border text-xs font-black uppercase transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                          deliveryType === 'Stop Desk'
                            ? 'border-[#FF7F50] bg-[#FF7F50]/5 text-[#FF7F50]'
                            : 'border-gray-200 text-gray-600 hover:border-gray-400 bg-white'
                        }`}
                      >
                        <span>Stop Desk</span>
                        <span className="text-[9px] font-mono lowercase tracking-normal text-gray-400">
                          {feesObj.desk} DA
                        </span>
                      </button>
                    )}

                    {feesObj.home !== null && (
                      <button
                        type="button"
                        onClick={() => setDeliveryType('Domicile')}
                        className={`px-3 py-2.5 rounded-xl border text-xs font-black uppercase transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                          deliveryType === 'Domicile'
                            ? 'border-[#FF7F50] bg-[#FF7F50]/5 text-[#FF7F50]'
                            : 'border-gray-200 text-gray-600 hover:border-gray-400 bg-white'
                        }`}
                      >
                        <span>À domicile</span>
                        <span className="text-[9px] font-mono lowercase tracking-normal text-gray-400">
                          {feesObj.home} DA
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Total recap & buttons */}
            <div className="p-6 border-t border-gray-150 bg-gray-50/50 space-y-3 shrink-0">
              <div className="bg-white p-3.5 rounded-xl border border-gray-150 space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold text-gray-500">
                  <span>Prix produits :</span>
                  <span className="font-mono font-bold text-gray-800">{subtotal.toLocaleString()} DA</span>
                </div>
                <div className="flex justify-between items-center text-xs font-semibold text-gray-500 border-b pb-2">
                  <span>Frais de livraison :</span>
                  <span className="font-mono font-bold text-gray-800 animate-pulse">
                    {isUnavailable ? 'Indisponible' : `${deliveryFee.toLocaleString()} DA`}
                  </span>
                </div>

                {isUnavailable ? (
                  <div className="text-center text-xs font-black text-red-655 bg-red-50 p-2 rounded-lg border border-red-100 uppercase">
                    Livraison indisponible pour cette wilaya.
                  </div>
                ) : (
                  <div className="flex justify-between items-center pt-1 text-xs font-black uppercase text-[#1A1A2E]">
                    <span>Total à payer :</span>
                    <span className="font-mono text-[#FF7F50] text-base">{grandTotal.toLocaleString()} DA</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setCheckoutPhase('cart')}
                  className="w-1/3 bg-gray-200 hover:bg-gray-300 text-gray-700 py-4 rounded-xl font-bold text-center text-xs tracking-wider uppercase transition-colors cursor-pointer"
                >
                  RETOUR
                </button>
                <button
                  type="submit"
                  disabled={isUnavailable}
                  className="w-2/3 flex items-center justify-center gap-2 bg-[#FF7F50] hover:bg-[#1A1A2E] disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed text-white py-4 px-6 rounded-xl font-black text-xs tracking-widest uppercase transition-all duration-300 shadow-md active:scale-95 cursor-pointer"
                  id="place-order-submit-btn"
                >
                  <ShieldCheck className="h-4.5 w-4.5 text-white" />
                  <span>CONFIRMER MA COMMANDE</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* --- PHASE 3: CHECKOUT SUCCESS SPLASH SCREEN --- */}
        {checkoutPhase === 'success' && (
          <div className="flex-grow flex flex-col justify-between p-8 text-center bg-[#F5F2ED]/40" id="phase-success-splash">
            <div className="my-auto space-y-5">
              <div className="mx-auto h-20 w-20 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mb-6 border-2 border-dashed border-emerald-500">
                <CheckCircle className="h-10 w-10 text-emerald-500" />
              </div>

              <p className="text-xs font-mono font-black tracking-widest text-[#FF7F50] uppercase leading-none">
                COMMANDE EXTRAORDINAIRE ENREGISTRÉE !
              </p>
              
              <h3 className="font-serif font-black text-[#1A1A2E] text-2xl tracking-normal italic">
                Merci d'avoir choisi Arena Mode !
              </h3>

              <div className="bg-white rounded-2xl p-5 border border-gray-150 inline-block shadow-sm max-w-sm mx-auto">
                <p className="text-[11px] text-gray-500 leading-relaxed font-semibold">
                  Notre service commercial à Alger vous appellera très rapidement sur le numéro <strong className="text-gray-800">{formPhone}</strong> pour valider l'expédition express à destination de la wilaya <strong className="text-gray-800">{formWilaya}</strong>.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setCheckoutPhase('cart');
                onClose();
              }}
              className="w-full bg-[#1A1A2E] hover:bg-[#FF7F50] text-white py-4.5 rounded-2xl font-black text-xs tracking-widest uppercase transition-all duration-300 shadow-lg active:scale-95 mt-6 cursor-pointer"
            >
              CONTINUER LA VISITE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
