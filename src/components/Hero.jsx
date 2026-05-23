import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, ShieldCheck, TrendingUp } from 'lucide-react';

// Count-up hook
const useCountUp = (end, duration = 2000, start = true) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(eased * end);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, start]);

  return count;
};

const Hero = () => {
  const clientsCount = useCountUp(200, 2000);
  const satisfactionCount = useCountUp(98, 2000);
  const performanceCount = useCountUp(142.6, 2200);

  return (
    <section className="hero-bg pt-32 pb-24 lg:pt-40 lg:pb-32 relative">
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white animate-slide-up lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/[0.06] backdrop-blur-sm rounded-full border border-white/15 mb-7">
              <Sparkles size={13} className="text-accent-400" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200">
                Welcome to Maurisys Solution
              </span>
            </div>

            <h1 className="text-4xl text-white md:text-5xl lg:text-[3.75rem] font-bold leading-[1.05] mb-6 tracking-tightest">
              Where Ideas <br className="hidden md:block" />
              Become <span className="font-serif italic font-medium text-accent-300">Digital Reality</span>
            </h1>

            <p className="text-base md:text-lg text-slate-300 mb-10 leading-relaxed max-w-xl">
              We engineer custom software, brand experiences, and growth strategies for ambitious
              businesses. Precision-built, reliably delivered, measurably effective.
            </p>

            <div className="flex flex-wrap gap-3 mb-12">
              <Link to="/contact" className="btn-accent">
                Start Your Project <ArrowRight size={16} className="ml-2" />
              </Link>
              <Link to="/portfolio" className="btn-outline">
                View Our Work
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10 max-w-lg">
              <div>
                <p className="stat-number text-2xl text-white">{Math.floor(clientsCount)}+</p>
                <p className="text-xs text-slate-400 mt-1">Clients served</p>
              </div>
              <div>
                <p className="stat-number text-2xl text-white">{Math.floor(satisfactionCount)}%</p>
                <p className="text-xs text-slate-400 mt-1">Satisfaction rate</p>
              </div>
              <div>
                <p className="stat-number text-2xl text-white">24/7</p>
                <p className="text-xs text-slate-400 mt-1">Support coverage</p>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative animate-fade-in lg:col-span-5">
            <div className="relative">
              {/* Main visual card */}
              <div className="glass-card rounded-2xl p-7 shadow-elevated">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-300">
                      Live · maurisys.app
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">v2.4</span>
                </div>

                <div className="bg-gradient-to-br from-primary-800/60 to-primary-950/80 rounded-xl p-5 mb-4 border border-white/[0.06]">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Performance</p>
                      <p className="stat-number text-xl text-white">+ {performanceCount.toFixed(1)}%</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-emerald-400" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-7 gap-1 mt-4">
                      {[40, 65, 50, 80, 55, 90, 70].map((h, i) => (
                        <div
                          key={i}
                          className="bg-gradient-to-t from-primary-500/30 to-primary-300/60 rounded-sm"
                          style={{ height: `${h * 0.5}px` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/[0.04] border border-white/[0.06] p-3.5 rounded-lg">
                    <p className="stat-number text-xl text-white">{Math.floor(satisfactionCount)}%</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Client Satisfaction</p>
                  </div>
                  <div className="bg-white/[0.04] border border-white/[0.06] p-3.5 rounded-lg">
                    <p className="stat-number text-xl text-white">24/7</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Support Available</p>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-3 -right-3 bg-white text-primary-800 px-3.5 py-2 rounded-lg shadow-elevated animate-float flex items-center gap-2">
                <ShieldCheck size={14} className="text-primary-700" />
                <p className="text-[11px] font-semibold">Enterprise-grade</p>
              </div>
              <div
                className="absolute -bottom-3 -left-3 bg-accent-500 text-white px-3.5 py-2 rounded-lg shadow-elevated animate-float"
                style={{ animationDelay: '2s' }}
              >
                <p className="text-[11px] font-semibold">Trusted Delivery</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;