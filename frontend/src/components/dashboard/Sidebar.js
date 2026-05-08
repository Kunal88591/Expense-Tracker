import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Receipt, PieChart, Wallet, Settings, Sparkles, Target, BrainCircuit } from 'lucide-react';

export default function Sidebar({ currentView, setCurrentView }) {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'transactions', icon: Receipt, label: 'Transactions' },
    { id: 'analytics', icon: PieChart, label: 'Analytics' },
    { id: 'budgets', icon: Wallet, label: 'Budgets' },
    { id: 'ai', icon: BrainCircuit, label: 'AI Insights' },
    { id: 'goals', icon: Target, label: 'Goals' }
  ];

  return (
    <motion.aside 
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-6 top-6 bottom-6 w-64 glass-card p-6 flex flex-col gap-8 hidden lg:flex"
    >
      <div className="flex items-center gap-3 px-2">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent-blue to-accent-purple flex items-center justify-center shadow-lg shadow-accent-purple/20">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">Vault</h1>
      </div>

      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView?.(item.id)}
            className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ${
              currentView === item.id 
                ? 'bg-white/10 text-white shadow-inner border border-white/5' 
                : 'text-textSecondary hover:text-white hover:bg-white/5'
            }`}
          >
            <item.icon className={`w-5 h-5 ${currentView === item.id ? 'text-accent-blue' : ''}`} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto">
        <button className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-textSecondary hover:text-white hover:bg-white/5 transition-all">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </motion.aside>
  );
}
