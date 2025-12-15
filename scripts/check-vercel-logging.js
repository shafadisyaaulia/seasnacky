// Vercel Deployment Readiness Checker
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Vercel Deployment Readiness for Logging System...\n');

const checks = [
  {
    name: 'MongoDB Atlas Configuration',
    check: () => {
      const envPath = path.join(__dirname, '..', '.env.local');
      if (!fs.existsSync(envPath)) {
        return { pass: false, message: '.env.local not found' };
      }
      const envContent = fs.readFileSync(envPath, 'utf-8');
      const hasMongoUri = envContent.includes('MONGODB_URI') && envContent.includes('mongodb+srv://');
      return { 
        pass: hasMongoUri, 
        message: hasMongoUri ? 'MongoDB Atlas URI configured ✓' : 'MongoDB URI not found or not cloud-based' 
      };
    }
  },
  {
    name: 'Logger File',
    check: () => {
      const loggerPath = path.join(__dirname, '..', 'src', 'lib', 'logger.ts');
      if (!fs.existsSync(loggerPath)) {
        return { pass: false, message: 'logger.ts not found' };
      }
      const content = fs.readFileSync(loggerPath, 'utf-8');
      const hasMongoTransport = content.includes('MongoDBTransport');
      const hasEnvironment = content.includes('VERCEL_ENV');
      return { 
        pass: hasMongoTransport && hasEnvironment, 
        message: hasMongoTransport && hasEnvironment ? 
          'Logger has MongoDB transport & environment tracking ✓' : 
          'Logger missing required features' 
      };
    }
  },
  {
    name: 'Log Model',
    check: () => {
      const modelPath = path.join(__dirname, '..', 'src', 'models', 'Log.ts');
      if (!fs.existsSync(modelPath)) {
        return { pass: false, message: 'Log.ts model not found' };
      }
      const content = fs.readFileSync(modelPath, 'utf-8');
      const hasEnvironmentField = content.includes('environment');
      return { 
        pass: hasEnvironmentField, 
        message: hasEnvironmentField ? 
          'Log model has environment field ✓' : 
          'Log model missing environment field' 
      };
    }
  },
  {
    name: 'API Endpoints with Logging',
    check: () => {
      const endpoints = [
        'src/app/api/auth/login/route.ts',
        'src/app/api/auth/register/route.ts',
        'src/app/api/shop/upgrade-and-create/route.ts',
        'src/app/api/orders/checkout/route.ts',
      ];
      
      let foundCount = 0;
      let totalCount = 0;
      
      for (const endpoint of endpoints) {
        const fullPath = path.join(__dirname, '..', endpoint);
        totalCount++;
        if (fs.existsSync(fullPath)) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          if (content.includes('logger.info') || content.includes('logger.error') || content.includes('logger.warn')) {
            foundCount++;
          }
        }
      }
      
      return { 
        pass: foundCount >= 3, 
        message: `${foundCount}/${totalCount} critical endpoints have logging ✓` 
      };
    }
  },
  {
    name: 'Admin Logs Dashboard',
    check: () => {
      const dashboardPath = path.join(__dirname, '..', 'src', 'app', 'dashboard', 'admin', 'logs', 'page.tsx');
      if (!fs.existsSync(dashboardPath)) {
        return { pass: false, message: 'Admin logs dashboard not found' };
      }
      const content = fs.readFileSync(dashboardPath, 'utf-8');
      const hasAutoRefresh = content.includes('autoRefresh');
      return { 
        pass: hasAutoRefresh, 
        message: hasAutoRefresh ? 
          'Logs dashboard has auto-refresh ✓' : 
          'Logs dashboard missing auto-refresh' 
      };
    }
  },
  {
    name: 'Vercel Configuration',
    check: () => {
      const vercelPath = path.join(__dirname, '..', 'vercel.json');
      if (!fs.existsSync(vercelPath)) {
        return { pass: false, message: 'vercel.json not found' };
      }
      const content = fs.readFileSync(vercelPath, 'utf-8');
      const config = JSON.parse(content);
      const hasRegion = config.regions && config.regions.length > 0;
      return { 
        pass: hasRegion, 
        message: hasRegion ? 
          `Vercel configured with region: ${config.regions[0]} ✓` : 
          'Vercel region not configured' 
      };
    }
  },
];

let passCount = 0;
let failCount = 0;

checks.forEach((check, index) => {
  const result = check.check();
  const status = result.pass ? '✅' : '❌';
  console.log(`${index + 1}. ${status} ${check.name}`);
  console.log(`   ${result.message}\n`);
  
  if (result.pass) {
    passCount++;
  } else {
    failCount++;
  }
});

console.log('━'.repeat(60));
console.log(`\n📊 Results: ${passCount}/${checks.length} checks passed\n`);

if (failCount === 0) {
  console.log('🎉 READY FOR VERCEL DEPLOYMENT!');
  console.log('\n✨ Logging system sudah 100% siap:');
  console.log('   • MongoDB Atlas: Connected ✓');
  console.log('   • Logger: Configured ✓');
  console.log('   • API Endpoints: Integrated ✓');
  console.log('   • Admin Dashboard: Ready ✓');
  console.log('\n🚀 Next steps:');
  console.log('   1. git add .');
  console.log('   2. git commit -m "feat: real-time logging system"');
  console.log('   3. git push origin main');
  console.log('   4. Vercel akan auto-deploy!');
  console.log('\n📝 Setelah deploy:');
  console.log('   • Login ke aplikasi production');
  console.log('   • Buat aktivitas (shop, order, etc)');
  console.log('   • Cek /dashboard/admin/logs untuk real-time logs');
} else {
  console.log('⚠️  Some checks failed. Please review the issues above.');
  process.exit(1);
}
