const router = require("express").Router();
const Rating = require("../models/Rating");

router.post("/add", async(req,res)=>{

const rating = new Rating(req.body);

await rating.save();

res.send("Rating added");

});

router.get("/product/:id", async(req,res)=>{

const ratings = await Rating.find({
productId:req.params.id
});

res.json(ratings);

});

module.exports = router;