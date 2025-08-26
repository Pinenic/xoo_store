const express = require("express");
const router = express.Router();
const supabase = require("../index");


router.get('/',async(req,res)=>{
   try {
    const {data}=await supabase.from('wish_list').select('*')
    res.status(200).send(data);
   } catch (error) {
    res.status(500).json({error:error.message})
   }
})

router.get('/:id',async(req,res)=>{
try {
    const {data}=await supabase.from('wish_list').select('*').eq('id',req.params.id);
     res.status(200).send(data);
} catch (error) {
    res.status(500).json({error:error.message})
}
})

router.post('/',async(req,res)=>{
    const wishList={
        user_id:15,
        product_id:272
    }
    try {
        await supabase.from('wish_list').insert([wishList])
        res.status(200).send('created succefully');
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

module.exports = router;
