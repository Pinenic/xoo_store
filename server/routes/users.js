const express = require("express");
const router = express.Router();
const supabase = require("../index");

//get all users in the users table

router.get("/", async (req, res) => {

  try {
    const { data} = await supabase.from("users").select("*");
    res.status(200).send(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//get  user by ID,
// the ID is passed through the params

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const { data } = await supabase.from("users").select().eq("id", id);
     res.status(200).send(data);
  } catch (error) {
    return res.status(500).send(error);
  }
});

//this route delete user,
//  user's products and stores by user ID,
// the ID is passed through the params

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
      const { data, error } = await supabase
    .from("users")
    .delete({ count: 1 })
    .eq("id", id);
    res.status(200).send("deleted");
  } catch (error) {
    return res.status(500).send(error);
  }
});

//update  user by ID,
// the ID is passed through the params

router.put("/:id", async (req, res) => {
    const id = req.params.id;
  const user = {
    supabase_uid: "firebase-uid-5",
    name: "mark mol",
    email: "mark@example.com",
    profile_picture_url: "https://example.com/painting-a.jpg",
  };

  try {
    await supabase
    .from("users")
    .update([user])
    .eq("id", id);
    res.status(200).send("updated");
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = router;
