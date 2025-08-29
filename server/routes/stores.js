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

//this route gets all stores in the store table
// you can also pass a limit to the number of stores returned using the query parameter `limit`
// the limit is set to the number of stores if not specified
router.get("/", async (req, res) => {
  const countLimit = (await supabase.from("stores").select("*")).data.length;
  const limit = req.query.limit || countLimit; // Default limit to the number of stores if not specified
  try {
    const { data } = await supabase.from("stores").select("*").limit(limit);
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
router.post("/", upload.single("file"), async (req, res) => {
  const File = fs.readFileSync(req.file.path);
  const uidForStore = uuid();
  const user_id = req.body.user_id;

    try {
    // this function waits until the product image is posted in the storage
    await supabase.storage
      .from(`user_uploads/${user_id}`)
      .upload(`public-uploaded-image-${uidForStore}.jpg`, File, {
        contentType: "image/jpeg",
      });

    //this function wait until it gets the url data and asign it as ImageUrl and update the store
    const { data, error } = await supabase.storage
      .from(`user_uploads/${user_id}`)
      .getPublicUrl(`public-uploaded-image-${uidForStore}.jpg`);
   if(error || data.publicUrl===0){
return res.status(500).send('not created try again');
   }
const store = {
    user_id: user_id,
    store_name: req.body.store_name,
    description: req.body.store_description,
    store_logo_url: data.publicUrl,
    category:req.body.category,
    payment_method:req.body.payment_method,
    account_number:req.body.account_number,
    plan:req.body.plan,
  };

 await supabase.from("stores").insert([store]);

    res.status(201).send('created');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

});
//delete store and products in it by store ID
// , ID is passed through params
router.delete("/:id", async (req, res) => {
  const store_id = req.params.id;

  try {

  const { data } = await supabase.from("stores").select().eq("id", store_id);

  const folderPath = `public/${data[0].user_id}/`; // e.g., "public/2/"
  const bucket = "imageUpload";
    //  List all files in the folder
    const { data: files, error: listError } = await supabase.storage
      .from(bucket)
      .list(folderPath);

    if (listError){ return res.status(500).json({ error: listError.message });}

    if (!files || files.length === 0) {
      await supabase.from("stores").delete({ count: 1 }).eq("id", id);
      return res.status(200).send("store deleted");
    }

    //  Build array of file paths to delete
    const objectsToDelete = files.map((file) => `${folderPath}${file.name}`);

    //  Delete all files
    const { data: deleted, error: deleteError } = await supabase.storage
      .from(bucket)
      .remove(objectsToDelete);

    if (deleteError){return res.status(500).json({ error: deleteError.message });}
      

    try {
      // 4. Delete the store
      await supabase.from("stores").delete({ count: 1 }).eq("id", store_id);
      res.status(200).send("store deleted");
    } catch (error) {
      return res.status(500).send(error);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//update  store by ID
// , ID is passed through params
router.put("/:id",upload.single("file"),async (req, res) => {
  
    const bucket = "imageUpload";
  const id = req.params.id;
  if(req.file){
 
  const { data } = await supabase.from("stores").select().eq("id", id);
  const File = fs.readFileSync(req.file.path);
  const uidForStore = uuid();
  const folderPath = `public/${data[0].user_id}}/`;
  const image_url= data[0].store_logo_url.split("/");
  
   //  Delete the prevous logo
   await supabase.storage
      .from(bucket)
      .remove(`${folderPath}${image_url[10]}`);
 
      //this function waits until it finish upload a store logo
      await supabase.storage
      .from(`imageUpload/public/${data[0].user_id}`)
      .upload(`public-uploaded-image-${uidForStore}.jpg`, File, {
        contentType: "image/jpeg",
      });

    //this function wait until it gets the url data and asign it as ImageUrl and update the store
    const { data:UrlData, error:UrlError } = await supabase.storage
      .from(`imageUpload/public/${data[0].user_id}`)
      .getPublicUrl(`public-uploaded-image-${uidForStore}.jpg`);
      if(UrlError || UrlData.publicUrl===0){
return res.status(500).send('not created try again');
   }

    const store = {
    store_name: req.body.store_name,
    description: req.body.store_description,
    store_logo_url: UrlData.publicUrl,
    category:req.body.category,
    payment_method:req.body.payment_method,
    account_number:req.body.account_number,
    plan:req.body.plan,
  };


    try {
    await supabase.from("stores").update([store]).eq("id", id);
    res.status(200).send("updated");
  } catch (error) {
    return res.status(500).send(error);
  }
  }

   const store = {
    store_name: req.body.store_name,
    description: req.body.description,
  };

  try {
    await supabase.from("stores").update([store]).eq("id", id);
    res.status(200).send("updated");
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = router;
