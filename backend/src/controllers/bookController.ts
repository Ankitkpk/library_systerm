import { Request, Response } from 'express';
import { Book } from '../models/Book';

export const getAllBooks = async (req: Request, res: Response) => {
  const books = await Book.find();
  res.json(books);
};

export const searchBooksByName = async (req: Request, res: Response) => {
    const { name } = req.query;

    if (!name || typeof name !== 'string') {
        return res.status(400).json({ message: 'A book name or search term is required.' });
    }

    try {
    
        const books = await Book.find({ bookName: new RegExp(name, 'i') });

        if (books.length === 0) {
            return res.status(404).json({ message: 'No books found matching the search term.' });
        }

        res.json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while searching for books.' });
    }
};

export const getBooksByRentRange = async (req: Request, res: Response) => {
    const { min, max } = req.query;
  
    const minRent = parseFloat(min as string);
    const maxRent = parseFloat(max as string);
  
    if (isNaN(minRent) || isNaN(maxRent)) {
      return res.status(400).json({ error: 'Invalid rent range parameters' });
    }
  
    try {
      const books = await Book.find({ rentPerDay: { $gte: minRent, $lte: maxRent } });
      res.json(books);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching books' });
    }
  };
  

  export const filterBooks = async (req: Request, res: Response) => {
    const { category, name, minRent, maxRent } = req.query;

    const query: any = {};


    if (category) {
        query.category = category;
    }

    if (name) {
        query.bookName = new RegExp(name as string, 'i');
    }
    if (minRent || maxRent) {
        const min = parseFloat(minRent as string);
        const max = parseFloat(maxRent as string);

        if (!isNaN(min) && !isNaN(max)) {
            query.rentPerDay = { $gte: min, $lte: max };
        } else {
            return res.status(400).json({ error: 'Invalid rent parameters. Min and max should be numbers.' });
        }
    }

    try {
    
        const books = await Book.find(query);

        if (books.length === 0) {
            return res.status(404).json({ message: 'No books found matching the criteria.' });
        }

        res.json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching books.' });
    }
};