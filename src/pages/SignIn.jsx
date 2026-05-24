import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, Code2, Quote,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png'
import maurisysLogo from '../assets/maurisys_logo.bg.webp'

const SignIn = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/account';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(credentials.email, credentials.password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      // Admins go to admin dashboard, regular users to their account or where they came from
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate(redirectTo, { replace: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Login failed');
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
            {/* <div>
              <img className='w-14' src={logo}  />
            </div> */}
            <img className='w-40' src={maurisysLogo} alt="Logo" />
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 tracking-tight">
              Welcome back
            </h1>
            <p className="text-slate-600 text-sm">
              Sign in to your account to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-pro">Email Address</label>
              <div className="relative">
                <Mail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type="email"
                  value={credentials.email}
                  onChange={(e) =>
                    setCredentials({ ...credentials, email: e.target.value })
                  }
                  required
                  autoComplete="email"
                  className="input-pro pl-10"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label-pro mb-0">Password</label>
                <Link
                  to="/contact"
                  className="text-xs text-primary-700 hover:text-primary-900 font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  required
                  autoComplete="current-password"
                  className="input-pro pl-10 pr-10"
                  placeholder="Enter your password"
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

            <label className="flex items-center gap-2.5 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-primary-700 focus:ring-primary-500 border-slate-300"
              />
              <span className="text-sm text-slate-600">Remember me</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-60 mt-2"
            >
              {loading ? (
                'Signing in...'
              ) : (
                <>
                  Sign In <ArrowRight size={15} className="ml-2" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-600 mt-7">
            Don&apos;t have an account?{' '}
            <Link
              to="/signup"
              className="text-primary-700 hover:text-primary-900 font-semibold"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      {/* Right side — visual */}
      <div className="hidden lg:flex flex-1 hero-bg relative items-center justify-center p-12">
        <div className="relative z-10 max-w-md text-white">
          <Quote className="w-10 h-10 text-accent-400 mb-6" strokeWidth={1.5} />
          <p className="text-xl xl:text-2xl text-white leading-relaxed mb-8 font-serif italic">
            &ldquo;Maurisys transformed our entire digital presence. The team
            delivered beyond what we hoped for, and the support has been
            exceptional ever since.&rdquo;
          </p>
          <div className="flex items-center gap-3 pt-6 border-t border-white/10">
            <div className="w-11 h-11 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white font-bold">
              <img className='w-18 h-18 rounded-full object-cover ring-2 ring-blue-500' src="https://media.licdn.com/dms/image/v2/D4D03AQHvLMfej0tXgg/profile-displayphoto-crop_800_800/B4DZnteanoGgAI-/0/1760625798436?e=1779926400&v=beta&t=W45yPCUiVBdrzYo9lEljF_RHqzcvoW1FKEVEnz78wV0" alt="" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">Mr. Kiran Kumar Sah</p>
              <p className="text-xs text-slate-400">Co-founder and CEO, Software Engineer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
