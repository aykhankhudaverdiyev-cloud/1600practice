import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { subscribeToast } from '../store';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
}

export default function ToastHost() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    return subscribeToast((toast) => {
      setToasts(prev => [...prev, toast]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id));
      }, 3500);
    });
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            className={`px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold text-white backdrop-blur-xl ${
              toast.type === 'error'
                ? 'bg-gradient-to-r from-red-500/90 to-rose-600/90 shadow-red-500/20'
                : 'bg-gradient-to-r from-emerald-500/90 to-green-600/90 shadow-green-500/20'
            }`}
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
