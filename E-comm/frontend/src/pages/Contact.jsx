import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend, FiClock, FiShield, FiHeadphones } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      toast.success('Message sent! Our appliance support team will respond within 24 hours.');
      setForm({ name: '', email: '', subject: '', message: '' });
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-[85vh] bg-[#F3F3EE] py-12 px-4">
      <div className="container-custom max-w-[1280px]">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] font-black uppercase tracking-widest text-brand-red bg-brand-red/10 px-3.5 py-1 rounded-full inline-block mb-3">
            Customer Support & Assistance
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-slate-900 tracking-tight">
            We're Here to Help Your Smart Home
          </h1>
          <p className="text-gray-600 text-sm mt-2 leading-relaxed">
            Have questions about appliance specifications, warranties, installation or your order? Reach our dedicated team anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info Side */}
          <div className="space-y-4">
            {/* Primary Dark Card */}
            <div className="bg-[#11161B] text-white rounded-3xl p-6 shadow-xl border border-white/10 relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-[#CEF04A]/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#CEF04A]/20 text-[#CEF04A] flex items-center justify-center">
                  <FiHeadphones size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Direct Support</h3>
                  <p className="text-xs text-gray-400">Toll-free customer care</p>
                </div>
              </div>
              <p className="font-mono text-xl font-black text-[#CEF04A] mb-1">1800-209-HOME</p>
              <p className="text-xs text-gray-400 mb-4">Mon - Sat: 9:00 AM – 8:00 PM IST</p>
              <div className="border-t border-white/10 pt-3 flex items-center gap-2 text-xs text-gray-300">
                <FiClock size={13} className="text-[#CEF04A]" /> Average response time: &lt; 15 mins
              </div>
            </div>

            {/* Other Contacts */}
            {[
              {
                icon: <FiMail className="text-brand-red" size={20} />,
                title: 'Email Inquiries',
                subtitle: 'support@homekart.com',
                desc: 'For warranty claims & corporate bulk inquiries',
              },
              {
                icon: <FiMapPin className="text-brand-red" size={20} />,
                title: 'Flagship Experience Center',
                subtitle: 'HomeKart Tech Park, BKC, Mumbai',
                desc: 'Maharashtra 400051, India',
              },
              {
                icon: <FiShield className="text-brand-red" size={20} />,
                title: 'Authorised Service Network',
                subtitle: '500+ Cities Covered across India',
                desc: 'Free home installation & genuine spare parts',
              },
            ].map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-3xl border border-black/5 shadow-sm p-5 flex items-start gap-4 hover:shadow-md transition-all"
              >
                <div className="w-11 h-11 bg-red-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5">{item.subtitle}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-6 sm:p-8">
              <div className="mb-6">
                <h3 className="text-xl font-black font-display text-slate-900">Send us a Message</h3>
                <p className="text-xs text-gray-500 mt-0.5">Fill out the details below and an appliance advisor will contact you</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Your Name
                    </label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="input-field text-xs sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Email Address
                    </label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="rahul@example.com"
                      className="input-field text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Subject / Topic
                  </label>
                  <input
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="e.g. Question about AC installation or warranty"
                    className="input-field text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us what you need assistance with..."
                    className="input-field resize-none text-xs sm:text-sm"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 py-3.5 px-8 rounded-full bg-brand-red hover:bg-brand-redHover text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg active:scale-95 transition-all disabled:opacity-60"
                  >
                    <FiSend size={15} />
                    {isLoading ? 'Sending message...' : 'Send Message'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
