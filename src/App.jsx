import { Film, BookOpen, Search, UserCircle } from "lucide-react";
import { catalogue } from "./catalogue";
import "./styles.css";

const completed = catalogue.filter((item) => item.status === "Completed");

export default function App() {
  const featured = catalogue.find((item) => item.title === "The Godfather") || catalogue[0];
  const nextItems = catalogue.slice(0, 6);

  return (
    <main className="app-shell">
      <header className="top-nav">
        <div className="brand">
          <div className="brand-mark">CC</div>
          <div>
            <strong>The Classics Club</strong>
            <span>Stories that shaped the world</span>
          </div>
        </div>

        <nav>
          <a>Home</a>
          <a>Browse</a>
          <a>Collections</a>
          <a>Progress</a>
        </nav>

        <div className="search-pill">
          <Search size={16} />
          <span>Search classics...</span>
        </div>

        <UserCircle size={30} />
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">A curated journey through culture</p>
          <h1>Experience the stories that shaped our world.</h1>
          <p>
            Discover essential books and films, track your progress together,
            and choose what to read or watch next without spoilers.
          </p>
          <div className="hero-actions">
            <button>Explore Classics</button>
            <button className="secondary">View Progress</button>
          </div>
        </div>

        <div className="hero-card">
          <p>Tonight’s Recommendation</p>
          <h2>{featured.title}</h2>
          <span>{featured.year} · {featured.type} · {featured.creator}</span>
          <p>{featured.synopsis}</p>
        </div>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <BookOpen />
          <span>Books completed</span>
          <strong>{completed.filter((i) => i.type === "Book").length} / 50</strong>
        </div>
        <div className="stat-card">
          <Film />
          <span>Films completed</span>
          <strong>{completed.filter((i) => i.type === "Film").length} / 50</strong>
        </div>
        <div className="stat-card">
          <span>Shared journey</span>
          <strong>{completed.length} / {catalogue.length}</strong>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <h2>Continue your journey</h2>
          <a>View all</a>
        </div>

        <div className="card-grid">
          {nextItems.map((item) => (
            <article className="classic-card" key={item.id}>
              <div className="poster-placeholder">
                {item.type === "Film" ? <Film /> : <BookOpen />}
              </div>
              <div>
                <h3>{item.title}</h3>
                <p>{item.creator}</p>
                <span>{item.year} · {item.difficulty}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}