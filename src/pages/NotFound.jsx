import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-slate-50/60 pt-20">
      <div className="text-center px-4 max-w-md">
        <p className="stat-number text-[7rem] md:text-[9rem] leading-none text-primary-700 mb-2">
          404
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 tracking-tight">
          Page Not Found
        </h2>
        <p className="text-slate-600 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => window.history.back()} className="btn-secondary">
            <ArrowLeft size={15} className="mr-2" /> Go Back
          </button>
          <Link to="/" className="btn-primary">
            <Home size={15} className="mr-2" /> Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
