import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CTA = () => {
  return (
    <section className="py-20">
      <div className="container-custom">
        <div className="relative bg-primary-900 rounded-2xl p-10 md:p-16 overflow-hidden border border-primary-800">
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.06]" style={{
            backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
          }} />

          <div className="absolute top-0 right-0 w-72 h-72 bg-primary-600/20 rounded-full -translate-y-36 translate-x-36 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent-500/10 rounded-full translate-y-36 -translate-x-36 blur-3xl" />

          <div className="relative z-10 max-w-3xl">
            <p className="inline-flex items-center gap-2 text-accent-300 font-semibold uppercase tracking-[0.18em] text-xs mb-4">
              <span className="inline-block w-8 h-px bg-accent-400" />
              Ready to Get Started
            </p>

            <h2 className="text-3xl md:text-[2.75rem] font-bold text-white mb-5 leading-[1.1] tracking-tightest">
              Let&apos;s build something
              <span className="font-serif italic font-medium text-accent-300"> remarkable </span>
              together
            </h2>
            <p className="text-slate-300 text-base md:text-lg mb-8 leading-relaxed max-w-2xl">
              Bring your vision to life with our senior team. From concept to deployment,
              we deliver digital solutions that stand out and stand the test of time.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/contact" className="btn-accent">
                Start Your Project <ArrowRight size={16} className="ml-2" />
              </Link>
              <Link to="/services" className="btn-outline">
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
