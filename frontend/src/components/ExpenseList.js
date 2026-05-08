import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Coffee, Bus, ShoppingBag, Clapperboard, Monitor, HeartPulse, GraduationCap, CircleDollarSign } from 'lucide-react';

const categoryIcons = {
  'Food & Dining': { icon: Coffee, color: 'bg-orange-500/20 text-orange-400' },
  'Transport': { icon: Bus, color: 'bg-cyan-500/20 text-cyan-400' },
  'Shopping': { icon: ShoppingBag, color: 'bg-pink-500/20 text-pink-400' },
  'Entertainment': { icon: Clapperboard, color: 'bg-purple-500/20 text-purple-400' },
  'Utilities': { icon: Monitor, color: 'bg-blue-500/20 text-blue-400' },
  'Healthcare': { icon: HeartPulse, color: 'bg-red-500/20 text-red-400' },
  'Education': { icon: GraduationCap, color: 'bg-yellow-500/20 text-yellow-400' },
  'Other': { icon: CircleDollarSign, color: 'bg-gray-500/20 text-gray-400' },
};

export default function ExpenseList({ expenses, onDeleteExpense }) {
  return (
    <div className="glass-card flex-1 min-h-[400px]">
      <div className="p-6 border-b border-white/10 flex justify-between items-center">
        <h2 className="text-xl font-bold tracking-tight text-white">Recent Transactions</h2>
        <span className="text-textSecondary text-sm">{expenses.length} entries</span>
      </div>
      
      <div className="p-4 max-h-[600px] overflow-y-auto">
        <ul className="space-y-2">
          <AnimatePresence>
            {expenses.map((expense) => {
              const mappedCat = categoryIcons[expense.category] || categoryIcons['Other'];
              const Icon = mappedCat.icon;
              
              return (
                <motion.li
                  key={expense.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, scale: 0.95 }}
                  className="group flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${mappedCat.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{expense.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-textSecondary bg-white/5 px-2 py-0.5 rounded-full">
                          {expense.category}
                        </span>
                        <span className="text-textSecondary text-xs">• {expense.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-accent-red tracking-tight">
                      -₹{expense.amount.toFixed(2)}
                    </span>
                    <button
                      onClick={() => onDeleteExpense(expense.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-textSecondary hover:text-accent-red hover:bg-accent-red/10 rounded-xl transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
        {expenses.length === 0 && (
          <div className="h-64 flex flex-col items-center justify-center text-textSecondary">
            <CircleDollarSign className="w-12 h-12 mb-4 opacity-50" />
            <p>No transactions found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
