#!/usr/bin/env node
/**
 * Etsy Listing Creator
 *
 * Creates a complete Etsy listing from a product directory:
 * 1. Creates draft listing with title, description, price, tags
 * 2. Uploads listing images (up to 10)
 * 3. Uploads digital download file
 * 4. Optionally publishes the listing
 *
 * Usage:
 *   node scripts/etsy/etsy-list.mjs <product-slug> [--publish]
 *
 * Expects product directory at products/<slug>/ with:
 *   - listing.md or description.md (YAML frontmatter with title, price, tags, category)
 *   - etsy/ directory with listing images (*.png, *.jpg)
 *   - A PDF or ZIP file as the digital download
 *
 * Or reads from Notion Digital Products DB entry (when invoked by Claude).
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { etsyFetch, getShopId } from './etsy-client.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PRODUCTS_DIR = join(__dirname, '..', '..', 'products');

// Etsy taxonomy IDs for common digital product categories
const TAXONOMY_MAP = {
  'digital_download': 69,        // Craft Supplies & Tools
  'template': 2078,              // Paper & Party Supplies > Templates
  'planner': 2078,
  'prompt_pack': 69,
  'ebook': 69,
  'guide': 69,
  'checklist': 69,
  'spreadsheet': 69,
  'notion_template': 69,
};

function parseProductDir(slug) {
  const dir = join(PRODUCTS_DIR, slug);
  if (!existsSync(dir)) {
    throw new Error(`Product directory not found: ${dir}`);
  }

  // Prefer etsy-config.json (structured, reliable)
  const configPath = join(dir, 'etsy-config.json');
  if (existsSync(configPath)) {
    const config = JSON.parse(readFileSync(configPath, 'utf8'));

    // Find images in etsy/ subdirectory, then main dir
    const etsyDir = join(dir, 'etsy');
    let images = [];
    if (existsSync(etsyDir)) {
      images = readdirSync(etsyDir)
        .filter(f => /\.(png|jpg|jpeg|gif|webp)$/i.test(f))
        .sort()
        .slice(0, 10)
        .map(f => join(etsyDir, f));
    }
    if (images.length === 0) {
      images = readdirSync(dir)
        .filter(f => /\.(png|jpg|jpeg)$/i.test(f))
        .sort()
        .slice(0, 10)
        .map(f => join(dir, f));
    }

    // Resolve download file
    let downloadFile = null;
    if (config.downloadFile) {
      downloadFile = join(dir, config.downloadFile);
    } else {
      const downloads = readdirSync(dir).filter(f => /\.(pdf|zip)$/i.test(f));
      if (downloads.length > 0) downloadFile = join(dir, downloads[0]);
    }

    return {
      slug,
      dir,
      title: config.title,
      description: config.description,
      price: config.price || 9.99,
      tags: config.tags || [],
      category: config.category || 'digital_download',
      images,
      downloadFile,
    };
  }

  // Fallback: parse listing.md or description.md with YAML frontmatter
  let metaFile;
  if (existsSync(join(dir, 'listing.md'))) {
    metaFile = join(dir, 'listing.md');
  } else if (existsSync(join(dir, 'description.md'))) {
    metaFile = join(dir, 'description.md');
  } else {
    throw new Error(`No etsy-config.json, listing.md, or description.md found in ${dir}`);
  }

  const content = readFileSync(metaFile, 'utf8');

  // Parse YAML frontmatter
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  let meta = {};
  let description = content;

  if (fmMatch) {
    const yamlLines = fmMatch[1].split('\n');
    for (const line of yamlLines) {
      const match = line.match(/^(\w+):\s*(.+)$/);
      if (match) {
        let value = match[2].trim();
        if (value.startsWith('[') && value.endsWith(']')) {
          value = value.slice(1, -1).split(',').map(s => s.trim().replace(/['"]/g, ''));
        } else if (value.startsWith('"') || value.startsWith("'")) {
          value = value.slice(1, -1);
        } else if (!isNaN(parseFloat(value))) {
          value = parseFloat(value);
        }
        meta[match[1]] = value;
      }
    }
    description = fmMatch[2].trim();
  }

  // Find images
  const etsyDir = join(dir, 'etsy');
  let images = [];
  if (existsSync(etsyDir)) {
    images = readdirSync(etsyDir)
      .filter(f => /\.(png|jpg|jpeg|gif|webp)$/i.test(f))
      .sort()
      .slice(0, 10)
      .map(f => join(etsyDir, f));
  }
  if (images.length === 0) {
    images = readdirSync(dir)
      .filter(f => /\.(png|jpg|jpeg)$/i.test(f))
      .sort()
      .slice(0, 10)
      .map(f => join(dir, f));
  }

  // Find download file
  const downloads = readdirSync(dir)
    .filter(f => /\.(pdf|zip)$/i.test(f))
    .map(f => join(dir, f));

  return {
    slug,
    dir,
    title: meta.title || meta.etsy_title || slug.replace(/-/g, ' '),
    description: meta.etsy_description || description,
    price: meta.etsy_price || meta.price || 9.99,
    tags: meta.tags || meta.etsy_tags || [],
    category: meta.category || meta.etsy_category || 'digital_download',
    images,
    downloadFile: downloads[0] || null,
  };
}

async function createListing(product, shopId, publish = false) {
  console.log(`\nCreating Etsy listing for: ${product.title}`);
  console.log(`  Price: $${product.price}`);
  console.log(`  Tags: ${Array.isArray(product.tags) ? product.tags.join(', ') : product.tags}`);
  console.log(`  Images: ${product.images.length}`);
  console.log(`  Download: ${product.downloadFile ? basename(product.downloadFile) : 'none'}`);

  // Resolve taxonomy ID
  const taxonomyId = TAXONOMY_MAP[product.category] || TAXONOMY_MAP['digital_download'];

  // Ensure tags is an array and limit to 13
  let tags = Array.isArray(product.tags) ? product.tags : product.tags.split(',').map(s => s.trim());
  tags = tags.slice(0, 13);

  // Step 1: Create draft listing
  console.log('\n1. Creating draft listing...');
  const listingData = {
    title: product.title.slice(0, 140),
    description: product.description,
    price: product.price,
    quantity: 999,
    taxonomy_id: taxonomyId,
    who_made: 'i_did',
    when_made: '2020_2025',
    is_supply: false,
    type: 'download',
    tags: tags,
    should_auto_renew: true,
  };

  // Create listing via form-encoded POST
  const formBody = new URLSearchParams();
  for (const [key, value] of Object.entries(listingData)) {
    if (key === 'tags') {
      // Tags must be sent as comma-separated
      formBody.set(key, value.join(','));
    } else {
      formBody.set(key, String(value));
    }
  }

  const listing = await etsyFetch(`/application/shops/${shopId}/listings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formBody,
  });

  const listingId = listing.listing_id;
  console.log(`   Draft listing created: ID ${listingId}`);

  // Step 2: Upload images
  if (product.images.length > 0) {
    console.log(`\n2. Uploading ${product.images.length} images...`);
    for (let i = 0; i < product.images.length; i++) {
      const imgPath = product.images[i];
      const imgName = basename(imgPath);
      console.log(`   Uploading ${imgName} (${i + 1}/${product.images.length})...`);

      const imgBuffer = readFileSync(imgPath);
      const formData = new FormData();
      formData.append('image', new Blob([imgBuffer]), imgName);
      formData.append('rank', String(i + 1));

      await etsyFetch(`/application/shops/${shopId}/listings/${listingId}/images`, {
        method: 'POST',
        body: formData,
      });
      console.log(`   Uploaded ${imgName}`);
    }
  }

  // Step 3: Upload digital file
  if (product.downloadFile) {
    console.log('\n3. Uploading digital download file...');
    const fileName = basename(product.downloadFile);
    const fileBuffer = readFileSync(product.downloadFile);
    const formData = new FormData();
    formData.append('file', new Blob([fileBuffer]), fileName);
    formData.append('name', fileName);

    await etsyFetch(`/application/shops/${shopId}/listings/${listingId}/files`, {
      method: 'POST',
      body: formData,
    });
    console.log(`   Uploaded ${fileName}`);
  }

  // Step 4: Publish if requested
  if (publish) {
    console.log('\n4. Publishing listing...');
    await etsyFetch(`/application/shops/${shopId}/listings/${listingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ state: 'active' }),
    });
    console.log('   Listing is now ACTIVE');
  } else {
    console.log('\n4. Listing saved as DRAFT (use --publish to make it active)');
  }

  console.log(`\nDone. Listing ID: ${listingId}`);
  return { listingId, listing };
}

// CLI entry point
async function main() {
  const args = process.argv.slice(2);
  const publish = args.includes('--publish');
  const slug = args.find(a => !a.startsWith('--'));

  if (!slug) {
    console.log('Usage: node scripts/etsy/etsy-list.mjs <product-slug> [--publish]');
    console.log('\nAvailable products:');
    if (existsSync(PRODUCTS_DIR)) {
      const products = readdirSync(PRODUCTS_DIR).filter(f =>
        !f.startsWith('.') && f !== 'templates' && f !== 'UPLOAD-GUIDE.md' && f !== 'kdp'
      );
      for (const p of products) {
        console.log(`  - ${p}`);
      }
    }
    process.exit(1);
  }

  try {
    const shopId = await getShopId();
    console.log(`Shop ID: ${shopId}`);

    const product = parseProductDir(slug);
    await createListing(product, shopId, publish);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();
