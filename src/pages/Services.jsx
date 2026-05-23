import ServicesSection from '../components/ServicesSection';
import CTA from '../components/CTA';

const Services = () => {
  return (
    <>
      <section className="hero-bg pt-32 pb-20 text-white relative">
        <div className="container-custom relative z-10 text-center max-w-3xl mx-auto">
          <p className="inline-flex items-center gap-2 text-accent-300 font-semibold uppercase tracking-[0.18em] text-xs mb-4">
            <span className="inline-block w-8 h-px bg-accent-400" />
            Services
            <span className="inline-block w-8 h-px bg-accent-400" />
          </p>
          <h1 className="text-4xl text-white md:text-5xl lg:text-[3.25rem] font-bold mb-5 leading-[1.1] tracking-tightest">
            Solutions tailored to{' '}
            <span className="font-serif italic font-medium text-accent-300">your goals</span>
          </h1>
          <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Comprehensive IT solutions designed to help your business thrive in
            the modern digital landscape.
          </p>
        </div>
      </section>
      <ServicesSection />
      <CTA />
    </>
  );
};

export default Services;
