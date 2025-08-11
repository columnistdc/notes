
import { execSync } from 'child_process';

try {
  console.warn('🔍 Running pre-commit checks...');
  execSync('npx lint-staged', { stdio: 'inherit' });
  console.warn('✅ Pre-commit checks passed');
} catch (e) {
  console.error('❌ Pre-commit checks failed', e);
  process.exit(1);
}