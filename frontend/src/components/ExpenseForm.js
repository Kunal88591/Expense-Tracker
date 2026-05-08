import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, CreditCard, Tag, Calendar, FileText } from 'lucide-react';

export default function ExpenseForm({ onAddExpense, categories }) {
  const [formData, setFormData] = useState({
    amount: '',
    category: categories[0] || 'Other',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onAddExpense(formData);
    setFormData({ ...formData, amount: '', description: '' }); // Reset fields
    setIsSubmitting(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 w-full lg:w-96"
    >
      <h2 className="text-xl font-bold tracking-tight text-white mb-6">Quick Add</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-textSecondary">
            ₹
          </div>
          <input
            type="number"
            required
            min="0.01"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="futuristic-input pl-8 text-2xl font-bold"
            placeholder="0.00"
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-textSecondary">
            <Tag className="w-4 h-4" />
          </div>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="futuristic-input pl-12 appearance-none bg-surface"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-textSecondary">
            <FileText className="w-4 h-4" />
          </div>
          <input
            type="text"
            required
            maxLength={100}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="futuristic-input pl-12"
            placeholder="What was this for?"
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-textSecondary">
            <Calendar className="w-4 h-4" />
          </div>
          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="futuristic-input pl-12 bg-transparent [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="futuristic-btn flex items-center justify-center gap-2 mt-6"
        >
          {isSubmitting ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
              <CreditCard className="w-5 h-5" />
            </motion.div>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              Add Expense
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
