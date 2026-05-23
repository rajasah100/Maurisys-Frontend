import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { MapPin, Phone, Mail, Send, Clock } from 'lucide-react';
import { submitContactForm } from '../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await submitContactForm(formData);
      toast.success(data.message || 'Message sent successfully!');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Our Location',
      lines: ['Lalitpur-44600, Nepal'],
    },
    {
      icon: Phone,
      title: 'Call Us',
      lines: ['+977-9709005491', '+977-9809005492'],
    },
    {
      icon: Mail,
      title: 'Email Us',
      lines: ['Info@maurisys.com', 'maurisyssoftware@gmail.com'],
    },
    {
      icon: Clock,
      title: 'Working Hours',
      lines: ['Sun - Fri: 10:00 AM - 4:00 PM', 'Sat: Closed'],
    },
  ];

  return (
    <>
      <Toaster position="top-right" />

      <section className="hero-bg pt-32 pb-20 text-white relative">
        <div className="container-custom relative z-10 text-center max-w-3xl mx-auto">
          <p className="inline-flex items-center gap-2 text-accent-300 font-semibold uppercase tracking-[0.18em] text-xs mb-4">
            <span className="inline-block w-8 h-px bg-accent-400" />
            Contact
            <span className="inline-block w-8 h-px bg-accent-400" />
          </p>
          <h1 className="text-4xl text-white md:text-5xl lg:text-[3.25rem] font-bold mb-5 leading-[1.1] tracking-tightest">
            Let&apos;s start a{' '}
            <span className="font-serif italic font-medium text-accent-300">conversation</span>
          </h1>
          <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Ready to start your digital journey? Reach out and our team will get
            back to you shortly.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200/70 rounded-2xl overflow-hidden border border-slate-200/70 mb-14">
            {contactInfo.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="bg-white p-7 hover:bg-primary-50/30 transition-colors">
                  <div className="w-11 h-11 bg-primary-50 border border-primary-100 rounded-lg flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-primary-700" strokeWidth={1.8} />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2 tracking-tight">{item.title}</h3>
                  {item.lines.map((line, i) => (
                    <p key={i} className="text-sm text-slate-600 leading-relaxed">{line}</p>
                  ))}
                </div>
              );
            })}
          </div>

          {/* Contact Form + Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form */}
            <div className="bg-white p-8 md:p-10 rounded-2xl border border-slate-200">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 tracking-tight">
                Send us a Message
              </h2>
              <p className="text-slate-600 mb-7 text-sm">
                Fill out the form below and we will respond as soon as possible.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label-pro">Your Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input-pro"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="label-pro">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input-pro"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label-pro">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input-pro"
                      placeholder="+977-xxxxxxxxx"
                    />
                  </div>
                  <div>
                    <label className="label-pro">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="input-pro"
                      placeholder="Project Inquiry"
                    />
                  </div>
                </div>

                <div>
                  <label className="label-pro">Your Message *</label>
                  <textarea
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="input-pro resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Sending...' : (
                    <>
                      Send Message <Send size={15} className="ml-2" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Map */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 min-h-[400px] bg-slate-100">
              <iframe
                title="Office Location"
                src="https://www.openstreetmap.org/export/embed.html?bbox=85.30,27.66,85.34,27.69&layer=mapnik"
                className="w-full h-full min-h-[500px] border-0"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
