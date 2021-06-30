require("dotenv").config({  path:"./config/.env"  });
const express = require("express");
const routes1 = require("../routes/user_routes");
const routes2 = require("../routes/task_routes");
const app = express();


app.use(express.json());
app.use(routes1);
app.use(routes2);

module.exports = app;