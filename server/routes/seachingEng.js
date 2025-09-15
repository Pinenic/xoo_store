const express = require("express");
const router = express.Router();
const supabase = require("../index");
const _=require('lodash');
//this route seach for a products with the matching content,
// seach iterm is passed through the query parameter `q` in the URL
// you can also pass a limit to the number of products returned using the query parameter `limit`
// the limit is set to the number of matching products if not specified
router.get("/", async (req, res) => {
  const seaching = await req.query.q;

let limit =eval(`${req.query.page}-1`);

  if(!req.query.page){
limit=0;
}

  try {
    const { data,error } = await supabase
      .from("products")
      .select("*")
      .ilike("title", `%${seaching}%`);
       if(error){ return res.status(500).json({error:error.message})}

      let groupSeachResult=_.chunk(data,24);
      let result={
      Products     :groupSeachResult[limit],
      TotalProducts:data.length,
      PerPage      :24,
      TotalPages   :groupSeachResult.length
    }

       if(data.length<=0){
          const { data:data2,error:error2 } = await supabase
      .from("products")
      .select("*")
      .ilike("category", `%${seaching}%`);
       if(error2){ return res.status(500).json({error:error2.message})}
        groupSeachResult=_.chunk(data2,24);

        result={
      Products     :groupSeachResult[limit],
      TotalProducts:data2.length,
      PerPage      :24,
      TotalPages   :groupSeachResult.length
    }

    if(data2.length<=0){
          const { data:data3,error:error3 } = await supabase
      .from("products")
      .select("*")
      .ilike("brand", `%${seaching}%`);
      if(error3){ return res.status(500).json({error:error3.message})}
        groupSeachResult=_.chunk(data3,24);

        result={
      Products     :groupSeachResult[limit],
      TotalProducts:data3.length,
      PerPage      :24,
      TotalPages   :groupSeachResult.length
    }

      }

      }

    res.status(200).send(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
