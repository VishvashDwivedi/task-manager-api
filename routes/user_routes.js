const express = require("express");
require("dotenv").config({  path:"./config/.env"  });
const User = require("../models/user");
const multer = require("multer")
const auth = require("../middlewares/authentication");
const router = express.Router();
const upload = multer({

    // dest:"avatar/profiles",
    limits:{
        fileSize:1000000,
    },
    fileFilter:(req, file, cb) => {

        if(!( file.originalname.endsWith(".jpg") || file.originalname.endsWith(".png") || file.originalname.endsWith(".jpeg") ))
            return cb(new Error("Not a JPG File !"));
        
        cb(undefined,true);
    }

});
const sharp = require("sharp");
const {  sendWelcomemail,sendByemail  } = require("../sendgrid/api_key");



router.post("/users/login", async (req,res) => {

//    console.log("hfhrugb");
    try{
        const user = await User.checkCredentials(req.body.email,req.body.password);
        const token = await user.createAuthentication();
        await user.save();
        res.send({ user,token });
    
    }
    catch(e){

        console.log(e);
        res.status(400).send("Error ! Invalid credentials !");
    }

});


router.post("/users/logoutAll", auth , async (req,res) => {

    try{
        
        const user = req.user;
        // console.log("\n",req.token,"\n");
        user.tokens = [];
        await user.save();
        res.send(user);
    }
    catch(e){
        console.log(e);
        res.status(500).send("ERROR !");

    }

});


router.post("/users/logout", auth , async (req,res) => {

    try{
        
        const user = req.user;
        // console.log("\n",req.token,"\n");
        const token = user.tokens.filter((tok) => {

            return (tok.token !== req.token);
        });
        user.tokens = token;
        await user.save();
        res.send(user);
    }
    catch(e){

        res.send("ERROR !");

    }
    
    

});


router.post("/users/signup", async (req,res) => {
        
    
    try{
        const user = User(req.body);
        // await user.save();
        const token = await user.createAuthentication();
        // console.log(token);
        await user.save();
        sendWelcomemail(user.email,user.name);
        res.status(201).send({  user,token  });
    }
    catch(e){
        res.status(400);    res.send(e);
    }

    // const user = User(req.body);
    // user.save()
    // .then(() => res.send(user))
    // .catch((e) => {   res.status(400);    res.send(e);   });

});


router.get("/users/me", auth , async (req,res) => {

    try{
        // const users = await User.find({});
        res.send(req.user);
    }
    catch(e){
    
        res.status(500);   res.send(e);
    }

    // User.find({})
    // .then((users) => res.send(users) )
    // .catch((e) => {    res.status(500);   res.send(e);  });

});


router.post("/users/me/avatar", auth , upload.single("avatar") , async (req,res) => {
    
    // req.user.avatar = req.file.buffer;
    const buffer = await sharp(req.file.buffer).resize({ width:200,height:200 }).png().toBuffer();
    // console.log(buffer);
    req.user.avatar = buffer;
    await req.user.save();
    res.status(200).send("Image Uploaded !");

},( err,req,res,next ) => {
    res.status(400).send({  _ERR:"Error occured while loading image !"  })
});


router.delete("/users/me/avatar", auth , async (req,res) => {
    
    req.user.avatar = undefined;
    await req.user.save();
    res.status(200).send("Image Deleted !");

},( err,req,res,next ) => {
    res.status(400).send({  _ERR:"Error occured while deleting image !"  })
});


router.patch("/users/update", auth , async (req,res) => {

    
    const keys = Object.keys(req.body);
    const validKeys = ["name","email","password","age"];
    var isValid = keys.every((key) =>  validKeys.includes(key)  );

    if(! isValid)    return res.status(400).send("Not a valid Key !");

    try{
        
        const user = req.user;

        keys.forEach((key) =>  user[key] = req.body[key] );
        await user.save();

        res.send(user);
//      const user = await User.findByIdAndUpdate(id,req.body,{ new:true, runValidators:true });
    }
    catch(e){

        res.status(400).send("Invalid operation !");
    }

});


router.delete("/users/delete", auth, async (req,res) => {

    try{
        const user = await req.user.remove();
        sendByemail(user.email,user.name);
        res.send(user);
    }
    catch(e){
        res.status(500).send({
            error:"_ERROR"
        })
    }

});


router.get("/users/:id/avatar", async (req,res) => {

    try{

        //console.log(req.params.id);
        const user = await User.findById(req.params.id);
        if(!user || !user.avatar)   return res.status(200).send("No object Found !");

        res.set("Content-Type","image/png");
        res.send(user.avatar);
    }
    catch(e){
        res.status(400).send("Some Error occured !");
    }

});



module.exports = router;


















// Get the user using its id on the url
function just_comments_1(){

// router.get("/users/:id", async (req,res) => {

//     try{

//         const id = req.params.id;
//         const user = await User.findById(id);
//         if(!user)   return res.status(404).send("Not Found !");

//         return res.send(user);

//     }
//     catch(e){
//         console.log("Error !");   res.status(400).send("Invalid ID !");
//     }

//     // const id = req.params.id;
//     // User.findById(id)
//     // .then((user) =>{       
//     //     // console.log(user);   
//     //     if(!user)   return res.status(404).send("Not Found!");
//     //     return  res.send(user);

//     // }).catch((e)  =>{       console.log("Error !");       res.status(400).send("Invalid ID !")    });

// });

}

// Delete user using its id on the url
function just_comments_2(){

    // router.delete("/users/:id",async (req,res) => {

    //     try{
    //         const id = req.params.id;
    //         const user = await User.findByIdAndDelete(id);
    //         if(!user)   return res.status(404).send("Not Found");
    //         res.send(user);
    //     }
    //     catch(e){
    //         res.status(400).send("Invalid Operation !");
    //     }
    
    // });

}
