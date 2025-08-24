const express = require("express");
const router = express.Router();
const supabase = require("../index");
//this route seach for a products with the matching content,
// seach iterm is passed through the query parameter `q` in the URL
// you can also pass a limit to the number of products returned using the query parameter `limit`
// the limit is set to the number of matching products if not specified
router.get("/", async (req, res) => {
  const seaching = await req.query.q;
  const countLimit = (
    await supabase.from("products").select("*").like("name", `%${seaching}%`)
  ).data.length;
  const limit = req.query.limit || countLimit; // Default limit to the number of matching products
  try {
    const { data } = await supabase
      .from("products")
      .select("*")
      .like("name", `%${seaching}%`)
      .limit(limit);
    res.status(200).send(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
