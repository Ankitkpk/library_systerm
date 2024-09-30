"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import { Book } from './models/Book';
const books = [
    { bookName: 'The Great Gatsby', category: 'Fiction', rentPerDay: 2 },
    { bookName: '1984', category: 'Fiction', rentPerDay: 3 },
    { bookName: 'To Kill a Mockingbird', category: 'Fiction', rentPerDay: 2.5 },
    { bookName: 'Moby Dick', category: 'Fiction', rentPerDay: 2.2 },
    { bookName: 'War and Peace', category: 'Fiction', rentPerDay: 3.5 },
    { bookName: 'The Art of War', category: 'Non-Fiction', rentPerDay: 1.5 },
    { bookName: 'Sapiens', category: 'Non-Fiction', rentPerDay: 2.5 },
    { bookName: 'Becoming', category: 'Non-Fiction', rentPerDay: 2 },
    { bookName: 'Educated', category: 'Non-Fiction', rentPerDay: 2.8 },
    { bookName: 'The Immortal Life of Henrietta Lacks', category: 'Non-Fiction', rentPerDay: 2.3 },
    { bookName: 'The Catcher in the Rye', category: 'Fiction', rentPerDay: 2.5 },
    { bookName: 'Pride and Prejudice', category: 'Fiction', rentPerDay: 2 },
    { bookName: 'The Hobbit', category: 'Fantasy', rentPerDay: 3 },
    { bookName: 'Harry Potter and the Sorcerer\'s Stone', category: 'Fantasy', rentPerDay: 3.5 },
    { bookName: 'The Lord of the Rings', category: 'Fantasy', rentPerDay: 4 },
    { bookName: 'Dune', category: 'Science Fiction', rentPerDay: 3 },
    { bookName: 'The Martian', category: 'Science Fiction', rentPerDay: 2.5 },
    { bookName: 'Ender\'s Game', category: 'Science Fiction', rentPerDay: 2.8 },
    { bookName: 'Fahrenheit 451', category: 'Science Fiction', rentPerDay: 2.2 },
    { bookName: 'Brave New World', category: 'Science Fiction', rentPerDay: 3.5 },
];
/*const seedDatabase = async () => {
  await mongoose.connect(process.env.MONGODB_URI as string);
  await Book.deleteMany({});
  await Book.insertMany(books);
  console.log('Database seeded!');
  await mongoose.connection.close();
};

seedDatabase().catch(err => console.error(err));

*/ 
