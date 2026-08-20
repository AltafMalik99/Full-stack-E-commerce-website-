import { readJsonFile, findById, createItem } from "../utils/jsonDatabase.js";

const ORDERS_FILE = "orders.json";

export async function getOrders(req, res, next) {
  try {
    const orders = await readJsonFile(ORDERS_FILE);
    const myOrders = orders.filter((o) => String(o.userId) === String(req.user.id));
    res.json({ count: myOrders.length, orders: myOrders });
  } catch (err) {
    next(err);
  }
}

export async function getOrderById(req, res, next) {
  try {
    const order = await findById(ORDERS_FILE, req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found." });
    if (String(order.userId) !== String(req.user.id)) {
      return res.status(403).json({ message: "Not authorized to view this order." });
    }
    res.json({ order });
  } catch (err) {
    next(err);
  }
}

export async function createOrder(req, res, next) {
  try {
    const { items, shippingInfo, total } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cannot place an order with an empty cart." });
    }

    const order = await createItem(ORDERS_FILE, {
      userId: req.user.id,
      items,
      shippingInfo,
      total,
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    next(err);
  }
}
