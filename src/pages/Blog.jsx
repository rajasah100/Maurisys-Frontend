import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Eye, ArrowRight, Search } from 'lucide-react';
import { fetchBlogs } from '../services/api';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await fetchBlogs({ page, limit: 9, search });
        setBlogs(data.data);
        setTotalPages(data.pages || 1);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [page, search]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  return (
    <>
      <section className="hero-bg pt-32 pb-20 text-white relative">
        <div className="container-custom relative z-10 text-center max-w-3xl mx-auto">
          <p className="inline-flex items-center gap-2 text-accent-300 font-semibold uppercase tracking-[0.18em] text-xs mb-4">
            <span className="inline-block w-8 h-px bg-accent-400" />
            Our Blog
            <span className="inline-block w-8 h-px bg-accent-400" />
          </p>
          <h1 className="text-4xl text-white md:text-5xl lg:text-[3.25rem] font-bold mb-5 leading-[1.1] tracking-tightest">
            Insights, tips, and{' '}
            <span className="font-serif italic font-medium text-accent-300">stories</span>
          </h1>
          <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Practical perspectives from the world of technology and digital business.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container-custom">
          {/* Search */}
          <div className="max-w-xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-slate-100 h-96 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20 text-slate-500">No articles found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <article key={blog._id} className="card-pro-hover overflow-hidden">
                  <Link to={`/blog/${blog.slug}`} className="block">
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      />
                      <span className="absolute top-3 left-3 bg-white/95 backdrop-blur text-primary-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                        {blog.category}
                      </span>
                    </div>
                  </Link>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={12} /> {formatDate(blog.createdAt)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Eye size={12} /> {blog.views}
                      </span>
                    </div>
                    <Link to={`/blog/${blog.slug}`}>
                      <h3 className="text-base font-semibold text-slate-900 mb-3 hover:text-primary-700 transition-colors line-clamp-2 tracking-tight leading-snug">
                        {blog.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-2">
                      {blog.excerpt}
                    </p>
                    <Link
                      to={`/blog/${blog.slug}`}
                      className="inline-flex items-center text-primary-700 font-semibold text-xs uppercase tracking-wider hover:gap-2 transition-all"
                    >
                      Read More <ArrowRight size={14} className="ml-1.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-1.5 mt-12">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-9 h-9 rounded-md font-semibold text-sm transition-colors ${
                    page === i + 1
                      ? 'bg-primary-800 text-white'
                      : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-400'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Blog;
