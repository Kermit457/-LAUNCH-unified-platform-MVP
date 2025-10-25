const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Finding unused components...\n');

// Get all component files
const componentsCmd = 'find components -name "*.tsx" -type f 2>/dev/null || dir /b /s components\\*.tsx 2>nul';
let components = [];

try {
  const output = execSync(componentsCmd, { encoding: 'utf-8' });
  components = output.trim().split('\n').filter(Boolean);
} catch (e) {
  console.error('Error finding components:', e.message);
  process.exit(1);
}

console.log(`Found ${components.length} total components`);

const unused = [];
const corePages = ['discover', 'launch', 'clip', 'chat', 'network', 'profile'];

for (const componentPath of components) {
  const basename = path.basename(componentPath, '.tsx');
  const dirName = path.dirname(componentPath);

  // Skip if in btdemo (used by core pages)
  if (dirName.includes('btdemo')) continue;

  // Skip if in blast (active feature)
  if (dirName.includes('blast') || dirName.includes('BLAST')) continue;

  let used = false;

  // Search for imports in core 6 pages
  for (const page of corePages) {
    try {
      const searchCmd = `grep -r "import.*${basename}" app/${page} 2>/dev/null || findstr /s /m "${basename}" app\\${page}\\*.tsx 2>nul`;
      const result = execSync(searchCmd, { encoding: 'utf-8' }).trim();
      if (result) {
        used = true;
        break;
      }
    } catch (e) {
      // No matches, continue
    }
  }

  // Also check if used in other components
  if (!used) {
    try {
      const searchCmd = `grep -r "import.*${basename}" components 2>/dev/null || findstr /s /m "${basename}" components\\*.tsx 2>nul`;
      const result = execSync(searchCmd, { encoding: 'utf-8' }).trim();
      if (result && !result.includes(componentPath)) {
        used = true;
      }
    } catch (e) {
      // No matches
    }
  }

  if (!used) {
    unused.push(componentPath);
  }
}

console.log(`\n📊 Results:`);
console.log(`   Used: ${components.length - unused.length}`);
console.log(`   Unused: ${unused.length}`);

if (unused.length > 0) {
  console.log(`\n🗑️  Unused components:\n`);
  unused.forEach(c => console.log(`   ${c}`));

  fs.writeFileSync('unused-components.txt', unused.join('\n'));
  console.log(`\n✅ Written to unused-components.txt`);
  console.log(`\n⚠️  Review this list before deleting!`);
  console.log(`   Some may be used by routes not yet checked.`);
} else {
  console.log(`\n✅ All components are used!`);
}
