const express = require("express");
const router = express.Router();
const supabase = require("../index");

router.get("/", async (req, res) => {
  try {
    const { data } = await supabase.from("wish_list").select("*");
    res.status(200).send(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { data } = await supabase
      .from("wish_list")
      .select("*")
      .eq("user_id", req.params.id);
    res.status(200).send(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  const wishList = {
    user_id: req.body.user_id,
    product_id: req.body.product_id,
  };
  try {
    const { data, error } = await supabase.from("wish_list").select("*");
    if (error) {
      return res.json({ error: error.message });
    }
    const wishListForUser = await data.filter(
      (wishListOne) =>
        wishListOne.user_id === wishList.user_id &&
        wishListOne.product_id === wishList.product_id
    );
    if (!wishListForUser || wishListForUser.length === 0) {
      await supabase.from("wish_list").insert([wishList]);
      res.status(200).send("created");
    }

    if (wishListForUser.length > 0) {
      await supabase
        .from("wish_list")
        .delete({ count: 1 })
        .eq("user_id", wishList.user_id)
        .eq("product_id", wishList.product_id);
      res.status(200).send("product removed");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
