require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const routers = require("./src/routers/index");
const mongoose = require("mongoose");
const passport = require("passport");

const app = express();

mongoose.connect(process.env.MONGO_URI, (error)=> {
    if (error) {
        console.log(error);
    } 
    console.log('Connect to database successfully!');
})

const PORT = process.env.PORT;
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(routers);

app.get("/", (req, res) => {
    res.send('hi there');
})

app.listen(PORT, ()=> {
    console.log('server listening on port ', PORT);
})