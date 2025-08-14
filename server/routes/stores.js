const express = require("express");
const router = express.Router();
const supabase = require("../index");

//get all stores

router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("stores").select("*");
  if (error) {
    return res.status(500).json({ error: error.message });
  } else res.status(200).send(data);
});

//get  store by ID

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const { data, error } = await supabase.from("stores").select().eq("id", id);
  if (error) {
    return res.status(500).send(error);
  } else res.status(200).send(data);
});

//post store

router.post("/", async (req, res) => {
  const store = {
    user_id: 7,
    store_name: "mark’s t-shirt Store",
    description: "Unique handmade art.",
    store_logo_url: "https://example.com/logo.jpg",
  };

  const { data, error } = await supabase.from("stores").insert([store]);
  if (error) {
    res.status(500).json({ error: error.message });
  } else res.status(200).send("created");
});

//delete store by ID

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const { data, error } = await supabase
    .from("stores")
    .delete({ count: 1 })
    .eq("id", id);
  if (error) {
    return res.status(500).send(error);
  } else res.status(200).send("deleted");
});

//update  store by ID

router.put("/:id", async (req, res) => {
  const store = {
    store_name: "mark’s Art Store",
    description: "Unique handmade art.",
    store_logo_url: "https://example.com/logo.jpg",
  };
  const id = req.params.id;
  const { data, error } = await supabase
    .from("stores")
    .update([store])
    .eq("id", id);
  if (error) {
    return res.status(500).send(error);
  } else res.status(200).send("updated");
});

module.exports = router;
