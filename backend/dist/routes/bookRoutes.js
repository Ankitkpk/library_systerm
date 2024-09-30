"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookController_1 = require("../controllers/bookController");
const router = (0, express_1.Router)();
router.get('/', bookController_1.getAllBooks);
router.get('/getbooksbyrent', bookController_1.getBooksByRentRange);
router.get('/getbook', bookController_1.searchBooksByName);
router.get('/filterbook', bookController_1.filterBooks);
exports.default = router;
