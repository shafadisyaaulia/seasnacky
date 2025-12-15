#!/usr/bin/env node

/**
 * Script untuk membantu setup Vercel deployment
 * Jalankan: node setup-vercel.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkCommand(command) {
  try {
    execSync(`${command} --version`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function readVercelProject() {
  const vercelPath = path.join(__dirname, '.vercel', 'project.json');
  if (fs.existsSync(vercelPath)) {
    return JSON.parse(fs.readFileSync(vercelPath, 'utf-8'));
  }
  return null;
}

async function main() {
  log('\n🚀 Vercel Deployment Setup Helper\n', 'bright');

  // Check 1: Vercel CLI
  log('📋 Checking prerequisites...', 'blue');
  
  if (!checkCommand('vercel')) {
    log('❌ Vercel CLI not found!', 'red');
    log('\nInstall with: npm install -g vercel@latest', 'yellow');
    process.exit(1);
  }
  log('✅ Vercel CLI installed', 'green');

  // Check 2: Git
  if (!checkCommand('git')) {
    log('❌ Git not found!', 'red');
    process.exit(1);
  }
  log('✅ Git installed', 'green');

  // Check 3: .vercel/project.json
  log('\n📁 Checking Vercel project link...', 'blue');
  const vercelProject = readVercelProject();
  
  if (!vercelProject) {
    log('❌ Project not linked to Vercel', 'yellow');
    log('\nYou need to run:', 'yellow');
    log('  vercel link', 'bright');
    log('\nThis will:', 'yellow');
    log('  1. Link this project to Vercel');
    log('  2. Create .vercel/project.json with your IDs');
    log('\nDo you want to run it now? (This will open Vercel login)', 'yellow');
    process.exit(0);
  }

  log('✅ Project linked to Vercel', 'green');

  // Display project info
  log('\n📊 Project Information:', 'blue');
  log(`   Org ID: ${vercelProject.orgId}`, 'bright');
  log(`   Project ID: ${vercelProject.projectId}`, 'bright');

  // Check 4: GitHub Secrets
  log('\n🔐 GitHub Secrets Required:', 'blue');
  log('   You need to add these secrets in GitHub:', 'yellow');
  log('   Settings → Secrets and variables → Actions → New repository secret\n');
  
  log('   1. VERCEL_TOKEN', 'bright');
  log('      Get from: https://vercel.com/account/tokens');
  log(`      Value: [Create a new token]\n`);
  
  log('   2. VERCEL_ORG_ID', 'bright');
  log(`      Value: ${vercelProject.orgId}\n`);
  
  log('   3. VERCEL_PROJECT_ID', 'bright');
  log(`      Value: ${vercelProject.projectId}\n`);

  // Check 5: Environment Variables
  log('🌍 Environment Variables:', 'blue');
  log('   Set these in Vercel Dashboard:', 'yellow');
  log('   https://vercel.com/dashboard → Your Project → Settings → Environment Variables\n');

  const envExample = path.join(__dirname, '.env.example');
  if (fs.existsSync(envExample)) {
    const envContent = fs.readFileSync(envExample, 'utf-8');
    const envVars = envContent
      .split('\n')
      .filter(line => line && !line.startsWith('#'))
      .map(line => line.split('=')[0]);

    log('   Required variables (from .env.example):', 'bright');
    envVars.forEach(varName => {
      if (varName) log(`   - ${varName}`);
    });
  }

  // Check 6: .gitignore
  log('\n🔒 Security Check:', 'blue');
  const gitignorePath = path.join(__dirname, '.gitignore');
  const gitignore = fs.readFileSync(gitignorePath, 'utf-8');
  
  const shouldIgnore = ['.vercel', '.env'];
  const missingIgnore = shouldIgnore.filter(item => !gitignore.includes(item));
  
  if (missingIgnore.length > 0) {
    log(`❌ Missing in .gitignore: ${missingIgnore.join(', ')}`, 'red');
  } else {
    log('✅ .gitignore configured correctly', 'green');
  }

  // Summary
  log('\n📝 Next Steps:', 'blue');
  log('   1. Add GitHub Secrets (see above)', 'yellow');
  log('   2. Set Environment Variables in Vercel Dashboard', 'yellow');
  log('   3. Push to main branch to trigger deployment:', 'yellow');
  log('      git add .', 'bright');
  log('      git commit -m "chore: setup vercel deployment"', 'bright');
  log('      git push origin main', 'bright');
  log('   4. Check deployment status:', 'yellow');
  log('      GitHub: Actions tab', 'bright');
  log('      Vercel: https://vercel.com/dashboard', 'bright');

  log('\n✨ Setup information complete!\n', 'green');
}

main().catch(console.error);
