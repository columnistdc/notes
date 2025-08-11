# GitHub Actions

This project uses several GitHub Actions for development automation and deployment.

## Workflows

### 1. CI (`.github/workflows/ci.yml`)

Main workflow for continuous integration:

- Triggers on push to `main` and `develop` branches
- Triggers on Pull Request creation
- Tests code on different Node.js versions (18.x, 20.x)
- Performs:
  - TypeScript type checking
  - ESLint linting
  - Vitest test execution
  - Project build
  - npm security audit

### 2. Deploy (`.github/workflows/deploy.yml`)

Automatic deployment to GitHub Pages:

- Triggers on push to `main` branch
- Can be triggered manually via workflow_dispatch
- Builds project using Vite
- Deploys to GitHub Pages

### 3. CodeQL (`.github/workflows/code-quality.yml`)

Code security analysis:

- Triggers on push and PR to `main` and `develop`
- Weekly scheduled execution
- Analyzes JavaScript/TypeScript code for vulnerabilities
- Uses GitHub CodeQL

### 4. Dependency Review (`.github/workflows/dependency-review.yml`)

Dependency checking:

- Triggers on Pull Request creation
- Analyzes changes in package.json and package-lock.json
- Checks dependencies for vulnerabilities
- Blocks PR when vulnerabilities of moderate level or higher are detected

## Setup

### GitHub Pages

To enable deployment:

1. Enable GitHub Pages in repository settings
2. Select "GitHub Actions" as source
3. Ensure Actions have write permissions to Pages

### Security

All workflows use minimal required permissions for security.

## Local Development

Before pushing code, ensure all checks pass:

```bash
npm run typecheck  # Type checking
npm run lint       # Linting
npm run test:run   # Tests
npm run build      # Build
```
