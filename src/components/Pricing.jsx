import { useEffect, useState } from 'react';
import { Check, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchPlans } from '../services/api';

const Pricing = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await fetchPlans();
        setPlans(data.data || []);
      } catch (e) {
        console.error('Failed to load plans', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <section className="py-24 bg-slate-50/60 border-y border-slate-100" id="pricing">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <p className="section-eyebrow justify-center">Pricing Plans</p>
          <h2 className="section-title">Affordable Plans for Every Business</h2>
          <p className="section-lede mx-auto">
            Transparent pricing with no hidden fees. Choose the plan that fits your goals
            and budget.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-slate-100 h-[480px] rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center text-slate-500">
            No plans are currently available. Please check back soon.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan._id}
                className={`relative bg-white rounded-2xl p-8 transition-all duration-300 ${
                  plan.isPopular
                    ? 'border-2 border-primary-700 shadow-elevated md:scale-[1.02]'
                    : 'border border-slate-200 hover:border-primary-200 hover:shadow-card'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-800 text-white text-[10px] font-bold uppercase tracking-[0.18em] px-3.5 py-1 rounded-full flex items-center gap-1.5 shadow-card">
                    <Star size={10} fill="currentColor" /> Most Popular
                  </div>
                )}

                <div className="text-center mb-7 pb-6 border-b border-slate-100">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-slate-600 mb-5 min-h-[40px]">
                    {plan.description}
                  </p>
                  <div className="flex items-end justify-center gap-1">
                    <span className="stat-number text-4xl text-slate-900">
                      {plan.price}
                    </span>
                    <span className="text-slate-500 text-xs mb-1.5">
                      /{plan.period}
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features?.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-sm">
                      <div className={`w-4 h-4 mt-0.5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        plan.isPopular ? 'bg-primary-100' : 'bg-slate-100'
                      }`}>
                        <Check className={`w-3 h-3 ${
                          plan.isPopular ? 'text-primary-700' : 'text-slate-600'
                        }`} strokeWidth={3} />
                      </div>
                      <span className="text-slate-700">{feat}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={plan.ctaLink || '/contact'}
                  className={`block w-full text-center py-3 rounded-md font-semibold text-sm tracking-wide transition-all ${
                    plan.isPopular
                      ? 'bg-primary-800 text-white hover:bg-primary-900 shadow-soft'
                      : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  {plan.ctaText || 'Get Started'}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Pricing;
