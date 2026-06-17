/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Minus, CheckCircle, ShoppingBag, Check, ShieldCheck, Truck, RefreshCw, ArrowLeft, PhoneCall } from 'lucide-react';
import { Product } from '../types';
import { worldExpressFees, getCleanWilayaName } from '../data';

interface ProductPageProps {
  product: Product;
  onGoBack: () => void;
  onPlaceDirectOrder: (orderData: {
    customerName: string;
    phone: string;
    wilaya: string;
    commune: string;
    productId: string;
    productName: string;
    category: string;
    size: string;
    colorOrModel: string;
    quantity: number;
    priceDA: number;
    deliveryType: 'Stop Desk' | 'Domicile';
    deliveryFee: number;
    productPrice: number;
    totalPrice: number;
  }) => void;
  onAddToCart: (product: Product, size: string, color: { name: string; class: string }) => void;
}

const ALGERIAN_WILAYAS = [
  "01 - Adrar", "02 - Chlef", "03 - Laghouat", "04 - Oum El Bouaghi", "05 - Batna", 
  "06 - Béjaïa", "07 - Biskra", "08 - Béchar", "09 - Blida", "10 - Bouira", 
  "11 - Tamanrasset", "12 - Tébessa", "13 - Tlemcen", "14 - Tiaret", "15 - Tizi Ouzou", 
  "16 - Alger", "17 - Djelfa", "18 - Jijel", "19 - Sétif", "20 - Saïda", 
  "21 - Skikda", "22 - Sidi Bel Abbès", "23 - Annaba", "24 - Guelma", "25 - Constantine", 
  "26 - Médéa", "27 - Mostaganem", "28 - M'Sila", "29 - Mascara", "30 - Ouargla", 
  "31 - Oran", "32 - El Bayadh", "33 - Illizi", "34 - Bordj Bou Arréridj", "35 - Boumerdès", 
  "36 - El Tarf", "37 - Tindouf", "38 - Tissemsilt", "39 - El Oued", "40 - Khenchela", 
  "41 - Souk Ahras", "42 - Tipaza", "43 - Mila", "44 - Aïn Defla", "45 - Naâma", 
  "46 - Aïn Témouchent", "47 - Ghardaïa", "48 - Relizane", "49 - El M'Ghair", "50 - El Meniaa", 
  "51 - Ouled Djellal", "52 - Bordj Baji Mokhtar", "53 - Béni Abbès", "54 - In Salah", 
  "55 - In Guezzam", "56 - Touggourt", "57 - Djanet", "58 - Al-M'Ghair"
];

export default function ProductPage({
  product,
  onGoBack,
  onPlaceDirectOrder,
  onAddToCart,
}: ProductPageProps) {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState({ name: '', class: '' });
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);

  // Form states
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formWilaya, setFormWilaya] = useState('16 - Alger');
  const [formCommune, setFormCommune] = useState('');
  const [deliveryType, setDeliveryType] = useState<'Stop Desk' | 'Domicile'>('Domicile');

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

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || 'M');
      setSelectedColor(product.colors[0] || { name: 'Sunset', class: 'bg-orange-500' });
      setActiveImageIndex(0);
      setQuantity(1);
      setOrderPlaced(false);
      setCartSuccess(false);
    }
  }, [product]);

  const cleanWilayaName = getCleanWilayaName(formWilaya);
  const feesObj = worldExpressFees[cleanWilayaName] || { desk: null, home: null };
  const deliveryFee = deliveryType === 'Stop Desk' ? (feesObj.desk || 0) : (feesObj.home || 0);
  const isUnavailable = feesObj.desk === null && feesObj.home === null;
  const productPriceTotal = product ? product.price * quantity : 0;
  const grandTotal = productPriceTotal + (isUnavailable ? 0 : deliveryFee);

  const handleMinus = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handlePlus = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCartClick = () => {
    onAddToCart(product, selectedSize, selectedColor);
    setCartSuccess(true);
    setTimeout(() => setCartSuccess(false), 2000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim() || !formCommune.trim()) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const cleanWName = getCleanWilayaName(formWilaya);
    const feesObj = worldExpressFees[cleanWName] || { desk: null, home: null };
    const isUnavailable = feesObj.desk === null && feesObj.home === null;

    if (isUnavailable) {
      alert("La livraison est indisponible pour cette wilaya.");
      return;
    }

    const currentFee = deliveryType === 'Stop Desk' ? (feesObj.desk || 0) : (feesObj.home || 0);
    const pPrice = product.price * quantity;

    onPlaceDirectOrder({
      customerName: formName,
      phone: formPhone,
      wilaya: formWilaya,
      commune: formCommune,
      productId: product.id,
      productName: product.name,
      category: product.category === 'men_swim_shorts' ? 'Shorts de bain premium' : 'Maillots de bain premium',
      size: selectedSize,
      colorOrModel: selectedColor.name,
      quantity: quantity,
      priceDA: product.price,
      deliveryType,
      deliveryFee: currentFee,
      productPrice: pPrice,
      totalPrice: pPrice + currentFee
    });

    setOrderPlaced(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in text-left" id="product-detail-page-container">
      {/* Back Button */}
      <button 
        onClick={onGoBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-bold font-mono text-xs tracking-wider uppercase mb-8 group transition-all cursor-pointer"
        id="btn-back-to-catalog"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        <span>Retour aux modèles</span>
      </button>

      {/* Success View */}
      {orderPlaced ? (
        <div className="bg-white rounded-3xl p-8 border border-emerald-200 shadow-xl max-w-2xl mx-auto text-center space-y-6 animate-scale-up" id="order-success-card">
          <div className="mx-auto h-20 w-20 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center border-2 border-dashed border-emerald-500">
            <CheckCircle className="h-10 w-10 text-emerald-500 animate-pulse" />
          </div>
          <span className="text-xs font-mono font-black tracking-widest text-[#FF7F50] uppercase leading-none block">
            COMMANDE ENREGISTRÉE avec succès !
          </span>
          <h2 className="text-2xl md:text-3xl font-serif font-black text-gray-800">
            Merci pour votre achat chez Arena Mode !
          </h2>
          <p className="text-gray-600 text-sm max-w-lg mx-auto font-medium">
            Votre commande a été transmise à notre équipe commerciale avec succès. 
            Nous vous appellerons sur votre numéro <strong className="text-gray-900">{formPhone}</strong> très rapidement pour confirmer l’expédition.
          </p>
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-150 inline-block text-left w-full space-y-2">
            <div><span className="text-gray-400 font-bold text-[10px] uppercase">Client:</span> <strong className="text-gray-800 text-xs">{formName}</strong></div>
            <div><span className="text-gray-400 font-bold text-[10px] uppercase">Détails:</span> <strong className="text-gray-800 text-xs">{product.name} ({quantity}x - Taille {selectedSize} - {selectedColor.name})</strong></div>
            <div><span className="text-gray-400 font-bold text-[10px] uppercase">Destination:</span> <strong className="text-gray-800 text-xs">{formCommune}, {formWilaya}</strong></div>
            <div className="pt-2 border-t border-dashed mt-2 flex justify-between items-center text-sm font-bold">
              <span className="text-[#FF7F50]">Paiement à la livraison:</span>
              <span className="font-mono text-gray-900 font-black text-base">{(product.price * quantity).toLocaleString()} DA</span>
            </div>
          </div>
          <button
            onClick={onGoBack}
            className="w-full bg-[#1A1A2E] hover:bg-[#FF7F50] hover:text-white text-white py-4.5 rounded-2xl font-black text-xs tracking-widest uppercase transition-all duration-300 shadow-lg cursor-pointer"
          >
            Continuer la visite d'Arena Mode
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start" id="product-detail-layout-grid">
          {/* Left Block: Image View */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-white shadow-md border" id="product-detail-hero-frame">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Sub-gallery images carousel */}
            {product.images.length > 1 && (
              <div className="flex gap-2 justify-center" id="product-detail-thumbnail-strip">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-luxury bg-white cursor-pointer ${
                      activeImageIndex === idx ? 'border-[#FF7F50] scale-105' : 'border-gray-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
            

          </div>

          {/* Center Block: Product Info and options selection */}
          <div className="lg:col-span-4 space-y-6" id="product-info-choices">
            <div>
              <span className="text-xs font-mono font-black tracking-widest text-[#FF7F50] uppercase mb-1.5 block">
                {product.isMen ? 'Collection Homme' : 'Collection Femme'}
              </span>
              <h1 className="text-2xl md:text-3xl font-serif font-black text-[#1A1A2E] leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-baseline mt-2.5">
                <span className="text-2xl md:text-3xl font-mono font-black text-[#1A1A2E]">
                  {product.price.toLocaleString()} DA
                </span>
              </div>
            </div>

            <p className="text-gray-600 text-xs md:text-sm leading-relaxed border-t border-dashed pt-4">
              {product.description}
            </p>

            {/* Size Options */}
            {product.sizes.length > 0 && (
              <div className="space-y-2 border-t border-dashed pt-4">
                <span className="text-xs font-black tracking-widest text-[#1A1A2E] uppercase block">
                  Taille : <span className="text-[#FF7F50] font-mono">{selectedSize}</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sz) => {
                    const isSelected = selectedSize === sz;
                    return (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`h-11 w-11 rounded-xl text-xs font-black uppercase transition-all duration-205 flex items-center justify-center border cursor-pointer ${
                          isSelected
                            ? 'border-[#1A1A2E] bg-[#1A1A2E] text-white shadow-md'
                            : 'border-gray-200 text-gray-600 hover:border-gray-400 bg-white'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}



            {/* Quantity selection */}
            <div className="space-y-2 border-t border-dashed pt-4">
              <span className="text-xs font-black tracking-widest text-[#1A1A2E] uppercase block">
                Quantité :
              </span>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-200 bg-white rounded-xl overflow-hidden shrink-0">
                  <button
                    type="button"
                    onClick={handleMinus}
                    disabled={quantity <= 1}
                    className="px-3.5 py-2 text-gray-500 hover:bg-gray-100 disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 text-sm font-black font-mono text-[#1A1A2E]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={handlePlus}
                    disabled={quantity >= product.stock}
                    className="px-3.5 py-2 text-gray-500 hover:bg-gray-100 disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <span className="text-[11px] text-gray-400 font-semibold uppercase">{product.stock} pièces disponibles</span>
              </div>
            </div>

            {/* Shopping cart support button if they want to group orders */}
            <div className="pt-4 border-t border-gray-150">
              <button
                onClick={handleAddToCartClick}
                className="w-full flex items-center justify-center gap-2.5 border-2 border-gray-800 hover:bg-[#FF7F50] hover:border-[#FF7F50] hover:text-white text-gray-800 py-3.5 px-6 rounded-xl font-black text-xs tracking-widest uppercase transition-all duration-300 cursor-pointer"
              >
                <ShoppingBag className="h-4.5 w-4.5" />
                <span>AJOUTER AU PANIER</span>
              </button>
              {cartSuccess && (
                <div className="text-center text-[11px] font-bold text-emerald-600 bg-emerald-50 rounded-lg p-2 border border-emerald-100 mt-2">
                  🎉 Article ajouté au panier !
                </div>
              )}
            </div>
          </div>

          {/* Right Block: Algerian Direct Order Checkout Form */}
          <div className="lg:col-span-3 bg-white p-6 rounded-3xl border border-[#E6DFD0]/45 shadow-sm space-y-4" id="direct-order-form-panel">
            <div className="text-center pb-3 border-b">
              <span className="text-xs font-mono font-black text-[#FF7F50] tracking-widest uppercase block mb-0.5">FORMULAIRE COMMANDE RAPIDE</span>
              <h3 className="font-serif font-black text-gray-800 uppercase tracking-tight text-sm">Paiement à la livraison</h3>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
              {/* Recipient Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black tracking-widest text-[#1A1A2E] uppercase">
                  Nom complet <span className="text-red-500">*</span>
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

              {/* Recipient Phone */}
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

              {/* Wilaya select */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black tracking-widest text-[#1A1A2E] uppercase">
                  Wilaya <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formWilaya}
                  onChange={(e) => {
                    setFormWilaya(e.target.value);
                  }}
                  className="w-full bg-[#F5F2ED]/40 border border-gray-250 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-[#FF7F50] cursor-pointer"
                >
                  {ALGERIAN_WILAYAS.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>

              {/* Commune text input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black tracking-widest text-[#1A1A2E] uppercase">
                  Commune <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Dar El Beida, Bouzaréah, Kouba"
                  value={formCommune}
                  onChange={(e) => setFormCommune(e.target.value)}
                  className="w-full bg-[#F5F2ED]/40 border border-gray-250 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-[#FF7F50]"
                />
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

              {/* Amount recap */}
              <div className="bg-[#F5F2ED]/40 p-3.5 rounded-2xl border space-y-2 mt-4">
                <div className="flex justify-between items-center text-xs font-medium text-gray-500">
                  <span>Produit :</span>
                  <span className="font-bold text-gray-800 text-right max-w-[150px] truncate">{product.name}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-medium text-gray-500">
                  <span>Options :</span>
                  <span className="font-bold text-gray-800">{selectedSize} &mdash; {selectedColor.name}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-medium text-gray-500">
                  <span>Quantité :</span>
                  <span className="font-mono font-bold text-gray-800">{quantity}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-medium text-gray-500 border-t border-dashed pt-2">
                  <span>Prix produit :</span>
                  <span className="font-mono font-bold text-gray-800">{productPriceTotal.toLocaleString()} DA</span>
                </div>
                <div className="flex justify-between items-center text-xs font-medium text-gray-500 pb-2 border-b">
                  <span>Frais de livraison :</span>
                  <span className="font-mono font-bold text-gray-800">
                    {isUnavailable ? 'Indisponible' : `${deliveryFee.toLocaleString()} DA`}
                  </span>
                </div>

                {isUnavailable ? (
                  <div className="text-center text-xs font-bold text-red-655 bg-red-50 p-2.5 rounded-xl border border-red-100/60 uppercase">
                    Livraison indisponible pour cette wilaya actuellement.
                  </div>
                ) : (
                  <div className="flex justify-between items-center pt-1 text-sm font-bold">
                    <span className="text-[#FF7F50]">Total à payer :</span>
                    <span className="font-mono text-[#1A1A2E] text-base font-black">
                      {grandTotal.toLocaleString()} DA
                    </span>
                  </div>
                )}
              </div>

              {/* Cash on delivery notification label */}
              <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 rounded-xl p-3 border border-emerald-100 uppercase tracking-wide text-center">
                🏍️ Paiement Cash à la livraison.
              </div>

              {/* Submit Order action */}
              <button
                type="submit"
                disabled={isUnavailable}
                className="w-full bg-[#FF7F50] hover:bg-[#1A1A2E] disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed text-white py-4 px-6 rounded-2xl font-black text-xs tracking-widest uppercase transition-all duration-300 shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <PhoneCall className="h-4 w-4 text-white" />
                <span>CONFIRMER LA COMMANDE</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
