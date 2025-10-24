#!/usr/bin/env node

/**
 * BTDEMO Color Migration Script
 *
 * Automatically replaces old color schemes with btdemo primary color (#D1FD0A)
 *
 * Usage:
 *   node scripts/migrate-colors.js              # Dry run (preview changes)
 *   node scripts/migrate-colors.js --apply      # Apply changes
 *   node scripts/migrate-colors.js --file path  # Single file
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Color replacement mappings
const replacements = [
  // Text colors
  { pattern: /text-\[#00FFFF\]/g, replacement: 'text-primary', category: 'text' },
  { pattern: /text-\[#00FF88\]/g, replacement: 'text-primary', category: 'text' },
  { pattern: /text-cyan-400/g, replacement: 'text-primary', category: 'text' },
  { pattern: /text-cyan-500/g, replacement: 'text-primary', category: 'text' },
  { pattern: /text-cyan-600/g, replacement: 'text-primary', category: 'text' },

  // Background colors
  { pattern: /bg-cyan-500\/20/g, replacement: 'bg-primary/20', category: 'background' },
  { pattern: /bg-cyan-500\/10/g, replacement: 'bg-primary/10', category: 'background' },
  { pattern: /bg-\[#00FFFF\]\/20/g, replacement: 'bg-primary/20', category: 'background' },
  { pattern: /bg-\[#00FF88\]\/20/g, replacement: 'bg-primary/20', category: 'background' },

  // Border colors
  { pattern: /border-cyan-500/g, replacement: 'border-primary', category: 'border' },
  { pattern: /border-cyan-500\/30/g, replacement: 'border-primary/30', category: 'border' },
  { pattern: /border-cyan-500\/50/g, replacement: 'border-primary/50', category: 'border' },
  { pattern: /border-\[#00FFFF\]/g, replacement: 'border-primary', category: 'border' },
  { pattern: /border-\[#00FF88\]/g, replacement: 'border-primary', category: 'border' },

  // Gradient colors (from)
  { pattern: /from-cyan-500/g, replacement: 'from-primary', category: 'gradient' },
  { pattern: /from-\[#00FFFF\]/g, replacement: 'from-primary', category: 'gradient' },
  { pattern: /from-\[#00FF88\]/g, replacement: 'from-primary', category: 'gradient' },

  // Gradient colors (to)
  { pattern: /to-cyan-600/g, replacement: 'to-primary', category: 'gradient' },
  { pattern: /to-cyan-500/g, replacement: 'to-primary', category: 'gradient' },
  { pattern: /to-\[#00FFFF\]/g, replacement: 'to-primary', category: 'gradient' },
  { pattern: /to-\[#00FF88\]/g, replacement: 'to-primary/80', category: 'gradient' },

  // Ring colors (focus states)
  { pattern: /ring-cyan-500/g, replacement: 'ring-primary', category: 'ring' },
  { pattern: /ring-\[#00FFFF\]/g, replacement: 'ring-primary', category: 'ring' },

  // Complex gradients (multi-color)
  {
    pattern: /from-\[#00FFFF\]\s+to-\[#00FF88\]/g,
    replacement: 'from-primary to-primary/80',
    category: 'complex-gradient'
  },
  {
    pattern: /bg-gradient-to-r\s+from-\[#FFD700\]\s+to-\[#FFC700\]/g,
    replacement: 'bg-gradient-to-r from-primary to-primary/90',
    category: 'complex-gradient'
  },
];

// Stats tracking
const stats = {
  filesScanned: 0,
  filesModified: 0,
  totalReplacements: 0,
  replacementsByCategory: {},
};

/**
 * Process a single file
 */
function processFile(filePath, applyChanges = false) {
  const originalContent = fs.readFileSync(filePath, 'utf8');
  let content = originalContent;
  let fileModified = false;
  const fileReplacements = [];

  replacements.forEach(({ pattern, replacement, category }) => {
    const matches = content.match(pattern);

    if (matches) {
      const count = matches.length;
      content = content.replace(pattern, replacement);
      fileModified = true;

      fileReplacements.push({
        category,
        pattern: pattern.source,
        replacement,
        count,
      });

      // Update stats
      stats.totalReplacements += count;
      stats.replacementsByCategory[category] =
        (stats.replacementsByCategory[category] || 0) + count;
    }
  });

  stats.filesScanned++;

  if (fileModified) {
    stats.filesModified++;

    console.log(`\n📝 ${filePath}`);
    fileReplacements.forEach(({ category, replacement, count }) => {
      console.log(`   ${category}: ${count} replacement(s) → ${replacement}`);
    });

    if (applyChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`   ✅ Changes applied`);
    } else {
      console.log(`   ⏸️  Dry run (use --apply to save changes)`);
    }
  }

  return { modified: fileModified, content };
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);
  const applyChanges = args.includes('--apply');
  const fileArg = args.find(arg => arg.startsWith('--file='));
  const singleFile = fileArg ? fileArg.split('=')[1] : null;

  console.log('🎨 BTDEMO Color Migration Script');
  console.log('=================================\n');

  if (applyChanges) {
    console.log('⚠️  APPLYING CHANGES - Files will be modified!\n');
  } else {
    console.log('🔍 DRY RUN - No files will be modified\n');
  }

  // Get files to process
  let files;
  if (singleFile) {
    files = [singleFile];
    console.log(`Processing single file: ${singleFile}\n`);
  } else {
    files = glob.sync('**/*.{tsx,ts,css}', {
      cwd: process.cwd(),
      ignore: [
        'node_modules/**',
        '.next/**',
        'dist/**',
        'build/**',
        'scripts/**',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
      ],
    });
    console.log(`Found ${files.length} files to scan\n`);
  }

  // Process each file
  files.forEach(file => {
    const filePath = path.resolve(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      processFile(filePath, applyChanges);
    }
  });

  // Print summary
  console.log('\n\n📊 Migration Summary');
  console.log('===================');
  console.log(`Files scanned:     ${stats.filesScanned}`);
  console.log(`Files modified:    ${stats.filesModified}`);
  console.log(`Total changes:     ${stats.totalReplacements}`);
  console.log('\nReplacements by category:');

  Object.entries(stats.replacementsByCategory)
    .sort((a, b) => b[1] - a[1])
    .forEach(([category, count]) => {
      console.log(`  ${category.padEnd(20)} ${count}`);
    });

  if (!applyChanges && stats.filesModified > 0) {
    console.log('\n💡 To apply these changes, run:');
    console.log('   node scripts/migrate-colors.js --apply');
  } else if (applyChanges && stats.filesModified > 0) {
    console.log('\n✅ Migration complete!');
    console.log('\n⚠️  Next steps:');
    console.log('   1. Review changes with: git diff');
    console.log('   2. Test the application: npm run dev');
    console.log('   3. Run TypeScript check: tsc --noEmit');
    console.log('   4. Commit changes: git add . && git commit -m "feat: migrate to btdemo colors"');
  }
}

// Run if called directly
if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

module.exports = { processFile };
