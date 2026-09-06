import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Button from '../components/common/Button';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      toast.success('Message sent! We\'ll get back to you soon.');
      setForm({ name: '', email: '', subject: '', message: '' });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="container-custom py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-display font-bold text-gray-900">Get In Touch</h1>
        <p className="text-gray-500 mt-2">We'd love to hear from you. Send us a message!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Info */}
        <div className="space-y-6">
          {[
            { icon: <FiMapPin className="text-navy" size={22} />, title: 'Address', text: '123 Nebula Street, Mumbai, Maharashtra 400001' },
            { icon: <FiPhone className="text-navy" size={22} />, title: 'Phone', text: '+91 (123) 456-7890' },
            { icon: <FiMail className="text-navy" size={22} />, title: 'Email', text: 'support@nebula.com' },
          ].map((c) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-4 bg-white rounded-xl shadow-card p-5"
            >
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">{c.icon}</div>
              <div>
                <p className="font-semibold text-sm text-gray-800">{c.title}</p>
                <p className="text-sm text-gray-500 mt-0.5">{c.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-card p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Name</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="input-field" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
              <input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="How can we help?" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
              <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us more..." className="input-field resize-none" />
            </div>
            <Button type="submit" isLoading={isLoading} leftIcon={<FiSend size={16} />}>Send Message</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
