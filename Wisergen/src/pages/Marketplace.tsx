import { useState, useEffect } from 'react';
import { Smartphone, Laptop, MessageCircle, X, Search, Send, ChevronLeft, ChevronRight } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
const imgUrl = (u: string) => (!u ? '' : u.startsWith('http') ? u : API_BASE + u);
const condLabel = (c: string) => (c === 'new' ? 'New' : 'Fairly Used');

type Product = {
  id: number;
  name: string;
  category: 'phone' | 'laptop';
  condition_type: 'new' | 'used';
  description: string;
  price: string;
  image_url: string;
  image_url2: string;
  image_url3: string;
  in_stock: number;
};

const naira = (v: string | number) =>
  '₦' + Number(v).toLocaleString('en-NG', { maximumFractionDigits: 0 });

// collect the non-empty images of a product, prefixed with the API host
const imagesOf = (p: Product) =>
  [p.image_url, p.image_url2, p.image_url3].filter(Boolean).map(imgUrl);

/* Auto-advancing image slideshow with dots (and optional arrows) */
function Slideshow({ images, alt, heightClass, arrows = false }:
  { images: string[]; alt: string; heightClass: string; arrows?: boolean }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (images.length <= 1) return;
    const t = setInterval(() => setI((p) => (p + 1) % images.length), 3500);
    return () => clearInterval(t);
  }, [images.length]);
  const idx = Math.min(i, images.length - 1);

  return (
    <div className={`relative ${heightClass} bg-white overflow-hidden`}>
      <img src={images[idx]} alt={alt} className="w-full h-full object-contain transition-opacity duration-300" />
      {images.length > 1 && (
        <>
          {arrows && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setI((idx - 1 + images.length) % images.length); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center"
              ><ChevronLeft size={18} /></button>
              <button
                onClick={(e) => { e.stopPropagation(); setI((idx + 1) % images.length); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center"
              ><ChevronRight size={18} /></button>
            </>
          )}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, d) => (
              <span key={d} className={`w-1.5 h-1.5 rounded-full ${d === idx ? 'bg-white' : 'bg-white/50'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function Marketplace() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<'' | 'phone' | 'laptop'>('');
  const [condition, setCondition] = useState<'' | 'new' | 'used'>('');
  const [selected, setSelected] = useState<Product | null>(null);
  const [whatsapp, setWhatsapp] = useState('');
  const [showRequest, setShowRequest] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/settings.php`)
      .then((r) => r.json())
      .then((d) => setWhatsapp(d.whatsapp || ''))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (condition) params.set('condition', condition);
    fetch(`${API_BASE}/api/products.php?` + params.toString())
      .then((r) => r.json())
      .then((d) => setProducts(Array.isArray(d) ? d : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category, condition]);

  const whatsappLink = (p: Product) => {
    const msg =
      `Hi Wisergen, I'm interested in this product:\n\n` +
      `*${p.name}*\n` +
      `Condition: ${condLabel(p.condition_type)}\n` +
      `Price: ${naira(p.price)}\n\n` +
      `${p.description}\n\n` +
      `Is it available?`;
    return `https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`;
  };

  const filterBtn = (active: boolean) =>
    `px-5 py-2 rounded-full text-sm font-medium transition-colors ${
      active ? 'bg-primary-blue text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`;

  const badgeClass = (c: string) =>
    `absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium z-10 ${
      c === 'new' ? 'bg-accent-green text-white' : 'bg-gray-800 text-white'
    }`;

  return (
    <div className="pt-20">
      <section className="relative h-80 bg-gradient-to-br from-primary-dark to-[#1E293B] flex items-center overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-blue rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-primary-blue text-sm font-medium tracking-widest uppercase mb-3">Marketplace</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Phones & Laptops</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Quality new and fairly used devices. Find your next gadget or request a custom order.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50 min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-10">
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setCategory('')} className={filterBtn(category === '')}>All Devices</button>
              <button onClick={() => setCategory('phone')} className={filterBtn(category === 'phone')}>Phones</button>
              <button onClick={() => setCategory('laptop')} className={filterBtn(category === 'laptop')}>Laptops</button>
            </div>
            <div className="hidden sm:block w-px h-6 bg-gray-300" />
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setCondition('')} className={filterBtn(condition === '')}>All</button>
              <button onClick={() => setCondition('new')} className={filterBtn(condition === 'new')}>New</button>
              <button onClick={() => setCondition('used')} className={filterBtn(condition === 'used')}>Fairly Used</button>
            </div>
          </div>

          {loading ? (
            <p className="text-gray-500 text-center py-20">Loading products…</p>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg mb-2">No devices match your selection.</p>
              <p className="text-gray-500">Try a different filter, or request a custom order below.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((p) => {
                const imgs = imagesOf(p);
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelected(p)}
                    className="text-left bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group"
                  >
                    <div className="relative">
                      {imgs.length > 0 ? (
                        <Slideshow images={imgs} alt={p.name} heightClass="h-48" />
                      ) : (
                        <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-300">
                          {p.category === 'phone' ? <Smartphone size={48} /> : <Laptop size={48} />}
                        </div>
                      )}
                      <span className={badgeClass(p.condition_type)}>{condLabel(p.condition_type)}</span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-dark mb-1 line-clamp-1">{p.name}</h3>
                      <p className="text-gray-500 text-sm mb-3 line-clamp-2">{p.description}</p>
                      <p className="text-primary-blue font-bold text-lg">{naira(p.price)}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-14 bg-primary-dark rounded-3xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Can't find what you're looking for?</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Tell us the exact device and specs you want. We'll source it and get back to you within 2 hours.
            </p>
            <button
              onClick={() => setShowRequest(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-8 sm:py-4 text-sm sm:text-base bg-primary-blue hover:bg-blue-700 text-white font-medium rounded-full transition-colors"
            >
              <Search size={16} /> Request a Device
            </button>
          </div>
        </div>
      </section>

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              {imagesOf(selected).length > 0 ? (
                <Slideshow images={imagesOf(selected)} alt={selected.name} heightClass="h-64" arrows />
              ) : (
                <div className="h-64 bg-gray-100 flex items-center justify-center text-gray-300">
                  {selected.category === 'phone' ? <Smartphone size={56} /> : <Laptop size={56} />}
                </div>
              )}
              <button onClick={() => setSelected(null)} className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center hover:bg-white">
                <X size={18} />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  selected.condition_type === 'new' ? 'bg-accent-green/15 text-accent-green' : 'bg-gray-200 text-gray-700'
                }`}>
                  {condLabel(selected.condition_type)}
                </span>
              </div>
              <h3 className="text-xl font-bold text-dark mb-2">{selected.name}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 whitespace-pre-line text-justify">{selected.description}</p>
              <p className="text-primary-blue font-bold text-2xl mb-6">{naira(selected.price)}</p>
              <a
                href={whatsappLink(selected)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm bg-[#25D366] hover:bg-[#1eb855] text-white font-medium rounded-full transition-colors"
              >
                <MessageCircle size={16} /> Chat about this on WhatsApp
              </a>
              <p className="text-gray-400 text-xs text-center mt-3">
                You'll be taken to WhatsApp with this product's details ready to send.
              </p>
            </div>
          </div>
        </div>
      )}

      {showRequest && <RequestModal onClose={() => setShowRequest(false)} />}
    </div>
  );
}

function RequestModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ gadget_name: '', condition_pref: 'new', spec: '', info: '', email: '', company: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const submit = async () => {
    if (form.company) return;
    if (!form.gadget_name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setStatus('error');
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch(`${API_BASE}/api/settings.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setStatus(data.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  const field = 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-colors';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-dark">Request a Device</h3>
          <button onClick={onClose} className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"><X size={18} /></button>
        </div>

        {status === 'success' ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-accent-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-accent-green" />
            </div>
            <h4 className="text-lg font-semibold text-dark mb-2">Request received!</h4>
            <p className="text-gray-600">Thanks — we'll get back to you within <span className="font-semibold">2 hours</span> with more information.</p>
            <button onClick={onClose} className="mt-6 text-primary-blue font-medium hover:underline">Close</button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">Device Name *</label>
              <input value={form.gadget_name} onChange={(e) => setForm({ ...form, gadget_name: e.target.value })} className={field} placeholder="e.g. iPhone 15 Pro Max" />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">Condition</label>
              <select value={form.condition_pref} onChange={(e) => setForm({ ...form, condition_pref: e.target.value })} className={field}>
                <option value="new">New</option>
                <option value="used">Fairly Used</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">Specifications</label>
              <textarea value={form.spec} onChange={(e) => setForm({ ...form, spec: e.target.value })} rows={2} className={`${field} resize-none`} placeholder="Storage, RAM, colour, etc." />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">Other Information</label>
              <textarea value={form.info} onChange={(e) => setForm({ ...form, info: e.target.value })} rows={2} className={`${field} resize-none`} placeholder="Budget, or anything else" />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">Your Email *</label>
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={field} placeholder="you@example.com" />
            </div>

            <input
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              tabIndex={-1} autoComplete="off" aria-hidden="true"
              className="absolute left-[-9999px] opacity-0 h-0 w-0"
            />

            {status === 'error' && (
              <p className="text-red-500 text-sm">Please enter at least the device name and a valid email.</p>
            )}

            <button
              onClick={submit}
              disabled={status === 'sending'}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-blue hover:bg-blue-700 disabled:opacity-60 text-white font-medium rounded-full transition-colors"
            >
              {status === 'sending' ? 'Sending…' : 'Submit Request'}
              {status !== 'sending' && <Send size={18} />}
            </button>
            <p className="text-gray-400 text-xs text-center">We respond within 2 hours during business hours.</p>
          </div>
        )}
      </div>
    </div>
  );
}
