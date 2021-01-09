const cons = require('consolidate');
var express = require('express');
const { validate } = require('uuid');
const { use } = require('./friendsRouter.js');
var router = express.Router();
const model = require('./dataBase.js')

router.use(express.json());

router.use(express.urlencoded({ extended: true }));

function redirectLogIn(req,res,next){
    if(!req.session.sessionId){
        res.redirect('/')
    }
    else{
        next();
    }
}

router.get("/",model.handleGetUser)

router.get('/viewProfile',(req,res)=>{
    let id = req.query.id;
    if(id){
        req.session.profileId = id;
        res.send('redirecting')
    }else{
        res.status(400);
    }
})
router.get('/loadProfile',model.handleLoadProfile)



router.get("/:user",model.handleGetUserByName)


//set the account to public or private
router.put("/active",model.setActiveState)

// friends related functions
router.delete("/friend",redirectLogIn,model.handleDeleteFriend)

  


module.exports = router;