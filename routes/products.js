const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

const multer = require("multer");

const storage = multer.diskStorage({

destination:function(req,file,cb){
cb(null,"uploads/");
},

filename:function(req,file,cb){
cb(null,Date.now()+"-"+file.originalname);
}

});

const upload = multer({storage:storage});


// ADD PRODUCT

router.post("/", upload.single("image"), async (req,res)=>{

try{

const newProduct = new Product({

name:req.body.name,
price:req.body.price,
description:req.body.description,
image:req.file.filename,

artisanName:req.body.artisanName,
artisanId:req.body.artisanId

});

await newProduct.save();

res.json(newProduct);

}catch(err){

res.status(500).json(err);

}

});


// GET ALL PRODUCTS

router.get("/", async(req,res)=>{

const products = await Product.find();

res.json(products);

});


// DELETE PRODUCT

router.delete("/:id", async(req,res)=>{

try{

await Product.findByIdAndDelete(req.params.id);

res.send("Product deleted");

}catch(err){

res.status(500).send(err);

}

});

module.exports = router;