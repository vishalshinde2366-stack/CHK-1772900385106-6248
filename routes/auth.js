const router = require("express").Router();
const User = require("../models/User");

router.post("/signup", async(req,res)=>{
const user = new User(req.body);
await user.save();
res.send("User registered");
});

router.post("/login", async(req,res)=>{
const user = await User.findOne({
email:req.body.email,
password:req.body.password
});

if(user){
res.json(user);
}else{
res.send("Invalid login");
}
});

module.exports = router;