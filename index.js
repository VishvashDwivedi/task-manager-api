const express = require("express");
const routes1 = require("./routes/user_routes");
const routes2 = require("./routes/task_routes");


const app = express();
const port = process.env.PORT;

console.log(process.env.PORT);
console.log(process.env.MONGO_PATH);
console.log(process.env.SECRET);
 
// console.log(port ,"mm");
// Needed for the post request as it parses the input json data into request body...
// So , that it becomes easy to access... 
app.use(express.json());
 

// Middleware which stops website to run ...
// app.use((req,res,next) => {
//         return res.status(503).send("Site under maintainance !");

// });


// const multer = require("multer");
// const upload = multer({
//     dest:"images"
// });

// app.post("/upload", upload.single("upload"),(req,res) => res.send("Uploaded !"));


app.use(routes1);
app.use(routes2);


// JSON_Web_Token is made up of three things separated by 2 dots , first one tells that what type of token
// it is , i.e. jsonwebtoken , second part(payload) expresses the object we have provided... and the third
// is the (signature) which is made up of the secret ... !





app.listen(port,(err,res) => {    if(err)  console.log("Error !");  console.log("Server is running !");    });
