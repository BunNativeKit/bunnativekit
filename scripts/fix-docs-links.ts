#!/usr/bin/env bun
/**
 * Fix broken links in auto-generated API docs for fumadocs.
 * 
 * Fumadocs' createRelativeLink requires:
 * 1. Links must start with ./ or ../
 * 2. Links must end with .md or .mdx extension
 * 
 * This script converts:
 * - `namespaces/cache/index` -> `./namespaces/cache/index.md`
 * - `classes/SafeResult` -> `./classes/SafeResult.md`
 * - `../cli/functions/runCLI` -> `../cli/functions/runCLI.md`
 */

import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import { join, relative, dirname } from "node:path";
import { existsSync } from "node:fs";

const API_DOCS_DIR = join(import.meta.dir, "../apps/docs/content/docs/api");

// Regex to match markdown links: [text](url)
// Captures: [1] = link text, [2] = url
const LINK_REGEX = /\[([^\]]*)\]\(([^)]+)\)/g;

interface FixResult {
  file: string;
  fixes: Array<{ original: string; fixed: string }>;
}

async function getAllMdFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  
  async function walk(currentDir: string) {
    const entries = await readdir(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.name.endsWith(".md") || entry.name.endsWith(".mdx")) {
        files.push(fullPath);
      }
    }
  }
  
  await walk(dir);
  return files;
}

function isExternalLink(url: string): boolean {
  return url.startsWith("http://") || 
         url.startsWith("https://") || 
         url.startsWith("mailto:") ||
         url.startsWith("#");
}

function fixLink(url: string, sourceFilePath: string): string {
  // Skip external links and anchor links
  if (isExternalLink(url)) {
    return url;
  }
  
  // Split into path and hash parts
  const hashIndex = url.indexOf("#");
  let pathPart = hashIndex >= 0 ? url.slice(0, hashIndex) : url;
  const hashPart = hashIndex >= 0 ? url.slice(hashIndex) : "";
  
  // Skip if already has .md or .mdx extension
  if (pathPart.endsWith(".md") || pathPart.endsWith(".mdx")) {
    // Just ensure it starts with ./ or ../
    if (!pathPart.startsWith("./") && !pathPart.startsWith("../")) {
      return "./" + pathPart + hashPart;
    }
    return url;
  }
  
  // Add ./ prefix if needed
  if (!pathPart.startsWith("./") && !pathPart.startsWith("../")) {
    pathPart = "./" + pathPart;
  }
  
  // Resolve the actual file path to determine if it's a folder with index.md or a direct .md file
  const sourceDir = dirname(sourceFilePath);
  const relativePath = pathPart.startsWith("./") ? pathPart.slice(2) : pathPart;
  const absoluteTarget = join(sourceDir, relativePath);
  
  // Check if target is a directory (would have index.md)
  const targetAsDir = absoluteTarget;
  const targetIndexMd = join(targetAsDir, "index.md");
  const targetAsMd = absoluteTarget + ".md";
  
  if (existsSync(targetIndexMd)) {
    // It's a folder with index.md
    pathPart = pathPart + "/index.md";
  } else if (existsSync(targetAsMd)) {
    // It's a direct .md file
    pathPart = pathPart + ".md";
  } else {
    // Fallback: assume it's a .md file (for files that might not exist yet)
    pathPart = pathPart + ".md";
  }
  
  return pathPart + hashPart;
}

async function fixFileLinks(filePath: string): Promise<FixResult | null> {
  const content = await readFile(filePath, "utf-8");
  const fixes: Array<{ original: string; fixed: string }> = [];
  
  const fixedContent = content.replace(LINK_REGEX, (match, text, url) => {
    const fixedUrl = fixLink(url, filePath);
    
    if (fixedUrl !== url) {
      fixes.push({ original: url, fixed: fixedUrl });
      return `[${text}](${fixedUrl})`;
    }
    
    return match;
  });
  
  if (fixes.length > 0) {
    await writeFile(filePath, fixedContent, "utf-8");
    return { file: relative(API_DOCS_DIR, filePath), fixes };
  }
  
  return null;
}

async function main() {
  console.log("🔍 Scanning API docs for broken links...\n");
  
  const files = await getAllMdFiles(API_DOCS_DIR);
  console.log(`Found ${files.length} markdown files\n`);
  
  let totalFixes = 0;
  const results: FixResult[] = [];
  
  for (const file of files) {
    const result = await fixFileLinks(file);
    if (result) {
      results.push(result);
      totalFixes += result.fixes.length;
    }
  }
  
  if (results.length === 0) {
    console.log("✅ No broken links found!");
    return;
  }
  
  console.log(`📝 Fixed ${totalFixes} links in ${results.length} files:\n`);
  
  for (const result of results) {
    console.log(`  ${result.file}:`);
    for (const fix of result.fixes) {
      console.log(`    - ${fix.original} → ${fix.fixed}`);
    }
    console.log();
  }
  
  console.log("✅ Done!");
}

main().catch(console.error);
