const express = require("express");
require("dotenv").config({  path:"./config/.env"  });
const User = require("../models/user");
const multer = require("multer")
const auth = require("../middlewares/authentication");
const router = express.Router();
const upload = multer({    
    // dest:"avatar",
    limits:{
        fileSize:3000000,
    },
    fileFilter:(req, file, cb) => {

        if(!( file.originalname.endsWith(".jpg")
              || file.originalname.endsWith(".png")
              || file.originalname.endsWith(".jpeg") ))
        {   return cb(new Error('Not a valid File !'));     }

        cb(undefined,true);
    }

});

const sharp = require("sharp");
const {  sendWelcomemail,sendByemail  } = require("../sendgrid/api_key");


router.post("/users/login", async (req,res) => {

    try{
        const user = await User.checkCredentials(req.body.email,req.body.password);
        const token = await user.createAuthentication();
        await user.save();
        res.status(200).send({ user,token });    
    }
    catch(e){
        console.log('Error in login !');
        return res.status(400).send(e);
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

    try {
        const user = User(req.body);
        const token = await user.createAuthentication();
        await user.save();
        sendWelcomemail(user.email,user.name);
        res.status(201).send({  user,token  });
    }
    catch(e) {

        console.log('Error !');
        if(e.errmsg && e.errmsg.toLowerCase().includes('duplicate key error'))
            return res.status(400).send({
                _ERR : "User already registered."
            });
        
        res.status(500).send({
            _ERR : "Server error."
        });
    }

    // const user = User(req.body);
    // user.save()
    // .then(() => res.send(user))
    // .catch((e) => {   res.status(400);    res.send(e);   });

});


router.get("/users/me", auth , async (req,res) => {

    try {
        res.send(req.user);
    }
    catch(e) {
        res.status(500).send(e);
    }
    // User.find({})
    // .then((users) => res.send(users) )
    // .catch((e) => {    res.status(500);   res.send(e);  });

});


router.patch("/users/update", auth , async (req,res) => {

    const keys = Object.keys(req.body);
    const validKeys = ["name","email","password","age"];
    var isValid = keys.every((key) =>  validKeys.includes(key)  );

    if(! isValid)    return res.status(400).send({
        _ERR : "Not a valid Key !"
    });

    try{
        const user = req.user;
        keys.forEach((key) =>  user[key] = req.body[key] );
        await user.save();
        res.send(user);
//      const user = await User.findByIdAndUpdate(id,req.body,{ new:true, runValidators:true });
    }
    catch(e){
        res.status(400).send({
            _ERR : "Invalid operation !"
        });
    }

});


router.delete("/users/delete", auth, async (req,res) => {

    try{
        const user = await req.user.remove();
        sendByemail(user.email,user.name);
        res.send(user);
    }
    catch(e){
        res.status(401).send({
            _ERR: "User does not exist !"
        });
    }

});


router.post("/users/me/avatar", auth, 
            upload.single("avatar"), async (req,res) => {
        // req.user.avatar = req.file.buffer;
        const buffer = await sharp(req.file.buffer).resize({ width:300,height:300 }).png().toBuffer();
        // console.log(buffer);
        req.user.avatar = buffer;
        await req.user.save();
        res.status(200).send({
            'msg' : 'SUCCESS'
        });

    }, (err,req,res,next) => {
        res.status(400).send({  _ERR:"Error occured while loading image !"  });
});


router.delete("/users/me/avatar", auth , async (req,res) => {
    
    req.user.avatar = undefined;
    await req.user.save();
    res.status(200).send({
        'msg' : 'SUCCESS !'
    });

},( err,req,res,next ) => {
    res.status(400).send({  _ERR:"Error occured while deleting image !"  })
});


router.get("/users/:id/avatar", async (req,res) => {

    try{
        const user = await User.findById(req.params.id);
        if(!user || !user.avatar)   
            return res.status(200).send({
                _ERR : 'No object found !'
            });

        res.set("Content-Type","image/png");
        res.send(user.avatar);
    }
    catch(e){
        res.status(400).send({
            _ERR : 'Some error occured !'
        });
    }

});


module.exports = router;