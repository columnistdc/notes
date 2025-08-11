#!/usr/bin/env node
import { execSync } from 'child_process';

try {
  console.warn('🔍 Running pre-push checks...');
  
  console.warn('📝 Running type checking...');
  execSync('npm run typecheck', { stdio: 'inherit' });
  
  console.warn('🔍 Running linting...');
  execSync('npm run lint', { stdio: 'inherit' });
  
  console.warn('✅ Pre-push checks passed');
} catch {
  console.error('❌ Pre-push checks failed');
  process.exit(1);
}
