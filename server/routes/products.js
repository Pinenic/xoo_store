const express = require("express");
const router = express.Router();
const supabase = require("../index");

//get all products

router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("products").select("*");
  if (error) {
    return res.status(500).json({ error: error.message });
  } else res.status(200).send(data);
});

//get  product by ID

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const { data, error } = await supabase.from("products").select().eq("id", id);
  if (error) {
    return res.status(500).send(error);
  } else res.status(200).send(data);
});

//post product

router.post("/", async (req, res) => {
  const product = {
    store_id: 1,
    name: "puma",
    description: "Abstract painting.",
    price: 150.0,
    stock: 25,
    details: { size: "Medium", color: "Blue" },
    image_url: "https://example.com/painting-a.jpg",
  };

  const { data, error } = await supabase.from("products").insert([product]);
  if (error) {
    res.status(500).json({ error: error.message });
  } else res.status(200).send("created");
});

//delete product by ID

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const { data, error } = await supabase
    .from("products")
    .delete({ count: 1 })
    .eq("id", id);
  if (error) {
    return res.status(500).send(error);
  } else res.status(200).send("deleted");
});

//update  product by ID

router.put("/:id", async (req, res) => {
  const product = {
    store_id: 1,
    name: "puma",
    description: "Abstract painting.",
    price: 150.0,
    stock: 25,
    details: { size: "Medium", color: "Blue" },
    image_url: "https://example.com/painting-a.jpg",
  };
  const id = req.params.id;
  const { data, error } = await supabase
    .from("products")
    .update([product])
    .eq("id", id);
  if (error) {
    return res.status(500).send(error);
  } else res.status(200).send("updated");
});

module.exports = router;
