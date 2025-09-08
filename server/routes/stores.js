const express = require("express");
const router = express.Router();
const supabase = require("../index");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");

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
router.post("/", upload.any(), async (req, res) => {
  let array = [];
  const user_id = req.body.user_id;

  const { data: checkForStore, error: checkForStoreError } = await supabase
    .from("stores")
    .select("*")
    .eq("user_id", user_id);
  if (checkForStoreError) {
    return res.status(500).json({error:"check your internet connection and try again"});
  }
  if (checkForStore.length > 0) {
    return res
      .status(500)
      .json({ error: "the store with this user already exist" });
  }

  for (const file of req.files) {
    if (file.fieldname === "file") {
      const File = fs.readFileSync(file.path);
      const uidForStore = uuid();
      try {
        // this function waits until the product image is posted in the storage
        const { data: uploadedImage, error: uploadedImageError } =
          await supabase.storage
            .from(`user_uploads/${user_id}/products`)
            .upload(`public-uploaded-image-${uidForStore}.jpg`, File, {
              contentType: "image/jpeg",
            });

        if (uploadedImageError) {
          return res.status(500).json({
            data: "not created try again",
            error:`netework error or ${ uploadedImageError.message}`,
          });
        }

        //this function wait until it gets the url data and asign it as ImageUrl and update the store
        const { data, error } = await supabase.storage
          .from(`user_uploads/${user_id}/products`)
          .getPublicUrl(`public-uploaded-image-${uidForStore}.jpg`);
        if (error || data.publicUrl === 0) {
          return res.status(500).send("not created try again");
        }
        const store = {
          user_id:user_id,
          store_name: req.body.storeName,
          description: req.body.description,
          store_logo_url: data.publicUrl,
          category: req.body.category,
          payment_method: req.body.paymentMethod,
          account_number: req.body.accountNumber,
          plan: req.body.plan,
        };

       const {data:dataForID}=
       await supabase.from("stores")
       .insert([store]).select();
        array.push(dataForID[0].id);
        res.status(201).send("created");
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
    if ((await array.length) > 0) {
      if (file.fieldname === "banner") {
        const uidFoimages = uuid();
        const File = fs.readFileSync(file.path);
        //this function upload a banner
        await supabase.storage
          .from(`user_uploads/${user_id}/products`)
          .upload(`public-uploaded-image-${uidFoimages}.jpg`, File, {
            contentType: "image/jpeg",
          });
        //this function get url for a banner
        const { data: dataForUrl, error: errorForUrl } = await supabase.storage
          .from(`user_uploads/${user_id}/products`)
          .getPublicUrl(`public-uploaded-image-${uidFoimages}.jpg`);
        let obj = dataForUrl.publicUrl;
        await supabase
          .from("stores")
          .update({ banner: obj })
          .eq("id", array[0]);
      }
    }
  }
});

//delete store and products in it by store ID
// , ID is passed through params
router.delete("/:id", async (req, res) => {
  const store_id = req.params.id;

  try {
    const { data } = await supabase.from("stores").select().eq("id", store_id);

    const folderPath = `${data[0].user_id}/products/`; // e.g., "public/2/"
    const bucket = "user_uploads";
    //  List all files in the folder
    const { data: files, error: listError } = await supabase.storage
      .from(bucket)
      .list(folderPath);

    if (listError) {
      return res
        .status(500)
        .json({ data: "error try again", error: listError.message });
    }

    if (!files || files.length < 0) {
      await supabase.from("stores").delete({ count: 1 }).eq("id", id);
      return res.status(200).send("store deleted");
    }

    //  Build array of file paths to delete
    const objectsToDelete = files.map((file) => `${folderPath}${file.name}`);
    //  Delete all files
    for (const file of objectsToDelete) {
      const { data: deleted, error: deleteError } = await supabase.storage
        .from(bucket)
        .remove(file);
      if (deleteError) {
        return res
          .status(500)
          .json({ data: "error try again again", error: deleteError.message });
      }
    }

    try {
      //  Delete the store
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
router.put("/:id", upload.any(), async (req, res) => {
  const bucket = "user_uploads";
  let withBanner=false;
  const id = req.params.id;
  
try {
  
  if(req.files.length>1){
      withBanner=true;
    }

  for (const file of req.files) {
    
    if (file.fieldname === "file"){
 const { data ,error} = await supabase.from("stores").select().eq("id", id);
    if(error){
      return res.send({'error':error.message})
    }
    const File = fs.readFileSync(file.path);
    const uidForStore = uuid();
 
    
    const folderPath = `${data[0].user_id}/products/`;
    const image_url = data[0].store_logo_url.split("/");

    //  Delete the prevous logo
   supabase.storage.from(bucket).remove(`${folderPath}${image_url[10]}`);

    //this function waits until it finish upload a store logo
    await supabase.storage
      .from(`user_uploads/${data[0].user_id}/products`)
      .upload(`public-uploaded-image-${uidForStore}.jpg`, File, {
        contentType: "image/jpeg",
      });

    //this function wait until it gets the url data and asign it as ImageUrl and update the store
    const { data: UrlData, error: UrlError } = await supabase.storage
      .from(`user_uploads/${data[0].user_id}/products`)
      .getPublicUrl(`public-uploaded-image-${uidForStore}.jpg`);
    if (UrlError || UrlData.publicUrl === 0) {
      return res.status(500).send("check your internet connection and try again");
    }

    const store = {
      store_name: req.body.storeName,
      description: req.body.description,
      store_logo_url: UrlData.publicUrl,
      category: req.body.category,
      payment_method: req.body.paymentMethod,
      account_number: req.body.accountNumber,
    };

    try {
      await supabase.from("stores").update([store]).eq("id", id);
      if(withBanner===false){
       return res.status(201).send("updated");
      }
    } catch (error) {
      return res.status(500).send(error);
    }
    }
    if (file.fieldname === "banner"){


 const { data ,error} = await supabase.from("stores").select().eq("id", id);
    if(error){
      return res.send({'error':error.message})
    }
    const File = fs.readFileSync(file.path);
    const uidForStore = uuid();
 
    
    const folderPath = `${data[0].user_id}/products/`;
    const image_url = data[0].banner.split("/");

    //  Delete the prevous banner
   supabase.storage.from(bucket).remove(`${folderPath}${image_url[10]}`);

    //this function waits until it finish upload a store banner
    await supabase.storage
      .from(`user_uploads/${data[0].user_id}/products`)
      .upload(`public-uploaded-image-${uidForStore}.jpg`, File, {
        contentType: "image/jpeg",
      });

    //this function wait until it gets the url data and asign it as ImageUrl and update the store
    const { data: UrlData, error: UrlError } = await supabase.storage
      .from(`user_uploads/${data[0].user_id}/products`)
      .getPublicUrl(`public-uploaded-image-${uidForStore}.jpg`);
    if (UrlError || UrlData.publicUrl === 0) {
      return res.status(500).send("check your internet connection and try again");
    }

    const store = {
      store_name: req.body.storeName,
      description: req.body.description,
      banner: UrlData.publicUrl,
      category: req.body.category,
      payment_method: req.body.paymentMethod,
      account_number: req.body.accountNumber,
    };

    try {
      if (withBanner===true) {
        await supabase.from("stores").update([{banner:UrlData.publicUrl}]).eq("id", id);
      return res.status(201).send("updated");
      }
      await supabase.from("stores").update([store]).eq("id", id);
      return res.status(201).send("updated");
    } catch (error) {
      return res.status(500).send(error);
    }
    }
  }

  if(req.files.length<1){
       const store = {
    store_name: req.body.storeName,
    description: req.body.description,
    category: req.body.category,
    payment_method: req.body.paymentMethod,
    account_number: req.body.accountNumber,
  };

  try {
    await supabase.from("stores").update([store]).eq("id", id);
   return res.status(201).send("updated");
  } catch (error) {
    return res.status(500).send(error);
  }
    }
} catch (error) {
  res.json({error:error.message})
}
});

module.exports = router;
