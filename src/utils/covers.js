export function slugify(title) {
    return title
      .toLowerCase()
      .replace(/'/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
  
  export function getCover(item) {
    const folder = item.type === "Film" ? "movies" : "books";
    return `/assets/covers/${folder}/${slugify(item.title)}.jpg`;
  }