import { Router } from 'express';
import {
  issueBook,
  returnBook,
  getTransactionHistory,
  
  totalRentGenerated,
  booksIssuedToUser,
  booksIssuedInDateRange 
} from '../controllers/transactionController';

const router = Router();

router.post('/issuebook', issueBook);
router.post('/return', returnBook);
router.get('/history', getTransactionHistory);
router.get('/total-rent', totalRentGenerated);

router.get('/user-books', booksIssuedToUser);
router.get('/date-range', booksIssuedInDateRange);


export default router;