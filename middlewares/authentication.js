const User = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();



const auth = async (req,res,next) => {

    try{

    const token = req.header("Authorization").replace("Bearer ","");
    const dec_user = await jwt.verify(token , process.env.SECRET);
    // console.log(dec_user);
    const user = await User.findOne({   _id:dec_user._id , "tokens.token":token  })
    // console.log(user);
    if(!user)   throw new Error("Cannot be added ! Account not found !");

    req.token = token;
    req.user = user;
    next();

    }catch(e){
        // console.log(e);
        res.status(501).send({ "_eid":"Wrong Authentication!"  });
    }

}




module.exports = auth;
