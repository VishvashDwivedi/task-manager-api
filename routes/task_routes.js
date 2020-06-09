const express = require("express");
const Task = require("../models/task");
const router = express.Router();
const auth = require("../middlewares/authentication");
require("dotenv").config();



router.post("/tasks/create", auth , async (req,res) => {

    try{
        console.log("------------------");
        const task = new Task({
            ...req.body,
            owner : req.user._id
        })

        await task.save();
        res.send(task);
    }
    catch(e){
        res.status(400);   res.send(e); 
    }


    // const task = Task(req.body);
    // task.save()
    // .then(() => res.send("Task Added !"))
    // .catch((e) =>{   res.status(400);   res.send(e);   });

}); 


router.get("/tasks/:id", auth ,async (req,res) => {

    try{

        const _id = req.params.id;
        console.log(req.user._id);
        const task = await Task.findOne({ _id , owner:req.user._id  });
        
        if(!task)   return res.status(404).send("Not Found !");
        res.send(task); 

    }
    catch(e){
        res.status(400).send("Invalid ID !");
    }


    // const id = req.params.id;
    // Task.findById(id)
    // .then((task) => {
    //     if(!task)   res.status(404).send("Not Found !");
    //     res.send(task);        
    // })
    // .catch((e) => res.status(400).send("Invalid ID !"));

});


router.get("/alltasks", auth , async (req,res) => {

    sort={}
    match={};

    if(req.query.complete)  match.isCompleted = req.query.complete === "true";
    if(req.query.sortBy)
    {
        // console.log("uuuuuuuuu");
        const parts = req.query.sortBy.split(":")
        console.log(parts);
        sort[parts[0]]= parts[1] === "asc"? 1 : -1;
    }

    // console.log(arg);/

    try{
        // const tasks = await Task.find({  owner:req.user._id  });
        await req.user.populate({
            path:"tasks",
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }

        }).execPopulate();
        
        if(req.user.tasks.length === 0)    return res.status(200).send("No Tasks Created !");

        res.send(req.user.tasks);

    }
    catch(e){
        res.status(400).send(e);
    }


    // Task.find({}).then((tasks) => {
    //     if(!tasks)  res.status(404).send("No Tasks Found !")
    //     res.send(tasks);
    // }).catch((e) => {
    //     res.status(400).send(e);
    // });

});


router.patch("/updatetask/:id", auth , async (req,res) => {

    // console.log(req.body);
    const keys = Object.keys(req.body);
    const validKeys = ["name","description","isCompleted"]
    var isValid = keys.every((key) => validKeys.includes(key) );
    if(!isValid)    return res.status(400).send("Not a valid key !");

    try{

        const _id = req.params.id;
        const task = await Task.findOne({   _id, owner:req.user._id   });
        if(!task)   return res.status(404).send("Not Found");

        keys.forEach((key) =>  task[key] = req.body[key]  );
        // console.log(task);
        await task.save();

        // const task = await Task.findByIdAndUpdate(id,req.body,{  new:true,runValidators:true  });
        res.send(task);

    }
    catch(e){
        
        console.log(e);

        res.status(400).send("Invalid operation !");
    }

})


router.delete("/tasks/:id", auth ,async (req,res) => {

    try{
        const _id = req.params.id;
        // const task = await Task.findByIdAndDelete(id);
        const task = await Task .deleteOne({  _id,owner:req.user._id  });
        if(!task || task.deletedCount === 0)   return res.status(404).send("Not Found");
        res.send(task);
    }
    catch(e){
        res.status(400).send("Invalid Operation !");
    }

});





module.exports = router;
