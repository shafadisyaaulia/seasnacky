export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  address: string;
  loyaltyPoints: number;
  orders: string[];
  storeId?: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  unit: string;
  description: string;
  tags: string[];
  stock: number;
  rating: number;
  reviewsCount: number;
  image: string;
};

export type Article = {
  id: string;
  title: string;
  category: "Resep" | "Tips" | "Artikel";
  readingTime: string;
  summary: string;
};

export type StorageTip = {
  id: string;
  title: string;
  detail: string;
  duration: string;
};

export type Order = {
  id: string;
  userId: string;
  status: "pending" | "diproses" | "dikirim" | "selesai";
  paymentStatus: "pending" | "paid";
  total: number;
  createdAt: string;
  estimatedDelivery: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
};

export type Review = {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
};

const createId = () => Math.random().toString(36).slice(2, 10);

export const users: User[] = [
  {
    id: "usr-001",
    name: "Mira Sasmita",
    email: "mira@marine-snack.id",
    password: "password123",
    address: "Jalan Bahari No. 18, Jakarta",
    loyaltyPoints: 1820,
    orders: ["INV-9821", "INV-9774", "INV-9710"],
  },
  {
    id: "usr-002",
    name: "Ando Lazuardi",
    email: "ando@seasnack.co",
    password: "password123",
    address: "Jalan Karang 21, Makassar",
    loyaltyPoints: 920,
    orders: ["INV-9655"],
  },
    {
    id: "adm-001",
    name: "Admin SeaSnacky",
    email: "admin@seasnacky.id",
    password: "adminpassword",
    address: "Kantor Pusat SeaSnacky",
    loyaltyPoints: 0,
    orders: [],
  },
];

export const products: Product[] = [
  {
    id: "prd-keripik-01",
    name: "Keripik Rumput Laut Signature",
    slug: "keripik-rumput-laut-signature",
    category: "Keripik",
    price: 18000,
    unit: "80g",
    description:
      "Keripik rumput laut renyah dengan baluran bumbu manis pedas, sumber serat dan mineral laut.",
    tags: ["rendah kalori", "gluten free", "snack sehat"],
    stock: 320,
    rating: 4.95,
    reviewsCount: 2410,
    image: "/keripik-signature.png",
  },
  {
    id: "prd-abon-01",
    name: "Abon Tuna Mediterranean",
    slug: "abon-tuna-mediterranean",
    category: "Abon",
    price: 28000,
    unit: "100g",
    description:
      "Abon ikan tuna premium dengan rempah Mediterranean, cocok sebagai topping salad dan sandwich.",
    tags: ["high protein", "omega 3", "meal prep"],
    stock: 210,
    rating: 4.88,
    reviewsCount: 1860,
    image: "/abon-tuna.png",
  },
  {
    id: "prd-bakso-01",
    name: "Bakso Ikan Kombu",
    slug: "bakso-ikan-kombu",
    category: "Frozen",
    price: 35000,
    unit: "500g",
    description:
      "Bakso ikan dengan kaldu kombu dan tekstur kenyal, ideal untuk sup dan hotpot.",
    tags: ["frozen", "high protein", "tanpa pengawet"],
    stock: 180,
    rating: 4.91,
    reviewsCount: 980,
    image: "/bakso-ikan.png",
  },
  {
    id: "prd-nugget-01",
    name: "Nugget Ikan Beku",
    slug: "nugget-ikan-beku",
    category: "Frozen",
    price: 42000,
    unit: "450g",
    description:
      "Nugget ikan tanpa pengawet dengan balutan panko renyah, siap goreng dalam 5 menit.",
    tags: ["keluarga", "praktis", "protein"],
    stock: 260,
    rating: 4.84,
    reviewsCount: 1310,
    image: "/nugget-ikan.png",
  },
  {
    id: "prd-keripik-02",
    name: "Keripik Nori Pedas Manis",
    slug: "keripik-nori-pedas-manis",
    category: "Keripik",
    price: 20000,
    unit: "70g",
    description:
      "Keripik nori dengan lapisan karamel pedas dan taburan wijen panggang.",
    tags: ["snack", "nori", "fancy"],
    stock: 150,
    rating: 4.94,
    reviewsCount: 1850,
    image: "/keripik-nori.png",
  },
];

const articles: Article[] = [
  {
    id: "art-01",
    title: "Meal Prep 15 Menit: Poke Bowl Rumput Laut",
    category: "Resep",
    readingTime: "6 menit",
    summary:
      "Kombinasikan rumput laut, quinoa, dan abon ikan untuk makan siang tinggi protein.",
  },
  {
    id: "art-02",
    title: "Sandwich Abon Ikan Omega-3",
    category: "Resep",
    readingTime: "5 menit",
    summary:
      "Resep cepat untuk sarapan sehat dengan abon tuna dan telur rebus.",
  },
  {
    id: "art-03",
    title: "Panduan Cold Chain untuk Produk Beku",
    category: "Tips",
    readingTime: "8 menit",
    summary:
      "Optimalkan suhu penyimpanan dan logistik agar kualitas produk tetap terjaga.",
  },
];

const storageTips: StorageTip[] = [
  {
    id: "tip-01",
    title: "Jaga kerenyahan keripik rumput laut",
    detail: "Gunakan silica gel food grade dan simpan di wadah kedap udara.",
    duration: "3 menit baca",
  },
  {
    id: "tip-02",
    title: "Defrost aman produk beku",
    detail: "Turunkan ke chiller selama 6 jam sebelum dimasak untuk menjaga tekstur.",
    duration: "5 menit baca",
  },
  {
    id: "tip-03",
    title: "Atur stok untuk kafe",
    detail: "Gunakan sistem FIFO dan catat batch produksi untuk menghindari pemborosan.",
    duration: "Checklist",
  },
];

export const orders: Order[] = [
  {
    id: "INV-9821",
    userId: "usr-001",
    status: "diproses",
    paymentStatus: "paid",
    total: 420000,
    createdAt: "2025-09-28T08:20:00+07:00",
    estimatedDelivery: "2025-10-01T18:00:00+07:00",
    items: [
      { productId: "prd-bakso-01", quantity: 4, price: 140000 },
      { productId: "prd-nugget-01", quantity: 5, price: 210000 },
      { productId: "prd-abon-01", quantity: 2, price: 70000 },
    ],
  },
  {
    id: "INV-9774",
    userId: "usr-001",
    status: "dikirim",
    paymentStatus: "paid",
    total: 180000,
    createdAt: "2025-09-25T10:45:00+07:00",
    estimatedDelivery: "2025-09-29T16:00:00+07:00",
    items: [
      { productId: "prd-keripik-01", quantity: 6, price: 108000 },
      { productId: "prd-keripik-02", quantity: 3, price: 72000 },
    ],
  },
  {
    id: "INV-9710",
    userId: "usr-001",
    status: "selesai",
    paymentStatus: "paid",
    total: 126000,
    createdAt: "2025-09-18T12:20:00+07:00",
    estimatedDelivery: "2025-09-22T12:00:00+07:00",
    items: [
      { productId: "prd-abon-01", quantity: 3, price: 84000 },
      { productId: "prd-keripik-02", quantity: 2, price: 42000 },
    ],
  },
  {
    id: "INV-9655",
    userId: "usr-002",
    status: "pending",
    paymentStatus: "pending",
    total: 95000,
    createdAt: "2025-09-15T09:05:00+07:00",
    estimatedDelivery: "2025-09-19T18:00:00+07:00",
    items: [
      { productId: "prd-keripik-01", quantity: 5, price: 90000 },
      { productId: "prd-keripik-02", quantity: 1, price: 20000 },
    ],
  },
];

const reviews: Review[] = [
  {
    id: "rvw-001",
    productId: "prd-keripik-01",
    userId: "usr-001",
    rating: 5,
    comment: "Keripik tetap renyah walau perjalanan jauh, rasa pedasnya pas.",
    createdAt: "2025-09-20T11:00:00+07:00",
  },
  {
    id: "rvw-002",
    productId: "prd-abon-01",
    userId: "usr-002",
    rating: 5,
    comment: "Abon tuna cocok untuk sandwich catering kami, wangi dan gurih.",
    createdAt: "2025-09-22T09:10:00+07:00",
  },
  {
    id: "rvw-003",
    productId: "prd-bakso-01",
    userId: "usr-001",
    rating: 4.9,
    comment: "Tekstur bakso kenyal dan tidak amis, anak-anak suka sekali.",
    createdAt: "2025-09-25T14:25:00+07:00",
  },
];

const salesByCategory = [
  { category: "Keripik", value: 38 },
  { category: "Abon", value: 26 },
  { category: "Frozen", value: 21 },
  { category: "Bundle Horeca", value: 15 },
];

const topHighlight = [
  {
    name: "Keripik Rumput Laut Signature",
    rating: 4.95,
    revenue: 182000000,
  },
  {
    name: "Abon Tuna Mediterranean",
    rating: 4.88,
    revenue: 126400000,
  },
];

export function listProducts(params: { search?: string; category?: string } = {}) {
  const { search, category } = params;
  return products.filter((product) => {
    const matchesSearch = search
      ? `${product.name} ${product.description} ${product.tags.join(" ")}`
          .toLowerCase()
          .includes(search.toLowerCase())
      : true;
    const matchesCategory = category ? product.category === category : true;
    return matchesSearch && matchesCategory;
  });
}

export function getProductById(id: string) {
  const product = products.find((item) => item.id === id || item.slug === id);
  if (!product) {
    return undefined;
  }
  const productReviews = reviews.filter((review) => review.productId === product.id);
  const averageRating =
    productReviews.reduce((acc, current) => acc + current.rating, 0) /
    (productReviews.length || 1);

  return {
    ...product,
    averageRating: Number(averageRating.toFixed(2)),
    reviewCount: productReviews.length,
    reviews: productReviews,
  };
}

export function getTopProducts() {
  return products
    .slice()
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3)
    .map((product, index) => ({
      id: product.id,
      name: product.name,
      rating: product.rating,
      reviews: product.reviewsCount,
      revenueRank: topHighlight[index]?.revenue ?? product.rating * 10000000,
    }));
}

export function getRecommendations(userId?: string) {
  const user = userId ? users.find((item) => item.id === userId) : undefined;
  if (!user) {
    return products.slice(0, 3);
  }
  const recentOrders = orders.filter((order) => order.userId === user.id);
  const categoriesPurchased = new Set(
    recentOrders
      .flatMap((order) => order.items)
      .map((item) => getProductById(item.productId)?.category)
      .filter(Boolean) as string[],
  );
  if (!categoriesPurchased.size) {
    return products.slice(0, 3);
  }
  return products.filter((product) => categoriesPurchased.has(product.category)).slice(0, 4);
}

export function listArticles() {
  return articles;
}

export function listTips() {
  return storageTips;
}

export function listOrders(userId?: string) {
  return userId ? orders.filter((order) => order.userId === userId) : orders;
}

export function getOrderById(id: string) {
  return orders.find((order) => order.id === id);
}

export function listReviews(productId?: string) {
  if (productId) {
    return reviews.filter((review) => review.productId === productId);
  }
  return reviews;
}

export function authenticateUser(email: string, password: string) {
  const user = users.find((user) => user.email === email);
  if (user && user.password === password) {
    return user;
  }
  return undefined;
}

export function registerUser(payload: { name: string; email: string; password: string; address: string }) {
  const exists = users.some((user) => user.email === payload.email);
  if (exists) {
    return undefined;
  }
  const newUser: User = {
    id: `usr-${createId()}`,
    name: payload.name,
    email: payload.email,
    password: payload.password, // Password disimpan langsung (tanpa hash untuk mock data)
    address: payload.address,
    loyaltyPoints: 0,
    orders: [],
  };
  users.push(newUser);
  return newUser;
}

export function updateUserProfile(userId: string, data: Partial<Pick<User, "name" | "address">>) {
  const user = users.find((item) => item.id === userId);
  if (!user) {
    return undefined;
  }
  if (data.name) {
    user.name = data.name;
  }
  if (data.address) {
    user.address = data.address;
  }
  return user;
}

export function getUserById(userId: string) {
  return users.find((item) => item.id === userId);
}

export function createReview(payload: { productId: string; userId: string; rating: number; comment: string }) {
  const user = users.find((item) => item.id === payload.userId);
  const product = products.find((item) => item.id === payload.productId);
  if (!user || !product) {
    return undefined;
  }
  const review: Review = {
    id: `rvw-${createId()}`,
    productId: payload.productId,
    userId: payload.userId,
    rating: payload.rating,
    comment: payload.comment,
    createdAt: new Date().toISOString(),
  };
  reviews.push(review);
  const productReviews = reviews.filter((item) => item.productId === payload.productId);
  const averageRating =
    productReviews.reduce((acc, current) => acc + current.rating, 0) / productReviews.length;
  product.rating = Number(averageRating.toFixed(2));
  product.reviewsCount = productReviews.length;
  return review;
}

export function simulateCheckout(userId: string, items: Array<{ productId: string; quantity: number }>) {
  const user = users.find((item) => item.id === userId);
  if (!user) {
    return undefined;
  }
  const enrichedItems = items.map((item) => {
    const product = products.find((productItem) => productItem.id === item.productId);
    return {
      productId: item.productId,
      quantity: item.quantity,
      price: product ? product.price * item.quantity : 0,
    };
  });
  const total = enrichedItems.reduce((sum, item) => sum + item.price, 0);
  const newOrder: Order = {
    id: `INV-${Math.floor(Math.random() * 9000 + 1000)}`,
    userId,
    status: "pending",
    paymentStatus: "pending",
    total,
    createdAt: new Date().toISOString(),
    estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    items: enrichedItems,
  };
  orders.push(newOrder);
  user.orders.push(newOrder.id);
  return newOrder;
}

export function appendCartItem(userId: string, productId: string, quantity: number) {
  const user = users.find((item) => item.id === userId);
  const product = products.find((item) => item.id === productId);
  if (!user || !product) {
    return undefined;
  }
  return {
    message: "Produk ditambahkan ke keranjang",
    userId,
    productId,
    quantity,
    price: product.price,
  };
}

export function getDashboardSummary() {
  const totalRevenue = orders
    .filter((order) => order.paymentStatus === "paid")
    .reduce((sum, order) => sum + order.total, 0);
  const completedOrders = orders.filter((order) => order.status === "selesai").length;
  const activeUsers = users.length;

  return {
    revenue: totalRevenue,
    completedOrders,
    activeUsers,
    salesTrend: [70, 82, 78, 96, 114, 131],
    productShare: salesByCategory,
    highlights: topHighlight,
  };
}

// Simple store mock mapping - return a store object for a product
export type Store = {
  id: string;
  name: string;
  city: string;
};

export const stores: Store[] = [
  { id: "st-1", name: "Glenn Limbah", city: "LHOKSEUMAWE" },
  { id: "st-2", name: "Sapa Mart", city: "ACEH TIMUR" },
  { id: "st-3", name: "Barokah Tani", city: "DUMAI, RIAU" },
  { id: "st-4", name: "SeaFresh", city: "BANDUNG" },
];

export function getStoreByProductId(productId: string) {
  // Simple deterministic mapping based on hash
  const idx = Math.abs(
    productId.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  ) % stores.length;
  return stores[idx];
}

export function getStoreById(id: string) {
  return stores.find((s) => s.id === id);
}