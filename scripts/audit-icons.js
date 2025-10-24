#!/usr/bin/env node

/**
 * BTDEMO Icon Usage Audit Script
 *
 * Scans codebase for Lucide icon usage and generates migration report
 *
 * Usage:
 *   node scripts/audit-icons.js                 # Full audit
 *   node scripts/audit-icons.js --json          # JSON output
 *   node scripts/audit-icons.js --missing       # Show missing btdemo icons
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Mapping of Lucide icons to btdemo icons
const iconMapping = {
  // Available in btdemo
  'Search': { btdemo: 'IconSearch', status: 'ready', priority: 'high' },
  'TrendingUp': { btdemo: 'IconPriceUp', status: 'ready', priority: 'high' },
  'TrendingDown': { btdemo: 'IconPriceDown', status: 'ready', priority: 'high' },
  'Users': { btdemo: 'IconContributorBubble', status: 'ready', priority: 'high' },
  'User': { btdemo: 'IconContributorBubble', status: 'ready', priority: 'medium' },
  'MessageCircle': { btdemo: 'IconMessage', status: 'ready', priority: 'high' },
  'X': { btdemo: 'IconClose', status: 'ready', priority: 'high' },
  'DollarSign': { btdemo: 'IconCash', status: 'ready', priority: 'high' },
  'Zap': { btdemo: 'IconLightning', status: 'ready', priority: 'high' },
  'Heart': { btdemo: 'IconUpvote', status: 'ready', priority: 'high' },
  'Bell': { btdemo: 'IconNotification', status: 'ready', priority: 'medium' },
  'Rocket': { btdemo: 'IconRocket', status: 'ready', priority: 'medium' },
  'Trophy': { btdemo: 'IconTrophy', status: 'ready', priority: 'medium' },
  'Globe': { btdemo: 'IconWeb', status: 'ready', priority: 'medium' },
  'Lock': { btdemo: 'IconFreeze', status: 'semantic-match', priority: 'medium' },
  'Activity': { btdemo: 'IconChartAnimation', status: 'semantic-match', priority: 'medium' },

  // Missing in btdemo (need creation)
  'Eye': { btdemo: 'IconEye', status: 'missing', priority: 'high' },
  'Music2': { btdemo: 'IconMusic', status: 'missing', priority: 'high' },
  'Share2': { btdemo: 'IconShare', status: 'missing', priority: 'high' },
  'Sparkles': { btdemo: 'IconSparkles', status: 'missing', priority: 'medium' },
  'Play': { btdemo: 'IconPlay', status: 'missing', priority: 'medium' },
  'Pause': { btdemo: 'IconPause', status: 'missing', priority: 'medium' },
  'Filter': { btdemo: 'IconFilter', status: 'missing', priority: 'medium' },

  // Keep Lucide (utility icons)
  'Send': { btdemo: 'Send (keep Lucide)', status: 'keep-lucide', priority: 'low' },
  'Copy': { btdemo: 'Copy (keep Lucide)', status: 'keep-lucide', priority: 'low' },
  'Check': { btdemo: 'Check (keep Lucide)', status: 'keep-lucide', priority: 'low' },
  'Upload': { btdemo: 'Upload (keep Lucide)', status: 'keep-lucide', priority: 'low' },
  'Hash': { btdemo: 'Hash (keep Lucide)', status: 'keep-lucide', priority: 'low' },
  'Image': { btdemo: 'Image (keep Lucide)', status: 'keep-lucide', priority: 'low' },
  'FileText': { btdemo: 'FileText (keep Lucide)', status: 'keep-lucide', priority: 'low' },
  'Calendar': { btdemo: 'Calendar (keep Lucide)', status: 'keep-lucide', priority: 'low' },
  'Link2': { btdemo: 'Link2 (keep Lucide)', status: 'keep-lucide', priority: 'low' },
  'Trash2': { btdemo: 'Trash2 (keep Lucide)', status: 'keep-lucide', priority: 'low' },
};

/**
 * Scan file for Lucide icon usage
 */
function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const results = [];

  // Pattern 1: import { IconName } from 'lucide-react'
  const importPattern = /import\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"]/g;
  const importMatches = [...content.matchAll(importPattern)];

  importMatches.forEach(match => {
    const imports = match[1]
      .split(',')
      .map(i => i.trim())
      .filter(i => i && !i.includes('LucideIcon')); // Skip type imports

    imports.forEach(iconName => {
      // Find usage locations
      const usagePattern = new RegExp(`<${iconName}[\\s/>]`, 'g');
      const usageMatches = [...content.matchAll(usagePattern)];

      results.push({
        iconName,
        mapping: iconMapping[iconName],
        usageCount: usageMatches.length,
        hasImport: true,
      });
    });
  });

  return results;
}

/**
 * Generate migration report
 */
function generateReport(findings) {
  const report = {
    summary: {
      totalFiles: findings.length,
      totalIcons: 0,
      totalUsages: 0,
      ready: 0,
      missing: 0,
      keepLucide: 0,
    },
    byStatus: {
      ready: [],
      missing: [],
      'keep-lucide': [],
      'semantic-match': [],
      unknown: [],
    },
    byPriority: {
      high: [],
      medium: [],
      low: [],
    },
    fileDetails: [],
  };

  findings.forEach(({ file, icons }) => {
    const fileReport = {
      file,
      icons: icons.map(icon => ({
        name: icon.iconName,
        btdemo: icon.mapping?.btdemo || 'Unknown',
        status: icon.mapping?.status || 'unknown',
        priority: icon.mapping?.priority || 'unknown',
        usageCount: icon.usageCount,
      })),
    };

    report.fileDetails.push(fileReport);

    icons.forEach(icon => {
      report.summary.totalIcons++;
      report.summary.totalUsages += icon.usageCount;

      const status = icon.mapping?.status || 'unknown';
      const priority = icon.mapping?.priority || 'unknown';

      // Count by status
      if (status === 'ready' || status === 'semantic-match') {
        report.summary.ready++;
      } else if (status === 'missing') {
        report.summary.missing++;
      } else if (status === 'keep-lucide') {
        report.summary.keepLucide++;
      }

      // Group by status
      if (!report.byStatus[status].find(i => i.name === icon.iconName)) {
        report.byStatus[status].push({
          name: icon.iconName,
          btdemo: icon.mapping?.btdemo || 'Unknown',
          usageCount: icon.usageCount,
          files: [file],
        });
      } else {
        const existing = report.byStatus[status].find(i => i.name === icon.iconName);
        existing.usageCount += icon.usageCount;
        existing.files.push(file);
      }

      // Group by priority
      if (!report.byPriority[priority].find(i => i.name === icon.iconName)) {
        report.byPriority[priority].push({
          name: icon.iconName,
          btdemo: icon.mapping?.btdemo || 'Unknown',
          status,
          usageCount: icon.usageCount,
        });
      }
    });
  });

  return report;
}

/**
 * Print human-readable report
 */
function printReport(report, options = {}) {
  console.log('\n🔍 BTDEMO Icon Usage Audit');
  console.log('===========================\n');

  // Summary
  console.log('📊 Summary:');
  console.log(`  Total files scanned:      ${report.summary.totalFiles}`);
  console.log(`  Total unique icons:       ${report.summary.totalIcons}`);
  console.log(`  Total icon usages:        ${report.summary.totalUsages}`);
  console.log(`  Ready to migrate:         ${report.summary.ready} ✅`);
  console.log(`  Need creation:            ${report.summary.missing} ⚠️`);
  console.log(`  Keep Lucide:              ${report.summary.keepLucide} 📌`);

  // Ready icons
  if (report.byStatus.ready.length > 0) {
    console.log('\n\n✅ Ready to Migrate (btdemo icon exists):');
    console.log('─'.repeat(80));
    report.byStatus.ready.forEach(icon => {
      console.log(`  ${icon.name.padEnd(20)} → ${icon.btdemo.padEnd(30)} (${icon.usageCount} usages)`);
      if (options.verbose) {
        console.log(`    Files: ${icon.files.slice(0, 3).join(', ')}${icon.files.length > 3 ? '...' : ''}`);
      }
    });
  }

  // Missing icons
  if (report.byStatus.missing.length > 0) {
    console.log('\n\n⚠️  Missing Icons (need creation):');
    console.log('─'.repeat(80));
    report.byStatus.missing.forEach(icon => {
      console.log(`  ${icon.name.padEnd(20)} → ${icon.btdemo.padEnd(30)} (${icon.usageCount} usages)`);
      if (options.verbose) {
        console.log(`    Files: ${icon.files.slice(0, 3).join(', ')}${icon.files.length > 3 ? '...' : ''}`);
      }
    });
  }

  // Keep Lucide
  if (report.byStatus['keep-lucide'].length > 0 && !options.showMissing) {
    console.log('\n\n📌 Keep Lucide (utility icons):');
    console.log('─'.repeat(80));
    report.byStatus['keep-lucide'].slice(0, 5).forEach(icon => {
      console.log(`  ${icon.name.padEnd(20)} → ${icon.btdemo.padEnd(30)} (${icon.usageCount} usages)`);
    });
    if (report.byStatus['keep-lucide'].length > 5) {
      console.log(`  ... and ${report.byStatus['keep-lucide'].length - 5} more`);
    }
  }

  // High priority icons
  console.log('\n\n🔥 High Priority Migration:');
  console.log('─'.repeat(80));
  report.byPriority.high.forEach(icon => {
    const statusIcon = icon.status === 'ready' ? '✅' : icon.status === 'missing' ? '⚠️' : '📌';
    console.log(`  ${statusIcon} ${icon.name.padEnd(20)} → ${icon.btdemo.padEnd(30)} (${icon.usageCount} usages)`);
  });

  // Next steps
  console.log('\n\n💡 Next Steps:');
  console.log('─'.repeat(80));
  if (report.summary.missing > 0) {
    console.log(`  1. Create ${report.summary.missing} missing icon(s) in lib/icons/custom/`);
  }
  console.log(`  2. Run: node scripts/migrate-icons.js --apply`);
  console.log(`  3. Test icon rendering in /btdemo page`);
  console.log(`  4. Visual regression test with Percy`);

  if (options.showMissing && report.byStatus.missing.length > 0) {
    console.log('\n\n🎨 Icon Creation Tasks:');
    console.log('─'.repeat(80));
    report.byStatus.missing.forEach(icon => {
      console.log(`\n  Create: ${icon.btdemo}`);
      console.log(`  ├─ Used in: ${icon.files.length} file(s)`);
      console.log(`  ├─ Total usages: ${icon.usageCount}`);
      console.log(`  └─ Template: lib/icons/custom/IconTemplate.tsx`);
    });
  }
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);
  const jsonOutput = args.includes('--json');
  const showMissing = args.includes('--missing');
  const verbose = args.includes('--verbose');

  // Scan all files
  const files = glob.sync('**/*.{tsx,ts}', {
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

  const findings = [];

  files.forEach(file => {
    const filePath = path.resolve(process.cwd(), file);
    const icons = scanFile(filePath);

    if (icons.length > 0) {
      findings.push({ file, icons });
    }
  });

  // Generate report
  const report = generateReport(findings);

  // Output
  if (jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    printReport(report, { showMissing, verbose });
  }
}

// Run if called directly
if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

module.exports = { scanFile, generateReport, iconMapping };
