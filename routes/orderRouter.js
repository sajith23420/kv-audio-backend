import express from 'express';
import { approveOrRejectOrder, createOrder, getOrders, getQuote } from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.post("/", createOrder)

orderRouter.post("/quote", getQuote)

orderRouter.get("/", getOrders)

orderRouter.put("/status/:orderID" , approveOrRejectOrder)

export default orderRouter;