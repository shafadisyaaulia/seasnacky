const fs = require('fs');
const path = require('path');

const structure = [
  'components/ui/button.tsx',
  'components/ui/card.tsx',
  'components/layout/SellerSidebar.tsx',
  'components/layout/AdminSidebar.tsx',
  'components/features/ProductCard.tsx',
  'components/features/RecipeCard.tsx',
  'components/features/OrderTable.tsx',
  'lib/utils.ts',
  'models/User.ts',
  'models/Shop.ts',
  'models/Product.ts',
  'models/Order.ts',
  'models/Recipe.ts',
  'models/Log.ts',
  'app/(auth)/login/page.tsx',
  'app/(auth)/register/page.tsx',
  'app/(marketplace)/products/[slug]/page.tsx',
  'app/(marketplace)/products/page.tsx',
  'app/(marketplace)/recipes/[slug]/page.tsx',
  'app/(marketplace)/recipes/page.tsx',
  'app/(marketplace)/cart/page.tsx',
  'app/(user)/profile/page.tsx',
  'app/(user)/open-shop/page.tsx',
  'app/dashboard/seller/layout.tsx',
  'app/dashboard/seller/page.tsx',
  'app/dashboard/seller/products/new/page.tsx',
  'app/dashboard/seller/products/page.tsx',
  'app/dashboard/seller/orders/page.tsx',
  'app/dashboard/seller/content/page.tsx',
  'app/dashboard/admin/layout.tsx',
  'app/dashboard/admin/page.tsx',
  'app/dashboard/admin/logs/page.tsx',
  'app/api/auth/login/route.ts',
  'app/api/auth/register/route.ts',
  'app/api/auth/logout/route.ts',
  'app/api/shop/create/route.ts',
  'app/api/products/route.ts',
  'app/api/orders/route.ts',
];

structure.forEach(item => {
  const fullPath = path.join(process.cwd(), 'src', item);
  const dir = path.dirname(fullPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created: ${dir}`);
  }

  // Only create file if missing
  if (path.extname(item)) {
    if (!fs.existsSync(fullPath)) {
      fs.writeFileSync(fullPath, '');
      console.log(`Created: ${fullPath}`);
    } else {
      console.log(`Skipped: ${fullPath}`);
    }
  }
});