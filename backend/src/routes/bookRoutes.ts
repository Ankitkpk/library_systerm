import { Router } from 'express';
import {
    getBooksByRentRange,
    searchBooksByName,
    filterBooks,
    getAllBooks
} from '../controllers/bookController';

const router = Router();
router.get('/', getAllBooks)
router.get('/getbooksbyrent', getBooksByRentRange)
router.get('/getbook', searchBooksByName)
router.get('/filterbook',filterBooks )


export default router;




