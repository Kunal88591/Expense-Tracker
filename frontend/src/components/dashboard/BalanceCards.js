import React from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp, Wallet, Target } from 'lucide-react';

export default function BalanceCards({ summary }) {
  const cards = [
    { 
      title: 'Total Balance', 
      amount: `₹${summary?.totalAmount || '0.00'}`, 
      trend: '+2.4%', 
      isPositive: true,
      color: 'from-accent-blue to-accent-cyan',
      icon: Wallet
    },
    { 
      title: 'Monthly Spending', 
      amount: `₹${summary?.totalAmount ? (summary.totalAmount * 0.4).toFixed(2) : '0.00'}`, 
      trend: '-12%', 
      isPositive: true,
      color: 'from-accent-purple to-pink-500',
      icon: TrendingDown
    },
    { 
      title: 'Savings Goal', 
      amount: '₹12,450.00', 
      trend: '68% Reached', 
      isPositive: true,
      color: 'from-accent-green to-emerald-400',
      icon: Target
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * (i + 2) }}
          className="glass-card p-6 min-h-[160px] flex flex-col justify-between group cursor-default"
        >
          <div className="flex justify-between items-start">
            <h3 className="text-textSecondary font-medium">{card.title}</h3>
            <div className={`p-2 rounded-xl bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors`}>
              <card.icon className="w-5 h-5 text-white/70" />
            </div>
          </div>
          
          <div className="mt-4">
            <span className={`text-3xl font-bold bg-gradient-to-br ${card.color} text-transparent bg-clip-text`}>
              {card.amount}
            </span>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-sm font-medium ${card.isPositive ? 'text-accent-green' : 'text-accent-red'}`}>
                {card.trend}
              </span>
              <span className="text-textSecondary text-sm">vs last month</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
