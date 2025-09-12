const express  = require("express");
const router   = express.Router();
const supabase = require("../index");
const         _= require("lodash");

router.get(`/category`,async(req,res)=>{
const {data,error}=await supabase.from('products').select('category').not('category','is',null);
if(error){
    return res.status(500).json({error:error.message})
}
const result=_(data)
.map(item=> item.category.trim())
.uniq()
.value();
res.status(200).send(result)
})
router.get(`/brand`,async(req,res)=>{
const {data,error}=await supabase.from('products').select('brand').not('brand','is',null);
if(error){
    return res.status(500).json({error:error.message})
}
const result=_(data)
.map(item=> item.brand.trim())
.uniq()
.value();
res.status(200).send(result);
})

module.exports = router;
