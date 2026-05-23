import { useState, useEffect } from 'react';
import { X, Star, Send, User as UserIcon, Mail, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import { submitReview } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ReviewModal = ({ open, onClose, onSubmitted }) => {
  const { user, isAuthenticated } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: '',
    rating: 5,
    text: '',
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Pre-fill from logged-in user
  useEffect(() => {
    if (open && isAuthenticated && user) {
      setForm((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }));
    }
  }, [open, isAuthenticated, user]);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setForm({ name: '', email: '', role: '', rating: 5, text: '' });
      setHoverRating(0);
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.rating || form.rating < 1 || form.rating > 5) {
      toast.error('Please pick a star rating');
      return;
    }
    if (form.text.trim().length < 10) {
      toast.error('Review must be at least 10 characters');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        rating: form.rating,
        text: form.text.trim(),
        role: form.role.trim(),
      };
      // For guests, include name/email; for logged-in users, server uses their account
      if (!isAuthenticated) {
        payload.name = form.name.trim();
        payload.email = form.email.trim();
      }

      await submitReview(payload);
      toast.success('Thank you! Your review will appear once approved.');
      onClose();
      if (onSubmitted) onSubmitted();
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || 'Submission failed'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const displayedRating = hoverRating || form.rating;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-start sm:items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full my-8 shadow-elevated">
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Write a Review
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Share your experience working with us
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-md text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Star Rating */}
          <div>
            <label className="label-pro">Your Rating *</label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setForm({ ...form, rating: n })}
                  onMouseEnter={() => setHoverRating(n)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                  aria-label={`${n} stars`}
                >
                  <Star
                    size={28}
                    className={
                      n <= displayedRating
                        ? 'fill-accent-400 text-accent-400'
                        : 'text-slate-300'
                    }
                    strokeWidth={1.5}
                  />
                </button>
              ))}
              <span className="ml-3 text-sm text-slate-600">
                {form.rating} of 5
              </span>
            </div>
          </div>

          {/* Name (locked for logged-in users) */}
          <div>
            <label className="label-pro">Your Name *</label>
            <div className="relative">
              <UserIcon
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                disabled={isAuthenticated}
                className={`input-pro pl-10 ${
                  isAuthenticated ? 'bg-slate-50 cursor-not-allowed' : ''
                }`}
                placeholder="Your full name"
              />
            </div>
          </div>

          {/* Email (locked for logged-in users) */}
          <div>
            <label className="label-pro">Email Address *</label>
            <div className="relative">
              <Mail
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                disabled={isAuthenticated}
                className={`input-pro pl-10 ${
                  isAuthenticated ? 'bg-slate-50 cursor-not-allowed' : ''
                }`}
                placeholder="you@example.com"
              />
            </div>
            {!isAuthenticated && (
              <p className="text-[11px] text-slate-400 mt-1.5">
                Used only to verify your review. Not displayed publicly.
              </p>
            )}
          </div>

          {/* Role (optional) */}
          <div>
            <label className="label-pro">Role / Company (optional)</label>
            <div className="relative">
              <Briefcase
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="input-pro pl-10"
                placeholder="e.g. CEO, Acme Co."
                maxLength={120}
              />
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label className="label-pro">Your Review *</label>
            <textarea
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              required
              minLength={10}
              maxLength={1000}
              rows={5}
              className="input-pro resize-none"
              placeholder="Tell others about your experience working with Maurisys..."
            />
            <p className="text-[11px] text-slate-400 mt-1.5">
              {form.text.length}/1000 characters · minimum 10
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-slate-100">
            <p className="text-[11px] text-slate-500">
              Reviews are moderated before being published.
            </p>
            <div className="flex gap-2 sm:gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 border border-slate-200 rounded-md hover:bg-slate-50 font-medium text-sm flex-1 sm:flex-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary disabled:opacity-60 flex-1 sm:flex-none"
              >
                {submitting ? (
                  'Submitting...'
                ) : (
                  <>
                    <Send size={14} className="mr-2" /> Submit Review
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
