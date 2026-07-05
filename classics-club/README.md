# The Classics Club

A personal classics tracker for Chris & Brooke. Built with React + Vite and designed to deploy on GitHub Pages.

## Run locally

```bash
npm install
npm run dev
```

## Deploy on GitHub Pages

This repo includes a GitHub Actions workflow in `.github/workflows/deploy.yml`.

1. Upload/commit all files to your GitHub repo.
2. In GitHub, go to **Settings → Pages**.
3. Under **Build and deployment**, choose **GitHub Actions** as the source.
4. Push to `main`. The action will build and publish the site.

## Progress storage

Progress is saved in your browser using `localStorage`. Use **Export progress** and **Import progress** to share/backup updates between devices or between Chris and Brooke.

## Notes

Streaming and ratings availability changes often, so the app links out to JustWatch Australia, Letterboxd, Rotten Tomatoes, Goodreads, StoryGraph and Booktopia rather than hard-coding unstable availability.
