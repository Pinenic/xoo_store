const express = require("express");
const router = express.Router();
const supabase = require("../index");

//this route seach for a products with the matching content,
// seach iterm is passed through the body

router.post("/", async (req, res) => {
const seaching=await req.body.seach;
  try {
    const { data } = await supabase.from("products").select("*").like("name",`%${seaching}%`);
    res.status(200).send(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


module.exports = router;
