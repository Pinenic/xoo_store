const express = require("express");
const router = express.Router();
const supabase = require("../index");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");

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

//this route post a product in the product table,
//at first it get the product as json data with a store ID then it post to the product table
router.post("/", upload.any(), async (req, res) => {
  let array = [];
  console.log(req.body)
  try {
    const uidFoimage = uuid();
    const { data } = await supabase.from("stores").select('*').eq("id", req.body.store_id);

    const user_id = data[0].user_id;
    for (const file of req.files) {
      if (file.fieldname === "file") {
        const File = fs.readFileSync(file.path);
        
        // this function waits until the product image is posted in the storage
      const   {data:imageUploaded,error:imageUploadedError}= await supabase.storage
          .from(`user_uploads/${user_id}/products`)
          .upload(`public-uploaded-image-${uidFoimage}.jpg`, File, {
            contentType: "image/jpeg",
          });
if(imageUploadedError){ return res.status(500).json({
  data:"error try again",error:imageUploadedError.message
})}
        //this function wait until it gets the url data and asign it as ImageUrl
        const { data, error } = await supabase.storage
          .from(`user_uploads/${user_id}/products`)
          .getPublicUrl(`public-uploaded-image-${uidFoimage}.jpg`);

        if (error) {
          return res.status(500).json({data:"error try again", error: error.message });
        }
        const ImageUrl = data.publicUrl;

        //this is a product json with a ImageUrl and store_id
        const product = {
          store_id: req.body.store_id,
          title: req.body.name,
          description: req.body.description,
          price: req.body.price,
          stock: req.body.stock,
          details: { size: req.body.size, color:req.body.color },
          thumbnail: ImageUrl,
          images: [],
          category:req.body.category,
          brand:req.body.brand,
          shipping_information:req.body.shipping_imformation,
          tags:null,
        };

        // this function insert the product json data into the products table
        try {
          const { data:dataForID } = await supabase
            .from("products")
            .insert([product])
            .select();
          array.push(dataForID[0].id);
        } catch (error) {
          res.status(500).json({ error: error.message});
          console.log(error);
        }
      }

      if (await array.length > 0) {
        if (file.fieldname === "files") {
          const uidFoimages =uuid()
          const File = fs.readFileSync(file.path);
          await supabase.storage
            .from(`user_uploads/${user_id}/products`)
            .upload(`public-uploaded-image-${uidFoimages}.jpg`, File, {
              contentType: "image/jpeg",
            });

          //this function wait until it gets the url data and asign it as ImageUrl
          const { data: dataForUrl, error: errorForUrl } =
            await supabase.storage
              .from(`user_uploads/${user_id}/products`)
              .getPublicUrl(`public-uploaded-image-${uidFoimages}.jpg`);

          const { data, error } = await supabase
            .from("products")
            .select("images")
            .eq("id", array[0])
            .single();

          let obj = data.images;
          obj.push(dataForUrl.publicUrl);

          await supabase
            .from("products")
            .update({"images":obj })
            .eq("id", array[0]);
        
        }
        
      }
    }
     res.status(200).send("product created");
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//this route it just delete product by ID,
// it get the ID through the params
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const { data } = await supabase.from("products").select().eq("id", id);
  const { data: storeData, error: storeDataError } = await supabase
    .from("stores")
    .select()
    .eq("id", data[0].store_id);
  const user_id = storeData[0].user_id;
  const folderPath = `${user_id}/products/`;

  try {
    const image_url = data[0].thumbnail.split("/");

    //this function delete the image from the storage
    await supabase.storage
      .from(`user_uploads`)
      .remove(`${folderPath}${image_url[10]}`);

    //this function delete the product from the database
    await supabase.from("products").delete({ count: 1 }).eq("id", id);
    if (data[0].images.length > -1) {
      //ths deletes all the addition images of the product
      for (const file of data[0].images) {
        const images_url = file.split("/");
        await supabase.storage
          .from(`user_uploads`)
          .remove(`${folderPath}${images_url[10]}`);
      }
    }
    res.status(200).send("product deleted");
  } catch (error) {
    return res.status(500).json({ error });
  }

  //this function deletes the store image folder if there is no user with the ID of image folder
  //it seaches the user by ID from the folder name
  //at first it gets the list of all folder images in the storage then it checks if the user exists
  //this is used to clean up the storage if developer deletes a store in the database

  // try {
  //   const data = await supabase.storage.from("imageUpload").list("public");
  //   const list = data.data.map((files) => `${files.name}`);
  //   list.forEach(async (list) => {
  //     try {
  //       const { data: deleteThis, error: deleteThisError } = await supabase
  //         .from("users")
  //         .select("*")
  //         .eq("id", list);

  //       if (deleteThis === null || deleteThis.length === 0) {
  //         const { data, error } = await supabase.storage
  //           .from("imageUpload")
  //           .list(`public/${list}`);

  //         const objectsToDelete = data.map(
  //           (file) => `public/${list}/${file.name}`
  //         );
  //         await supabase.storage.from("imageUpload").remove(objectsToDelete);
  //       }
  //       if (deleteThisError) {
  //         return res.status(500).json({ error: "refresh again" });
  //       }
  //     } catch (error) {
  //       res.status(500).json({ error: error.message });
  //     }
  //   });
  // } catch (error) {
  //   res.status(500).json({ error: error.message });
  // }
});









// route update the product by ID,
// the ID is passed through the params
router.put("/:id", upload.any(), async (req, res) => {
  let array = [req.params.id];
  let isReset = false;
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("id", req.params.id);
  const productToUpdate = data;
  try {
  
    const { data: storeData, error: storeDataError } = await supabase
      .from("stores")
      .select("*")
      .eq("id", data[0].store_id);
    const user_id = storeData[0].user_id;
    const folderPath = `${user_id}/products/`;

    if (req.files.length >= 1) {
      for (const file of req.files) {
        if (file.fieldname === "file") {
          const uidFoimage = uuid();
        const File = fs.readFileSync(file.path);

 //deleting the pre image while update the new one
        const pre_image_url = data[0].thumbnail.split("/");
       supabase.storage
      .from(`user_uploads`)
      .remove(`${folderPath}${pre_image_url[10]}`);
        
        // this function waits until the product image is posted in the storage
      const   {data:imageUploaded,error:imageUploadedError}= await supabase.storage
          .from(`user_uploads/${user_id}/products`)
          .upload(`public-uploaded-image-${uidFoimage}.jpg`, File, {
            contentType: "image/jpeg",
          });
if(imageUploadedError){ return res.status(500).json({
  data:"error try again",error:imageUploadedError.message
})}
        //this function wait until it gets the url data and asign it as ImageUrl
        const { data:newUrl, error:newUrlError } = await supabase.storage
          .from(`user_uploads/${user_id}/products`)
          .getPublicUrl(`public-uploaded-image-${uidFoimage}.jpg`);

        if (newUrlError ) {
          return res.status(500).json({data:"error try again", error: error.message });
        }
        const ImageUrl = newUrl.publicUrl;

        //this is a product json with a ImageUrl and store_id
        const product= {
          store_id: req.body.store_id,
          title: req.body.name,
          description: req.body.description,
          price: req.body.price,
          stock: req.body.stock,
          details: { size: req.body.size, color:req.body.color },
          thumbnail: ImageUrl,
          category:req.body.category,
          brand:req.body.brand,
          shipping_information:req.body.shipping_imformation,
        };

    try {
      await supabase.from("products").update(product).eq("id", req.params.id);
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.log(error);
    }


        }
        if ((await array.length) > 0) {
          if (file.fieldname === "files") {
            if (isReset === false) {
              for (const file of productToUpdate[0].images) {
                const images_url = file.split("/");
                await supabase.storage
                  .from(`user_uploads`)
                  .remove(`${folderPath}${images_url[10]}`);
                await supabase
                  .from("products")
                  .update({ images: [] })
                  .eq("id", array[0]);
                isReset = true;
              }
            }
            isReset = true;
            const uidFoimages = uuid();
            const File = fs.readFileSync(file.path);
            await supabase.storage
              .from(`user_uploads/${user_id}/products`)
              .upload(`public-uploaded-image-${uidFoimages}.jpg`, File, {
                contentType: "image/jpeg",
              });

            //this function wait until it gets the url data and asign it as ImageUrl
            const { data: dataForUrl, error: errorForUrl } =
              await supabase.storage
                .from(`user_uploads/${user_id}/products`)
                .getPublicUrl(`public-uploaded-image-${uidFoimages}.jpg`);

            const { data, error } = await supabase
              .from("products")
              .select("images")
              .eq("id", array[0])
              .single();

            let obj = data.images;
            obj.push(dataForUrl.publicUrl);

            await supabase
              .from("products")
              .update({ images: obj })
              .eq("id", array[0]);
          }
        }
      }
      return res.status(200).send("product updated");
    }
else{
const product = {
      title: req.body.name,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      details: { size: req.body.size, color: req.body.color },
      category: req.body.category,
      brand: req.body.brand,
      shipping_information: req.body.shipping_imformation,
    };
    try {
      await supabase.from("products").update(product).eq("id", req.params.id);
     return  res.status(200).send("product updated");
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.log(error);
    }
}
    
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
