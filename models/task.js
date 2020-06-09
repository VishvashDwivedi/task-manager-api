require("dotenv").config({  path:"./config/.env"  });

const mongoose = require("mongoose");
const User = require("./user");

mongoose.connect(process.env.MONGO_PATH ,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    
});

const taskSchema = mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    isCompleted:{
        type:Boolean,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    }


}, {
    timestamps:true
});

const Task = mongoose.model("Task",taskSchema);

module.exports = Task;