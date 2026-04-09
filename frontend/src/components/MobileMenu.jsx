<<<<<<< HEAD
// eslint-disable-next-line no-unused-vars
=======
>>>>>>> 35a7c14142a8e3e8c898c99bb4a8ffdb59299344
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { User, X, Globe, Mail, MessageCircle } from 'lucide-react';

const menuVariants = {
  closed: {
    y: '-100%',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
  open: {
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  closed: { opacity: 0, y: 20 },
  open: { opacity: 1, y: 0 },
};

export default function MobileMenu({ isOpen, onClose, user }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="closed"
          animate="open"
          exit="closed"
          variants={menuVariants}
          className="md:hidden fixed inset-0 top-0 bg-white z-[100] flex flex-col pt-24 shadow-2xl overflow-y-auto"
          style={{ opacity: 1 }}
        >
          {/* Close button for full screen feel */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 bg-secondary/20 hover:bg-secondary/30 border border-secondary/20 rounded-full transition-all text-textMain shadow-sm active:scale-95"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="flex flex-col px-8 space-y-1">
            {[
              { to: '/products', label: 'Products' },
              { to: '/about', label: 'About Us' },
              { to: '/contact', label: 'Contact' },
            ].map((item) => (
              <motion.div key={item.to} variants={itemVariants}>
                <Link
                  to={item.to}
                  onClick={onClose}
                  className="text-4xl font-bold tracking-tight py-4 block hover:text-primary transition-colors border-b border-secondary/30"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}

            {user?.role === 'ADMIN' && (
              <motion.div variants={itemVariants} className="pt-4">
                <Link
                  to="/admin"
                  onClick={onClose}
                  className="text-2xl font-bold text-red-600 bg-red-50/50 p-4 rounded-2xl block border border-red-100"
                >
                  Admin Dashboard
                </Link>
              </motion.div>
            )}
          </div>

          <motion.div 
            variants={itemVariants}
            className="mt-auto p-8 bg-secondary/20 border-t border-secondary/50"
          >
            <Link
              to={user ? "/profile" : "/login"}
              onClick={onClose}
              className="flex items-center gap-4 group"
            >
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-textLight">Welcome back,</span>
                <span className="text-xl font-bold">{user ? user.name : "Sign In / Join"}</span>
              </div>
            </Link>

            <div className="flex gap-6 mt-8">
              {[
                { icon: Globe, color: 'text-blue-500', bg: 'hover:bg-blue-50' },
                { icon: MessageCircle, color: 'text-green-500', bg: 'hover:bg-green-50' },
                { icon: Mail, color: 'text-red-500', bg: 'hover:bg-red-50' }
              ].map((social, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center cursor-pointer hover:shadow-md transition-all ${social.color} ${social.bg}`}
                >
                  <social.icon className="w-6 h-6" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
