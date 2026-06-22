/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import CatalogView from './components/CatalogView';
import ContactView from './components/ContactView';
import AdminPanel from './components/AdminPanel';
import CartDrawer from './components/CartDrawer';
import ProductPage from './components/ProductPage';

import { Product, CartItem, Order, CampaignSettings } from './types';
import { 
  getStoredProducts, saveStoredProducts, 
  getStoredOrders, saveStoredOrders, 
  getStoredCampaign, saveStoredCampaign,
  getCleanWilayaName
} from './data';

export default function App() {
  // Navigation Routing Tab State - Includes 'product' for the standalone view
  const [currentTab, setCurrentTab] = useState<'home' | 'hommes' | 'femmes' | 'contact' | 'admin' | 'product'>('home');
  const [prevTab, setPrevTab] = useState<'home' | 'hommes' | 'femmes' | 'contact'>('home');

  // Translation State - Defaults to French (FR) as requested
  const [language, setLanguage] = useState<'FR' | 'EN'>('FR');

  // Persistence States
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [campaign, setCampaign] = useState<CampaignSettings>({
    subtitle: '',
    promoBanner: '',
    discountCode: ''
  });

  // Shopping Cart & Overlays States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // 1. Initial State Seed Loading on Component Mount
  useEffect(() => {
    setProducts(getStoredProducts());
    setOrders(getStoredOrders());
    setCampaign(getStoredCampaign());

    // Load Cart from localStorage if any
    const savedCart = localStorage.getItem('arena_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (err) {
        console.error("Failed loading saved cart:", err);
      }
    }
  }, []);

  // 2. Synchronize Shopping Cart changes to localStorage
  useEffect(() => {
    localStorage.setItem('arena_cart', JSON.stringify(cart));
  }, [cart]);

  // 3. Smooth page tab scroll adjustments
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Trigger Meta Pixel PageView on page changes
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'PageView');
    }
    console.log("Meta Pixel PageView fired for tab: " + currentTab);
  }, [currentTab]);

  // --- CORE SHOPPING CARD & ACTIONS HANDLERS ---

  const handleAddToCart = (
    product: Product,
    size: string,
    color: { name: string; class: string }
  ) => {
    const itemUniqueId = `${product.id}-${size}-${color.name.replace(/\s+/g, '')}`;

    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex((item) => item.id === itemUniqueId);

      if (existingIdx > -1) {
        // Increment quantity limit checks
        const updated = [...prevCart];
        const newQty = updated[existingIdx].quantity + 1;
        
        if (newQty <= product.stock) {
          updated[existingIdx].quantity = newQty;
        }
        return updated;
      } else {
        // Appends new cart item row
        const newItem: CartItem = {
          id: itemUniqueId,
          product,
          quantity: 1,
          selectedSize: size,
          selectedColor: color,
        };
        return [...prevCart, newItem];
      }
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === id);
      if (!existing) return prevCart;

      const newQty = existing.quantity + delta;
      
      // Stock limits
      if (newQty < 1 || newQty > existing.product.stock) {
        return prevCart;
      }

      return prevCart.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: newQty };
        }
        return item;
      });
    });
  };

  const handleRemoveItem = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Place order for each item in the cart (individual tracking)
  const handlePlaceOrder = (customerInfo: { 
    name: string; 
    phone: string; 
    wilaya: string; 
    commune: string;
    deliveryType: 'Stop Desk' | 'Domicile';
    deliveryFee: number;
    productPrice: number;
    totalPrice: number;
  }) => {
    const newOrders: Order[] = cart.map((item) => {
      const randomIdNumber = Math.floor(1000 + Math.random() * 9000);
      const orderId = `AM-${randomIdNumber}`;
      return {
        id: orderId,
        createdAt: new Date().toISOString(),
        customerName: customerInfo.name,
        phone: customerInfo.phone,
        wilaya: customerInfo.wilaya,
        commune: customerInfo.commune,
        productId: item.product.id,
        productName: item.product.name,
        category: item.product.category === 'men_swim_shorts' ? 'Shorts de bain premium' : 'Maillots de bain premium',
        size: item.selectedSize,
        colorOrModel: item.selectedColor.name,
        quantity: item.quantity,
        priceDA: item.product.price,
        status: 'Nouveau' as const,
        deliveryType: customerInfo.deliveryType,
        deliveryFee: customerInfo.deliveryFee,
        productPrice: item.product.price * item.quantity,
        totalPrice: (item.product.price * item.quantity) + customerInfo.deliveryFee,

        // Firebase structured parameters
        wilaya_code: customerInfo.wilaya ? customerInfo.wilaya.split(' - ')[0] : '',
        wilaya_name: getCleanWilayaName(customerInfo.wilaya),
        commune_name: customerInfo.commune,
        delivery_type: customerInfo.deliveryType === 'Stop Desk' ? 'bureau' : 'à domicile',
        delivery_price: customerInfo.deliveryFee,
        total: (item.product.price * item.quantity) + customerInfo.deliveryFee
      };
    });

    // Deduct products stock levels
    const updatedProducts = products.map((prod) => {
      const itemsBought = cart.filter((ci) => ci.product.id === prod.id);
      if (itemsBought.length > 0) {
        const totalQtyDeducted = itemsBought.reduce((sum, item) => sum + item.quantity, 0);
        return {
          ...prod,
          stock: Math.max(0, prod.stock - totalQtyDeducted)
        };
      }
      return prod;
    });

    setProducts(updatedProducts);
    saveStoredProducts(updatedProducts);

    const updatedOrders = [...newOrders, ...orders];
    setOrders(updatedOrders);
    saveStoredOrders(updatedOrders);

    // Reset shopping bag
    setCart([]);
  };

  // Place a single direct order from the standalone product detail page
  const handlePlaceDirectOrder = (orderData: {
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
  }) => {
    const randomIdNumber = Math.floor(1000 + Math.random() * 9000);
    const orderId = `AM-${randomIdNumber}`;

    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customerName: orderData.customerName,
      phone: orderData.phone,
      wilaya: orderData.wilaya,
      commune: orderData.commune,
      productId: orderData.productId,
      productName: orderData.productName,
      category: orderData.category,
      size: orderData.size,
      colorOrModel: orderData.colorOrModel,
      quantity: orderData.quantity,
      priceDA: orderData.priceDA,
      status: 'Nouveau',
      deliveryType: orderData.deliveryType,
      deliveryFee: orderData.deliveryFee,
      productPrice: orderData.productPrice,
      totalPrice: orderData.totalPrice,

      // Firebase structured parameters
      wilaya_code: orderData.wilaya ? orderData.wilaya.split(' - ')[0] : '',
      wilaya_name: getCleanWilayaName(orderData.wilaya),
      commune_name: orderData.commune,
      delivery_type: orderData.deliveryType === 'Stop Desk' ? 'bureau' : 'à domicile',
      delivery_price: orderData.deliveryFee,
      total: orderData.totalPrice
    };

    // Deduct stock for that product
    const updatedProducts = products.map((prod) => {
      if (prod.id === orderData.productId) {
        return {
          ...prod,
          stock: Math.max(0, prod.stock - orderData.quantity)
        };
      }
      return prod;
    });

    setProducts(updatedProducts);
    saveStoredProducts(updatedProducts);

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    saveStoredOrders(updatedOrders);
  };

  const handleSelectProduct = (product: Product) => {
    if (currentTab !== 'product') {
      setPrevTab(currentTab as any);
    }
    setSelectedProduct(product);
    setCurrentTab('product');
  };

  // --- ADMIN UPDATE CALLBACKS ---

  const handleUpdateProducts = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    saveStoredProducts(updatedProducts);
  };

  const handleUpdateOrders = (updatedOrders: Order[]) => {
    setOrders(updatedOrders);
    saveStoredOrders(updatedOrders);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F2ED] overflow-x-hidden w-full">
      {/* 1. STICKY BRAND HEADER */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab as any}
        cart={cart}
        setIsCartOpen={setIsCartOpen}
        campaignText="ARENA MODE — TON ÉTÉ, TON PRIME"
        language={language}
        setLanguage={setLanguage}
      />

      {/* 2. DYNAMIC MAIN ROUTE RENDERING */}
      <main className="flex-grow">
        {currentTab === 'home' && (
          <HomeView
            setCurrentTab={setCurrentTab as any}
            products={products}
            onSelect={handleSelectProduct}
            campaignSubtitle={
              language === 'FR'
                ? "Découvrez les plus beaux maillots de bain de marque et shorts de bain premium."
                : "Explore our premium swimwear & branded swim shorts curated for comfort."
            }
            language={language}
          />
        )}

        {(currentTab === 'hommes' || currentTab === 'femmes') && (
          <CatalogView
            isMen={currentTab === 'hommes'}
            products={products}
            onSelect={handleSelectProduct}
            onAddToCart={handleAddToCart}
          />
        )}

        {currentTab === 'product' && selectedProduct && (
          <ProductPage
            product={selectedProduct}
            onGoBack={() => setCurrentTab(prevTab)}
            onPlaceDirectOrder={handlePlaceDirectOrder}
            onAddToCart={handleAddToCart}
          />
        )}

        {currentTab === 'contact' && (
          <ContactView />
        )}

        {currentTab === 'admin' && (
          <AdminPanel
            products={products}
            orders={orders}
            onUpdateProducts={handleUpdateProducts}
            onUpdateOrders={handleUpdateOrders}
          />
        )}
      </main>

      {/* 3. FOOTER SIGNBOARD */}
      <Footer setCurrentTab={setCurrentTab as any} language={language} />

      {/* 4. OVERLAYS PANEL & DRAWERS */}
      
      {/* Sliding shopping bag drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onPlaceOrder={handlePlaceOrder}
      />
    </div>
  );
}
