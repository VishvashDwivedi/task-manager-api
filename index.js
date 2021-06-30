// https://docs.mongodb.com/manual/core/wiredtiger/
const app = require("./test/app-test");
const port = process.env.PORT;


// Middleware which stops website to run ...
// app.use((req,res,next) => {
//         return res.status(503).send("Site under maintainance !");

// });

app.listen(port,(err,res) => {    
    if(err)  console.log("Error !");  
    console.log("Server is running !");    
});