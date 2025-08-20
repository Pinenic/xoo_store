const express = require("express");
const router = express.Router();
const supabase = require("../index");



router.get("/", async (req, res) => {
  try {
    const { data } = await supabase.from("order").select("*");
    res.status(200).send(data);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});


module.exports = router;
