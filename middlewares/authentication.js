const User = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config({  path:"./config/.env"  });

const auth = async (req,res,next) => {

    try {
        const token = req.header("Authorization").replace("Bearer ","");
        const decoded_user = await jwt.verify(token , process.env.SECRET);
        const user = await User.findOne({   _id:decoded_user._id , "tokens.token":token  });
        if(!user)
            throw new Error();

        req.token = token;
        req.user = user;
        next();

    } catch(e){
        res.status(401).send({  "_ERR": "Unauthorized"    });
    }

}


module.exports = auth;