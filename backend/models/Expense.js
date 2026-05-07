import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      // Stored as integer paise (e.g., 25075 = ₹250.75)
      validate: {
        validator: function(value) {
          return Number.isInteger(value) && value > 0;
        },
        message: 'Amount must be a positive integer (in paise)'
      }
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Food & Dining',
        'Transport',
        'Shopping',
        'Entertainment',
        'Utilities',
        'Healthcare',
        'Education',
        'Other'
      ]
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    date: {
      type: Date,
      required: [true, 'Date is required']
    },
    idempotency_key: {
      type: String,
      sparse: true,
      // Unique per user to prevent duplicate expenses
      index: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Compound index for idempotency: same key per user = duplicate
expenseSchema.index({ userId: 1, idempotency_key: 1 }, { sparse: true });

// Helper method to display amount in decimal format
expenseSchema.methods.getAmountInDecimal = function() {
  return (this.amount / 100).toFixed(2);
};

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;
