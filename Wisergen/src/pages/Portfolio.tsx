import { useState, useEffect } from 'react';
import { ExternalLink, X, Send, Code, ChevronLeft, ChevronRight } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
const imgUrl = (u: string) => (!u ? '' : u.startsWith('http') ? u : API_BASE + u);
const naira = (v: string | number) => '₦' + Number(v).toLocaleString('en-NG', { maximumFractionDigits: 0 });
const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '';

// Load Paystack inline script once
function loadPaystack(): Promise<any> {
  return new Promise((resolve, reject) => {
    if ((window as any).PaystackPop) return resolve((window as any).PaystackPop);
    const s = document.createElement('script');
    s.src = 'https://js.paystack.co/v1/inline.js';
    s.onload = () => resolve((window as any).PaystackPop);
    s.onerror = () => reject(new Error('Failed to load Paystack'));
    document.body.appendChild(s);
  });
}

type Project = {
  id: number;
  title: string;
  summary: string;
  description: string;
  tech_stack: string;
  image_url: string;
  image_url2: string;
  image_url3: string;
  live_url: string;
  price: string | null;
};

const imagesOf = (p: Project) =>
  [p.image_url, p.image_url2, p.image_url3].filter(Boolean).map(imgUrl);

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
    <div className={`relative ${heightClass} bg-gray-100 overflow-hidden`}>
      <img src={images[idx]} alt={alt} className="w-full h-full object-cover" />
      {images.length > 1 && (
        <>
          {arrows && (
            <>
              <button onClick={(e) => { e.stopPropagation(); setI((idx - 1 + images.length) % images.length); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center"><ChevronLeft size={18} /></button>
              <button onClick={(e) => { e.stopPropagation(); setI((idx + 1) % images.length); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center"><ChevronRight size={18} /></button>
            </>
          )}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, d) => <span key={d} className={`w-1.5 h-1.5 rounded-full ${d === idx ? 'bg-white' : 'bg-white/50'}`} />)}
          </div>
        </>
      )}
    </div>
  );
}

export default function Portfolio() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Project | null>(null);
  const [inquiry, setInquiry] = useState<Project | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/projects.php`)
      .then((r) => r.json())
      .then((d) => setProjects(Array.isArray(d) ? d : []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-20">
      <section className="relative h-96 bg-gradient-to-br from-primary-dark to-[#1E293B] flex items-center overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-blue rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-primary-blue text-sm font-medium tracking-widest uppercase mb-3">Portfolio</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Software & Web Apps We've Built</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">Explore our projects. Like what you see? Make an inquiry or get the source code.</p>
        </div>
      </section>

      <section className="py-20 bg-gray-50 min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <p className="text-center text-gray-500 py-20">Loading projects…</p>
          ) : projects.length === 0 ? (
            <p className="text-center text-gray-500 py-20">No projects to show yet — check back soon.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((p) => {
                const imgs = imagesOf(p);
                return (
                  <div key={p.id} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setSelected(p)}>
                    {imgs.length > 0 ? (
                      <Slideshow images={imgs} alt={p.title} heightClass="h-56" />
                    ) : (
                      <div className="h-56 bg-gray-100 flex items-center justify-center text-gray-300"><Code size={48} /></div>
                    )}
                    <div className="p-6">
                      <h3 className="text-dark font-semibold text-lg mb-2">{p.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{p.summary || p.description}</p>
                      {p.tech_stack && <p className="text-xs text-primary-blue font-medium">{p.tech_stack}</p>}
                      {p.price && <p className="text-sm text-dark font-semibold mt-3">Source code: {naira(p.price)}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden my-8" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              {imagesOf(selected).length > 0 ? (
                <Slideshow images={imagesOf(selected)} alt={selected.title} heightClass="h-48 sm:h-64" arrows />
              ) : (
                <div className="h-48 sm:h-64 bg-gray-100 flex items-center justify-center text-gray-300"><Code size={48} /></div>
              )}
              <button onClick={() => setSelected(null)} className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white"><X size={16} /></button>
            </div>
            <div className="p-5 sm:p-6">
              <h3 className="text-lg sm:text-2xl font-bold text-dark mb-2">{selected.title}</h3>
              {selected.tech_stack && <p className="text-sm text-primary-blue font-medium mb-3 sm:mb-4">{selected.tech_stack}</p>}
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed whitespace-pre-line mb-4 sm:mb-6 text-justify">{selected.description}</p>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {selected.live_url && (
                  <a href={selected.live_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 border border-gray-300 hover:border-primary-blue text-dark rounded-full text-xs sm:text-sm font-medium">
                    <ExternalLink size={14} /> Live Demo
                  </a>
                )}
                <button onClick={() => { setInquiry(selected); setSelected(null); }} className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-primary-blue hover:bg-blue-700 text-white rounded-full text-xs sm:text-sm font-medium">
                  <Send size={14} /> Make an Inquiry
                </button>
                {selected.price && <BuyButton project={selected} />}
              </div>
              {selected.price && <p className="text-xs text-gray-400 mt-3">Secure payment via Paystack. You'll get the source code as a download after payment.</p>}
            </div>
          </div>
        </div>
      )}

      {inquiry && <InquiryModal project={inquiry} onClose={() => setInquiry(null)} />}
    </div>
  );
}

function InquiryModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', message: '', company: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const submit = async () => {
    if (form.company) return;
    if (!form.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setStatus('error'); return; }
    setStatus('sending');
    try {
      const res = await fetch(`${API_BASE}/api/projects.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, project_id: project.id }),
      });
      const data = await res.json();
      setStatus(data.ok ? 'success' : 'error');
    } catch { setStatus('error'); }
  };

  const field = 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-dark">Inquiry</h3>
          <button onClick={onClose} className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"><X size={18} /></button>
        </div>
        <p className="text-sm text-gray-500 mb-5">About: <span className="font-medium text-dark">{project.title}</span></p>

        {status === 'success' ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 bg-accent-green/10 rounded-full flex items-center justify-center mx-auto mb-3"><Send className="w-7 h-7 text-accent-green" /></div>
            <p className="text-gray-600">Thanks! We'll be in touch shortly.</p>
            <button onClick={onClose} className="mt-5 text-primary-blue font-medium hover:underline">Close</button>
          </div>
        ) : (
          <div className="space-y-4">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name *" className={field} />
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Your email *" className={field} />
            <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={3} placeholder="What would you like to know?" className={`${field} resize-none`} />
            <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] opacity-0 h-0 w-0" />
            {status === 'error' && <p className="text-red-500 text-sm">Please enter your name and a valid email.</p>}
            <button onClick={submit} disabled={status === 'sending'} className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-blue hover:bg-blue-700 disabled:opacity-60 text-white font-medium rounded-full">
              {status === 'sending' ? 'Sending…' : 'Send Inquiry'} {status !== 'sending' && <Send size={18} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function BuyButton({ project }: { project: Project }) {
  const [status, setStatus] = useState<'idle' | 'email' | 'processing' | 'done' | 'error'>('idle');
  const [email, setEmail] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const pay = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErrMsg('Enter a valid email'); return; }
    setErrMsg('');
    setStatus('processing');
    try {
      const PaystackPop = await loadPaystack();
      const handler = PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email,
        amount: Math.round(Number(project.price) * 100), // kobo
        currency: 'NGN',
        metadata: { project_id: project.id, project: project.title },
        callback: (response: any) => {
          // Verify server-side, then get the download token
          fetch(`${API_BASE}/api/verify-payment.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reference: response.reference, project_id: project.id, email }),
          })
            .then((r) => r.json())
            .then((d) => {
              if (d.ok && d.token) {
                setDownloadUrl(`${API_BASE}/api/download.php?token=${d.token}`);
                setStatus('done');
              } else {
                setErrMsg(d.error || 'Payment could not be verified.');
                setStatus('error');
              }
            })
            .catch(() => { setErrMsg('Verification failed.'); setStatus('error'); });
        },
        onClose: () => { setStatus('email'); },
      });
      handler.openIframe();
    } catch {
      setErrMsg('Could not start payment.');
      setStatus('error');
    }
  };

  if (status === 'done') {
    return (
      <a href={downloadUrl} className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-green text-white rounded-full text-sm font-medium">
        <Code size={16} /> Download Source Code
      </a>
    );
  }

  if (status === 'idle') {
    return (
      <button onClick={() => setStatus('email')} className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-green hover:bg-green-600 text-white rounded-full text-sm font-medium">
        <Code size={16} /> Buy Source Code — {naira(project.price!)}
      </button>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email for your receipt & download"
          className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/20"
        />
        <button onClick={pay} disabled={status === 'processing'} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-accent-green hover:bg-green-600 disabled:opacity-60 text-white rounded-full text-sm font-medium whitespace-nowrap">
          {status === 'processing' ? 'Processing…' : `Pay ${naira(project.price!)}`}
        </button>
      </div>
      {errMsg && <p className="text-red-500 text-xs mt-2">{errMsg}</p>}
    </div>
  );
}
