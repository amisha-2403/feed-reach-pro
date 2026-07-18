import {
  Wheat,
  Sprout,
  FlaskConical,
  Leaf,
  Apple,
  Stethoscope,
  Tractor,
  type LucideIcon,
} from "lucide-react";

export interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
  count: number;
  accent: string;
  image: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "animal-feed",
    name: "Animal Feed",
    icon: Wheat,
    count: 128,
    accent: "from-amber-100 to-amber-50",
    image:
      "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=600&auto=format&fit=crop&q=70",
  },
  {
    id: "seeds",
    name: "Seeds",
    icon: Sprout,
    count: 94,
    accent: "from-emerald-100 to-emerald-50",
    image:
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=70",
  },
  {
    id: "fertilizers",
    name: "Fertilizers",
    icon: FlaskConical,
    count: 67,
    accent: "from-lime-100 to-lime-50",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&auto=format&fit=crop&q=70",
  },
  {
    id: "farm-produce",
    name: "Farm Produce",
    icon: Apple,
    count: 212,
    accent: "from-rose-100 to-rose-50",
    image:
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=70",
  },
  {
    id: "organic",
    name: "Organic Products",
    icon: Leaf,
    count: 45,
    accent: "from-teal-100 to-teal-50",
    image:
      "https://images.unsplash.com/photo-1628689469838-524a4a973b8e?w=600&auto=format&fit=crop&q=70",
  },
  {
    id: "veterinary",
    name: "Veterinary Supplies",
    icon: Stethoscope,
    count: 38,
    accent: "from-sky-100 to-sky-50",
    image:
      "https://images.unsplash.com/photo-1584515933487-779824d29309?w=600&auto=format&fit=crop&q=70",
  },
  {
    id: "essentials",
    name: "Farming Essentials",
    icon: Tractor,
    count: 156,
    accent: "from-orange-100 to-orange-50",
    image:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&auto=format&fit=crop&q=70",
  },
];

export const CATEGORY_LOOKUP: Record<string, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
);

export const DISTRICTS: { name: string; villages: string[] }[] = [
  { name: "Nashik", villages: ["Nashik", "Sinnar", "Niphad", "Yeola"] },
  { name: "Pune", villages: ["Pune", "Baramati", "Junnar", "Indapur"] },
  { name: "Kolhapur", villages: ["Kolhapur", "Ichalkaranji", "Kagal"] },
  { name: "Solapur", villages: ["Solapur", "Pandharpur", "Barshi"] },
  { name: "Belgaum", villages: ["Belgaum", "Chikodi", "Bailhongal"] },
  { name: "Anand", villages: ["Anand", "Petlad", "Umreth"] },
  { name: "Aurangabad", villages: ["Aurangabad", "Paithan", "Sillod"] },
  { name: "Rampur", villages: ["Rampur", "Bilaspur", "Milak"] },
];

export const ALL_VILLAGES = DISTRICTS.flatMap((d) => d.villages);

export type SellerType = "Shop" | "Farmer" | "Cooperative";
export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";
export type DeliverySpeed = "same-day" | "next-day" | "2-3-days";

export interface Product {
  id: string;
  name: string;
  image: string;
  gallery: string[];
  price: number;
  originalPrice: number;
  brand?: string;
  seller: string;
  sellerId: string;
  sellerType: SellerType;
  village: string;
  district: string;
  verified: boolean;
  rating: number;
  reviews: number;
  deliveryAvailable: boolean;
  deliverySpeed: DeliverySpeed;
  category: string;
  stock: StockStatus;
  description: string;
  specs: { label: string; value: string }[];
  tags: ("trending" | "best-seller" | "new" | "top-rated" | "seasonal")[];
}

const gallery = (url: string) => [
  url,
  url.replace(/photo-\w+/, "photo-1500595046743-cd271d694d30"),
  url.replace(/photo-\w+/, "photo-1464226184884-fa280b87c399"),
];

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Premium Cattle Feed — 50kg",
    image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800&auto=format&fit=crop&q=70",
    gallery: gallery("https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800&auto=format&fit=crop&q=70"),
    price: 1150,
    originalPrice: 1400,
    brand: "Krishna Nutrition",
    seller: "Krishna Agro Store",
    sellerId: "s1",
    sellerType: "Shop",
    village: "Rampur",
    district: "Rampur",
    verified: true,
    rating: 4.7,
    reviews: 218,
    deliveryAvailable: true,
    deliverySpeed: "same-day",
    category: "animal-feed",
    stock: "in-stock",
    description:
      "High-protein cattle feed formulated for lactating cows and buffaloes. Balanced blend of grains, oilcake and mineral mix for improved milk yield.",
    specs: [
      { label: "Weight", value: "50 kg" },
      { label: "Protein", value: "22%" },
      { label: "Shelf Life", value: "6 months" },
      { label: "Suitable For", value: "Cattle, Buffalo" },
    ],
    tags: ["best-seller", "trending"],
  },
  {
    id: "p2",
    name: "Organic Wheat Seeds — 10kg",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=70",
    gallery: gallery("https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=70"),
    price: 480,
    originalPrice: 600,
    brand: "Anand Organics",
    seller: "Ramesh Patel",
    sellerId: "s2",
    sellerType: "Farmer",
    village: "Anand",
    district: "Anand",
    verified: true,
    rating: 4.9,
    reviews: 84,
    deliveryAvailable: true,
    deliverySpeed: "next-day",
    category: "seeds",
    stock: "in-stock",
    description:
      "Certified organic HD-2967 wheat seeds with 95%+ germination. Ideal for rabi sowing across northern and western India.",
    specs: [
      { label: "Variety", value: "HD-2967" },
      { label: "Germination", value: "95%+" },
      { label: "Weight", value: "10 kg" },
      { label: "Certification", value: "Jaivik Bharat" },
    ],
    tags: ["top-rated", "seasonal"],
  },
  {
    id: "p3",
    name: "Vermicompost Fertilizer — 25kg",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&auto=format&fit=crop&q=70",
    gallery: gallery("https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&auto=format&fit=crop&q=70"),
    price: 320,
    originalPrice: 400,
    brand: "GreenGrow",
    seller: "GreenGrow Cooperative",
    sellerId: "s3",
    sellerType: "Cooperative",
    village: "Nashik",
    district: "Nashik",
    verified: true,
    rating: 4.6,
    reviews: 142,
    deliveryAvailable: true,
    deliverySpeed: "same-day",
    category: "fertilizers",
    stock: "low-stock",
    description:
      "100% organic vermicompost enriched with earthworm castings. Improves soil structure, water retention and micronutrient availability.",
    specs: [
      { label: "Weight", value: "25 kg" },
      { label: "Type", value: "Organic" },
      { label: "NPK", value: "1.5-1-1" },
    ],
    tags: ["trending"],
  },
  {
    id: "p4",
    name: "Fresh Farm Tomatoes — 5kg",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=70",
    gallery: gallery("https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=70"),
    price: 140,
    originalPrice: 180,
    seller: "Suresh Yadav",
    sellerId: "s4",
    sellerType: "Farmer",
    village: "Belgaum",
    district: "Belgaum",
    verified: true,
    rating: 4.8,
    reviews: 56,
    deliveryAvailable: true,
    deliverySpeed: "same-day",
    category: "farm-produce",
    stock: "in-stock",
    description:
      "Vine-ripened tomatoes harvested this morning from Suresh's 3-acre farm. Naturally grown without chemical pesticides.",
    specs: [
      { label: "Weight", value: "5 kg" },
      { label: "Harvested", value: "Today" },
      { label: "Grown", value: "Naturally" },
    ],
    tags: ["new", "trending"],
  },
  {
    id: "p5",
    name: "Poultry Layer Feed — 40kg",
    image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&auto=format&fit=crop&q=70",
    gallery: gallery("https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&auto=format&fit=crop&q=70"),
    price: 980,
    originalPrice: 1150,
    brand: "PoultryPro",
    seller: "Village Feeds Depot",
    sellerId: "s5",
    sellerType: "Shop",
    village: "Solapur",
    district: "Solapur",
    verified: false,
    rating: 4.5,
    reviews: 173,
    deliveryAvailable: true,
    deliverySpeed: "next-day",
    category: "animal-feed",
    stock: "in-stock",
    description:
      "Complete layer feed to maximise egg production. Fortified with calcium, phosphorus and essential amino acids.",
    specs: [
      { label: "Weight", value: "40 kg" },
      { label: "Protein", value: "17%" },
      { label: "Calcium", value: "3.8%" },
    ],
    tags: ["best-seller"],
  },
  {
    id: "p6",
    name: "A2 Cow Ghee — 1L Jar",
    image: "https://images.unsplash.com/photo-1628689469838-524a4a973b8e?w=800&auto=format&fit=crop&q=70",
    gallery: gallery("https://images.unsplash.com/photo-1628689469838-524a4a973b8e?w=800&auto=format&fit=crop&q=70"),
    price: 1450,
    originalPrice: 1800,
    brand: "Gauri Dairy",
    seller: "Gauri Dairy Farm",
    sellerId: "s6",
    sellerType: "Farmer",
    village: "Kolhapur",
    district: "Kolhapur",
    verified: true,
    rating: 4.9,
    reviews: 302,
    deliveryAvailable: true,
    deliverySpeed: "next-day",
    category: "organic",
    stock: "in-stock",
    description:
      "Bilona-method A2 desi cow ghee, hand-churned from cultured curd. Rich aroma, golden colour and traditional taste.",
    specs: [
      { label: "Volume", value: "1 L" },
      { label: "Method", value: "Bilona" },
      { label: "Source", value: "Desi Gir Cow" },
    ],
    tags: ["top-rated", "best-seller"],
  },
  {
    id: "p7",
    name: "Veterinary First-Aid Kit",
    image: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&auto=format&fit=crop&q=70",
    gallery: gallery("https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&auto=format&fit=crop&q=70"),
    price: 675,
    originalPrice: 850,
    brand: "PashuCare",
    seller: "PashuCare Supplies",
    sellerId: "s7",
    sellerType: "Shop",
    village: "Aurangabad",
    district: "Aurangabad",
    verified: true,
    rating: 4.6,
    reviews: 61,
    deliveryAvailable: true,
    deliverySpeed: "2-3-days",
    category: "veterinary",
    stock: "in-stock",
    description:
      "Complete first-aid kit for livestock emergencies. Includes antiseptic, bandages, thermometer and common veterinary medicines.",
    specs: [
      { label: "Items", value: "18" },
      { label: "For", value: "Cattle, Goat, Poultry" },
    ],
    tags: ["new"],
  },
  {
    id: "p8",
    name: "Hand-Held Seed Sprayer",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&auto=format&fit=crop&q=70",
    gallery: gallery("https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&auto=format&fit=crop&q=70"),
    price: 890,
    originalPrice: 1200,
    brand: "KrishiTools",
    seller: "KrishiTools Bazaar",
    sellerId: "s8",
    sellerType: "Shop",
    village: "Pune",
    district: "Pune",
    verified: true,
    rating: 4.4,
    reviews: 47,
    deliveryAvailable: true,
    deliverySpeed: "next-day",
    category: "essentials",
    stock: "in-stock",
    description:
      "Ergonomic 5-litre knapsack sprayer with adjustable nozzle. Ideal for pesticide and foliar spray on small farms.",
    specs: [
      { label: "Capacity", value: "5 L" },
      { label: "Material", value: "HDPE" },
      { label: "Warranty", value: "1 Year" },
    ],
    tags: ["trending"],
  },
  {
    id: "p9",
    name: "Neem Oil Bio-Pesticide — 1L",
    image: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=800&auto=format&fit=crop&q=70",
    gallery: gallery("https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=800&auto=format&fit=crop&q=70"),
    price: 320,
    originalPrice: 450,
    brand: "OrganicShield",
    seller: "GreenGrow Cooperative",
    sellerId: "s3",
    sellerType: "Cooperative",
    village: "Nashik",
    district: "Nashik",
    verified: true,
    rating: 4.7,
    reviews: 128,
    deliveryAvailable: true,
    deliverySpeed: "same-day",
    category: "organic",
    stock: "in-stock",
    description:
      "Cold-pressed neem oil concentrate. Safe, natural pest control that protects crops without harming beneficial insects.",
    specs: [
      { label: "Volume", value: "1 L" },
      { label: "Concentration", value: "3000 ppm" },
    ],
    tags: ["new", "trending"],
  },
  {
    id: "p10",
    name: "Hybrid Tomato Seeds — 500g",
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800&auto=format&fit=crop&q=70",
    gallery: gallery("https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800&auto=format&fit=crop&q=70"),
    price: 260,
    originalPrice: 340,
    brand: "SeedCraft",
    seller: "KrishiTools Bazaar",
    sellerId: "s8",
    sellerType: "Shop",
    village: "Pune",
    district: "Pune",
    verified: true,
    rating: 4.5,
    reviews: 72,
    deliveryAvailable: true,
    deliverySpeed: "next-day",
    category: "seeds",
    stock: "in-stock",
    description:
      "High-yield hybrid tomato seeds with disease resistance. Suited for open-field and polyhouse cultivation.",
    specs: [
      { label: "Weight", value: "500 g" },
      { label: "Germination", value: "92%" },
    ],
    tags: ["seasonal"],
  },
  {
    id: "p11",
    name: "Urea Fertilizer — 45kg Bag",
    image: "https://images.unsplash.com/photo-1585336455962-3ed3c5a9de51?w=800&auto=format&fit=crop&q=70",
    gallery: gallery("https://images.unsplash.com/photo-1585336455962-3ed3c5a9de51?w=800&auto=format&fit=crop&q=70"),
    price: 275,
    originalPrice: 320,
    brand: "IFFCO",
    seller: "Krishna Agro Store",
    sellerId: "s1",
    sellerType: "Shop",
    village: "Rampur",
    district: "Rampur",
    verified: true,
    rating: 4.4,
    reviews: 214,
    deliveryAvailable: true,
    deliverySpeed: "same-day",
    category: "fertilizers",
    stock: "in-stock",
    description:
      "Standard granular urea fertilizer (46% N) for cereal, sugarcane and vegetable crops.",
    specs: [
      { label: "Weight", value: "45 kg" },
      { label: "Nitrogen", value: "46%" },
    ],
    tags: ["best-seller"],
  },
  {
    id: "p12",
    name: "Farm-Fresh Onions — 10kg",
    image: "https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=800&auto=format&fit=crop&q=70",
    gallery: gallery("https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=800&auto=format&fit=crop&q=70"),
    price: 220,
    originalPrice: 300,
    seller: "Suresh Yadav",
    sellerId: "s4",
    sellerType: "Farmer",
    village: "Belgaum",
    district: "Belgaum",
    verified: true,
    rating: 4.6,
    reviews: 91,
    deliveryAvailable: true,
    deliverySpeed: "next-day",
    category: "farm-produce",
    stock: "out-of-stock",
    description:
      "Sun-cured red onions with long shelf life. Ideal for households and small kirana shops.",
    specs: [
      { label: "Weight", value: "10 kg" },
      { label: "Variety", value: "Nashik Red" },
    ],
    tags: ["seasonal"],
  },
];

/** Back-compat export used elsewhere in the app. */
export const FEATURED_PRODUCTS = PRODUCTS.slice(0, 8);

export interface Seller {
  id: string;
  name: string;
  type: SellerType;
  village: string;
  district: string;
  avatar: string;
  cover: string;
  productsListed: number;
  rating: number;
  verified: boolean;
  since: string;
}

export const SELLERS: Seller[] = [
  {
    id: "s1",
    name: "Krishna Agro Store",
    type: "Shop",
    village: "Rampur",
    district: "Rampur",
    avatar: "https://i.pravatar.cc/160?img=15",
    cover: "https://images.unsplash.com/photo-1595475207225-428b62bda831?w=600&auto=format&fit=crop&q=70",
    productsListed: 42,
    rating: 4.7,
    verified: true,
    since: "2019",
  },
  {
    id: "s2",
    name: "Ramesh Patel",
    type: "Farmer",
    village: "Anand",
    district: "Anand",
    avatar: "https://i.pravatar.cc/160?img=52",
    cover: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=600&auto=format&fit=crop&q=70",
    productsListed: 12,
    rating: 4.9,
    verified: true,
    since: "2021",
  },
  {
    id: "s3",
    name: "GreenGrow Cooperative",
    type: "Cooperative",
    village: "Nashik",
    district: "Nashik",
    avatar: "https://i.pravatar.cc/160?img=32",
    cover: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&auto=format&fit=crop&q=70",
    productsListed: 68,
    rating: 4.6,
    verified: true,
    since: "2017",
  },
  {
    id: "s6",
    name: "Gauri Dairy Farm",
    type: "Farmer",
    village: "Kolhapur",
    district: "Kolhapur",
    avatar: "https://i.pravatar.cc/160?img=48",
    cover: "https://images.unsplash.com/photo-1594761051556-eb1c6dcf6c73?w=600&auto=format&fit=crop&q=70",
    productsListed: 8,
    rating: 4.9,
    verified: true,
    since: "2020",
  },
];

export const SORT_OPTIONS = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "rating", label: "Top Rated" },
  { id: "newest", label: "Newest First" },
  { id: "discount", label: "Biggest Discount" },
] as const;

export type SortId = (typeof SORT_OPTIONS)[number]["id"];

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  village: string;
  quote: string;
  rating: number;
  avatar: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Anita Deshmukh",
    role: "Dairy Farmer",
    village: "Kolhapur",
    quote:
      "GramSetu changed how I run my dairy. Feed arrives the same day and prices are fair — I finally have time for my cattle instead of the market.",
    rating: 5,
    avatar: "https://i.pravatar.cc/120?img=47",
  },
  {
    id: "t2",
    name: "Ravi Kumar",
    role: "Shop Owner",
    village: "Rampur",
    quote:
      "My shop reaches four more villages now. Orders flow in every morning and delivery partners pick everything up on time. Business is up 40%.",
    rating: 5,
    avatar: "https://i.pravatar.cc/120?img=12",
  },
  {
    id: "t3",
    name: "Meena Sharma",
    role: "Household Customer",
    village: "Belgaum",
    quote:
      "I used to wait for my husband to bring feed from town. Now I order from my phone and it arrives before evening milking. Simple and reliable.",
    rating: 5,
    avatar: "https://i.pravatar.cc/120?img=45",
  },
];
