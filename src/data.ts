/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Order } from './types';
import { WOMEN_SWIMWEAR_RAW } from './swimwear_data';

const MEN_PRODUCTS: Product[] = [
  {
    id: 'men-1',
    name: 'Short Burberry Navy',
    category: 'men_swim_shorts',
    price: 5900,
    description: 'Short de bain premium pour homme, sélectionné pour l’été.',
    images: ['https://i.ibb.co/278Q2DPC/IMG-0799.jpg'],
    image: 'https://i.ibb.co/278Q2DPC/IMG-0799.jpg',
    gender: 'hommes',
    displayCategory: 'Shorts de bain homme',
    productType: 'Short de bain',
    currency: 'DA',
    rating: 4.8,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Modèle Plaid', class: 'bg-[#E6DFD0]' }
    ],
    stock: 20,
    isMen: true,
    isWomen: false,
    featured: true,
    inNewArrivals: true
  },
  {
    id: 'men-2',
    name: 'Short Casa Blanca',
    category: 'men_swim_shorts',
    price: 5900,
    description: 'Short de bain premium pour homme, sélectionné pour l’été.',
    images: ['https://i.ibb.co/8g0KkztF/IMG-0798.jpg'],
    image: 'https://i.ibb.co/8g0KkztF/IMG-0798.jpg',
    gender: 'hommes',
    displayCategory: 'Shorts de bain homme',
    productType: 'Short de bain',
    currency: 'DA',
    rating: 4.9,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Modèle Navy', class: 'bg-[#1A1A2E]' }
    ],
    stock: 15,
    isMen: true,
    isWomen: false,
    featured: true,
    inNewArrivals: true
  },
  {
    id: 'men-3',
    name: 'Short Burberry',
    category: 'men_swim_shorts',
    price: 5900,
    description: 'Short de bain premium pour homme, sélectionné pour l’été.',
    images: ['https://i.ibb.co/ZRRwrfTQ/IMG-0797.jpg'],
    image: 'https://i.ibb.co/ZRRwrfTQ/IMG-0797.jpg',
    gender: 'hommes',
    displayCategory: 'Shorts de bain homme',
    productType: 'Short de bain',
    currency: 'DA',
    rating: 4.7,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Modèle Green', class: 'bg-[#40E0D0]' }
    ],
    stock: 25,
    isMen: true,
    isWomen: false,
    featured: true,
    inNewArrivals: true
  },
  {
    id: 'men-4',
    name: 'Short Fendi',
    category: 'men_swim_shorts',
    price: 5900,
    description: 'Short de bain premium pour homme, sélectionné pour l’été.',
    images: ['https://i.ibb.co/LXNnBq47/IMG-0796.jpg'],
    image: 'https://i.ibb.co/LXNnBq47/IMG-0796.jpg',
    gender: 'hommes',
    displayCategory: 'Shorts de bain homme',
    productType: 'Short de bain',
    currency: 'DA',
    rating: 4.8,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Modèle White', class: 'bg-[#FFFFFF] border' }
    ],
    stock: 12,
    isMen: true,
    isWomen: false,
    featured: true,
    inNewArrivals: true
  },
  {
    id: 'men-5',
    name: 'Short Gucci',
    category: 'men_swim_shorts',
    price: 5900,
    description: 'Short de bain premium pour homme, sélectionné pour l’été.',
    images: ['https://i.ibb.co/C5MJVJx1/IMG-0795.jpg'],
    image: 'https://i.ibb.co/C5MJVJx1/IMG-0795.jpg',
    gender: 'hommes',
    displayCategory: 'Shorts de bain homme',
    productType: 'Short de bain',
    currency: 'DA',
    rating: 4.6,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Modèle Black', class: 'bg-[#1A1A2E]' }
    ],
    stock: 18,
    isMen: true,
    isWomen: false,
    featured: true,
    inNewArrivals: true
  }
];

function detectBrand(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('burberry')) return 'Burberry';
  if (n.includes('fendi')) return 'Fendi';
  if (n.includes('gucci')) return 'Gucci';
  if (n.includes('casa blanca') || n.includes('casablanca')) return 'Casa Blanca';
  if (n.includes('chanel')) return 'Chanel';
  if (n.includes('dior')) return 'Christian Dior';
  return 'Other';
}

const WOMEN_PRODUCTS: Product[] = WOMEN_SWIMWEAR_RAW.map((p, index) => {
  const isOnePiece = p[0].includes("Maillot Une Pièce");
  return {
    id: `women-${index + 1}`,
    name: p[0],
    category: isOnePiece ? 'women_one_piece' : 'women_two_piece',
    price: 5900,
    description: `Maillot de bain premium sélectionné pour l’été. Modèle ${p[0]}, conçu pour associer un confort d’exception et un style hautement élégant.`,
    images: [p[1]],
    image: p[1],
    gender: 'femmes',
    displayCategory: 'Maillots de bain femmes',
    productType: isOnePiece ? 'Maillot une pièce' : 'Bikini',
    currency: 'DA',
    rating: +(4.5 + (index * 0.07) % 0.5).toFixed(1),
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: p[2], class: p[3] }
    ],
    stock: 12 + (index % 4) * 6,
    isMen: false,
    isWomen: true,
    featured: index % 6 === 0,
    inNewArrivals: index % 5 === 0,
    brand: detectBrand(p[0])
  };
});

export const INITIAL_PRODUCTS: Product[] = [
  ...MEN_PRODUCTS.map(p => ({ ...p, brand: detectBrand(p.name) })),
  ...WOMEN_PRODUCTS
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'AM-4029',
    createdAt: '2026-06-05T14:22:00Z',
    customerName: 'Samy Bouras',
    phone: '0552360078',
    wilaya: '16 - Alger',
    commune: 'Dar El Beida',
    productId: 'men-1',
    productName: 'Short Burberry Navy',
    category: 'Shorts de bain premium',
    size: 'M',
    colorOrModel: 'Modèle Plaid',
    quantity: 1,
    priceDA: 5900,
    status: 'Nouveau'
  }
];

// Helper methods to get or save from localStorage
export const getStoredProducts = (): Product[] => {
  const data = localStorage.getItem('arena_products');
  if (!data) {
    localStorage.setItem('arena_products', JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }
  // Make sure to parse and check if the prices or items are older format and update them
  let parsed: Product[] = JSON.parse(data);
  const first = parsed[0];
  if (!first || first.price < 500 || parsed.length !== INITIAL_PRODUCTS.length || first.id !== 'men-1' || parsed[0]?.name !== 'Short Burberry Navy') {
    // Stale or outdated product list detected, clear storage so new beautiful DA catalog is loaded!
    localStorage.setItem('arena_products', JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }

  // Migrate any legacy women's products still priced at 6900 DA in local storage to 5900 DA
  let dirty = false;
  parsed = parsed.map(p => {
    if (p.isWomen && p.price === 6900) {
      dirty = true;
      return { ...p, price: 5900 };
    }
    return p;
  });
  if (dirty) {
    localStorage.setItem('arena_products', JSON.stringify(parsed));
  }

  return parsed;
};

export const saveStoredProducts = (products: Product[]) => {
  localStorage.setItem('arena_products', JSON.stringify(products));
};

export const getStoredOrders = (): Order[] => {
  const data = localStorage.getItem('arena_orders');
  if (!data) {
    localStorage.setItem('arena_orders', JSON.stringify(INITIAL_ORDERS));
    return INITIAL_ORDERS;
  }
  const parsed = JSON.parse(data);
  // Re-seed if order format is outdated (Euro orders didn't have phone, etc)
  const first = parsed[0];
  if (first && !first.phone) {
    localStorage.setItem('arena_orders', JSON.stringify(INITIAL_ORDERS));
    return INITIAL_ORDERS;
  }
  return parsed;
};

export const saveStoredOrders = (orders: Order[]) => {
  localStorage.setItem('arena_orders', JSON.stringify(orders));
};

// Campaign and banner settings
export interface CampaignSettings {
  subtitle: string;
  promoBanner: string;
  discountCode: string;
}

export const getStoredCampaign = (): CampaignSettings => {
  const defaultCampaign: CampaignSettings = {
    subtitle: 'Shorts de bain premium et maillots de bain de marque.',
    promoBanner: '🏷️ Livraison rapide avec World Express. Paiement cash à la livraison !',
    discountCode: ''
  };
  const data = localStorage.getItem('arena_campaign');
  if (!data) {
    localStorage.setItem('arena_campaign', JSON.stringify(defaultCampaign));
    return defaultCampaign;
  }
  return JSON.parse(data);
};

export const saveStoredCampaign = (campaign: CampaignSettings) => {
  localStorage.setItem('arena_campaign', JSON.stringify(campaign));
};

export const worldExpressFees: Record<string, { desk: number | null; home: number | null }> = {
  "Adrar": { desk: 900, home: 1200 },
  "Chlef": { desk: 400, home: 700 },
  "Laghouat": { desk: 550, home: 900 },
  "Oum El Bouaghi": { desk: 450, home: 750 },
  "Batna": { desk: 450, home: 750 },
  "Béjaïa": { desk: 450, home: 750 },
  "Bejaia": { desk: 450, home: 750 },
  "Biskra": { desk: 550, home: 850 },
  "Béchar": { desk: 900, home: 1200 },
  "Bechar": { desk: 900, home: 1200 },
  "Blida": { desk: 400, home: 700 },
  "Bouira": { desk: 400, home: 700 },
  "Tamanrasset": { desk: 1100, home: 1600 },
  "Tébessa": { desk: 500, home: 800 },
  "Tebessa": { desk: 500, home: 800 },
  "Tlemcen": { desk: 450, home: 750 },
  "Tiaret": { desk: 450, home: 750 },
  "Tizi Ouzou": { desk: 400, home: 700 },
  "Alger": { desk: 400, home: 500 },
  "Djelfa": { desk: 500, home: 800 },
  "Jijel": { desk: 450, home: 750 },
  "Sétif": { desk: 400, home: 700 },
  "Setif": { desk: 400, home: 700 },
  "Saïda": { desk: 500, home: 800 },
  "Saida": { desk: 500, home: 800 },
  "Skikda": { desk: 450, home: 750 },
  "Sidi Bel Abbès": { desk: 450, home: 750 },
  "Sidi Bel Abbes": { desk: 450, home: 750 },
  "Annaba": { desk: 450, home: 750 },
  "Guelma": { desk: 500, home: 800 },
  "Constantine": { desk: 400, home: 700 },
  "Médéa": { desk: 400, home: 700 },
  "Medea": { desk: 400, home: 700 },
  "Mostaganem": { desk: 450, home: 750 },
  "M'Sila": { desk: 450, home: 750 },
  "Mascara": { desk: 500, home: 800 },
  "Ouargla": { desk: 700, home: 1000 },
  "Oran": { desk: 400, home: 700 },
  "El Bayadh": { desk: 700, home: 1000 },
  "Illizi": { desk: null, home: null },
  "Bordj Bou Arréridj": { desk: 400, home: 700 },
  "Bordj Bou Arreridj": { desk: 400, home: 700 },
  "Boumerdès": { desk: 400, home: 700 },
  "Boumerdes": { desk: 400, home: 700 },
  "El Tarf": { desk: 550, home: 850 },
  "Tindouf": { desk: null, home: null },
  "Tissemsilt": { desk: 450, home: 750 },
  "El Oued": { desk: 700, home: 1000 },
  "Khenchela": { desk: 500, home: 800 },
  "Souk Ahras": { desk: 500, home: 800 },
  "Tipaza": { desk: 400, home: 700 },
  "Mila": { desk: 450, home: 750 },
  "Aïn Defla": { desk: 400, home: 700 },
  "Ain Defla": { desk: 400, home: 700 },
  "Naâma": { desk: 700, home: 1000 },
  "Naama": { desk: 700, home: 1000 },
  "Aïn Témouchent": { desk: 500, home: 800 },
  "Ain Témouchent": { desk: 500, home: 800 },
  "Ghardaïa": { desk: 700, home: 1000 },
  "Ghardaia": { desk: 700, home: 1000 },
  "Relizane": { desk: 450, home: 750 },
  "El M'Ghair": { desk: null, home: 1000 },
  "Al-M'Ghair": { desk: null, home: 1000 },
  "El M'ghair": { desk: null, home: 1000 },
  "El Meniaa": { desk: null, home: 1100 },
  "Ouled Djellal": { desk: null, home: 900 },
  "Bordj Badji Mokhtar": { desk: null, home: null },
  "Bordj Baji Mokhtar": { desk: null, home: null },
  "Béni Abbès": { desk: null, home: 1200 },
  "Beni Abbès": { desk: null, home: 1200 },
  "In Salah": { desk: null, home: 1400 },
  "In Guezzam": { desk: null, home: 1800 },
  "Touggourt": { desk: null, home: 1100 },
  "Djanet": { desk: null, home: null },
  "Timimoun": { desk: null, home: 1200 },
};

export const getCleanWilayaName = (fullWilayaStr: string): string => {
  if (!fullWilayaStr) return "";
  const parts = fullWilayaStr.split(" - ");
  return (parts[parts.length - 1] || "").trim();
};

import algeriaCities from './data/algeria_cities.json';

export interface CityCommune {
  id: number;
  commune_name_ascii: string;
  commune_name: string;
  daira_name_ascii: string;
  daira_name: string;
  wilaya_code: string;
  wilaya_name_ascii: string;
  wilaya_name: string;
}

export const getAlgeriaCities = (): CityCommune[] => {
  return algeriaCities as CityCommune[];
};

export const getUniqueWilayas = (): string[] => {
  const map = new Map<string, string>();
  for (const c of (algeriaCities as CityCommune[])) {
    const key = `${c.wilaya_code} - ${c.wilaya_name_ascii}`;
    map.set(key, key);
  }
  return Array.from(map.values()).sort((a, b) => {
    const codeA = a.split(" - ")[0] || "";
    const codeB = b.split(" - ")[0] || "";
    return codeA.localeCompare(codeB);
  });
};

export const getCommunesForWilaya = (wilayaCode: string): string[] => {
  if (!wilayaCode) return [];
  const communes = (algeriaCities as CityCommune[])
    .filter(c => c.wilaya_code === wilayaCode)
    .map(c => c.commune_name_ascii);
  return Array.from(new Set(communes)).sort((a, b) => a.localeCompare(b));
};


