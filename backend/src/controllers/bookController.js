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
exports.filterBooks = exports.getBooksByRentRange = exports.searchBooksByName = exports.getAllBooks = void 0;
const Book_1 = require("../models/Book");
const getAllBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const books = yield Book_1.Book.find();
    res.json(books);
});
exports.getAllBooks = getAllBooks;
const searchBooksByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.query;
    if (!name || typeof name !== 'string') {
        return res.status(400).json({ message: 'A book name or search term is required.' });
    }
    try {
        const books = yield Book_1.Book.find({ bookName: new RegExp(name, 'i') });
        if (books.length === 0) {
            return res.status(404).json({ message: 'No books found matching the search term.' });
        }
        res.json(books);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while searching for books.' });
    }
});
exports.searchBooksByName = searchBooksByName;
const getBooksByRentRange = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { min, max } = req.query;
    const minRent = parseFloat(min);
    const maxRent = parseFloat(max);
    if (isNaN(minRent) || isNaN(maxRent)) {
        return res.status(400).json({ error: 'Invalid rent range parameters' });
    }
    try {
        const books = yield Book_1.Book.find({ rentPerDay: { $gte: minRent, $lte: maxRent } });
        res.json(books);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching books' });
    }
});
exports.getBooksByRentRange = getBooksByRentRange;
const filterBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category, name, minRent, maxRent } = req.query;
    const query = {};
    if (category) {
        query.category = category;
    }
    if (name) {
        query.bookName = new RegExp(name, 'i');
    }
    if (minRent || maxRent) {
        const min = parseFloat(minRent);
        const max = parseFloat(maxRent);
        if (!isNaN(min) && !isNaN(max)) {
            query.rentPerDay = { $gte: min, $lte: max };
        }
        else {
            return res.status(400).json({ error: 'Invalid rent parameters. Min and max should be numbers.' });
        }
    }
    try {
        const books = yield Book_1.Book.find(query);
        if (books.length === 0) {
            return res.status(404).json({ message: 'No books found matching the criteria.' });
        }
        res.json(books);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching books.' });
    }
});
exports.filterBooks = filterBooks;
