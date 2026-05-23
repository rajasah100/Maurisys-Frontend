import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Eye, User, ArrowLeft, Tag } from 'lucide-react';
import { fetchBlogBySlug } from '../services/api';
import CTA from '../components/CTA';

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await fetchBlogBySlug(slug);
        setBlog(data.data);
        window.scrollTo(0, 0);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-40 pb-20 text-center text-slate-500 animate-pulse">Loading...</div>
    );
  }

  if (!blog) {
    return (
      <div className="pt-40 pb-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Article not found</h2>
        <Link to="/blog" className="btn-primary">Back to Blog</Link>
      </div>
    );
  }

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  return (
    <>
      <article className="pt-32 pb-20 bg-white">
        <div className="container-custom max-w-4xl">
          <Link
            to="/blog"
            className="inline-flex items-center text-primary-600 font-semibold mb-6 hover:gap-2 transition-all"
          >
            <ArrowLeft size={18} className="mr-1" /> Back to Blog
          </Link>

          <span className="inline-block px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-xs font-semibold uppercase mb-4">
            {blog.category}
          </span>

          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 mb-8 pb-8 border-b border-slate-200">
            <span className="flex items-center gap-2">
              <User size={16} /> {blog.author}
            </span>
            <span className="flex items-center gap-2">
              <Calendar size={16} /> {formatDate(blog.createdAt)}
            </span>
            <span className="flex items-center gap-2">
              <Eye size={16} /> {blog.views} views
            </span>
          </div>

          {blog.coverImage && (
            <div className="rounded-2xl overflow-hidden mb-10 shadow-lg">
              <img src={blog.coverImage} alt={blog.title} className="w-full h-auto" />
            </div>
          )}

          <div
            className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-slate-900 prose-p:text-slate-700 prose-p:leading-relaxed prose-a:text-primary-600"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-slate-200">
              <div className="flex items-center gap-3 flex-wrap">
                <Tag size={18} className="text-slate-500" />
                {blog.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      <CTA />
    </>
  );
};

export default BlogDetail;
