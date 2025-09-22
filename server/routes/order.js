const express = require("express");
const router = express.Router();
const supabase = require("../index");

// ------------------------------
// Get order by ID
// ------------------------------
router.get("/by/:id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("order_id", req.params.id)
      .single();

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ------------------------------
// Get store orders for an order
// ------------------------------
router.get("/store_orders/by/:orderId", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("store_orders")
      .select("*")
      .eq("order_id", req.params.orderId);

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ------------------------------
// Get order items for a store order
// ------------------------------
router.get("/items/by/:storeOrderId", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("order_items")
      .select("*")
      .eq("store_order_id", req.params.storeOrderId);

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ------------------------------
// Create an order with store orders and items
// ------------------------------
router.post("/", async (req, res) => {
  try {
    const { user_id, currency, stores = [],stripe_payment_id } = req.body;
    if (!user_id || stores.length === 0) {
      return res.status(400).json({ error: "user_id and stores are required" });
    }

    //  Calculate total amount for the main order
    const total_amount = stores.reduce(
      (sum, store) =>
        sum +
        store.items.reduce(
          (s, item) => s + item.quantity * item.price_at_purchase,
          0
        ),
      0
    );

    //  Insert into orders table
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([{ user_id, total_amount, currency,stripe_payment_id}])
      .select()
      .single();
    if (orderError) {
      return res.status(500).json(orderError);
    };

    //  Insert each store_order and its items
    const storeOrdersResults = [];
    for (const store of stores) {
      const storeTotal = store.items.reduce(
        (s, item) => s + item.quantity * item.price_at_purchase,
        0
      );

      // Insert store_order
      const { data: storeOrder, error: storeOrderError } = await supabase
        .from("store_orders")
        .insert([
          {
            order_id: order.order_id,
            store_total_amount: storeTotal,
            store_id: store.store_id,
          },
        ])
        .select()
        .single();
      if (storeOrderError) {
        return res.status(500).json(storeOrderError);
      };

      // Insert order items for this store_order
      const orderItems = store.items.map((item) => ({
        store_order_id: storeOrder.store_order_id,
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_purchase: item.price_at_purchase,
        subtotal: item.quantity * item.price_at_purchase,
      }));

      const { data: insertedItems, error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems)
        .select();
      if (itemsError){
        return res.status(500).json(itemsError);
      };

      storeOrdersResults.push({ storeOrder, items: insertedItems });
    }

    res.status(201).json({ order, stores: storeOrdersResults });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ------------------------------
// Delete an order item by ID
// ------------------------------
router.delete("/items/by/:id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("order_items")
      .delete()
      .eq("order_item_id", req.params.id);
    if (error){
    return  res.status(500).json(error);
    };
    res.status(200).json({ message: "Order item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ------------------------------
// Delete a store order by ID (cascades items)
// ------------------------------
router.delete("/store_orders/by/:id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("store_orders")
      .delete()
      .eq("store_order_id", req.params.id);
   if (error){
    return  res.status(500).json(error);
    };
    res.status(200).json({ message: "Store order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ------------------------------
// Delete an order by ID (cascades store_orders and items)
// ------------------------------
router.delete("/by/:id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .delete()
      .eq("order_id", req.params.id);
if (error){
    return  res.status(500).json(error);
    };
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
