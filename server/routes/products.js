const express = require("express");
const router = express.Router();
const supabase = require("../index");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

//multer for file upload
//this is used to read the file from the request and pass the url to the next function
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

//this route is used to get all the products in the product table you can also pass a limit to the number of products returned using the query parameter `limit`
router.get("/", async (req, res) => {
  const countLimit = (await supabase.from("products").select("*")).data.length;
  const limit = req.query.limit || countLimit; // Default limit to data limit if all products are requested
  try {
    const { data } = await supabase.from("products").select("*").limit(limit);
    res.status(200).send(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
//this route gets all products in a store,
//the store_id is passed through the query params
//you can also pass a limit to the number of products returned using the query parameter `limit`
router.get("/store/:store_id", async (req, res) => {
  const store_id = req.params.store_id;
  const countLimit = (
    await supabase.from("products").select("*").eq("store_id", store_id)
  ).data.length;
  const limit = req.query.limit || countLimit; // Default limit to data limit if all products are requested
  try {
    const { data } = await supabase
      .from("products")
      .select()
      .eq("store_id", store_id)
      .limit(limit);
    res.status(200).send(data);
  } catch (error) {
    return res.status(500).send(error);
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
router.post("/", upload.any(), async (req, res) => {
  let array = [];
  try {
    const dateForImage = await Date.now();
    const store_id = req.body.store_id;
    for (const file of req.files) {
      if (file.fieldname === "file") {
        const File = fs.readFileSync(file.path);
        // this function waits until the product image is posted in the storage
        await supabase.storage
          .from(`imageUpload/public/${store_id}`)
          .upload(`public-uploaded-image-${dateForImage}.jpg`, File, {
            contentType: "image/jpeg",
          });

        //this function wait until it gets the url data and asign it as ImageUrl
        const { data, error } = await supabase.storage
          .from(`imageUpload/public/${store_id}`)
          .getPublicUrl(`public-uploaded-image-${dateForImage}.jpg`);
        if (error) {
          return res.status(500).json({ error: error.message });
        }
        const ImageUrl = data.publicUrl;

        //this is a product json with a ImageUrl and store_id
        const product = {
          store_id: req.body.store_id,
          name: req.body.product_name,
          description: req.body.product_description,
          price: req.body.product_price,
          stock: req.body.product_stock,
          details: { size: req.body.product_size, color:req.body.product_color },
          image_url: ImageUrl,
          image_array: [],
        };

        //this function insert the product json data into the products table
        try {
          const { data } = await supabase
            .from("products")
            .insert([product])
            .select();
          array.push(data[0].id);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      }

      if (await array.length > 0) {
        if (file.fieldname === "files") {
          const newdateForImage =
            (await Date.now()) + Math.floor(9000 + Math.random() * 9000);
          const File = fs.readFileSync(file.path);
          await supabase.storage
            .from(`imageUpload/public/${store_id}`)
            .upload(`public-uploaded-image-${newdateForImage}.jpg`, File, {
              contentType: "image/jpeg",
            });

          //this function wait until it gets the url data and asign it as ImageUrl
          const { data: dataForUrl, error: errorForUrl } =
            await supabase.storage
              .from(`imageUpload/public/${store_id}`)
              .getPublicUrl(`public-uploaded-image-${newdateForImage}.jpg`);

          const { data, error } = await supabase
            .from("products")
            .select("image_array")
            .eq("id", array[0])
            .single();

          let obj = data.image_array;
          obj.push(dataForUrl);

          await supabase
            .from("products")
            .update({ image_array: obj })
            .eq("id", array[0]);
         res.status(200).send("product created");
        }
      }
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
//this route it just delete product by ID,
// it get the ID through the params
// it get the store ID from the request body as req.body.store_id
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const store_id = await req.body.store_id;
  const folderPath = `public/${store_id}/`;
  try {
    const { data } = await supabase.from("products").select().eq("id", id);
    const image_url = data[0].image_url.split("/");

    //this function delete the image from the storage
    await supabase.storage
      .from(`imageUpload`)
      .remove(`${folderPath}${image_url[10]}`);

    //this function delete the product from the database
    await supabase.from("products").delete({ count: 1 }).eq("id", id);
    res.status(200).send("product deleted");
  } catch (error) {
    return res.status(500).json({ error });
  }

  //this function deletes the store image folder if there is no store with the ID of image folder
  //it seaches the store by ID from the folder name
  //at first it gets the list of all folder images in the storage then it checks if the store exists
  //this is used to clean up the storage if developer deletes a store in the database

  try {
    const data = await supabase.storage.from("imageUpload").list("public");
    const list = data.data.map((files) => `${files.name}`);
    list.forEach(async (list) => {
      try {
        const { data: deleteThis, error: deleteThisError } = await supabase
          .from("stores")
          .select("*")
          .eq("id", list);

        if (deleteThis === null || deleteThis.length === 0) {
          const { data, error } = await supabase.storage
            .from("imageUpload")
            .list(`public/${list}`);

          const objectsToDelete = data.map(
            (file) => `public/${list}/${file.name}`
          );
          await supabase.storage.from("imageUpload").remove(objectsToDelete);
        }
        if (deleteThisError) {
          return res.status(500).json({ error: "refresh again" });
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
//this route gets the latest product
// you can pass a limit to the number of products returned using the query parameter `limit`
router.get("/latest/first", async (req, res) => {
  const latest = req.query.limit;
  try {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(latest);
    res.status(200).send(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
