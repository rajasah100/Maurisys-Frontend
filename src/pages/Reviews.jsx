import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Star, Quote, MessageSquarePlus, Filter } from 'lucide-react';
import { fetchReviews } from '../services/api';
import ReviewModal from '../components/ReviewModal';
import CTA from '../components/CTA';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState('all'); // all, 5, 4, 3
  const [loadError, setLoadError] = useState(null);

  const load = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const { data } = await fetchReviews();
      setReviews(data.data || []);
    } catch (e) {
      console.error('Failed to load reviews:', e);
      setLoadError(
        e.response?.data?.message ||
          e.message ||
          'Could not connect to the server'
      );
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered =
    filter === 'all'
      ? reviews
      : reviews.filter((r) => r.rating === parseInt(filter, 10));

  // Aggregate stats
  const totalCount = reviews.length;
  const averageRating =
    totalCount > 0
      ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalCount).toFixed(1)
      : '0.0';

  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const pct = totalCount > 0 ? (count / totalCount) * 100 : 0;
    return { star, count, pct };
  });

  return (
    <>
      <Toaster position="top-right" />

      {/* Hero */}
      <section className="hero-bg pt-32 pb-20 text-white relative">
        <div className="container-custom relative z-10 text-center max-w-3xl mx-auto">
          <p className="inline-flex items-center gap-2 text-accent-300 font-semibold uppercase tracking-[0.18em] text-xs mb-4">
            <span className="inline-block w-8 h-px bg-accent-400" />
            Reviews
            <span className="inline-block w-8 h-px bg-accent-400" />
          </p>
          <h1 className="text-4xl text-white md:text-5xl lg:text-[3.25rem] font-bold mb-5 leading-[1.1] tracking-tightest">
            Stories from{' '}
            <span className="font-serif italic font-medium text-accent-300">
              our clients
            </span>
          </h1>
          <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Real feedback from the businesses we have partnered with. Have you worked with us?
            We would love to hear your experience too.
          </p>
        </div>
      </section>

      {/* Stats + Filter + List */}
      <section className="py-16 bg-slate-50/60 min-h-[60vh]">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
            {/* Aggregate stats */}
            <div className="lg:col-span-4">
              <div className="card-pro p-6 sticky top-24">
                <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-slate-500 mb-2">
                  Overall Rating
                </p>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="stat-number text-5xl text-slate-900">
                    {averageRating}
                  </span>
                  <span className="text-sm text-slate-500">/ 5.0</span>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < Math.round(parseFloat(averageRating))
                          ? 'fill-accent-400 text-accent-400'
                          : 'text-slate-300'
                      }
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-500 mb-5">
                  Based on {totalCount} review{totalCount === 1 ? '' : 's'}
                </p>

                <div className="space-y-2 pb-5 mb-5 border-b border-slate-100">
                  {ratingBreakdown.map((b) => (
                    <button
                      key={b.star}
                      onClick={() =>
                        setFilter(filter === String(b.star) ? 'all' : String(b.star))
                      }
                      className={`w-full flex items-center gap-2.5 p-1 rounded-md hover:bg-slate-50 transition-colors ${
                        filter === String(b.star) ? 'bg-primary-50' : ''
                      }`}
                    >
                      <span className="text-xs font-semibold text-slate-700 w-3">
                        {b.star}
                      </span>
                      <Star
                        size={11}
                        className="fill-accent-400 text-accent-400 flex-shrink-0"
                      />
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent-400 rounded-full"
                          style={{ width: `${b.pct}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-slate-500 w-6 text-right">
                        {b.count}
                      </span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setModalOpen(true)}
                  className="btn-primary w-full"
                >
                  <MessageSquarePlus size={15} className="mr-2" /> Write a Review
                </button>

                {filter !== 'all' && (
                  <button
                    onClick={() => setFilter('all')}
                    className="w-full mt-2 text-xs font-semibold text-primary-700 hover:text-primary-900"
                  >
                    Clear filter
                  </button>
                )}
              </div>
            </div>

            {/* Reviews list */}
            <div className="lg:col-span-8">
              {filter !== 'all' && (
                <div className="mb-4 flex items-center gap-2 text-sm text-slate-600">
                  <Filter size={14} />
                  Showing {filter}-star reviews ({filtered.length})
                </div>
              )}

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="bg-slate-100 h-44 rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              ) : loadError ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
                  <p className="text-red-800 font-semibold mb-2">
                    Could not load reviews
                  </p>
                  <p className="text-red-700 text-sm mb-4">{loadError}</p>
                  <p className="text-xs text-red-600 mb-4">
                    Check that the backend server is running and reachable.
                  </p>
                  <button onClick={load} className="btn-primary inline-flex">
                    Retry
                  </button>
                </div>
              ) : filtered.length === 0 ? (
                <div className="card-pro p-10 text-center">
                  <Quote
                    className="w-12 h-12 mx-auto text-slate-300 mb-4"
                    strokeWidth={1.5}
                  />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2 tracking-tight">
                    {totalCount === 0 ? 'No reviews yet' : 'No reviews match this filter'}
                  </h3>
                  <p className="text-sm text-slate-600 mb-5 max-w-sm mx-auto">
                    {totalCount === 0
                      ? 'Be the first to share your experience working with us.'
                      : 'Try a different rating filter or be the first to add one.'}
                  </p>
                  <button
                    onClick={() => setModalOpen(true)}
                    className="btn-primary inline-flex"
                  >
                    <MessageSquarePlus size={15} className="mr-2" /> Write a Review
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filtered.map((r) => (
                    <article key={r._id} className="card-pro p-6 md:p-7">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3 min-w-0">
                          {r.image ? (
                            <img
                              src={r.image}
                              alt={r.name}
                              className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-100 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-full bg-primary-800 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                              {r.name?.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 truncate tracking-tight">
                              {r.name}
                            </p>
                            {r.role && (
                              <p className="text-xs text-slate-500 truncate">
                                {r.role}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end flex-shrink-0">
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={13}
                                className={
                                  i < (r.rating || 5)
                                    ? 'fill-accent-400 text-accent-400'
                                    : 'text-slate-200'
                                }
                              />
                            ))}
                          </div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">
                            {new Date(r.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                      <p className="text-slate-700 leading-relaxed text-[15px]">
                        {r.text}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <CTA />

      <ReviewModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmitted={load}
      />
    </>
  );
};

export default Reviews;
