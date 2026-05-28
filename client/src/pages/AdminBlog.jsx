import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { BookOpen, PlusCircle, Edit3, Trash2, Eye, EyeOff, X, Save } from 'lucide-react';

export function AdminBlogManager() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form state
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchBlogs = async () => {
    try {
      const data = await api.get('/blogs/admin/all');
      setBlogs(data);
    } catch (err) {
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const resetForm = () => {
    setTitle('');
    setExcerpt('');
    setContent('');
    setIsPublished(true);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (blog) => {
    setTitle(blog.title);
    setExcerpt(blog.excerpt || '');
    setContent(blog.content);
    setIsPublished(blog.is_published);
    setEditingId(blog.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await api.delete(`/blogs/${id}`);
      await fetchBlogs();
    } catch (err) {
      alert(err.message || 'Failed to delete blog post.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { title, excerpt, content, is_published: isPublished };
      if (editingId) {
        await api.put(`/blogs/${editingId}`, payload);
      } else {
        await api.post('/blogs', payload);
      }
      resetForm();
      await fetchBlogs();
    } catch (err) {
      alert(err.message || 'Failed to save blog post.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-[var(--text-muted)] animate-pulse">Loading blog posts...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--text-primary)]">Blog Manager</h1>
          <p className="text-xs text-[var(--text-muted)]">Create, edit, and publish blog articles for the public knowledge base.</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
        >
          <PlusCircle className="w-4 h-4" /> New Post
        </button>
      </div>

      {/* Blog Form */}
      {showForm && (
        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 bg-cyan-950/5 space-y-4 animate-fade-in relative">
          <button onClick={resetForm} className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
            <X className="w-5 h-5" />
          </button>

          <div>
            <span className="text-xxs uppercase font-mono text-cyan-400 font-bold block mb-1">
              {editingId ? 'Edit Post' : 'Create New Post'}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[var(--text-muted)] font-semibold mb-1">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. Understanding GPU Cooling Solutions"
                className="w-full p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-cyan-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[var(--text-muted)] font-semibold mb-1">Excerpt (short summary)</label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows="2"
                placeholder="A brief summary that appears on the blog listing page..."
                className="w-full p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-cyan-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[var(--text-muted)] font-semibold mb-1">Content *</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows="8"
                placeholder="Write the full blog article content here..."
                className="w-full p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-cyan-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_published"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 rounded bg-[var(--bg-card)] border-[var(--border-color)] text-cyan-500 focus:ring-0"
              />
              <label htmlFor="is_published" className="text-[var(--text-muted)] select-none font-semibold">
                Publish immediately (visible on public blog page)
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {submitting ? 'Saving...' : editingId ? 'Update Post' : 'Publish Post'}
            </button>
          </form>
        </div>
      )}

      {/* Posts Table */}
      <div className="glass-panel rounded-2xl border border-[var(--border-color)] overflow-hidden">
        {blogs.length === 0 ? (
          <div className="p-12 text-center text-[var(--text-muted)]">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No blog posts yet. Create your first post!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-[var(--bg-card)] border-b border-[var(--border-color)] text-xxs font-mono text-cyan-400 uppercase tracking-widest">
                  <th className="p-4">Title</th>
                  <th className="p-4">Author</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Created</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {blogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-[var(--bg-card)] transition-colors">
                    <td className="p-4">
                      <span className="block font-bold text-[var(--text-primary)]">{blog.title}</span>
                      <span className="text-xxs text-[var(--text-muted)] font-mono">/{blog.slug}</span>
                    </td>
                    <td className="p-4 text-xs text-[var(--text-secondary)]">{blog.author_name || 'Admin'}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xxs font-bold uppercase ${
                        blog.is_published
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {blog.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4 text-xxs font-mono text-[var(--text-muted)]">
                      {new Date(blog.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(blog)}
                          className="p-2 rounded-lg hover:bg-cyan-500/10 text-[var(--text-muted)] hover:text-cyan-400 transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(blog.id)}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
