import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { Calendar, User, ArrowLeft, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'IT Knowledge Base & Blog | Next Core System';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', 'Tips, guides, and updates from the IT experts at Next Core System in Bharatpur, Chitwan, Nepal.');
    return () => {
      document.title = 'Next Core System - Professional IT Services & Hardware Repair in Bharatpur';
      if (meta) meta.setAttribute('content', 'Bharatpur\'s premier Managed IT Partner. Delivering enterprise-grade hardware support, LAN fiber networking, CCTV security systems, and fast, reliable remote IT maintenance.');
    };
  }, []);

  useEffect(() => {
    api.get('/blogs')
      .then(data => {
        setBlogs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching blogs:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] mb-4 tracking-tight">IT Knowledge Base & Blog</h1>
        <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
          Tips, tricks, and updates from the tech experts at NextCoreSystem.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[var(--text-muted)] animate-pulse">Loading articles...</div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-12 text-[var(--text-muted)] glass-card rounded-2xl">
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No articles published yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map(blog => (
            <Link to={`/blog/${blog.slug}`} key={blog.id} className="glass-card rounded-2xl p-6 hover:shadow-xl hover:border-cyan-500/30 transition-all group cursor-pointer flex flex-col">
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3 group-hover:text-cyan-500 transition-colors">
                {blog.title}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] mb-6 flex-grow leading-relaxed">
                {blog.excerpt || blog.content.substring(0, 150) + '...'}
              </p>
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pt-4 border-t border-[var(--border-color)] mt-auto">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(blog.created_at).toLocaleDateString()}</span>
                <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {blog.author_name || 'Admin'}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/blogs/${slug}`)
      .then(data => {
        setBlog(data);
        setLoading(false);

        // Dynamic SEO: update title and meta tags for this post
        const description = data.excerpt || data.content.substring(0, 155).replace(/[#*`]/g, '').trim();
        const canonicalUrl = `https://nextcoresystem.com/blog/${data.slug}`;

        document.title = `${data.title} | Next Core System`;

        const setMeta = (selector, attr, value) => {
          let el = document.querySelector(selector);
          if (el) el.setAttribute(attr, value);
        };

        setMeta('meta[name="description"]', 'content', description);
        setMeta('meta[property="og:title"]', 'content', data.title);
        setMeta('meta[property="og:description"]', 'content', description);
        setMeta('meta[property="og:url"]', 'content', canonicalUrl);
        setMeta('meta[name="twitter:title"]', 'content', data.title);
        setMeta('meta[name="twitter:description"]', 'content', description);

        // Inject canonical link
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
          canonical = document.createElement('link');
          canonical.rel = 'canonical';
          document.head.appendChild(canonical);
        }
        canonical.href = canonicalUrl;

        // Inject JSON-LD BlogPosting structured data
        const existing = document.getElementById('jsonld-blog');
        if (existing) existing.remove();
        const jsonld = document.createElement('script');
        jsonld.id = 'jsonld-blog';
        jsonld.type = 'application/ld+json';
        jsonld.text = JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: data.title,
          description,
          author: { '@type': 'Person', name: data.author_name || 'Next Core System' },
          publisher: {
            '@type': 'Organization',
            name: 'Next Core System',
            logo: { '@type': 'ImageObject', url: 'https://nextcoresystem.com/logo.png' }
          },
          datePublished: data.created_at,
          dateModified: data.updated_at || data.created_at,
          url: canonicalUrl,
          mainEntityOfPage: canonicalUrl
        });
        document.head.appendChild(jsonld);
      })
      .catch(err => {
        console.error('Error fetching blog:', err);
        setError('Blog post not found.');
        setLoading(false);
      });

    return () => {
      // Restore default title and meta when leaving the post
      document.title = 'Next Core System - Professional IT Services & Hardware Repair in Bharatpur';
      const setMeta = (selector, attr, value) => {
        const el = document.querySelector(selector);
        if (el) el.setAttribute(attr, value);
      };
      setMeta('meta[name="description"]', 'content', 'Bharatpur\'s premier Managed IT Partner. Delivering enterprise-grade hardware support, LAN fiber networking, CCTV security systems, and fast, reliable remote IT maintenance.');
      setMeta('meta[property="og:title"]', 'content', 'Next Core System - Professional IT Services in Bharatpur');
      setMeta('meta[property="og:description"]', 'content', 'Expert computer repair, networking setups, and IT support services in Chitwan, Nepal.');
      setMeta('meta[property="og:url"]', 'content', 'https://nextcoresystem.com');
      setMeta('meta[name="twitter:title"]', 'content', 'Next Core System - Professional IT Services in Bharatpur');
      setMeta('meta[name="twitter:description"]', 'content', 'Expert computer repair, networking setups, and IT support services in Chitwan, Nepal.');
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) canonical.remove();
      const jsonld = document.getElementById('jsonld-blog');
      if (jsonld) jsonld.remove();
    };
  }, [slug]);

  if (loading) return <div className="text-center py-20 text-[var(--text-muted)] animate-pulse">Loading article...</div>;
  if (error) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">{error}</h2>
      <button onClick={() => navigate('/blog')} className="text-cyan-500 hover:underline">Return to Blog</button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={() => navigate('/blog')} className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-8 transition-colors text-sm font-semibold">
        <ArrowLeft className="w-4 h-4" /> Back to all articles
      </button>

      <div className="glass-panel p-8 md:p-12 rounded-3xl">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] mb-6 leading-tight">
          {blog.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-6 text-sm text-[var(--text-muted)] mb-10 pb-6 border-b border-[var(--border-color)]">
          <span className="flex items-center gap-2"><User className="w-4 h-4" /> {blog.author_name || 'Admin'}</span>
          <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {new Date(blog.created_at).toLocaleDateString()}</span>
        </div>

        <div className="prose prose-invert prose-cyan max-w-none text-[var(--text-secondary)] leading-loose text-base markdown-content">
          <ReactMarkdown>{blog.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
