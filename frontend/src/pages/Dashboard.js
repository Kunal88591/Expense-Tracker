import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { expenseService } from '../api';
import Sidebar from '../components/dashboard/Sidebar';
import BalanceCards from '../components/dashboard/BalanceCards';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';

export default function Dashboard() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');

  const defaultCategories = [
    'Food & Dining', 'Transport', 'Shopping', 'Entertainment',
    'Utilities', 'Healthcare', 'Education', 'Other'
  ];

  const fetchExpenses = async () => {
    setIsLoading(true);
    try {
      const expRes = await expenseService.getExpenses(null, 'date_desc');
      setExpenses(expRes.data.expenses || []);
      const sumRes = await expenseService.getDashboardSummary();
      setSummary(sumRes.data.summary);
    } catch (err) {}
    setIsLoading(false);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAddExpense = async (data) => {
    await expenseService.createExpense(data);
    await fetchExpenses();
  };

  const handleDeleteExpense = async (id) => {
    await expenseService.deleteExpense(id);
    await fetchExpenses();
  };

  return (
    <div className="min-h-screen bg-background relative selection:bg-accent-blue/30 overflow-hidden text-textPrimary">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />

      <main className="lg:ml-[20rem] p-6 lg:p-8 max-w-7xl">
        <header className="mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-semibold tracking-tight text-white mb-2"
          >
            Good Evening, {user?.name?.split(' ')[0] || 'there'} 👋
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-textSecondary text-lg"
          >
            Here is your financial overview for the month.
          </motion.p>
        </header>

        <AnimatePresence mode="wait">
          {currentView === 'dashboard' && (
            <motion.div
              key="dash"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <BalanceCards summary={summary} />
              
              <div className="flex flex-col lg:flex-row gap-8">
                <ExpenseList expenses={expenses} onDeleteExpense={handleDeleteExpense} />
                <ExpenseForm onAddExpense={handleAddExpense} categories={defaultCategories} />
              </div>
            </motion.div>
          )}

          {currentView === 'transactions' && (
             <motion.div
              key="trans"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full"
            >
               <ExpenseList expenses={expenses} onDeleteExpense={handleDeleteExpense} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
