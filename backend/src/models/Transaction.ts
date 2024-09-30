import { Schema, model } from 'mongoose';

const transactionSchema = new Schema({
  bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  issueDate: { type: Date, required: true },
  returnDate: { type: Date },
  totalRent: { type: Number },
});

export const Transaction = model('Transaction', transactionSchema);