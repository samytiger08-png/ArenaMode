/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Lock, Settings, Layers, ShoppingBag, TrendingUp, Plus, Edit, 
  Trash2, AlertTriangle, CheckCircle, X, Phone 
} from 'lucide-react';
import { Product, Order, CampaignSettings } from '../types';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  onUpdateProducts: (products: Product[]) => void;
  onUpdateOrders: (orders: Order[]) => void;
}

export default function AdminPanel({
  products,
  orders,
  onUpdateProducts,
  onUpdateOrders,
}: AdminPanelProps) {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  // Tab views within the Admin workspace
  const [subTab, setSubTab] = useState<'products' | 'orders' | 'inventory'>('orders');

  // Interactive Product editing states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Notifications feedback states
  const [successFeedback, setSuccessFeedback] = useState('');
  const [orderIdToConfirmDelete, setOrderIdToConfirmDelete] = useState<string | null>(null);

  // Interactive form states for adding/editing a resort product
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'men_swim_shorts',
    price: 3900,
    description: '',
    imagesStr: '',
    rating: 4.5,
    sizesStr: 'S, M, L, XL',
    colorsStr: 'Sand Beige:#E6DFD0, Arena Coral:#FF7F50, Pure White:#FFFFFF',
    stock: 20,
    isMen: true,
    isWomen: false,
    featured: false,
    inNewArrivals: true
  });

  // Handle Passcode login submit
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'saidarena' || passcode === '2026' || passcode === '3100' || passcode === '1600' || passcode === 'admin') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Code d’accès invalide. Veuillez réessayer.');
    }
  };

  // Open Product form for Adding new apparel
  const triggerAddNewProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: 'men_swim_shorts',
      price: 3900,
      description: 'Shorts de bain premium. Confection artisanale à séchage ultra-rapide.',
      imagesStr: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      sizesStr: 'S, M, L, XL',
      colorsStr: 'Sand Beige:#E6DFD0, Arena Coral:#FF7F50, Pure White:#FFFFFF',
      stock: 25,
      isMen: true,
      isWomen: false,
      featured: true,
      inNewArrivals: true
    });
    setIsProductModalOpen(true);
  };

  // Open Product form for editing
  const triggerEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      category: p.category,
      price: p.price,
      description: p.description,
      imagesStr: p.images.join(', '),
      rating: p.rating,
      sizesStr: p.sizes.join(', '),
      colorsStr: p.colors.map(c => `${c.name}:${c.class}`).join(', '),
      stock: p.stock,
      isMen: p.isMen,
      isWomen: p.isWomen,
      featured: p.featured,
      inNewArrivals: p.inNewArrivals
    });
    setIsProductModalOpen(true);
  };

  // Save Product trigger callback
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse complex properties input strings
    const imagesSplit = productForm.imagesStr.split(',').map((img) => img.trim()).filter(Boolean);
    const sizesSplit = productForm.sizesStr.split(',').map((sz) => sz.trim().toUpperCase()).filter(Boolean);
    
    const colorsSplit = productForm.colorsStr.split(',').map((cStr) => {
      const parts = cStr.split(':');
      return {
        name: parts[0]?.trim() || 'Custom Color',
        class: parts[1]?.trim() || 'bg-gray-400'
      };
    }).filter(Boolean);

    const savedProduct: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      name: productForm.name,
      category: productForm.category,
      price: Number(productForm.price),
      description: productForm.description,
      images: imagesSplit.length > 0 ? imagesSplit : ['https://images.unsplash.com/photo-1598033129183-c4f50c735f10?auto=format&fit=crop&w=800&q=80'],
      rating: Number(productForm.rating),
      sizes: sizesSplit,
      colors: colorsSplit,
      stock: Number(productForm.stock),
      isMen: productForm.isMen,
      isWomen: productForm.isWomen,
      featured: productForm.featured,
      inNewArrivals: productForm.inNewArrivals
    };

    if (editingProduct) {
      // Editing Mode
      const updated = products.map((p) => p.id === editingProduct.id ? savedProduct : p);
      onUpdateProducts(updated);
      triggerSuccess('Article mis à jour avec succès.');
    } else {
      // Appending Mode
      const updated = [savedProduct, ...products];
      onUpdateProducts(updated);
      triggerSuccess('Nouvel article ajouté au catalogue.');
    }

    setIsProductModalOpen(false);
  };

  // Delete product action
  const handleDeleteProduct = (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer cet article de la boutique ?')) {
      const filtered = products.filter((p) => p.id !== id);
      onUpdateProducts(filtered);
      triggerSuccess('Article supprimé du catalogue.');
    }
  };

  // Update order status action
  const handleUpdateOrderStatus = (orderId: string, nextStatus: 'Nouveau' | 'Confirmé' | 'En livraison' | 'Livré' | 'Annulé') => {
    const updated = orders.map((ord) => {
      if (ord.id === orderId) {
        return { ...ord, status: nextStatus };
      }
      return ord;
    });
    onUpdateOrders(updated);
    triggerSuccess(`Statut de la commande ${orderId} mis à jour : ${nextStatus}.`);
  };

  // Quick state notification helpers
  const triggerSuccess = (msg: string) => {
    setSuccessFeedback(msg);
    setTimeout(() => {
      setSuccessFeedback('');
    }, 3500);
  };

  // Financial statistics analytics outputs
  const analytics = useMemo(() => {
    const activeOrders = orders.filter((o) => o.status !== 'Annulé');
    const revenueSum = activeOrders.reduce((sum, o) => sum + o.priceDA * o.quantity, 0);
    const lowStockCount = products.filter((p) => p.stock <= 5).length;

    return {
      totalRevenue: revenueSum,
      totalOrders: orders.length,
      outOfStock: products.filter((p) => p.stock === 0).length,
      lowStock: lowStockCount
    };
  }, [orders, products]);

  // Stable chronological numbering of all orders starting from 1 (oldest to newest)
  const sequentialNumberMap = useMemo(() => {
    const sorted = [...orders].sort((a, b) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
    const map: Record<string, number> = {};
    sorted.forEach((ord, idx) => {
      map[ord.id] = idx + 1;
    });
    return map;
  }, [orders]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in" id="admin-workspace-pane">
      
      {/* 2. SECURITY LOGIN MODAL OVERLAY */}
      {!isAuthenticated ? (
        <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-[#E6DFD0]/45 shadow-2xl text-center space-y-6 my-10 animate-scale-up" id="admin-passcode-box">
          <div className="mx-auto h-16 w-16 bg-[#FF7F50]/10 text-[#FF7F50] rounded-full flex items-center justify-center shadow-inner">
            <Lock className="h-7 w-7" />
          </div>

          <div className="space-y-1.5">
            <h2 className="font-serif font-bold text-2xl text-[#1A1A2E] tracking-tight">Arena Mode Alger</h2>
            <p className="text-xs text-gray-400 font-semibold tracking-wide uppercase">Secured Administration Desk</p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div className="space-y-1 mb-4">
              <input
                type="password"
                required
                placeholder="Entrez le mot de passe admin"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full text-center tracking-widest bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-semibold focus:outline-[#FF7F50]"
              />
              {authError && <span className="text-[11px] font-bold text-red-500 block leading-tight mt-1">{authError}</span>}
            </div>

            <button
              type="submit"
              className="w-full bg-[#1A1A2E] hover:bg-[#FF7F50] text-white py-3 px-6 rounded-xl font-mono text-xs font-black tracking-widest uppercase transition-colors cursor-pointer"
            >
              DÉVERROUILLER LES COMMANDES
            </button>
          </form>
        </div>
      ) : (
        
        /* 3. CORE SECURED ADMIN INTERFACE PANEL */
        <div className="space-y-8 animate-fade-in" id="admin-live-panel">
          
          {/* Header Dashboard section */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-200 pb-6 text-left">
            <div>
              <span className="text-xs font-mono font-black text-[#FF7F50] tracking-widest uppercase block mb-1">Bureau d’administration</span>
              <h2 className="font-serif font-black text-3xl text-gray-800 uppercase tracking-tight">Arena Mode Hub</h2>
            </div>

            {/* Sub-navigation categories tab bar */}
            <div className="flex items-center gap-2 bg-white p-1 rounded-xl border" id="admin-subnavigation-tabs">
              <button
                onClick={() => setSubTab('products')}
                className={`px-4 py-2 text-xs font-black tracking-wider uppercase rounded-lg transition-colors cursor-pointer ${
                  subTab === 'products' ? 'bg-[#1A1A2E] text-white' : 'text-gray-500 hover:text-gray-900 bg-transparent'
                }`}
              >
                Catalogue
              </button>
              <button
                onClick={() => setSubTab('orders')}
                className={`px-4 py-2 text-xs font-black tracking-wider uppercase rounded-lg transition-colors cursor-pointer ${
                  subTab === 'orders' ? 'bg-[#1A1A2E] text-white' : 'text-gray-1000'
                }`}
              >
                Commandes({orders.length})
              </button>
              <button
                onClick={() => setSubTab('inventory')}
                className={`px-4 py-2 text-xs font-black tracking-wider uppercase rounded-lg transition-colors cursor-pointer ${
                  subTab === 'inventory' ? 'bg-[#1A1A2E] text-white' : 'text-gray-500 hover:text-gray-900 bg-transparent'
                }`}
              >
                Stock
              </button>
            </div>
          </div>

          {/* Success notifications floating alert banner */}
          {successFeedback && (
            <div className="bg-emerald-500/10 text-emerald-800 font-bold text-xs p-4 rounded-xl flex items-center gap-2.5 animate-bounce-short border border-emerald-500/30 text-left">
              <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
              <span>{successFeedback}</span>
            </div>
          )}

          {/* PANEL 2: CATALOG MANAGEMENT */}
          {subTab === 'products' && (
            <div className="space-y-6 animate-fade-in" id="panel-products-catalog">
              
              {/* Header metrics */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-left w-full md:w-auto">
                  <h3 className="font-serif font-black text-lg text-gray-800 uppercase">Catalogue des maillots</h3>
                  <span className="text-xs text-gray-400 font-bold uppercase font-mono">{products.length} articles disponibles</span>
                </div>

                {/* Action trigger edit modal */}
                <button
                  onClick={triggerAddNewProduct}
                  className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#FF7F50] hover:bg-[#1A1A2E] text-white py-3 px-6 rounded-xl font-bold text-xs tracking-widest uppercase transition-colors cursor-pointer"
                  id="add-new-product-form-btn"
                >
                  <Plus className="h-4 w-4" />
                  <span>AJOUTER UN ARTICLE</span>
                </button>
              </div>

              {/* Table rendering list of products */}
              <div className="bg-white rounded-3xl border border-gray-150 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs font-bold font-sans">
                    <thead>
                      <tr className="bg-[#F5F2ED] text-gray-500 uppercase font-mono text-[10px] tracking-wider border-b border-gray-150">
                        <th className="py-4 pl-6 pr-2">Aperçu</th>
                        <th className="py-4 px-2">Nom de l'article</th>
                        <th className="py-4 px-2 text-center">Catégorie</th>
                        <th className="py-4 px-2 text-center">Prix</th>
                        <th className="py-4 px-2 text-center">Stock</th>
                        <th className="py-4 pr-6 pl-2 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-2.5 pl-6 pr-2">
                            <div className="h-14 w-11 rounded-lg overflow-hidden shrink-0 border bg-gray-50">
                              <img src={p.images[0]} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                          </td>
                          <td className="py-2.5 pl-2">
                            <div className="flex flex-col text-left">
                              <span className="font-serif text-sm font-bold text-gray-800 line-clamp-1">{p.name}</span>
                              <span className="text-[9px] font-bold text-gray-400 font-mono block">ID: {p.id}</span>
                            </div>
                          </td>
                          <td className="py-2.5 text-center">
                            <div className="flex flex-col">
                              <span className="bg-[#F5F2ED] text-gray-600 text-[10px] px-2 py-0.5 rounded-full font-bold border inline-block mx-auto">
                                {p.category === 'men_swim_shorts' ? 'Shorts Homme' : p.category === 'women_beachwear' ? 'Robe Plage' : p.category === 'women_pareo' ? 'Paréo' : p.category === 'women_soiree' ? 'Haut Soirée' : 'Maillot Femme'}
                              </span>
                            </div>
                          </td>
                          <td className="py-2 text-center font-mono font-bold text-gray-800">{p.price.toLocaleString()} DA</td>
                          <td className="py-2 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-black border ${
                              p.stock === 0 ? 'bg-red-50 text-red-600 border-red-100' :
                              p.stock <= 5 ? 'bg-orange-50 text-orange-500 border-orange-100 animate-pulse' :
                              'bg-emerald-50 text-emerald-700 border-emerald-100'
                            }`}>
                              {p.stock} pcs
                            </span>
                          </td>
                          <td className="py-2 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => triggerEditProduct(p)}
                                className="p-1.5 bg-gray-100 hover:bg-[#FF7F50]/10 text-gray-500 hover:text-[#FF7F50] rounded-lg transition-colors cursor-pointer"
                                title="Modifier la fiche"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id)}
                                className="p-1.5 bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                                title="Supprimer complètement"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* PANEL 3: ORDER PROCESSING */}
          {subTab === 'orders' && (
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-150 shadow-sm space-y-6 animate-fade-in" id="panel-orders-processing text-left">
              <div className="text-left">
                <h3 className="font-serif font-black text-lg text-gray-800 uppercase">Traitement des commandes</h3>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-2xl border">
                  <span className="text-sm font-bold text-gray-500">Aucune commande enregistrée pour le moment.</span>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((ord) => (
                    <div 
                      key={ord.id} 
                      className="p-6 md:p-8 bg-[#F5F2ED]/80 rounded-3xl border border-gray-200 hover:border-[#FF7F50] transition-colors text-left space-y-5"
                    >
                      {/* Header and Status */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200/50 pb-4">
                        <div className="text-left">
                          <span className="font-mono text-base font-black text-gray-800 flex items-center gap-1.5">
                            Réf Commande : <strong className="text-[#FF7F50]">{sequentialNumberMap[ord.id] || 1}</strong>
                          </span>
                          <span className="text-[10px] text-gray-400 block font-mono mt-0.5">
                            Enregistrée le : {new Date(ord.createdAt).toLocaleDateString()} à {new Date(ord.createdAt).toLocaleTimeString()}
                          </span>
                        </div>

                        {/* Status selector select box */}
                        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
                          <span className="text-xs font-black text-gray-400 uppercase font-mono">Statut :</span>
                          <select
                            value={ord.status}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as any)}
                            className="bg-white text-gray-800 border border-gray-200 text-[11px] sm:text-xs font-black tracking-wider uppercase rounded-xl py-1.5 pl-2.5 pr-7 focus:outline-none cursor-pointer max-w-[170px] xs:max-w-[210px] sm:max-w-none truncate"
                          >
                            <option value="Nouveau">Nouveau (En attente)</option>
                            <option value="Confirmé">Confirmé</option>
                            <option value="En livraison">En livraison</option>
                            <option value="Livré">Livré</option>
                            <option value="Annulé">Annulé</option>
                          </select>
                        </div>
                      </div>

                      {/* Unified Client & Order Details under one template, with no internal cards */}
                      <div className="space-y-3.5 text-xs sm:text-sm">
                        
                        <div className="grid grid-cols-[110px_1fr] items-baseline">
                          <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs">Client :</span>
                          <span className="text-gray-900 font-serif font-black">{ord.customerName}</span>
                        </div>

                        <div className="grid grid-cols-[110px_1fr] items-baseline">
                          <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs">Téléphone :</span>
                          <span className="text-gray-900 font-mono font-bold tracking-wide">{ord.phone}</span>
                        </div>

                        <div className="grid grid-cols-[110px_1fr] items-baseline">
                          <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs">Wilaya :</span>
                          <span className="text-gray-800 font-semibold uppercase">
                            {ord.wilaya} {ord.wilaya_code && `(Code: ${ord.wilaya_code})`}
                          </span>
                        </div>

                        <div className="grid grid-cols-[110px_1fr] items-baseline">
                          <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs">Commune :</span>
                          <span className="text-gray-800 font-semibold uppercase">{ord.commune_name || ord.commune}</span>
                        </div>

                        <div className="grid grid-cols-[110px_1fr] items-baseline">
                          <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs">Livraison :</span>
                          <span className="text-gray-800 font-black uppercase text-[#FF7F50]">
                            {ord.deliveryType || "Domicile"} ({ord.delivery_type || (ord.deliveryType === 'Stop Desk' ? 'bureau' : 'à domicile')})
                          </span>
                        </div>

                        <div className="grid grid-cols-[110px_1fr] items-baseline">
                          <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs">Frais :</span>
                          <span className="font-mono font-bold text-gray-800">
                            {ord.delivery_price !== undefined ? `${ord.delivery_price.toLocaleString()} DA` : (ord.deliveryFee !== undefined ? `${ord.deliveryFee.toLocaleString()} DA` : "0 DA")}
                          </span>
                        </div>

                        {/* Database Fields Audit Trail */}
                        <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/60 my-2 space-y-1.5 font-mono text-[11px] leading-relaxed text-gray-650">
                          <div className="text-[9px] font-black uppercase tracking-widest text-neutral-400 border-b pb-1 border-neutral-200 mb-1">
                            Données Base de Données (Firebase)
                          </div>
                          <div>
                            <span className="font-bold text-neutral-500">wilaya_code:</span> <span className="text-[#1A1A2E] font-bold">"{ord.wilaya_code || ord.wilaya?.split(' - ')[0] || ''}"</span>
                          </div>
                          <div>
                            <span className="font-bold text-neutral-500">wilaya_name:</span> <span className="text-[#1A1A2E] font-bold">"{ord.wilaya_name || (ord.wilaya?.includes(' - ') ? ord.wilaya.split(' - ')[1] : ord.wilaya) || ''}"</span>
                          </div>
                          <div>
                            <span className="font-bold text-neutral-500">commune_name:</span> <span className="text-[#1A1A2E] font-bold">"{ord.commune_name || ord.commune || ''}"</span>
                          </div>
                          <div>
                            <span className="font-bold text-neutral-500">delivery_type:</span> <span className="text-[#1A1A2E] font-bold">"{ord.delivery_type || (ord.deliveryType === 'Stop Desk' ? 'bureau' : 'à domicile')}"</span>
                          </div>
                          <div>
                            <span className="font-bold text-neutral-500">delivery_price:</span> <span className="text-[#FF7F50] font-bold">{ord.delivery_price !== undefined ? ord.delivery_price : (ord.deliveryFee || 0)}</span>
                          </div>
                          <div>
                            <span className="font-bold text-neutral-500">total:</span> <span className="text-[#FF7F50] font-bold">{ord.total !== undefined ? ord.total : (ord.totalPrice || 0)}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-[110px_1fr] items-baseline">
                          <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs">Produit :</span>
                          <span className="text-gray-900 font-sans font-extrabold">{ord.productName}</span>
                        </div>

                        <div className="grid grid-cols-[110px_1fr] items-baseline">
                          <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs">Taille :</span>
                          <span className="text-gray-800 font-black font-mono">{ord.size}</span>
                        </div>

                        <div className="grid grid-cols-[110px_1fr] items-baseline">
                          <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs">Quantité :</span>
                          <span className="text-gray-800 font-bold font-mono">{ord.quantity}</span>
                        </div>

                        <div className="grid grid-cols-[110px_1fr] items-center pt-3 border-t border-gray-200/50">
                          <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs">Total à payer :</span>
                          <span className="text-base sm:text-lg font-mono font-black text-[#FF7F50]">
                            {ord.totalPrice !== undefined ? ord.totalPrice.toLocaleString() : (ord.priceDA * ord.quantity).toLocaleString()} DA
                          </span>
                        </div>

                      </div>

                      {/* Delete Button Area with Premium Confirmation */}
                      <div className="pt-4 border-t border-gray-200/50">
                        {orderIdToConfirmDelete === ord.id ? (
                          <div className="w-full bg-red-50/85 p-4 rounded-2xl border border-red-100 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
                            <span className="text-xs sm:text-sm font-bold text-red-700 font-sans">
                              Voulez-vous vraiment supprimer cette commande ?
                            </span>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => setOrderIdToConfirmDelete(null)}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-750 text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                              >
                                Annuler
                              </button>
                              <button
                                onClick={() => {
                                  const filtered = orders.filter((o) => o.id !== ord.id);
                                  onUpdateOrders(filtered);
                                  setOrderIdToConfirmDelete(null);
                                  triggerSuccess('Commande supprimée avec succès.');
                                }}
                                className="px-4 py-2 bg-red-600 hover:bg-red-750 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                              >
                                Supprimer
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full flex justify-end">
                            <button
                              onClick={() => setOrderIdToConfirmDelete(ord.id)}
                              className="flex items-center gap-1.5 px-4 py-2 text-xs font-black tracking-widest uppercase rounded-xl text-red-600 hover:text-white border border-red-200 hover:bg-red-600 hover:border-red-600 transition-all cursor-pointer shadow-xs"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Supprimer</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PANEL 4: INVENTORY MONITORING */}
          {subTab === 'inventory' && (
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-150 shadow-sm space-y-6 animate-fade-in" id="panel-inventory-monitor">
              <div className="text-left pb-4 border-b">
                <span className="text-xs font-mono font-black text-[#FF7F50] tracking-widest uppercase block mb-1">État des Stocks en temps Réel</span>
                <h3 className="font-serif font-black text-lg text-gray-800 uppercase">Alerte Stocks critiques</h3>
              </div>

              {/* Grid with warning metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                
                {/* Low stock alerts panel list */}
                <div className="bg-white p-5 rounded-2xl border space-y-4 text-left">
                  <div className="border-b pb-2 flex items-center justify-between text-orange-600">
                    <span className="text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
                      <AlertTriangle className="h-4.5 w-4.5 animate-bounce" /> Alertes (Stock critique &le; 5)
                    </span>
                    <span className="bg-orange-50 px-2 py-0.5 rounded font-mono font-black text-xs border border-orange-100">{analytics.lowStock} Articles</span>
                  </div>
                  
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                    {products.filter((p) => p.stock <= 5).map((p) => (
                      <div key={p.id} className="flex gap-3 bg-orange-50/50 p-3 rounded-xl border border-orange-100">
                        <div className="h-10 w-8 bg-white shrink-0 rounded overflow-hidden border">
                          <img src={p.images[0]} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex-1 text-left space-y-0.5">
                          <h4 className="font-serif text-xs font-black text-gray-800 line-clamp-1">{p.name}</h4>
                          <span className="text-[9px] font-bold text-gray-400 tracking-wider block uppercase">{p.category === 'men_swim_shorts' ? 'Shorts Homme' : p.category === 'women_beachwear' ? 'Robe Plage' : p.category === 'women_pareo' ? 'Paréo' : p.category === 'women_soiree' ? 'Haut Soirée' : 'Maillots Femme'}</span>
                        </div>
                        <div className="text-right flex flex-col justify-center">
                          <span className="font-mono text-xs font-black text-red-600 bg-red-100/60 px-2 py-1 rounded select-none uppercase">
                            {p.stock === 0 ? 'RUPTURE' : `${p.stock} RESTANTS`}
                          </span>
                        </div>
                      </div>
                    ))}
                    {products.filter((p) => p.stock <= 5).length === 0 && (
                      <div className="text-center py-6 text-xs text-gray-400">🎉 Tous les articles du catalogue sont bien approvisionnés.</div>
                    )}
                  </div>
                </div>

                {/* All stocks tracking updater card */}
                <div className="bg-white p-5 rounded-2xl border space-y-4 text-left">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-gray-400 uppercase border-b pb-2 block">Mise à jour rapide des quantités</span>
                  
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                    {products.map((p) => (
                      <div key={p.id} className="flex items-center justify-between gap-3 p-2 bg-gray-50/60 rounded-xl border border-gray-100">
                        <div className="flex-1 text-left min-w-0">
                          <span className="font-serif font-bold text-xs text-gray-800 block line-clamp-1">{p.name}</span>
                          <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">{p.category === 'men_swim_shorts' ? 'Shorts' : p.category === 'women_beachwear' ? 'Robe' : p.category === 'women_pareo' ? 'Paréo' : p.category === 'women_soiree' ? 'Haut Soirée' : 'Maillot'}</span>
                        </div>

                        {/* Adjust Stocks Quick counters */}
                        <div className="flex items-center justify-end gap-3 shrink-0">
                          <div className="flex items-center border bg-white rounded-lg overflow-hidden shrink-0">
                            <button
                              onClick={() => {
                                if (p.stock > 0) {
                                  const updated = products.map((x) => x.id === p.id ? { ...x, stock: x.stock - 1 } : x);
                                  onUpdateProducts(updated);
                                }
                              }}
                              className="px-2 py-1 text-gray-400 hover:text-gray-900 text-xs font-bold cursor-pointer"
                            >
                              -
                            </button>
                            <span className="px-2.5 text-xs font-black font-mono text-gray-700 min-w-6 text-center">{p.stock}</span>
                            <button
                              onClick={() => {
                                const updated = products.map((x) => x.id === p.id ? { ...x, stock: x.stock + 1 } : x);
                                onUpdateProducts(updated);
                              }}
                              className="px-2 py-1 text-gray-400 hover:text-gray-950 text-xs font-bold cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. DIALOG PRODUCT MODAL */}
          {isProductModalOpen && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 shadow-2xl flex items-center justify-center p-4 animate-fade-in">
              <div className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden border border-[#E6DFD0]/30 shadow-2xl text-left">
                {/* Modal Header */}
                <div className="p-6 bg-gray-50 border-b flex items-center justify-between">
                  <h3 className="font-serif font-black text-lg text-gray-800 uppercase">
                    {editingProduct ? 'Modifier la fiche produit' : 'Ajouter un nouvel article'}
                  </h3>
                  <button 
                    onClick={() => setIsProductModalOpen(false)}
                    className="p-1.5 text-gray-400 hover:text-gray-850 rounded-full hover:bg-gray-150 cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Form fields */}
                <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
                  
                  {/* Grid 1 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Nom de l'article</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Breeze Premium Shorts"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        className="w-full bg-[#F5F2ED]/30 border rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-[#FF7F50]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Prix (DA)</label>
                        <input
                          type="number"
                          required
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                          className="w-full bg-[#F5F2ED]/30 border rounded-xl px-3 py-2.5 text-xs font-mono font-bold focus:outline-[#FF7F50]"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Stock initial</label>
                        <input
                          type="number"
                          required
                          value={productForm.stock}
                          onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                          className="w-full bg-[#F5F2ED]/30 border rounded-xl px-3 py-2.5 text-xs font-mono font-bold focus:outline-[#FF7F50]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Grid 2 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Catégorie</label>
                      <select
                        value={productForm.category}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                        className="w-full bg-[#F5F2ED]/30 border rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-[#FF7F50]"
                      >
                        <option value="men_swim_shorts">Short de bain premium (Homme)</option>
                        <option value="women_one_piece">Maillot 1 pièce premium (Femme)</option>
                        <option value="women_two_piece">Maillot 2 pièces premium (Femme)</option>
                        <option value="women_beachwear">Robe de plage premium (Femme)</option>
                        <option value="women_pareo">Paréo premium (Femme)</option>
                        <option value="women_soiree">Haut de soirée premium (Femme)</option>
                      </select>
                    </div>

                    <div className="flex gap-4 items-center pt-5">
                      <label className="flex items-center gap-1.5 text-xs font-extrabold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={productForm.isMen}
                          onChange={(e) => setProductForm({ ...productForm, isMen: e.target.checked })}
                          className="rounded text-[#FF7F50] focus:ring-[#FF7F50]"
                        />
                        <span>Collection Hommes</span>
                      </label>
                      <label className="flex items-center gap-1.5 text-xs font-extrabold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={productForm.isWomen}
                          onChange={(e) => setProductForm({ ...productForm, isWomen: e.target.checked })}
                          className="rounded text-[#FF7F50] focus:ring-[#FF7F50]"
                        />
                        <span>Collection Femmes</span>
                      </label>
                    </div>
                  </div>

                  {/* Textarea Description */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Description</label>
                    <textarea
                      required
                      placeholder="Saisissez une description premium..."
                      rows={3}
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      className="w-full bg-[#F5F2ED]/30 border rounded-2xl p-3 text-xs focus:outline-[#FF7F50] resize-none"
                    />
                  </div>

                  {/* Input Split Values */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Url des images (séparées par des virgules)</label>
                      <input
                        type="text"
                        placeholder="Ex: url1, url2"
                        value={productForm.imagesStr}
                        onChange={(e) => setProductForm({ ...productForm, imagesStr: e.target.value })}
                        className="w-full bg-[#F5F2ED]/30 border rounded-xl px-3 py-2.5 text-xs focus:outline-[#FF7F50]"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Tailles proposées (séparées par des virgules)</label>
                      <input
                        type="text"
                        placeholder="Ex: S, M, L, XL"
                        value={productForm.sizesStr}
                        onChange={(e) => setProductForm({ ...productForm, sizesStr: e.target.value })}
                        className="w-full bg-[#F5F2ED]/30 border rounded-xl px-3 py-2.5 text-xs focus:outline-[#FF7F50]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Couleurs / Modèles (Format: Nom:#CodeCouleur, séparés par des virgules)</label>
                    <input
                      type="text"
                      placeholder="Ex: Arena Coral:#FF7F50, Ocean Turquoise:#40E0D0"
                      value={productForm.colorsStr}
                      onChange={(e) => setProductForm({ ...productForm, colorsStr: e.target.value })}
                      className="w-full bg-[#F5F2ED]/30 border rounded-xl px-3 py-2.5 text-xs focus:outline-[#FF7F50]"
                    />
                  </div>

                  {/* Modal Footer actions */}
                  <div className="flex gap-3 justify-end pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => setIsProductModalOpen(false)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-5 rounded-xl font-bold text-xs uppercase cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="bg-[#1A1A2E] hover:bg-[#FF7F50] text-white py-2.5 px-6 rounded-xl font-bold text-xs uppercase cursor-pointer"
                    >
                      Enregistrer
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
