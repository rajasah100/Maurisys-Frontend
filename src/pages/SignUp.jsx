import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import {
  Mail, Lock, User as UserIcon, Eye, EyeOff, ArrowRight, Code2,
  ShieldCheck, Zap, Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png'
import maurisysLogo from '../assets/maurisys_logo.bg.webp'

const SignUp = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/account';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (!form.agreeToTerms) {
      toast.error('Please agree to the terms to continue');
      return;
    }

    setLoading(true);
    try {
      await signup(form.name, form.email, form.password);
      toast.success(`Welcome, ${form.name.split(' ')[0]}!`);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <Toaster position="top-right" />

      {/* Left side — form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-10 bg-white">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-1 mb-10">
            <div>
              <img className='w-14' src={logo} />
            </div>
            <img className='w-40' src={maurisysLogo} alt="Logo" />
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 tracking-tight">
              Create your account
            </h1>
            <p className="text-slate-600 text-sm">
              Join Maurisys to manage your projects, track inquiries, and more.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-pro">Full Name</label>
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
                  autoComplete="name"
                  className="input-pro pl-10"
                  placeholder="Your full name"
                />
              </div>
            </div>

            <div>
              <label className="label-pro">Email Address</label>
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
                  autoComplete="email"
                  className="input-pro pl-10"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="label-pro">Password</label>
              <div className="relative">
                <Lock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="input-pro pl-10 pr-10"
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="label-pro">Confirm Password</label>
              <div className="relative">
                <Lock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                  required
                  autoComplete="new-password"
                  className="input-pro pl-10"
                  placeholder="Re-enter your password"
                />
              </div>
              {form.confirmPassword &&
                form.password !== form.confirmPassword && (
                  <p className="text-xs text-red-600 mt-1.5">
                    Passwords do not match
                  </p>
                )}
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={form.agreeToTerms}
                onChange={(e) =>
                  setForm({ ...form, agreeToTerms: e.target.checked })
                }
                className="w-4 h-4 mt-0.5 rounded text-primary-700 focus:ring-primary-500 border-slate-300"
              />
              <span className="text-xs text-slate-600 leading-relaxed">
                I agree to the{' '}
                <Link to="/terms" className="text-primary-700 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary-700 hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-60 mt-2"
            >
              {loading ? (
                'Creating account...'
              ) : (
                <>
                  Create Account <ArrowRight size={15} className="ml-2" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-600 mt-7">
            Already have an account?{' '}
            <Link
              to="/signin"
              className="text-primary-700 hover:text-primary-900 font-semibold"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Right side — visual marketing panel */}
      <div className="hidden lg:flex flex-1 hero-bg relative items-center justify-center p-12">
        <div className="relative z-10 max-w-md text-white">
          <p className="inline-flex items-center gap-2 text-accent-300 font-semibold uppercase tracking-[0.18em] text-xs mb-5">
            <span className="inline-block w-8 h-px bg-accent-400" />
            Why join us
          </p>
          <h2 className="text-3xl text-white xl:text-4xl font-bold mb-5 leading-[1.15] tracking-tightest">
            Build your digital{' '}
            <span className="font-serif italic font-medium text-accent-300">
              future
            </span>{' '}
            with Maurisys
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-8">
            Create an account to track your projects, communicate with our team,
            and access exclusive resources.
          </p>

          <div className="space-y-4">
            {[
              {
                icon: Zap,
                title: 'Get started in seconds',
                text: 'No credit card required, no setup fees',
              },
              {
                icon: ShieldCheck,
                title: 'Your data stays secure',
                text: 'Industry-standard encryption and privacy',
              },
              {
                icon: Sparkles,
                title: 'Personalized experience',
                text: 'Save preferences and get tailored recommendations',
              },
            ].map((b, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-9 h-9 bg-white/[0.06] border border-white/10 rounded-md flex items-center justify-center flex-shrink-0">
                  <b.icon
                    className="w-4 h-4 text-accent-300"
                    strokeWidth={1.8}
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white mb-0.5">
                    {b.title}
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {b.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
