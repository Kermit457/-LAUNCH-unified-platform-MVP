#!/usr/bin/env node
/**
 * Codebase Health Check & Audit
 * Analyzes mock data usage, orphaned files, and dead imports
 * SAFE: Read-only analysis, no deletions
 */

import { readdir, readFile, stat } from 'fs/promises';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  section: (msg) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}\n`),
};

// Files to analyze
const MOCK_FILES = [
  'lib/dashboardMockData.ts',
  'lib/livePitchMockData.ts',
  'lib/unifiedMockData.ts',
  'lib/advancedTradingData.ts',
  'lib/mockChartData.ts',
  'lib/mockNetworkData.ts',
  'lib/mockProfileData.ts',
  'lib/mock-data.ts',
  'lib/leaderboardData.ts',
  'lib/sampleData.ts',
  'lib/landingData.ts',
];

const HOOK_FILES_TO_CHECK = [
  'hooks/useSolanaBuyKeysMock.ts',
  'hooks/useTestSolanaTransaction.ts',
  'hooks/useSimpleSolanaTransaction.ts',
  'hooks/useConnectSolanaWallet.ts',
];

async function findAllFiles(dir, pattern, exclude = []) {
  const files = [];

  async function walk(currentDir) {
    const entries = await readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name);

      // Skip excluded paths
      if (exclude.some(ex => fullPath.includes(ex))) continue;

      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (pattern.test(entry.name)) {
        files.push(fullPath);
      }
    }
  }

  await walk(dir);
  return files;
}

async function searchForImport(file, searchPaths) {
  const content = await readFile(file, 'utf-8');
  const found = [];

  for (const searchPath of searchPaths) {
    const importName = searchPath.replace(/^lib\//, '@/lib/').replace(/\.tsx?$/, '');
    if (content.includes(importName) || content.includes(searchPath)) {
      found.push(searchPath);
    }
  }

  return found;
}

async function analyzeFile(filePath) {
  try {
    const stats = await stat(join(ROOT, filePath));
    const exists = stats.isFile();
    return { exists, size: stats.size };
  } catch {
    return { exists: false, size: 0 };
  }
}

async function main() {
  log.section('🔍 CODEBASE HEALTH CHECK');

  // 1. Analyze Mock Data Files
  log.section('📊 Mock Data Files Analysis');

  const mockAnalysis = [];

  for (const mockFile of MOCK_FILES) {
    const fileInfo = await analyzeFile(mockFile);

    if (!fileInfo.exists) {
      log.info(`${mockFile} - NOT FOUND (already removed?)`);
      continue;
    }

    // Search for imports in app/ directory
    const appFiles = await findAllFiles(join(ROOT, 'app'), /\.(tsx?|jsx?)$/, ['node_modules', '.next']);
    const componentFiles = await findAllFiles(join(ROOT, 'components'), /\.(tsx?|jsx?)$/, ['node_modules']);

    const allFiles = [...appFiles, ...componentFiles];
    const importedBy = [];

    for (const file of allFiles) {
      const found = await searchForImport(file, [mockFile]);
      if (found.length > 0) {
        importedBy.push(relative(ROOT, file));
      }
    }

    const status = importedBy.length > 0 ? 'USED' : 'UNUSED';
    const color = importedBy.length > 0 ? colors.green : colors.red;

    console.log(`${color}${status}${colors.reset} ${mockFile} (${fileInfo.size} bytes)`);
    if (importedBy.length > 0) {
      console.log(`      Referenced by: ${importedBy.join(', ')}`);
    }

    mockAnalysis.push({
      file: mockFile,
      status,
      size: fileInfo.size,
      references: importedBy.length,
      importedBy,
    });
  }

  // 2. Analyze Hooks
  log.section('🪝 Hook Files Analysis');

  const hookAnalysis = [];

  for (const hookFile of HOOK_FILES_TO_CHECK) {
    const fileInfo = await analyzeFile(hookFile);

    if (!fileInfo.exists) {
      log.info(`${hookFile} - NOT FOUND (already removed?)`);
      continue;
    }

    const allFiles = await findAllFiles(join(ROOT, 'app'), /\.(tsx?|jsx?)$/, ['node_modules', '.next']);
    const importedBy = [];

    for (const file of allFiles) {
      const found = await searchForImport(file, [hookFile]);
      if (found.length > 0) {
        importedBy.push(relative(ROOT, file));
      }
    }

    const status = importedBy.length > 0 ? 'USED' : 'UNUSED';
    const color = importedBy.length > 0 ? colors.green : colors.red;

    console.log(`${color}${status}${colors.reset} ${hookFile}`);
    if (importedBy.length > 0) {
      console.log(`      Referenced by: ${importedBy.join(', ')}`);
    }

    hookAnalysis.push({
      file: hookFile,
      status,
      references: importedBy.length,
      importedBy,
    });
  }

  // 3. Summary Report
  log.section('📋 Summary Report');

  const unusedMocks = mockAnalysis.filter(m => m.status === 'UNUSED');
  const usedMocks = mockAnalysis.filter(m => m.status === 'USED');
  const unusedHooks = hookAnalysis.filter(h => h.status === 'UNUSED');

  log.info(`Total Mock Files: ${mockAnalysis.length}`);
  log.success(`  Used: ${usedMocks.length}`);
  log.warn(`  Unused: ${unusedMocks.length}`);

  log.info(`Total Hook Files Checked: ${hookAnalysis.length}`);
  log.success(`  Used: ${hookAnalysis.filter(h => h.status === 'USED').length}`);
  log.warn(`  Unused: ${unusedHooks.length}`);

  // 4. Recommendations
  log.section('💡 Recommendations');

  if (unusedMocks.length > 0) {
    log.warn('Safe to archive these UNUSED mock files:');
    unusedMocks.forEach(m => console.log(`  - ${m.file}`));
  }

  if (unusedHooks.length > 0) {
    log.warn('Safe to archive these UNUSED hooks:');
    unusedHooks.forEach(h => console.log(`  - ${h.file}`));
  }

  if (usedMocks.length > 0) {
    log.info('These mock files are ACTIVELY USED (keep for now):');
    usedMocks.forEach(m => {
      console.log(`  - ${m.file}`);
      console.log(`    Used in: ${m.importedBy.join(', ')}`);
    });
  }

  // 5. CSV Export
  log.section('📄 Generating CSV Report');

  const csv = [
    'Type,File,Status,References,ImportedBy',
    ...mockAnalysis.map(m =>
      `Mock,${m.file},${m.status},${m.references},"${m.importedBy.join('; ')}"`,
    ),
    ...hookAnalysis.map(h =>
      `Hook,${h.file},${h.status},${h.references},"${h.importedBy.join('; ')}"`,
    ),
  ].join('\n');

  const csvPath = join(ROOT, 'AUDIT_REPORT.csv');
  await import('fs').then(fs => fs.promises.writeFile(csvPath, csv));

  log.success(`Report saved to: AUDIT_REPORT.csv`);

  // 6. Next Steps
  log.section('🚀 Next Steps');
  console.log(`
1. Review AUDIT_REPORT.csv for detailed analysis
2. For UNUSED files, run: node scripts/safe-archive.mjs
3. For USED mock files, consider replacing with real Appwrite queries
4. After archiving, test the app: npm run dev
  `);
}

main().catch(console.error);
