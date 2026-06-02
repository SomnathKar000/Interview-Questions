import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs';
import { join, basename, extname } from 'path';

// Map of file path patterns to sidebar positions
const sidebarPositions = {
  // intro
  'intro.md': 0,
  // javascript (numbered files get their number)
  // react
  'Index.md': 1,
  'Hooks.md': 2,
  'React Component Lifecycle.md': 3,
  'Redux Toolkit.md': 4,
  // backend
  'How NodeJS Works.md': 1,
  'Http Status Codes.md': 2,
  'SSH.md': 3,
  'Kafka Basic.md': 1,
  // database
  'SQL vs NoSQL.md': 1,
  'Handle Database Transactions.md': 2,
  // cloud
  'Horizontal vs Vertical Scaling.md': 1,
  // dsa
  'Operators.md': 1,
};

function extractTitleFromFilename(filename) {
  // Remove leading "N. " numbering
  let name = filename.replace(/^\d+\.\s*/, '');
  // Remove .md extension
  name = name.replace(/\.md$/, '');
  return name;
}

function getSidebarPosition(filename, dirName) {
  // For numbered JS files, extract the number
  const match = filename.match(/^(\d+)\./);
  if (match) return parseInt(match[1]);
  return sidebarPositions[filename] ?? 99;
}

function hasFrontmatter(content) {
  return content.trimStart().startsWith('---');
}

function addFrontmatter(filePath) {
  const content = readFileSync(filePath, 'utf8');
  if (hasFrontmatter(content)) {
    console.log(`  SKIP (already has frontmatter): ${filePath}`);
    return;
  }

  const filename = basename(filePath);
  const dirName = filePath.split('/').slice(-2)[0];
  const title = extractTitleFromFilename(filename);
  const position = getSidebarPosition(filename, dirName);

  const frontmatter = `---\ntitle: "${title}"\nsidebar_position: ${position}\n---\n\n`;
  writeFileSync(filePath, frontmatter + content, 'utf8');
  console.log(`  ADDED: ${filePath} → "${title}" (pos: ${position})`);
}

function walkDir(dir) {
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (extname(entry) === '.md') {
      addFrontmatter(fullPath);
    }
  }
}

console.log('Adding frontmatter to all docs...\n');
walkDir('docs');
console.log('\nDone!');
