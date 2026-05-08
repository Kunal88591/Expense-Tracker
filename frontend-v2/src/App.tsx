import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Receipt, PieChart, Wallet, Settings, Sparkles } from 'lucide-react';

const Sidebar = () => (
  <motion.aside 
    initial={{ x: -50, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    className="fixed left-6 top-6 bottom-6 w-64 glass-card p-6 flex flex-col gap-8"
  >
    <div className="flex items-center gap-3 px-2">
      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent-blue to-accent-purple flex items-center justify-center shadow-lg shadow-accent-purple/20">
        <Sparkles className="w-5 h-5 text-white" />
      </div>
      <h1 className="text-xl font-bold tracking-tight">Vault</h1>
    </div>

    <nav className="flex flex-col gap-2">
      {[
        { icon: LayoutDashboard, label: 'Dashboard', active: true },
        { icon: Receipt, label: 'Transactions' },
        { icon: PieChart, label: 'Analytics' },
        { icon: Wallet, label: 'Budgets' },
      ].map((item, i) => (
        <a key={i} href="#" className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ${item.active ? 'bg-white/10 text-white shadow-inner border border-white/5' : 'text-textSecondary hover:text-white hover:bg-white/5'}`}>
          <item.icon className={`w-5 h-5 ${item.active ? 'text-accent-blue' : ''}`} />
          <span className="font-medium">{item.label}</span>
        </a>
      ))}
    </nav>
    <div className="mt-auto">
      <a href="#" className="flex items-center gap-4 px-4 py-3 rounded-2xl text-textSecondary hover:text-white hover:bg-white/5 transition-all">
        <Settings className="w-5 h-5" />
        <span className="font-medium">Settings</span>
      </a>
    </div>
  </motion.aside>
);

const App = () => {
  return (
    <div className="min-h-screen bg-background relative selection:bg-accent-blue/30 overflow-hidden text-textPrimary">
      <Sidebar />
      <main className="ml-[20rem] p-8 max-w-7xl">
        <header className="mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-semibold tracking-tight text-white mb-2"
          >
            Good Evening, Alex 👋
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-textSecondary text-lg"
          >
            You spent <span className="text-accent-green font-medium">12% less</span> this week compared to last week.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { title: 'Total Balance', amount: '$24,562.00', color: 'from-accent-blue to-accent-cyan' },
            { title: 'Monthly Spending', amount: '$3,240.50', color: 'from-accent-purple to-pink-500' },
            { title: 'Goal Progress', amount: '68%', color: 'from-accent-green to-emerald-400' }
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (i + 2) }}
              className="glass-card p-6 min-h-[160px] flex flex-col justify-between group cursor-default"
            >
              <h3 className="text-textSecondary font-medium">{card.title}</h3>
              <div className="mt-4">
                <span className={`text-3xl font-bold bg-gradient-to-br ${card.color} text-transparent bg-clip-text`}>
                  {card.amount}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default App;
