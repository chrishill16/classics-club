const cache = new Map();

export async function fetchBookMetadata(item) {
  const key = `${item.title}-${item.creator}`;

  if (cache.has(key)) return cache.get(key);

  const query = encodeURIComponent(`${item.title} ${item.creator}`);
  const url = `https://openlibrary.org/search.json?q=${query}&limit=1`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Open Library error: ${response.status}`);
  }

  const data = await response.json();
  const result = data.docs?.[0];

  if (!result) return null;

  const metadata = {
    coverUrl: result.cover_i
      ? `https://covers.openlibrary.org/b/id/${result.cover_i}-L.jpg`
      : null,
    firstPublishYear: result.first_publish_year,
    subjects: result.subject?.slice(0, 5) || [],
    editions: result.edition_count,
  };

  cache.set(key, metadata);
  return metadata;
}