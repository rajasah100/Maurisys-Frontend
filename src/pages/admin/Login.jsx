import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Mail, Lock, LogIn, Code2, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logo from "../../assets/logo.png"

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(credentials.email, credentials.password);
      toast.success('Welcome back!');
      navigate('/admin');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen hero-bg flex items-center justify-center p-4">
      <Toaster position="top-right" />

      <div className="w-full max-w-md relative z-10">
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-8">
          {/* <div>
            <Code2 className="w-5 h-5 text-white" strokeWidth={2.2} />
            <img className='w-12' src={logo} />
          </div> */}
          <span className="font-display text-xl font-bold text-white tracking-tight">
            Maurisys
            <span className="text-primary-300 font-medium"> Admin</span>
          </span>
        </Link>

        <div className="bg-white rounded-2xl shadow-elevated p-8 border border-white/10">
          <div className="text-center mb-7">
            <h1 className="text-2xl font-bold text-slate-900 mb-1.5 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-slate-600 text-sm">Sign in to access the dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-pro">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  required
                  className="input-pro pl-10"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label className="label-pro">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  required
                  className="input-pro pl-10 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-60 mt-2"
            >
              {loading ? 'Signing in...' : (
                <>
                  Sign In <LogIn size={15} className="ml-2" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center space-y-2">
            <Link
              to="/"
              className="text-xs text-primary-700 hover:text-primary-900 inline-flex items-center gap-1.5 font-medium"
            >
              <ArrowLeft size={12} /> Back to Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
