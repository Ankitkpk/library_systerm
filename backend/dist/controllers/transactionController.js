"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.booksIssuedInDateRange = exports.booksIssuedToUser = exports.totalRentGenerated = exports.getTransactionHistory = exports.returnBook = exports.issueBook = void 0;
const Transaction_1 = require("../models/Transaction");
const Book_1 = require("../models/Book");
const User_1 = require("../models/User");
const issueBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookName, userId, issueDate } = req.query;
    if (typeof bookName !== 'string' || typeof userId !== 'string' || typeof issueDate !== 'string') {
        return res.status(400).json({ error: 'Book name, user ID, and issue date are required.' });
    }
    try {
        const book = yield Book_1.Book.findOne({ bookName });
        const user = yield User_1.User.findById(userId);
        if (!book) {
            return res.status(404).json({ error: 'Book not found.' });
        }
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        const transaction = new Transaction_1.Transaction({
            bookId: book._id,
            userId: user._id,
            issueDate: new Date(issueDate)
        });
        yield transaction.save();
        res.status(201).json(transaction);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while issuing the book.' });
    }
});
exports.issueBook = issueBook;
const returnBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookName, userId, returnDate } = req.query;
    if (typeof bookName !== 'string' || typeof userId !== 'string' || typeof returnDate !== 'string') {
        return res.status(400).json({ error: 'Book name, user ID, and issue date are required.' });
    }
    try {
        const parsedReturnDate = new Date(returnDate);
        if (isNaN(parsedReturnDate.getTime())) {
            return res.status(400).send("Invalid return date.");
        }
        const book = yield Book_1.Book.findOne({ bookName });
        if (!book) {
            return res.status(404).send("Book not found.");
        }
        const transaction = yield Transaction_1.Transaction.findOne({ bookId: book._id, userId, returnDate: null });
        if (!transaction) {
            return res.status(404).send("Transaction not found or book not issued.");
        }
        const issueDate = transaction.issueDate;
        const rentPerDay = book.rentPerDay;
        const daysRented = Math.ceil((parsedReturnDate.getTime() - issueDate.getTime()) / (1000 * 3600 * 24));
        const totalRent = daysRented * rentPerDay;
        transaction.returnDate = parsedReturnDate;
        transaction.totalRent = totalRent;
        yield transaction.save();
        res.status(200).json(transaction);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error.");
    }
});
exports.returnBook = returnBook;
const getTransactionHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookName } = req.query;
    try {
        const book = yield Book_1.Book.findOne({ bookName });
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        const transactions = yield Transaction_1.Transaction.find({ bookId: book._id }).populate('userId');
        const issuedCount = transactions.length;
        const currentlyIssuedTransaction = transactions.find(t => !t.returnDate);
        const currentlyIssued = currentlyIssuedTransaction ? currentlyIssuedTransaction.userId : null;
        res.json({ issuedCount, currentlyIssued });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getTransactionHistory = getTransactionHistory;
const totalRentGenerated = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookName } = req.query;
    try {
        const book = yield Book_1.Book.findOne({ bookName });
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        const transactions = yield Transaction_1.Transaction.find({ bookId: book._id });
        const totalRent = transactions.reduce((acc, transaction) => acc + (transaction.totalRent || 0), 0);
        res.json({ totalRent });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.totalRentGenerated = totalRentGenerated;
const booksIssuedToUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query;
    if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ error: 'User ID is required and must be a string.' });
    }
    try {
        const transactions = yield Transaction_1.Transaction.find({ userId }).populate('bookId');
        console.log(transactions);
        if (transactions.length === 0) {
            return res.status(404).json({ message: 'No transactions found for this user.' });
        }
        res.json(transactions);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching transactions.' });
    }
});
exports.booksIssuedToUser = booksIssuedToUser;
const booksIssuedInDateRange = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { start, end } = req.query;
    if (!start || !end) {
        return res.status(400).json({ error: 'Both start and end dates are required.' });
    }
    try {
        const startDate = new Date(start);
        const endDate = new Date(end);
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return res.status(400).json({ error: 'Invalid date format. Please provide valid dates.' });
        }
        const transactions = yield Transaction_1.Transaction.find({
            issueDate: { $gte: startDate, $lte: endDate }
        }).populate('userId bookId');
        res.json(transactions);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching transactions.' });
    }
});
exports.booksIssuedInDateRange = booksIssuedInDateRange;
