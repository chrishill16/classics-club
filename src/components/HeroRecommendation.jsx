import { Sparkles } from "lucide-react";

export default function HeroRecommendation({ item }) {
  if (!item) return null;

  return (
    <section className="hero-recommendation">
      <div className="hero-badge">
        <Sparkles size={16} />
        <span>Tonight's Recommendation</span>
      </div>

      <h1>{item.title}</h1>

<p className="hero-meta">
  {item.creator} • {item.year}
</p>

<p className="hero-synopsis">
  {item.synopsis}
</p>
<button className="hero-button">
  {item.type === "Film" ? "Watch Tonight" : "Read Next"}
</button>
    </section>
  );
}