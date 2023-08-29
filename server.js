const fs = require('fs');
const express = require('express');
const session = require('express-session')
const utils = require('./utils/utils.js');
const path = require('path');


const app = express();

const cat = ["Refund","Replace","Payment issue","Other"];

app.set('view engine', 'ejs');
app.use(express.json());
app.use(session({
    secret:"aaaaaa",
    resave: false,
    saveUninitialized: false
}));
app.use(express.urlencoded({extended: true}));

app.get("/dashboard",(req,res)=>{
    utils.getDashboard(req,res);
})

app.get("/login",(req,res)=>{
    res.render("login",{err:null});
})

app.post("/login",(req,res)=>{
    utils.userLogin(req, res);
})

app.get("/complaint",(req,res)=>{
    res.render("complaint",{username:"",category: cat});
})

app.post("/ticket",(req,res)=>{
   utils.createTicket(req,res);
})

app.get("/ticket/:id",(req,res)=>{
   utils.getTicket(req.params.id,res);
})

app.listen(8000,()=>{
    console.log("8000");
})