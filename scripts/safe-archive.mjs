#!/usr/bin/env node
/**
 * Safe Archive Script
 * Moves unused files to .archive/ instead of deleting
 * Run with: APPLY=1 to actually move files (default is DRY RUN)
 */

import { mkdir, copyFile, unlink, readFile } from 'fs/promises';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

const DRY_RUN = !process.env.APPLY;

// Files identified as unused from audit (2025-10-19)
const UNUSED_FILES = [
  // Mock data files with 0 references
  'lib/mockNetworkData.ts',
  'lib/mockProfileData.ts',
  'lib/mock-data.ts',
  'lib/sampleData.ts',
  // Hooks with 0 references
  'hooks/useSolanaBuyKeysMock.ts',
  'hooks/useTestSolanaTransaction.ts',
  'hooks/useSimpleSolanaTransaction.ts',
  'hooks/useConnectSolanaWallet.ts',
];

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

async function archiveFile(filePath) {
  const sourcePath = join(ROOT, filePath);
  const archivePath = join(ROOT, '.archive', filePath);
  const archiveDir = dirname(archivePath);

  if (!existsSync(sourcePath)) {
    log.warn(`File not found: ${filePath} (already removed?)`);
    return false;
  }

  if (DRY_RUN) {
    log.info(`[DRY RUN] Would archive: ${filePath} → .archive/${filePath}`);
    return true;
  }

  try {
    // Create archive directory
    await mkdir(archiveDir, { recursive: true });

    // Copy file to archive
    await copyFile(sourcePath, archivePath);
    log.success(`Archived: ${filePath}`);

    // Delete original
    await unlink(sourcePath);
    log.success(`Removed: ${filePath}`);

    return true;
  } catch (error) {
    log.error(`Failed to archive ${filePath}: ${error.message}`);
    return false;
  }
}

async function main() {
  log.section('🗄️  Safe Archive Script');

  if (DRY_RUN) {
    log.warn('DRY RUN MODE - No files will be moved');
    log.info('To actually archive files, run: APPLY=1 node scripts/safe-archive.mjs');
  } else {
    log.warn('APPLY MODE - Files WILL be moved to .archive/');
  }

  log.info(`Files to archive: ${UNUSED_FILES.length}`);

  let archived = 0;
  let failed = 0;
  let notFound = 0;

  for (const file of UNUSED_FILES) {
    const result = await archiveFile(file);
    if (result === true) {
      archived++;
    } else if (result === false && existsSync(join(ROOT, file))) {
      failed++;
    } else {
      notFound++;
    }
  }

  log.section('📊 Summary');
  log.info(`Total files: ${UNUSED_FILES.length}`);
  log.success(`Archived: ${archived}`);
  log.error(`Failed: ${failed}`);
  log.warn(`Not found: ${notFound}`);

  if (DRY_RUN && archived > 0) {
    log.section('🚀 Next Steps');
    console.log(`Run: APPLY=1 node scripts/safe-archive.mjs`);
  }

  if (!DRY_RUN && archived > 0) {
    log.section('✅ Cleanup Complete');
    console.log(`Files have been moved to .archive/ directory.`);
    console.log(`Test your app with: npm run dev`);
    console.log(`If everything works, you can delete .archive/ later.`);
  }
}

main().catch(console.error);
