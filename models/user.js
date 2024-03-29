const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const Task = require("../models/task");
require("dotenv").config({  path:"./config/.env"  });

mongoose.connect(process.env.MONGO_PATH ,{

    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false

});

const userSchema = mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        validate:(value) => {
            if(! validator.isEmail(value))   throw new Error("Not a valid ");
        }
    },
    password:{
        type:String,
        required:true,
        minlength:8
    },
    age:{
        type:Number,
        default:0,
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ],
    avatar:{
        type:Buffer,
    }
    
}, {
    timestamps:true
});

userSchema.virtual("tasks",{
    ref:"Task",
    localField:"_id",
    foreignField:"owner"
});

userSchema.methods.toJSON = function(){

    const user = this.toObject();
    delete user.password;
    delete user.tokens;
    delete user.avatar;
    return user;

}

userSchema.methods.createAuthentication = async function() {

    // console.log(typeof(this._id.toString()));
    const token = await jwt.sign
                ({  _id:this._id.toString()  },
                    process.env.SECRET,
                 {  expiresIn: '15 days' });

    this.tokens = this.tokens.concat([{  token  }]);
    return token;

}

userSchema.statics.checkCredentials = async ( email,password ) => {

        const user = await User.findOne({  "email":email });
        if( !user ) {
            const err = new Error();
            err._ERR = 'User does not exist !';
            throw err;
        }

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch) {
            const err = new Error();
            err._ERR = 'Incorrect password !';
            throw err;
        }

        return user;

}

userSchema.pre("save", async function(next) {

    const user = this
    // console.log(user.password);
    //  console.log(user.isModified("password"));

    if(user.isModified("password"))     
        user.password = await bcrypt.hash(user.password,8);

    next();
});

userSchema.pre("remove", async function(next){

    const user = this;
    await Task.deleteMany({  owner:user._id  });
    next();

});

const User = mongoose.model("User",userSchema);


module.exports = User;