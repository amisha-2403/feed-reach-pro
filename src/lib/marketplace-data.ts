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
}

export const CATEGORIES: Category[] = [
  { id: "animal-feed", name: "Animal Feed", icon: Wheat, count: 128, accent: "from-amber-100 to-amber-50" },
  { id: "seeds", name: "Seeds", icon: Sprout, count: 94, accent: "from-emerald-100 to-emerald-50" },
  { id: "fertilizers", name: "Fertilizers", icon: FlaskConical, count: 67, accent: "from-lime-100 to-lime-50" },
  { id: "farm-produce", name: "Farm Produce", icon: Apple, count: 212, accent: "from-rose-100 to-rose-50" },
  { id: "organic", name: "Organic Products", icon: Leaf, count: 45, accent: "from-teal-100 to-teal-50" },
  { id: "veterinary", name: "Veterinary Supplies", icon: Stethoscope, count: 38, accent: "from-sky-100 to-sky-50" },
  { id: "essentials", name: "Farming Essentials", icon: Tractor, count: 156, accent: "from-orange-100 to-orange-50" },
];

export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  seller: string;
  sellerType: "Shop" | "Farmer" | "Cooperative";
  village: string;
  rating: number;
  reviews: number;
  deliveryAvailable: boolean;
  category: string;
}

export const FEATURED_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Premium Cattle Feed — 50kg",
    image:
      "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=600&auto=format&fit=crop&q=70",
    price: 1150,
    originalPrice: 1400,
    seller: "Krishna Agro Store",
    sellerType: "Shop",
    village: "Rampur",
    rating: 4.7,
    reviews: 218,
    deliveryAvailable: true,
    category: "animal-feed",
  },
  {
    id: "p2",
    name: "Organic Wheat Seeds — 10kg",
    image:
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=70",
    price: 480,
    originalPrice: 600,
    seller: "Ramesh Patel",
    sellerType: "Farmer",
    village: "Anand",
    rating: 4.9,
    reviews: 84,
    deliveryAvailable: true,
    category: "seeds",
  },
  {
    id: "p3",
    name: "Vermicompost Fertilizer — 25kg",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&auto=format&fit=crop&q=70",
    price: 320,
    originalPrice: 400,
    seller: "GreenGrow Cooperative",
    sellerType: "Cooperative",
    village: "Nashik",
    rating: 4.6,
    reviews: 142,
    deliveryAvailable: true,
    category: "fertilizers",
  },
  {
    id: "p4",
    name: "Fresh Farm Tomatoes — 5kg",
    image:
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=70",
    price: 140,
    originalPrice: 180,
    seller: "Suresh Yadav",
    sellerType: "Farmer",
    village: "Belgaum",
    rating: 4.8,
    reviews: 56,
    deliveryAvailable: true,
    category: "farm-produce",
  },
  {
    id: "p5",
    name: "Poultry Layer Feed — 40kg",
    image:
      "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&auto=format&fit=crop&q=70",
    price: 980,
    originalPrice: 1150,
    seller: "Village Feeds Depot",
    sellerType: "Shop",
    village: "Solapur",
    rating: 4.5,
    reviews: 173,
    deliveryAvailable: false,
    category: "animal-feed",
  },
  {
    id: "p6",
    name: "A2 Cow Ghee — 1L Jar",
    image:
      "https://images.unsplash.com/photo-1628689469838-524a4a973b8e?w=600&auto=format&fit=crop&q=70",
    price: 1450,
    originalPrice: 1800,
    seller: "Gauri Dairy Farm",
    sellerType: "Farmer",
    village: "Kolhapur",
    rating: 4.9,
    reviews: 302,
    deliveryAvailable: true,
    category: "organic",
  },
  {
    id: "p7",
    name: "Veterinary First-Aid Kit",
    image:
      "https://images.unsplash.com/photo-1584515933487-779824d29309?w=600&auto=format&fit=crop&q=70",
    price: 675,
    originalPrice: 850,
    seller: "PashuCare Supplies",
    sellerType: "Shop",
    village: "Aurangabad",
    rating: 4.6,
    reviews: 61,
    deliveryAvailable: true,
    category: "veterinary",
  },
  {
    id: "p8",
    name: "Hand-Held Seed Sprayer",
    image:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&auto=format&fit=crop&q=70",
    price: 890,
    originalPrice: 1200,
    seller: "KrishiTools Bazaar",
    sellerType: "Shop",
    village: "Pune",
    rating: 4.4,
    reviews: 47,
    deliveryAvailable: true,
    category: "essentials",
  },
];

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
