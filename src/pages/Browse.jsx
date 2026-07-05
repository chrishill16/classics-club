
import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Search, Film, BookOpen, Star, Download, Upload, Shuffle, CheckCircle2, Library, Heart, Sparkles, Users, BarChart3 } from 'lucide-react';
import { catalogue } from './catalogue.js';
import './styles.css';

const people = ['Chris', 'Brooke'];
const statuses = ['Not started', 'Want to', 'In progress', 'Finished'];
const moods = [...new Set(catalogue.flatMap(i => i.mood))].sort();

function safeProgress(){
  try { return JSON.parse(localStorage.getItem('classicsClubProgress')) || {}; } catch { return {}; }
}

function App(){
  const [progress, setProgress] = useState(safeProgress);
  const [query, setQuery] = useState('');
  const [type, setType] = useState('All');
  const [mood, setMood] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [selectedId, setSelectedId] = useState(catalogue[0].id);
  const selected = catalogue.find(i => i.id === selectedId) || catalogue[0];

  useEffect(() => localStorage.setItem('classicsClubProgress', JSON.stringify(progress)), [progress]);

  const filtered = useMemo(() => catalogue.filter(item => {
    const haystack = `${item.title} ${item.creator} ${item.type} ${item.mood.join(' ')} ${item.synopsis}`.toLowerCase();
    return (type === 'All' || item.type === type) &&
      (mood === 'All' || item.mood.includes(mood)) &&
      (difficulty === 'All' || item.difficulty === difficulty) &&
      haystack.includes(query.toLowerCase());
  }), [query, type, mood, difficulty]);

  const stats = useMemo(() => {
    const finishedTogether = catalogue.filter(item => people.every(p => progress[item.id]?.[p]?.status === 'Finished')).length;
    const chris = catalogue.filter(item => progress[item.id]?.Chris?.status === 'Finished').length;
    const brooke = catalogue.filter(item => progress[item.id]?.Brooke?.status === 'Finished').length;
    const wishlist = catalogue.filter(item => people.some(p => progress[item.id]?.[p]?.status === 'Want to')).length;
    return { finishedTogether, chris, brooke, wishlist };
  }, [progress]);

  function update(itemId, person, field, value){
    setProgress(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], [person]: { ...prev[itemId]?.[person], [field]: value } }
    }));
  }

  function exportData(){
    const blob = new Blob([JSON.stringify(progress, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'classics-club-progress.json'; a.click();
    URL.revokeObjectURL(url);
  }

  function importData(e){
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try { setProgress(JSON.parse(reader.result)); }
      catch { alert('That file was not valid Classics Club progress JSON.'); }
    };
    reader.readAsText(file);
  }

  function surprise(){
    const pool = filtered.length ? filtered : catalogue;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setSelectedId(pick.id);
  }

  return <main className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark">CC</div><div><h1>The Classics Club</h1><p>Chris & Brooke’s great works tracker</p></div></div>
      <div className="stat-card hero-stat"><Library /><div><b>{catalogue.length}</b><span>curated classics</span></div></div>
      <div className="mini-stats">
        <div><b>{stats.finishedTogether}</b><span>together</span></div>
        <div><b>{stats.chris}</b><span>Chris</span></div>
        <div><b>{stats.brooke}</b><span>Brooke</span></div>
        <div><b>{stats.wishlist}</b><span>wishlist</span></div>
      </div>
      <button onClick={() => setType('All')} className={type==='All'?'active':''}><Library /> All</button>
      <button onClick={() => setType('Film')} className={type==='Film'?'active':''}><Film /> Films</button>
      <button onClick={() => setType('Book')} className={type==='Book'?'active':''}><BookOpen /> Books</button>
      <button onClick={surprise}><Shuffle /> Surprise us</button>
      <button onClick={exportData}><Download /> Export progress</button>
      <label className="button"><Upload /> Import progress<input hidden type="file" accept="application/json" onChange={importData} /></label>
    </aside>

    <section className="browse-panel">
      <div className="section-title"><Sparkles /><div><h2>What are you in the mood for?</h2><p>Filter by type, mood, difficulty or search directly.</p></div></div>
      <div className="search"><Search size={18}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search titles, creators, moods..." /></div>
      <div className="filters">
        <select value={mood} onChange={e => setMood(e.target.value)}><option>All</option>{moods.map(m => <option key={m}>{m}</option>)}</select>
        <select value={difficulty} onChange={e => setDifficulty(e.target.value)}><option>All</option><option>Easy</option><option>Medium</option><option>Challenging</option></select>
      </div>
      <div className="count">Showing {filtered.length} of {catalogue.length}</div>
      <div className="cards">
        {filtered.map(item => <article key={item.id} onClick={() => setSelectedId(item.id)} className={'work-card ' + (selectedId === item.id ? 'selected' : '')}>
          <div className="cover"><span>{item.type === 'Film' ? '🎬' : '📚'}</span></div>
          <div className="work-copy"><div className="eyebrow">{item.type} · {item.year}</div><h3>{item.title}</h3><p>{item.creator}</p><div className="pills">{item.mood.slice(0,3).map(m => <span key={m}>{m}</span>)}</div></div>
          <div className="card-status">{people.every(p => progress[item.id]?.[p]?.status === 'Finished') ? <CheckCircle2 /> : null}</div>
        </article>)}
      </div>
    </section>

    <section className="detail-panel">
      <div className="detail-hero">
        <div><div className="eyebrow gold">{selected.type} · {selected.year}</div><h2>{selected.title}</h2><p>{selected.creator} · {selected.length} · {selected.difficulty}</p></div>
        <div className="badge"><Star /> Ratings via links</div>
      </div>
      <div className="mood-row">{selected.mood.map(m => <span key={m}>{m}</span>)}</div>
      <div className="panel"><h3>Spoiler-free synopsis</h3><p>{selected.synopsis}</p></div>
      <div className="two-col">
        <div className="panel"><h3>Why it’s a classic</h3><p>{selected.whyClassic}</p></div>
        <div className="panel"><h3>Before you start</h3><p>{selected.notes}</p><p><b>You may like it if you like:</b> {selected.liked}</p></div>
      </div>
      <div className="panel tracker-panel"><h3><Users /> Track it</h3>{people.map(person => <div className="tracker" key={person}>
        <b>{person}</b>
        <select value={progress[selected.id]?.[person]?.status || 'Not started'} onChange={e => update(selected.id, person, 'status', e.target.value)}>{statuses.map(s => <option key={s}>{s}</option>)}</select>
        <select value={progress[selected.id]?.[person]?.rating || ''} onChange={e => update(selected.id, person, 'rating', e.target.value)}><option value="">No rating</option>{[1,2,3,4,5].map(n => <option key={n}>{'★'.repeat(n)}</option>)}</select>
        <input value={progress[selected.id]?.[person]?.notes || ''} onChange={e => update(selected.id, person, 'notes', e.target.value)} placeholder="Private notes, quotes, reactions..." />
      </div>)}</div>
      <div className="panel links"><h3><BarChart3 /> Find it / check ratings</h3><a target="_blank" href={selected.links.primary}>{selected.type === 'Film' ? 'JustWatch AU' : 'Goodreads'}</a><a target="_blank" href={selected.links.secondary}>{selected.type === 'Film' ? 'Letterboxd' : 'Booktopia AU'}</a><a target="_blank" href={selected.links.ratings}>{selected.type === 'Film' ? 'Rotten Tomatoes' : 'StoryGraph'}</a></div>
    </section>
  </main>;
}

createRoot(document.getElementById('root')).render(<App />);
