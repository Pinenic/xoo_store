const express     = require("express");
const app         = express();
const bodyParser  = require('body-parser');
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.DATABASE_URL,
  process.env.PUBLIC_AnonKey
);
module.exports = supabase;

//routes
const productRouter = require("./routes/products");
const userRouter    = require("./routes/users");
const storeRoute    = require("./routes/stores");
const seachRoute    = require("./routes/seachingEng");
const orderRoute    = require('./routes/order');

// midlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
const api = process.env.API_ROOT;
app.use(`/${api}/products`, productRouter);
app.use(`/${api}/users`, userRouter);
app.use(`/${api}/stores`, storeRoute );
app.use(`/${api}/seach`,seachRoute);
app.use(`/${api}/orders`,orderRoute);

app.get("/", async(req, res)=>{
    try {
       const data= await supabase.storage
    .from("imageUpload").list('public');
// const list=data.map((files)=> `files.name`);

    res.status(200).send(data.data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
})

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`server is runing on port ${port}`);
});
