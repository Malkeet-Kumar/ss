const fs = require('fs');
const {v4:uuidv4} = require('uuid');
const path = require('path')
const ticketsDbFile = path.join(__dirname,"..","tickets.json");
const usersDbFile = path.join(__dirname,"..","Users.json");

function userLogin(req,res){
    const users = JSON.parse(fs.readFileSync(usersDbFile,'utf-8'));
    const user = users.find(user => user.username==req.body.username && user.password == req.body.password);
    if(user){
        req.session.username = user.username;
        req.session.role = user.role;
        req.session.userId = user.id;
        res.redirect("/dashboard");
    } else {
        res.render("login",{err:"Inavlid credentials !"});
    }
}
const loadLogout= (req, res)=>{
    req.session.destroy();
    res.redirect("/login");
}

function createTicket(req,res){
    const ticket = {
        ticketId: uuidv4(),
        createdBy: req.session.username,
        role: req.session.role,
        category: req.body.category,
        title: req.body.title,
        desc: req.body.desc,
        startTime: new Date().toLocaleString(),
        endTime: new Date(new Date().getTime() + 48 * 60 * 60 * 1000).toLocaleString(),
        resolverId:""
    }
    let tickets = JSON.parse(fs.readFileSync(ticketsDbFile,"utf-8"));
    if(tickets==""){
        tickets=[];
    }
    tickets.push(ticket);
    fs.writeFileSync(ticketsDbFile,JSON.stringify(tickets));
    res.end("hello");
}

function getResolversTickets(){
    
}

function getDashboard(req,res){

    const tickets = JSON.parse(fs.readFileSync(ticketsDbFile,"utf-8"));
    if(req.session.role=="ordinary"){
    
        const userTickets = tickets.filter(t=>t.createdBy==req.session.username);
        res.render("dashboard",{role: req.session.role, username: req.session.username,tickets:userTickets});

    } else if(req.session.role=="resolver"){

        const resTickets = tickets.filter(t=>t.resolverId == req.session.userId);
        res.render("dashboard",{role:req.session.role,username:req.session.username, tickets: resTickets})

    } else if(req.session.role=="admin"){
        res.render("dashboard",{role:req.session.role,username:req.session.username, tickets: tickets})

    }
}

function getTicket(id,res){
    const tickets = JSON.parse(fs.readFileSync(ticketsDbFile,"utf-8"));
    const ticket = tickets.find(t=>t.ticketId==id);
    console.log(ticket);
    res.end(JSON.stringify(ticket));
    
}
module.exports = {userLogin, createTicket, getDashboard, getTicket,loadLogout}