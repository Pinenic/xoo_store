const express = require("express");
const router = express.Router();
const supabase = require("../index");

//this route is used to get all the products in the product table

router.get("/", async (req, res) => {
  try {
    const { data } = await supabase.from("products").select("*");
    res.status(200).send(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//this route is used to get product by ID in the product table,
// the ID is passed through the params

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const { data } = await supabase.from("products").select().eq("id", id);
    res.status(200).send(data);
  } catch (error) {
    return res.status(500).send(error);
  }
});

//this route post a product in the product table,
//at first it get the product as json data with a store ID then it post to the product table

router.post("/", async (req, res) => {
  const product = {
    store_id: 1,
    name: "barbei tshirt",
    description: "Abstract painting.",
    price: 250.9,
    stock: 25,
    details: { size: "Medium", color: "Blue" },
    image_url: "https://example.com/painting-a.jpg",
  };

  try {
    await supabase.from("products").insert([product]);
    res.status(200).send("created");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//this route it just delete product by ID,
// it get the ID through the params

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await supabase.from("products").delete({ count: 1 }).eq("id", id);
    res.status(200).send("deleted");
  } catch (error) {
    return res.status(500).send(error);
  }
});

// route update the product by ID,
// the ID is passed through the params

router.put("/:id", async (req, res) => {
  const id = req.params.id;

  const product = {
    store_id: 1,
    name: "puma",
    description: "Abstract painting.",
    price: 150.0,
    stock: 25,
    details: { size: "Medium", color: "Blue" },
    image_url: "https://example.com/painting-a.jpg",
  };

  try {
    await supabase.from("products").update([product]).eq("id", id);
    res.status(200).send("updated");
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = router;
