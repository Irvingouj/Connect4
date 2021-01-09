const { constants } = require('buffer')
const express = require('express')
const server = express()
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')
const model = require('./dataBase.js')
const { request } = require('http')
const userRouter = require('./userRouter.js')
const friendsRouter = require('./friendsRouter.js')
const gamesRouter = require('./gameRouter.js')
const session = require('express-session')
const cons = require('consolidate')

server.use(session({
    name:"sessionName",
    secret:"this_is_secret",
    resave: false,
    saveUninitialized:false,
    cookie:{
        maxAge: 1000 * 60 * 60,
        sameSite: true,

    }
}));

// parse application/x-www-form-urlencoded
server.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
server.use(bodyParser.json())

server.set("view engine","pug")

server.use("/users",userRouter);

server.use("/friends",friendsRouter)

server.use("/games",gamesRouter);




server.get('/',(req,res)=>{
    res.render(__dirname + '/public/welcome')
})

server.post('/signIn', model.handleSignIn);

server.post('/signUp', model.createNewUser);

server.post('/logOut',(req,res)=>{
    res.clearCookie();
    res.redirect("/")
})


server.use('/',express.static(__dirname+'/public'));

model.db.once("open",()=>{
    server.listen(1025,()=>{
        console.log('listened')
        console.log(__dirname)
    })
})
