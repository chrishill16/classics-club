import fs from "fs";
import path from "path";
import { catalogue } from "../src/catalogue.js";

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function download(url, filepath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(filepath, buffer);
}

async function fetchBookCover(item) {
  const query = encodeURIComponent(`${item.title} ${item.creator}`);
  const searchUrl = `https://openlibrary.org/search.json?q=${query}&limit=1`;

  const res = await fetch(searchUrl);
  const data = await res.json();

  const coverId = data.docs?.[0]?.cover_i;
  if (!coverId) return false;

  const coverUrl = `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
  const filename = `${slugify(item.title)}.jpg`;
  const filepath = path.join("public", "assets", "covers", "books", filename);

  await download(coverUrl, filepath);
  return true;
}

async function main() {
  ensureDir(path.join("public", "assets", "covers", "books"));
  ensureDir(path.join("public", "assets", "covers", "movies"));

  const books = catalogue.filter((item) => item.type === "Book");

  for (const item of books) {
    const filename = `${slugify(item.title)}.jpg`;
    const filepath = path.join("public", "assets", "covers", "books", filename);

    if (fs.existsSync(filepath)) {
      console.log(`✅ Already exists: ${filename}`);
      continue;
    }

    try {
      const success = await fetchBookCover(item);
      console.log(success ? `📚 Downloaded: ${filename}` : `⚠️ No cover found: ${item.title}`);
    } catch (err) {
      console.log(`❌ Error: ${item.title} — ${err.message}`);
    }
  }

  console.log("Done.");
}

main();