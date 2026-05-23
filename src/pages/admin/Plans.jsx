import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Star, Check, EyeOff, Eye, GripVertical } from 'lucide-react';
import API from '../../services/api';

const emptyForm = {
  name: '',
  price: '',
  period: 'per month',
  description: '',
  features: [''],
  ctaText: 'Get Started',
  ctaLink: '/contact',
  isPopular: false,
  isActive: true,
  order: 0,
};

const Plans = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const loadItems = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/plans?all=true');
      setItems(data.data || []);
    } catch (e) {
      toast.error('Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, order: items.length + 1 });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name || '',
      price: item.price || '',
      period: item.period || 'per month',
      description: item.description || '',
      features: item.features?.length ? [...item.features] : [''],
      ctaText: item.ctaText || 'Get Started',
      ctaLink: item.ctaLink || '/contact',
      isPopular: !!item.isPopular,
      isActive: item.isActive !== false,
      order: item.order || 0,
    });
    setShowModal(true);
  };

  const handleFeatureChange = (idx, value) => {
    const next = [...form.features];
    next[idx] = value;
    setForm({ ...form, features: next });
  };

  const addFeature = () => setForm({ ...form, features: [...form.features, ''] });

  const removeFeature = (idx) => {
    if (form.features.length === 1) {
      setForm({ ...form, features: [''] });
      return;
    }
    setForm({ ...form, features: form.features.filter((_, i) => i !== idx) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        features: form.features.map((f) => f.trim()).filter(Boolean),
        order: Number(form.order) || 0,
      };
      if (editingId) {
        await API.put(`/plans/${editingId}`, payload);
        toast.success('Plan updated');
      } else {
        await API.post('/plans', payload);
        toast.success('Plan created');
      }
      setShowModal(false);
      loadItems();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this plan? This cannot be undone.')) return;
    try {
      await API.delete(`/plans/${id}`);
      toast.success('Plan deleted');
      loadItems();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const togglePopular = async (item) => {
    try {
      await API.put(`/plans/${item._id}`, { isPopular: !item.isPopular });
      toast.success(item.isPopular ? 'Popular flag removed' : 'Marked as popular');
      loadItems();
    } catch {
      toast.error('Update failed');
    }
  };

  const toggleActive = async (item) => {
    try {
      await API.put(`/plans/${item._id}`, { isActive: !item.isActive });
      toast.success(item.isActive ? 'Plan hidden' : 'Plan published');
      loadItems();
    } catch {
      toast.error('Update failed');
    }
  };

  return (
    <div>
      <Toaster position="top-right" />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1 tracking-tight">
            Pricing Plans
          </h1>
          <p className="text-slate-600 text-sm">
            Manage the plans shown on your public Pricing page.
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus size={16} className="mr-2" /> Add Plan
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-slate-200 h-72 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-slate-500 border border-slate-100">
          No plans yet. Click <strong>Add Plan</strong> to create your first one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item._id}
              className={`bg-white rounded-xl border ${
                item.isPopular ? 'border-primary-300' : 'border-slate-200'
              } overflow-hidden flex flex-col`}
            >
              <div className="p-5 border-b border-slate-100">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-slate-900 tracking-tight">{item.name}</h3>
                    {item.isPopular && (
                      <span className="bg-primary-50 text-primary-700 text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider flex items-center gap-1">
                        <Star size={9} fill="currentColor" /> Popular
                      </span>
                    )}
                    {!item.isActive && (
                      <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                        Hidden
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">#{item.order}</span>
                </div>
                <div className="flex items-end gap-1 mb-2">
                  <span className="stat-number text-2xl text-slate-900">{item.price}</span>
                  <span className="text-xs text-slate-500 mb-1">/{item.period}</span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2">{item.description}</p>
              </div>

              <div className="p-5 flex-1">
                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-2">
                  Features ({item.features?.length || 0})
                </p>
                <ul className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                  {item.features?.slice(0, 5).map((feat, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <Check size={12} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-1">{feat}</span>
                    </li>
                  ))}
                  {item.features?.length > 5 && (
                    <li className="text-xs text-slate-400 italic pl-5">
                      +{item.features.length - 5} more
                    </li>
                  )}
                </ul>
              </div>

              <div className="border-t border-slate-100 p-3 flex items-center gap-1">
                <button
                  onClick={() => togglePopular(item)}
                  className={`flex-1 p-2 rounded-md text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                    item.isPopular
                      ? 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                  title="Toggle Popular"
                >
                  <Star size={13} fill={item.isPopular ? 'currentColor' : 'none'} />
                </button>
                <button
                  onClick={() => toggleActive(item)}
                  className="flex-1 p-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-1.5"
                  title={item.isActive ? 'Hide' : 'Publish'}
                >
                  {item.isActive ? <Eye size={13} /> : <EyeOff size={13} />}
                </button>
                <button
                  onClick={() => openEdit(item)}
                  className="flex-1 p-2 rounded-md text-slate-600 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center"
                  title="Edit"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="flex-1 p-2 rounded-md text-slate-600 hover:bg-red-50 hover:text-red-600 flex items-center justify-center"
                  title="Delete"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-start sm:items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full my-8 shadow-elevated">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 sticky top-0 bg-white rounded-t-2xl">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                {editingId ? 'Edit Plan' : 'Add New Plan'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 hover:bg-slate-100 rounded-md text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1">
                  <label className="label-pro">Plan Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    placeholder="e.g. Growth"
                    className="input-pro"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className="label-pro">Price *</label>
                  <input
                    type="text"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                    placeholder="e.g. ₹1999"
                    className="input-pro"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className="label-pro">Period</label>
                  <input
                    type="text"
                    value={form.period}
                    onChange={(e) => setForm({ ...form, period: e.target.value })}
                    placeholder="per month"
                    className="input-pro"
                  />
                </div>
              </div>

              <div>
                <label className="label-pro">Description *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                  rows={2}
                  maxLength={250}
                  placeholder="Short tagline shown under the plan name"
                  className="input-pro resize-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  {form.description.length}/250 characters
                </p>
              </div>

              {/* Features editor */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="label-pro mb-0">Features</label>
                  <button
                    type="button"
                    onClick={addFeature}
                    className="text-xs font-semibold text-primary-700 hover:text-primary-900 flex items-center gap-1"
                  >
                    <Plus size={13} /> Add Feature
                  </button>
                </div>
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {form.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 group">
                      <GripVertical
                        size={16}
                        className="text-slate-300 flex-shrink-0"
                      />
                      <input
                        type="text"
                        value={feat}
                        onChange={(e) => handleFeatureChange(idx, e.target.value)}
                        placeholder={`Feature ${idx + 1}`}
                        className="input-pro flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => removeFeature(idx)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md flex-shrink-0"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Empty features will be removed automatically when saving.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-pro">CTA Button Text</label>
                  <input
                    type="text"
                    value={form.ctaText}
                    onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
                    placeholder="Get Started"
                    className="input-pro"
                  />
                </div>
                <div>
                  <label className="label-pro">CTA Link</label>
                  <input
                    type="text"
                    value={form.ctaLink}
                    onChange={(e) => setForm({ ...form, ctaLink: e.target.value })}
                    placeholder="/contact"
                    className="input-pro"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="label-pro">Display Order</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: e.target.value })}
                    placeholder="0"
                    className="input-pro"
                  />
                </div>
                <div className="sm:col-span-2 flex items-end gap-5 pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isPopular}
                      onChange={(e) => setForm({ ...form, isPopular: e.target.checked })}
                      className="w-4 h-4 rounded text-primary-700 focus:ring-primary-500"
                    />
                    <span className="text-sm text-slate-700">Mark as Popular</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                      className="w-4 h-4 rounded text-primary-700 focus:ring-primary-500"
                    />
                    <span className="text-sm text-slate-700">Active (visible on site)</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 border border-slate-200 rounded-md hover:bg-slate-50 font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary disabled:opacity-60"
                >
                  {submitting ? 'Saving...' : editingId ? 'Update Plan' : 'Create Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Plans;
