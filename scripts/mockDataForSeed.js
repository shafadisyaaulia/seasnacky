// Minimal mock data in CommonJS for seeding (based on src/app/api/_data/mockData.ts)
const users = [
  { id: 'usr-001', name: 'Mira Sasmita', email: 'mira@marine-snack.id', password: 'password123', address: 'Jalan Bahari No. 18, Jakarta' },
  { id: 'usr-002', name: 'Ando Lazuardi', email: 'ando@seasnack.co', password: 'password123', address: 'Jalan Karang 21, Makassar' },
  { id: 'adm-001', name: 'Admin SeaSnacky', email: 'admin@seasnacky.id', password: 'adminpassword', address: 'Kantor Pusat SeaSnacky' },
];

const stores = [
  { id: 'st-1', name: 'Glenn Limbah', city: 'LHOKSEUMAWE' },
  { id: 'st-2', name: 'Sapa Mart', city: 'ACEH TIMUR' },
  { id: 'st-3', name: 'Barokah Tani', city: 'DUMAI, RIAU' },
  { id: 'st-4', name: 'SeaFresh', city: 'BANDUNG' },
];

const products = [
  {
    id: 'prd-keripik-01',
    name: 'Keripik Rumput Laut Signature',
    slug: 'keripik-rumput-laut-signature',
    category: 'Keripik',
    price: 18000,
    unit: '80g',
    description: 'Keripik rumput laut renyah dengan baluran bumbu manis pedas, sumber serat dan mineral laut.',
    stock: 320,
    rating: 4.95,
    image: '/keripik-signature.png',
  },
  {
    id: 'prd-abon-01',
    name: 'Abon Tuna Mediterranean',
    slug: 'abon-tuna-mediterranean',
    category: 'Abon',
    price: 28000,
    unit: '100g',
    description: 'Abon ikan tuna premium dengan rempah Mediterranean, cocok sebagai topping salad dan sandwich.',
    stock: 210,
    rating: 4.88,
    image: '/abon-tuna.png',
  },
  {
    id: 'prd-bakso-01',
    name: 'Bakso Ikan Kombu',
    slug: 'bakso-ikan-kombu',
    category: 'Frozen',
    price: 35000,
    unit: '500g',
    description: 'Bakso ikan dengan kaldu kombu dan tekstur kenyal, ideal untuk sup dan hotpot.',
    stock: 180,
    rating: 4.91,
    image: '/bakso-ikan.png',
  },
  {
    id: 'prd-nugget-01',
    name: 'Nugget Ikan Beku',
    slug: 'nugget-ikan-beku',
    category: 'Frozen',
    price: 42000,
    unit: '450g',
    description: 'Nugget ikan tanpa pengawet dengan balutan panko renyah, siap goreng dalam 5 menit.',
    stock: 260,
    rating: 4.84,
    image: '/nugget-ikan.png',
  },
  {
    id: 'prd-keripik-02',
    name: 'Keripik Nori Pedas Manis',
    slug: 'keripik-nori-pedas-manis',
    category: 'Keripik',
    price: 20000,
    unit: '70g',
    description: 'Keripik nori dengan lapisan karamel pedas dan taburan wijen panggang.',
    stock: 150,
    rating: 4.94,
    image: '/keripik-nori.png',
  },
];

const reviews = [
  { id: 'rvw-001', productId: 'prd-keripik-01', userId: 'usr-001', rating: 5, comment: 'Keripik tetap renyah walau perjalanan jauh, rasa pedasnya pas.', createdAt: '2025-09-20T11:00:00+07:00' },
  { id: 'rvw-002', productId: 'prd-abon-01', userId: 'usr-002', rating: 5, comment: 'Abon tuna cocok untuk sandwich catering kami, wangi dan gurih.', createdAt: '2025-09-22T09:10:00+07:00' },
  { id: 'rvw-003', productId: 'prd-bakso-01', userId: 'usr-001', rating: 4.9, comment: 'Tekstur bakso kenyal dan tidak amis, anak-anak suka sekali.', createdAt: '2025-09-25T14:25:00+07:00' },
];

function listProducts() {
  return products;
}

function listReviews() {
  return reviews;
}

module.exports = { users, stores, products, reviews, listProducts, listReviews };
