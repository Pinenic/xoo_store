const express = require("express");
const router = express.Router();
const supabase = require("../index");

//this route gets all stores in the store table

router.get("/", async (req, res) => {
  try {
    const { data } = await supabase.from("stores").select("*");
    res.status(200).send(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//the route get  store by ID
// ,the ID is passed through the params

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const { data } = await supabase.from("stores").select().eq("id", id);
    res.status(200).send(data);
  } catch (error) {
    return res.status(500).send(error);
  }
});

//the route post store as a json data with a user_id in store table

router.post("/", async (req, res) => {
  const store = {
    user_id: 7,
    store_name: "mark’s t-shirt Store",
    description: "Unique handmade art.",
    store_logo_url: "https://example.com/logo.jpg",
  };

  try {
    await supabase.from("stores").insert([store]);
    res.status(200).send("created");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//delete store and products in it by store ID
// , ID is passed through params

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    await supabase.from("stores").delete({ count: 1 }).eq("id", id);
    res.status(200).send("deleted");
  } catch (error) {
    return res.status(500).send(error);
  }
});

//update  store by ID
// , ID is passed through params

router.put("/:id", async (req, res) => {
  const store = {
    store_name: "mark’s Art Store",
    description: "Unique handmade art.",
    store_logo_url: "https://example.com/logo.jpg",
  };
  const id = req.params.id;

  try {
    await supabase.from("stores").update([store]).eq("id", id);
    res.status(200).send("updated");
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = router;
