import { Request, Response } from 'express';
import { Transaction } from '../models/Transaction';
import { Book } from '../models/Book';
import { User } from '../models/User';


export const issueBook = async (req: Request, res: Response) => {
  const { bookName, userId, issueDate } = req.query;

  if (typeof bookName !== 'string' || typeof userId !== 'string' || typeof issueDate !== 'string') {
      return res.status(400).json({ error: 'Book name, user ID, and issue date are required.' });
  }

  try {
    
      const book = await Book.findOne({ bookName });
      const user = await User.findById(userId);

      if (!book) {
          return res.status(404).json({ error: 'Book not found.' });
      }

      if (!user) {
          return res.status(404).json({ error: 'User not found.' });
      }

      const transaction = new Transaction({
          bookId: book._id,
          userId: user._id,
          issueDate: new Date(issueDate)
          
      });

  
      await transaction.save();

      res.status(201).json(transaction);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while issuing the book.' });
  }
};


export const returnBook = async (req: Request, res: Response) => {

    const { bookName, userId, returnDate} = req.query;

    if (typeof bookName !== 'string' || typeof userId !== 'string' || typeof returnDate !== 'string') {
        return res.status(400).json({ error: 'Book name, user ID, and issue date are required.' });
    }
  
    try {
      const parsedReturnDate = new Date(returnDate);
      if (isNaN(parsedReturnDate.getTime())) {
        return res.status(400).send("Invalid return date.");
      }
  
      const book = await Book.findOne({ bookName });
      if (!book) {
        return res.status(404).send("Book not found.");
      }
  
      const transaction = await Transaction.findOne({ bookId: book._id, userId, returnDate: null });
      if (!transaction) {
        return res.status(404).send("Transaction not found or book not issued.");
      }

      const issueDate = transaction.issueDate;
      const rentPerDay = book.rentPerDay;
      const daysRented = Math.ceil((parsedReturnDate.getTime() - issueDate.getTime()) / (1000 * 3600 * 24));
      const totalRent = daysRented * rentPerDay;
  
      transaction.returnDate = parsedReturnDate;
      transaction.totalRent = totalRent;
  
      await transaction.save();

      res.status(200).json(transaction);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error.");
    }
  }

  export const getTransactionHistory = async (req: Request, res: Response) => {
    const { bookName } = req.query;
  
    try {
      const book = await Book.findOne({ bookName });
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
  
      const transactions = await Transaction.find({ bookId: book._id }).populate('userId');
      const issuedCount = transactions.length;
      const currentlyIssuedTransaction = transactions.find(t => !t.returnDate);
      const currentlyIssued = currentlyIssuedTransaction ? currentlyIssuedTransaction.userId:null;

      res.json({ issuedCount, currentlyIssued });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  

export const totalRentGenerated = async (req: Request, res: Response) => {
    const { bookName } = req.query;
  
    try {
      const book = await Book.findOne({ bookName });
  
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
      
      const transactions = await Transaction.find({ bookId: book._id });
      const totalRent = transactions.reduce((acc, transaction) => acc + (transaction.totalRent || 0), 0);
      res.json({ totalRent });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

export const booksIssuedToUser = async (req: Request, res: Response) => {
  const { userId } = req.query;
  if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'User ID is required and must be a string.' });
  }

  try {
  
      const transactions = await Transaction.find({ userId }).populate('bookId');
      console.log(transactions)
      if (transactions.length === 0) {
          return res.status(404).json({ message: 'No transactions found for this user.' });
      }
      res.json(transactions);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching transactions.' });
  }
};
export const booksIssuedInDateRange = async (req: Request, res: Response) => {
  const { start, end } = req.query;
  if (!start || !end) {
      return res.status(400).json({ error: 'Both start and end dates are required.' });
  }

  try {
      const startDate = new Date(start as string);
      const endDate = new Date(end as string);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          return res.status(400).json({ error: 'Invalid date format. Please provide valid dates.' });
      }

      const transactions = await Transaction.find({
          issueDate: { $gte: startDate, $lte: endDate }
      }).populate('userId bookId');

      res.json(transactions);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching transactions.' });
  }
};