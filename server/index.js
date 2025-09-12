const express = require("express");
const app = express();
const cors=require('cors');

cors({
  origin: '*'
})
app.use(cors());
const bodyParser = require("body-parser");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.DATABASE_URL,
  process.env.SERVICE_ROLE
);
module.exports = supabase;

//routes
const productRouter = require("./routes/products");
const userRouter = require("./routes/users");
const storeRoute = require("./routes/stores");
const seachRoute = require("./routes/seachingEng");
const orderRoute = require("./routes/order");
const wishListRoute= require("./routes/wishList");
const getFilterRoute= require("./routes/getFilter");
//API
const api = process.env.API_ROOT;

// midlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(`/${api}/products`, productRouter);
app.use(`/${api}/users`, userRouter);
app.use(`/${api}/stores`, storeRoute);
app.use(`/${api}/seach`, seachRoute);
app.use(`/${api}/orders`, orderRoute);
app.use(`/${api}/filter`, getFilterRoute);
app.use(`/${api}/wishlist`, wishListRoute);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`server is runing on port ${port}`);
});
