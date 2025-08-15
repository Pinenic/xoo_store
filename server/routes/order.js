const express = require("express");
const router = express.Router();
const supabase = require("../index");

// -- Insert sample order by Bob Buyer
// INSERT INTO orders (buyer_id, store_id, total_amount, status, payment_method, shipping_address) VALUES
// (2, 1, 400.00, 'pending', 'credit_card', '{"address": "123 Main St", "city": "Metropolis"}');

router.get("/", async (req, res) => {
  try {
    const { data } = await supabase.from("orders").select("*");
    res.send(data);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.post("/", async (req, res) => {
  const order = {
    buyer_id: 4,
    store_id: 1,
    total_amount: 500.0,
    status: "pending",
    payment_method: "MTN MOMO",
    shipping_address: { address: "123 Main St", city: "Metropolis" },
  };
  try {
    const { data } = await supabase.from("orders").insert([order]);
    res.send("order sent");
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = router;
