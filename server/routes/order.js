const express = require("express");
const router = express.Router();
const supabase = require("../index");



router.get("/", async (req, res) => {
  try {
    const { data } = await supabase.from("order_items").select("*");
    res.status(200).send(data);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});


router.post("/", async (req, res) => {
  const order = {
    buyer_id:2,
    store_id:11,
    total_amount: 15000.00,
    status:'pending',
    payment_method:'credit_card',
    shipping_address: {"address": "123 Main St", "city": "Metropolis"},
  }
  try {
    const { data} = await supabase
      .from("orders")
      .insert([order])
      .select();
    res.status(201).send(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
})

module.exports = router;
