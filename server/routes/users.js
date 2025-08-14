const express = require("express");
const router = express.Router();
const supabase = require("../index");

//get all users

router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("users").select("*");
  if (error) {
    return res.status(500).json({ error: error.message });
  } else res.status(200).send(data);
});

//get  user by ID

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const { data, error } = await supabase.from("users").select().eq("id", id);
  if (error) {
    return res.status(500).send(error);
  } else res.status(200).send(data);
});

//delete user by ID

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const { data, error } = await supabase
    .from("users")
    .delete({ count: 1 })
    .eq("id", id);
  if (error) {
    return res.status(500).send(error);
  } else res.status(200).send("deleted");
});

//update  user by ID

router.put("/:id", async (req, res) => {
  const user = {
    supabase_uid: "firebase-uid-5",
    name: "mark mol",
    email: "mark@example.com",
    phone: +620911111111,
    profile_picture_url: "https://example.com/painting-a.jpg",
  };
  const id = req.params.id;
  const { data, error } = await supabase
    .from("users")
    .update([user])
    .eq("id", id);
  if (error) {
    return res.status(500).send(error);
  } else res.status(200).send("updated");
});

module.exports = router;
