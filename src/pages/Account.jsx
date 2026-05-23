import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import {
  User as UserIcon, Mail, Phone, Lock, LogOut, Save, Eye, EyeOff,
  ShieldCheck, Calendar,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Account = () => {
  const { user, updateProfile, changePassword, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPwd, setShowPwd] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile(profileForm);
      toast.success('Profile updated');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Update failed');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    setSavingPwd(true);
    try {
      await changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      toast.success('Password changed successfully');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || 'Password change failed'
      );
    } finally {
      setSavingPwd(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Signed out');
    navigate('/');
  };

  const memberSince = user?._id
    ? new Date(parseInt(user._id.toString().substring(0, 8), 16) * 1000)
    : null;

  return (
    <>
      <Toaster position="top-right" />

      {/* Hero */}
      <section className="hero-bg pt-32 pb-16 text-white relative">
        <div className="container-custom relative z-10">
          <p className="inline-flex items-center gap-2 text-accent-300 font-semibold uppercase tracking-[0.18em] text-xs mb-4">
            <span className="inline-block w-8 h-px bg-accent-400" />
            My Account
          </p>
          <h1 className="text-3xl text-white md:text-4xl font-bold mb-2 leading-[1.15] tracking-tightest">
            Welcome back, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-slate-300 text-sm md:text-base">
            Manage your profile, security, and preferences.
          </p>
        </div>
      </section>

      <section className="py-12 bg-slate-50/60 min-h-[60vh]">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sidebar / Profile summary */}
            <aside className="lg:col-span-4">
              <div className="card-pro p-6 mb-4">
                <div className="flex items-center gap-4 mb-5 pb-5 border-b border-slate-100">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-slate-100"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-primary-800 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 truncate tracking-tight">
                      {user?.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    <span className="inline-block mt-1.5 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-primary-50 text-primary-700">
                      {user?.role === 'admin' ? 'Administrator' : 'Member'}
                    </span>
                  </div>
                </div>

                <nav className="space-y-1">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'profile'
                        ? 'bg-primary-50 text-primary-800'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <UserIcon size={15} strokeWidth={1.8} /> Profile Info
                  </button>
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'security'
                        ? 'bg-primary-50 text-primary-800'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <ShieldCheck size={15} strokeWidth={1.8} /> Security
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={15} strokeWidth={1.8} /> Sign Out
                  </button>
                </nav>
              </div>

              {memberSince && (
                <div className="card-pro p-4">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1.5 flex items-center gap-1.5">
                    <Calendar size={11} /> Member Since
                  </p>
                  <p className="text-sm text-slate-700">
                    {memberSince.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              )}
            </aside>

            {/* Main content */}
            <div className="lg:col-span-8">
              {activeTab === 'profile' && (
                <div className="card-pro p-6 md:p-8">
                  <div className="mb-6 pb-6 border-b border-slate-100">
                    <h2 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight mb-1">
                      Profile Information
                    </h2>
                    <p className="text-sm text-slate-600">
                      Update how your name and contact info appear on your account.
                    </p>
                  </div>

                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div>
                      <label className="label-pro">Full Name</label>
                      <div className="relative">
                        <UserIcon
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                          size={16}
                        />
                        <input
                          type="text"
                          value={profileForm.name}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, name: e.target.value })
                          }
                          required
                          className="input-pro pl-10"
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
                          value={user?.email || ''}
                          disabled
                          className="input-pro pl-10 bg-slate-50 cursor-not-allowed text-slate-500"
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1.5">
                        Email cannot be changed. Contact support if you need to update it.
                      </p>
                    </div>

                    <div>
                      <label className="label-pro">Phone Number</label>
                      <div className="relative">
                        <Phone
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                          size={16}
                        />
                        <input
                          type="tel"
                          value={profileForm.phone}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              phone: e.target.value,
                            })
                          }
                          className="input-pro pl-10"
                          placeholder="+977-xxxxxxxxx"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="label-pro">Avatar URL (optional)</label>
                      <input
                        type="url"
                        value={profileForm.avatar}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            avatar: e.target.value,
                          })
                        }
                        className="input-pro"
                        placeholder="https://example.com/avatar.jpg"
                      />
                    </div>

                    <div className="flex justify-end pt-4 border-t border-slate-100">
                      <button
                        type="submit"
                        disabled={savingProfile}
                        className="btn-primary disabled:opacity-60"
                      >
                        {savingProfile ? (
                          'Saving...'
                        ) : (
                          <>
                            <Save size={15} className="mr-2" /> Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="card-pro p-6 md:p-8">
                  <div className="mb-6 pb-6 border-b border-slate-100">
                    <h2 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight mb-1">
                      Change Password
                    </h2>
                    <p className="text-sm text-slate-600">
                      Choose a strong password you don&apos;t use anywhere else.
                    </p>
                  </div>

                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                      <label className="label-pro">Current Password</label>
                      <div className="relative">
                        <Lock
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                          size={16}
                        />
                        <input
                          type={showPwd ? 'text' : 'password'}
                          value={passwordForm.currentPassword}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              currentPassword: e.target.value,
                            })
                          }
                          required
                          className="input-pro pl-10 pr-10"
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPwd(!showPwd)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="label-pro">New Password</label>
                      <div className="relative">
                        <Lock
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                          size={16}
                        />
                        <input
                          type={showPwd ? 'text' : 'password'}
                          value={passwordForm.newPassword}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              newPassword: e.target.value,
                            })
                          }
                          required
                          minLength={6}
                          className="input-pro pl-10"
                          placeholder="At least 6 characters"
                          autoComplete="new-password"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="label-pro">Confirm New Password</label>
                      <div className="relative">
                        <Lock
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                          size={16}
                        />
                        <input
                          type={showPwd ? 'text' : 'password'}
                          value={passwordForm.confirmPassword}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              confirmPassword: e.target.value,
                            })
                          }
                          required
                          className="input-pro pl-10"
                          autoComplete="new-password"
                        />
                      </div>
                      {passwordForm.confirmPassword &&
                        passwordForm.newPassword !==
                          passwordForm.confirmPassword && (
                          <p className="text-xs text-red-600 mt-1.5">
                            Passwords do not match
                          </p>
                        )}
                    </div>

                    <div className="flex justify-end pt-4 border-t border-slate-100">
                      <button
                        type="submit"
                        disabled={savingPwd}
                        className="btn-primary disabled:opacity-60"
                      >
                        {savingPwd ? 'Updating...' : 'Update Password'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Account;
