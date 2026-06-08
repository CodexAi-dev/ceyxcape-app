// ─────────────────────────────────────────────────────────────
// Builds database/migration-old-data.sql from the old PHP dump.
//
// It maps the OLD tables → our NEW (inquiry-system) schema:
//   • tours          → tours   (image paths normalised to filenames)
//   • gallery_images → gallery_images (src = /images/gallery/<file>)
//
// Run:  node database/build-migration.js
// ─────────────────────────────────────────────────────────────
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'ceyxcape_ceyDb_01.sql');
const OUT = path.join(__dirname, 'migration-old-data.sql');

const sql = fs.readFileSync(SRC, 'utf8');

// ── Tiny SQL-VALUES row parser ────────────────────────────────
// Splits the "(...),(...)" body of an INSERT into rows, respecting
// quotes and escaped characters. Returns an array of field arrays.
function parseInsert(sqlText, table) {
  const re = new RegExp(
    'INSERT INTO `' + table + '` \\([^)]*\\) VALUES\\s*([\\s\\S]*?);\\s*(?:--|$)',
  );
  const m = sqlText.match(re);
  if (!m) return [];
  const body = m[1];

  const rows = [];
  let depth = 0, field = '', row = [], inStr = false, esc = false;
  for (let i = 0; i < body.length; i++) {
    const c = body[i];
    if (esc) { field += c; esc = false; continue; }
    if (c === '\\') { field += c; esc = true; continue; }
    if (c === "'") { inStr = !inStr; field += c; continue; }
    if (!inStr && c === '(') { if (depth === 0) { row = []; field = ''; } depth++; continue; }
    if (!inStr && c === ')') {
      depth--;
      if (depth === 0) { row.push(field.trim()); rows.push(row); field = ''; }
      continue;
    }
    if (!inStr && c === ',' && depth === 1) { row.push(field.trim()); field = ''; continue; }
    field += c;
  }
  return rows;
}

// Strip surrounding quotes; keep NULL as null. Returns the RAW SQL token
// (still SQL-escaped) so we can re-emit it verbatim.
const raw = (v) => (v === 'NULL' ? null : v);

// ── tours ─────────────────────────────────────────────────────
// Old columns (by index):
// 0 id, 1 tour_code, 2 name, 3 description, 4 price, 5 discount_price,
// 6 duration, 7 nights, 8 days, 9 location, 10 start_location,
// 11 end_location, 12 category, 13 max_participants, 14 image,
// 15 gallery, 16 itinerary, 17 includes, 18 excludes, 19 status,
// 20 featured, 21 views, 22 created_at, 23 updated_at, 24 deleted_at
const tours = parseInsert(sql, 'tours');

// Normalise a tour main-image path → filename only (app prepends /uploads/tours/).
function tourImage(token) {
  if (!token || token === 'NULL') return 'NULL';
  // token looks like:  'uploads/tours/tour_xxx.webp'
  const inner = token.slice(1, -1); // drop quotes
  const file = inner.split('/').pop();
  return "'" + file.replace(/'/g, "\\'") + "'";
}

// Normalise the gallery JSON array → keep only filenames.
function tourGallery(token) {
  if (!token || token === 'NULL') return "'[]'";
  try {
    // token is a quoted, escaped JSON string. Unescape to real JSON.
    const jsonStr = token.slice(1, -1).replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    const arr = JSON.parse(jsonStr);
    const files = (Array.isArray(arr) ? arr : []).map((p) => String(p).split('/').pop());
    return "'" + JSON.stringify(files).replace(/'/g, "\\'") + "'";
  } catch {
    return "'[]'";
  }
}

let out = `-- ============================================================
-- CeyXcape — migration of real data from the old PHP database
-- Maps old 'tours' + 'gallery_images' into the new schema.
-- Safe to run on the new 'ceyxcape_new' database AFTER schema.sql.
-- Re-runnable: clears existing seed rows for these tables first.
-- ============================================================
USE ceyxcape_new;
SET NAMES utf8mb4;

-- Remove the sample seed tours/gallery so real data isn't duplicated.
DELETE FROM tours;
DELETE FROM gallery_images;

-- ── Tours (${tours.length}) ─────────────────────────────────────────────
`;

for (const r of tours) {
  const id = r[0];
  const tour_code = r[1];
  const name = r[2];
  const description = r[3];
  const price = r[4];
  const discount_price = r[5];
  const duration = r[6];
  const location = raw(r[9]) || "''";
  const start_location = r[10];
  const category = r[12];
  const image = tourImage(r[14]);
  const gallery = tourGallery(r[15]);
  const itinerary = raw(r[16]) ? r[16] : "'[]'";
  const includes = raw(r[17]) ? r[17] : "'[]'";
  const excludes = raw(r[18]) ? r[18] : "'[]'";
  const status = r[19] && r[19].includes('active') ? "'active'" : "'inactive'";
  const featured = r[20] === '1' ? 1 : 0;
  const views = r[21] || 0;

  out +=
    `INSERT INTO tours (id, tour_code, name, description, category, start_location, location, duration, price, discount_price, image, gallery, itinerary, includes, excludes, status, featured, views)\n` +
    `VALUES (${id}, ${tour_code}, ${name}, ${description}, ${category}, ${start_location}, '${String(location).replace(/^'|'$/g, '').replace(/'/g, "\\'")}', ${duration}, ${price}, ${discount_price}, ${image}, ${gallery}, ${itinerary}, ${includes}, ${excludes}, ${status}, ${featured}, ${views});\n`;
}

// ── gallery_images ────────────────────────────────────────────
// Old: 0 id,1 title,2 description,3 category,4 image_url,5 thumbnail,...
const gallery = parseInsert(sql, 'gallery_images');

out += `\n-- ── Gallery images (${gallery.length}) ─────────────────────────────\n`;
for (const r of gallery) {
  const id = r[0];
  const title = r[1];
  const category = r[3];
  // old image_url: '../assets/images/gallery/img_xxx.jpg' → '/images/gallery/img_xxx.jpg'
  const urlInner = (r[4] || "''").slice(1, -1);
  const file = urlInner.split('/').pop();
  const src = "'/images/gallery/" + file.replace(/'/g, "\\'") + "'";

  out += `INSERT INTO gallery_images (id, src, title, category) VALUES (${id}, ${src}, ${title}, ${category});\n`;
}

fs.writeFileSync(OUT, out, 'utf8');
console.log(`Wrote ${OUT}`);
console.log(`  tours: ${tours.length}, gallery_images: ${gallery.length}`);
