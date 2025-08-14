const express = require("express");
const app = express();
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.DATABASE_URL,
  process.env.PUBLIC_AnonKey
);
module.exports = supabase;

//routes
const productRouter = require("./routes/products");
const userRouter = require("./routes/users");
const stoerRouter = require("./routes/stores");

// midlewares
const api = process.env.API_ROOT;
app.use(`/${api}/products`, productRouter);
app.use(`/${api}/users`, userRouter);
app.use(`/${api}/stores`, stoerRouter);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`server is runing on port ${port}`);
});
