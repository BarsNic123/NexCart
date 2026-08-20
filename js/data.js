const PRODUCTS = [
  { id: "mba-m1", name: "Macbook Air M1", category: "Macbooks", price: 36000, grade: "Excellent", warranty: "12 months", stock: true, emoji: "💻", specs: "8GB RAM · 256GB SSD" },
  { id: "hp-15s", name: "HP 15s slim", category: "Laptops", price: 25000, grade: "Good", warranty: "6 months", stock: false, emoji: "💻", specs: "8GB RAM · 512GB SSD" },
  { id: "hp-victus", name: "HP Victus", category: "Gaming Laptops", price: 42000, grade: "Excellent", warranty: "12 months", stock: true, emoji: "🎮", specs: "16GB RAM · RTX 3050" },
  { id: "mba-m2", name: "Macbook Air M2", category: "Macbooks", price: 52000, grade: "Excellent", warranty: "12 months", stock: true, emoji: "💻", specs: "8GB RAM · 256GB SSD" },
  { id: "hp-victus-15", name: "HP Victus 15", category: "Gaming Laptops", price: 42000, grade: "Good", warranty: "12 months", stock: true, emoji: "🎮", specs: "16GB RAM · RTX 3050" },
  { id: "rog-zephyrus", name: "Asus ROG Zephyrus", category: "Gaming Laptops", price: 88000, grade: "Excellent", warranty: "18 months", stock: true, emoji: "🎮", specs: "16GB RAM · RTX 4060" },
  { id: "legion-5", name: "Lenovo Legion 5", category: "Gaming Laptops", price: 74000, grade: "Excellent", warranty: "18 months", stock: true, emoji: "🎮", specs: "16GB RAM · RTX 4060" },
  { id: "nitro-5", name: "Acer Nitro 5", category: "Gaming Laptops", price: 52000, grade: "Good", warranty: "12 months", stock: true, emoji: "🎮", specs: "16GB RAM · RTX 3050" }
];

const SLIDES = [
  { title: "Laptops Under Warranty", text: "Certified premium laptops with full official warranty.", cta: "Shop now", href: "#/shop" },
  { title: "Gaming Laptops", text: "High-performance machines for the ultimate gaming experience.", cta: "Browse gaming", href: "#/shop?category=Gaming%20Laptops" },
  { title: "Buy MacBook", text: "Premium Apple MacBooks at unbeatable refurbished prices.", cta: "Buy MacBook", href: "#/shop?category=Macbooks" },
  { title: "Maximize Your Laptop's Value", text: "Get a guaranteed, expert valuation for your used devices instantly.", cta: "Sell now", href: "#/sell" },
  { title: "Certified Data Wipe", text: "100% secure, military-grade data erasure for your safety.", cta: "Learn more", href: "#/sell" }
];

const FAQS = [
  { q: "What is refurbished & is it safe to buy?", a: "Refurbished devices are pre-owned products that have been inspected, repaired if required, tested and certified to work like new. We offer a warranty and quality checks for peace of mind." },
  { q: "Do the devices come with warranty?", a: "Yes — every product listed shows its warranty duration. Standard warranty covers functional defects and is mentioned on the product page." },
  { q: "Can I return the product if not satisfied?", a: "We have a return policy (varies by product). If the product arrives significantly different than advertised, contact support within the return window." },
  { q: "Are accessories (charger, cable) included?", a: "Most products include essential accessories — charger or cable when applicable. The product listing notes exactly what's included." },
  { q: "How do you grade the device condition?", a: "Devices are graded (e.g., Excellent, Good, Fair) based on cosmetic condition and battery health. Each product page shows the grade and images." }
];

const SELL_BASE = {
  "MacBook Air M1": 34000,
  "MacBook Air M2": 48000,
  "HP 15s": 18000,
  "HP Victus": 32000,
  "Lenovo Legion 5": 56000,
  "Asus ROG": 68000,
  "Other laptop": 15000
};
