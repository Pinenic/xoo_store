const express = require("express");
const router = express.Router();
const supabase = require("../index");
//this route gets all orders in the orders table
router.get("/", async (req, res) => {
  try {
    const { data } = await supabase.from("orders").select("*");
    res.status(200).send(data);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});
//this route gets order by ID in the orders table
router.get("/by/:id", async (req, res) => {
  try {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("id", req.params.id);
    res.status(200).send(data);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});
//this route gets all order items in the order_items table
router.get("/items", async (req, res) => {
  try {
    const { data } = await supabase.from("order_items").select("*");
    res.status(200).send(data);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});
//this route gets order items by ID in the order_items table
router.get("/items/by/:id", async (req, res) => {
  try {
    const { data } = await supabase
      .from("order_items")
      .select("*")
      .eq("id", req.params.id);
    res.status(200).send(data);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});
//this route creates an order in the orders table
router.post("/", async (req, res) => {
  const order = {
    buyer_id: 8,
    store_id: 52,
    total_amount: 400.0,
    payment_method: "credit_card",
    shipping_address: { address: "123 Main St", city: "Metropolis" },
  };
  try {
    const { data } = await supabase.from("orders").insert([order]);
    res.status(201).send("cleated");
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
//this route creates an order item in the order_items table
router.post("/items", async (req, res) => {
  const orderItems = {
    order_id: 14,
    product_id: 267,
    quantity: 2,
    unit_price: 10,
  };

  try {
    const { data, error } = await supabase
      .from("order_items")
      .insert(orderItems)
      .select();
    if (error) throw error;
    res.status(201).send(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
//this route delete order item by ID in the order_items table
router.delete("/items/by/:id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("order_items")
      .delete({ count: 1 })
      .eq("id", req.params.id);
    if (error) {
      return res.status("500").json({ error: error.message });
    }
    res.status(201).send("deleted succefully");
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
//this route delete order by ID in the orders table
router.delete("/by/:id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .delete({ count: 1 })
      .eq("id", req.params.id);
    if (error) {
      return res.status("500").json({ error: error.message });
    }
    res.status(201).send("deleted succefully");
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
