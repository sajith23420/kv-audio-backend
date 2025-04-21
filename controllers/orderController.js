import Order from "../models/order.js";
import Product from "../models/product.js";
import { isItAdmin, isItCustomer } from "./userController.js";

export async function createOrder(req, res) {
    const data = req.body;
    const orderInfo = {
        orderItems: []
    };

    if (!req.user) {
        res.status(401).json({ message: "Please login and try again" });
        return;
    }

    orderInfo.email = req.user.email;


    try {
        const lastOrder = await Order.find().sort({ orderID: -1 }).limit(1);
        if (lastOrder.length === 0) {
            orderInfo.orderID = "ORD0001";
        } else {
            const lastOrderID = lastOrder[0].orderID;
            const lastNumber = parseInt(lastOrderID.replace("ORD", ""));
            const newNumber = String(lastNumber + 1).padStart(4, "0");
            orderInfo.orderID = "ORD" + newNumber;
        }
    } catch (err) {
        res.status(500).json({ message: "Failed to generate orderID" });
        return;
    }


    if (!data.startingDate) {
        res.status(400).json({ message: "startingDate is required" });
        return;
    }

    orderInfo.startingDate = data.startingDate;
    orderInfo.endingDate = data.endingDate;
    orderInfo.days = data.days;

    let oneDayCost = 0;

    for (let i = 0; i < data.orderedItems.length; i++) {
        try {
            const item = data.orderedItems[i];
            const product = await Product.findOne({ key: item.key });

            if (!product) {
                res.status(404).json({
                    message: `Product with key ${item.key} not found`
                });
                return;
            }

            if (!product.availability) {
                res.status(400).json({
                    message: `Product with key ${item.key} is not available`
                });
                return;
            }

            orderInfo.orderItems.push({
                product: {
                    key: product.key,
                    name: product.name,
                    Image: product.Image[0],
                    price: product.price
                },
                quantity: item.qty
            });

            oneDayCost += product.price * item.qty;

        } catch (err) {
            res.status(500).json({
                message: "Error processing product: " + data.orderedItems[i].key
            });
            return;
        }
    }

    orderInfo.totalAmount = oneDayCost * data.days;

    try {
        const newOrder = new Order(orderInfo);
        const result = await newOrder.save();
        res.status(201).json({
            message: "Order created successfully",
            order: result
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to create order" });
    }
}

export async function getQuote(req, res) {
    console.log(req.body);
    const data = req.body;
    const orderInfo = {
        orderItems: []
    };

    let oneDayCost = 0;

    for (let i = 0; i < data.orderedItems.length; i++) {
        try {
            const item = data.orderedItems[i];
            const product = await Product.findOne({ key: item.key });

            if (!product) {
                res.status(404).json({
                    message: `Product with key ${item.key} not found`
                });
                return;
            }

            if (!product.availability) {
                res.status(400).json({
                    message: `Product with key ${item.key} is not available`
                });
                return;
            }

            orderInfo.orderItems.push({
                product: {
                    key: product.key,
                    name: product.name,
                    Image: product.Image[0],
                    price: product.price
                },
                quantity: item.qty
            });

            oneDayCost += product.price * item.qty;

        } catch (err) {
            res.status(500).json({
                message: "Error processing product: " + data.orderedItems[i].key
            });
            return;
        }
    }

    orderInfo.startingDate = data.startingDate;
    orderInfo.endingDate = data.endingDate;
    orderInfo.days = data.days;
    orderInfo.totalAmount = oneDayCost * data.days;

    try {

        res.status(201).json({
            message: "Order quotation",
            total: orderInfo.totalAmount,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to create order" });
    }
}

export async function getOrders(req, res) {
    if (isItCustomer(req)) {
        try {
            const orders = await Order.find({ email: req.user.email });
            res.json(orders);
        } catch (e) {
            res.status(500).json({ error: "Failed to get orders" });

        }
    } else if (isItAdmin(req)) {
        try {
            const orders = await Order.find();
            res.json(orders);
        } catch (e) {
            res.status(500).json({ error: "Failed to get orders" })
        }
    } else {
        res.status(403).json({ error: "Unauthorized" })

    }
}

export async function approveOrRejectOrder(req, res) {
    const orderID = req.params.orderID;
    const status = req.body.status; // "approved" or "rejected"

    if (isItAdmin(req)) {
        try {
            const order = await Order.findOne(
                { orderID: orderID }
            )
            if (order == null) {
                res.status(404).json({ error: "Order not found" });
                return;

            }
            await Order.updateOne(
                { orderID: orderID },
                { status: status }
            );   


        } catch (e) {
            res.status(500).json({ error: "Failed to get order" });
        }

    }
    else {
        res.status(403).json({ error: "Unauthorized" });
        return;
    }

}