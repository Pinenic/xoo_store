const express = require("express");
const router = express.Router();
const supabase = require("../index");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {v4:uuid}=require('uuid');

//multer for file upload
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

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
router.put("/:id", upload.single("file"),async (req, res) => {b
  const id = req.params.id;
  const uid=uuid();
 
if(req.file){
 const File = fs.readFileSync(req.file.path);
         //  Delete the prevous profile
 const { data:userData } = await supabase.from("users").select().eq("id", id);
 const image_url= userData[0].thubnail.split("/");
   await supabase.storage
      .from("imageUpload")
      .remove(`public/${id}/${image_url[10]}`);
         // this function waits until the user profile  is posted in the storage
        await supabase.storage
          .from(`imageUpload/public/${id}`)
          .upload(`public-uploaded-image-${uid}.jpg`, File, {contentType: "image/jpeg",});
                      //this function wait until it gets the url data and asign it as ImageUrl
        const { data, error } = await supabase.storage
          .from(`imageUpload/public/${id}`)
          .getPublicUrl(`public-uploaded-image-${uid}.jpg`);
        if (error) {
          return res.status(500).json({ error: error.message });
        }
        const ImageUrl = data.publicUrl;
        const user = {
    name: req.body.user_name,
    email: "mark@example.com",
    thubnail: ImageUrl,
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