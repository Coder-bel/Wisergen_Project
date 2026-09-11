import { useState, useEffect } from 'react';
import { ExternalLink, X, Newspaper } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
const imgUrl = (u: string) => (!u ? '' : u.startsWith('http') ? u : API_BASE + u);

type NewsItem = {
  id: number;
  title: string;
  summary: string;
  body?: string;
  image_url: string;
  source_url: string;
  created_at: string;
};

const fmtDate = (s: string) =>
  new Date(s).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' });

export default function NewsFeed() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<NewsItem | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/news.php`)
      .then((r) => r.json())
      .then((d) => setItems(Array.isArray(d) ? d : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  // Fetch full body when opening a post
  const openPost = async (item: NewsItem) => {
    setOpen(item);
    if (item.body === undefined) {
      try {
        const res = await fetch(`${API_BASE}/api/news.php?id=${item.id}`);
        const full = await res.json();
        if (full && full.id) setOpen(full);
      } catch { /* keep summary */ }
    }
  };

  return (
    <div className="pt-20">
      <section className="relative h-80 bg-gradient-to-br from-primary-dark to-[#1E293B] flex items-center overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-blue rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-primary-blue text-sm font-medium tracking-widest uppercase mb-3">News Feed</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Tech News & Updates</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">The latest in technology, curated by Wisergen Computing.</p>
        </div>
      </section>

      <section className="py-20 bg-gray-50 min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <p className="text-center text-gray-500 py-20">Loading news…</p>
          ) : items.length === 0 ? (
            <p className="text-center text-gray-500 py-20">No news yet — check back soon.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((n) => (
                <article key={n.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer flex flex-col" onClick={() => openPost(n)}>
                  <div className="h-48 bg-gray-100 overflow-hidden">
                    {n.image_url ? (
                      <img src={imgUrl(n.image_url)} alt={n.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300"><Newspaper size={40} /></div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <p className="text-xs text-gray-400 mb-2">{fmtDate(n.created_at)}</p>
                    <h3 className="text-dark font-semibold text-lg mb-2 line-clamp-2">{n.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-3 flex-1">{n.summary}</p>
                    <span className="text-primary-blue text-sm font-medium mt-4">Read more →</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setOpen(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden my-8" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              {open.image_url ? (
                <img src={imgUrl(open.image_url)} alt={open.title} className="w-full h-64 object-cover" />
              ) : (
                <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-300"><Newspaper size={48} /></div>
              )}
              <button onClick={() => setOpen(null)} className="absolute top-3 right-3 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center hover:bg-white"><X size={18} /></button>
            </div>
            <div className="p-6">
              <p className="text-xs text-gray-400 mb-2">{fmtDate(open.created_at)}</p>
              <h3 className="text-2xl font-bold text-dark mb-4">{open.title}</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line mb-6 text-justify">{open.body || open.summary}</p>
              {open.source_url && (
                <a href={open.source_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary-blue font-medium hover:underline">
                  <ExternalLink size={16} /> Read original article
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
