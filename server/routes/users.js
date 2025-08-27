const express = require("express");
const router = express.Router();
const supabase = require("../index");
const {v4:uuid}=require('uuid');

//get all users in the users table
router.get("/", async (req, res) => {
  const countLimit = (await supabase.from("users").select("*")).data.length;
  const limit = req.query.limit || countLimit;
  try {
    const { data } = await supabase.from("users").select("*").limit(limit);
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
  const uid=uuid();
 
if(req.body.profile){
 const File = fs.readFileSync(file.path);
         // this function waits until the user profile  is posted in the storage
        await supabase.storage
          .from(`imageUpload/public/${req.body.user_id}`)
          .upload(`public-uploaded-image-${uid}.jpg`, File, {contentType: "image/jpeg",});
                      //this function wait until it gets the url data and asign it as ImageUrl
        const { data, error } = await supabase.storage
          .from(`imageUpload/public/${req.body.user_id}`)
          .getPublicUrl(`public-uploaded-image-${uid}.jpg`);
        if (error) {
          return res.status(500).json({ error: error.message });
        }
        const ImageUrl = data.publicUrl;
        const user = {
    name: req.body.user_name,
    email: "mark@example.com",
    profile_picture_url: ImageUrl,
  };
    try {
    await supabase.from("users").update([user]).eq("id", id);
   return res.status(200).send("updated");
  } catch (error) {
    return res.status(500).send(error);
  }
}

else{
        const user = {
    name: req.body.user_name,
    email: req.body.user_email,
  };
    try {
    await supabase.from("users").update([user]).eq("id", id);
   return res.status(200).send("updated");
  } catch (error) {
    return res.status(500).send(error);
  }
}

});

module.exports = router;
