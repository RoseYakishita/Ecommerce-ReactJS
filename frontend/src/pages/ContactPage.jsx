import { useState } from 'react';
import { useToast } from '../components/ToastProvider';
import Button from '../components/Button';
import { sendContactMessageApi } from '../services/api';

export default function ContactPage() {
  const { showToast } = useToast();
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendContactMessageApi(form);
      showToast('Thanks! Your message has been sent successfully.', 'success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      showToast(err.userMessage || 'Failed to send message. Please try again.', 'error');
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 md:py-16">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-primary font-semibold mb-3">Contact</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">Let’s talk</h1>
          <p className="text-textLight mb-6">
            Have questions about products, orders, or shipping? Our team is here to help.
          </p>

          <div className="space-y-4 text-sm">
            <div className="bg-white border border-secondary rounded-lg p-4">
              <p className="font-semibold">Email</p>
              <p className="text-textLight">hungdo1388@gmail.com</p>
            </div>
            <div className="bg-white border border-secondary rounded-lg p-4">
              <p className="font-semibold">Phone</p>
              <p className="text-textLight">+84 975582765</p>
            </div>
            <div className="bg-white border border-secondary rounded-lg p-4">
              <p className="font-semibold">Business Hours</p>
              <p className="text-textLight">Mon - Sat, 8:30 AM - 6:00 PM (GMT+7)</p>
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="bg-white border border-secondary rounded-xl p-6 md:p-7 space-y-4">
          <h2 className="text-xl font-semibold mb-1">Send us a message</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={onChange}
              className="w-full px-4 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={onChange}
              className="w-full px-4 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <input
              type="text"
              name="subject"
              required
              value={form.subject}
              onChange={onChange}
              className="w-full px-4 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea
              name="message"
              rows="5"
              required
              value={form.message}
              onChange={onChange}
              className="w-full px-4 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <Button type="submit" className="w-full">Send Message</Button>
        </form>
      </div>
    </div>
  );
}
