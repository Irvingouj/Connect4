const { json } = require('body-parser');
const { ObjectID } = require('bson');
const mongoose = require('mongoose');
const { populate } = require('mongoose/lib/model');
const Mixed = require('mongoose/lib/schema/mixed');
// const { User } = require('./databasetest/module');
// const { playGame } = require('./module');
const Schema = mongoose.Schema;


mongoose.connect('mongodb://localhost/2406Project',{useNewUrlParser:true})

var db = mongoose.connection;

// // db.on("error",console.error.bind(console,"collection error"))

var userSchema = mongoose.Schema(
    {
        userName: {
            type:String,
            unique: true,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        onOrOff:Boolean,
        private:Boolean,
        friends:[{
            type:Schema.Types.ObjectId, 
            ref: 'User',
            unique: true,
         }],
        pendingFriends:[{type:Schema.Types.ObjectId, ref: 'User' }],
        gameHistory:[{type:Schema.Types.ObjectId, ref: 'Game' }],
    }
)

var gameBoardSchema = mongoose.Schema({

    redOrBlack:{
        type:Boolean,
        default:true
    },
    board:{
        type:Mixed,
        default:[
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
        ]
    }
})
 
var gameSchema = mongoose.Schema({
    
    host:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    hostName:{
        type:String
    },
    remote:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    remoteName:{
        type:String
    },
    board:{
        type:gameBoardSchema,
        unique:true,
        required:true,
        default:{
            redOrBlack:true,
            board:[
                [0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0],
            ]
        }
    },
    winner:{
        type:String
    },
    step:[{type:Number}]

})

userSchema.methods.playGame= function(gameId){
    
    let tmpGames = deepCopy(this.gameHistory)
    tmpGames.push(gameId);
    this.gameHistory = tmpGames;
    this.save((err)=>{
        console.log('the gave info is saved for '+this.userName)
    })
}

userSchema.methods.getWinPercentage= function(){

    UserModel.findById(this._id).populate('gameHistory').exec((err,user)=>{
        numWin = 0;
        numFinished = 0;
        
        for (let index = 0; index < user.gameHistory.length; index++) {
            let game = user.gameHistory[index];
            if(game.winner){
                numFinished +=1;
                if(game.winner == user.userName){
                    numWin+=1;
                }
            }
        }
        return numFinished == 0?0:numWin/numFinished;
    })
}


gameSchema.methods.play = function(col){
    if(this.winner){
        return;
    }
    this.board.play(col,(err)=>{
        if(err)throw err;
    })
    let win = this.board.checkWin()
    if(win) this.winner = win==1?this.hostName:this.remoteName;

    let tempStep = deepCopy(this.step);
    tempStep.push(col);
    this.step = tempStep;
    this.save();
}

gameSchema.methods.getName = function(){
    UserModel.findById(this.host,(err,host)=>{
        UserModel.findById(this.remote,(err,remote)=>{
            this.hostName = host.userName;
            this.remoteName = remote.userName;
            this.save();
        })
    })
}


gameBoardSchema.methods.setToDefault = function(){
    this.redOrBlack = true;
    this.board =
   [[0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],]
    this.save()
}

gameBoardSchema.methods.play = function(col,callBack){
    let tempBoard = deepCopy(this.board);
    if(col < 0 || col > 7) {
        throw 'indexOutOfBoundary@GameBoard@model'
    }
    
    for (let i = 0; i < tempBoard.length; i++) {
        if(tempBoard[i][col] == 0){
            tempBoard[i][col] = this.redOrBlack? 1:2;
            this.redOrBlack = !this.redOrBlack;
            break;
        }
    }
    this.board = tempBoard;



    this.save(callBack);
}

gameBoardSchema.methods.checkWin = function(){
    var count = 0;
    var previousCheck, currentCheck;
    // check for each row
    let tempBoard = this.board;
    for (let i = 0; i < tempBoard.length; i++) {
        previousCheck = 0;
        for (let j = 0; j < tempBoard[i].length; j++) {
            currentCheck = tempBoard[i][j];
            if(currentCheck == previousCheck 
                && currentCheck  != 0){
                    count++;
                    if (count == 3){
                        return currentCheck;
                    }
            }
            else{
                count = 0;
            }
            previousCheck = currentCheck;
        }
    }


    //check for each col
    count = 0
    for (let i = 0; i < tempBoard[0].length; i++) {
        previousCheck = 0;
        for (let j = 0; j < tempBoard.length; j++) {
            currentCheck = tempBoard[j][i];
            if(currentCheck == previousCheck 
                && currentCheck  != 0){
                    count++;
                    if (count == 3){
                        return currentCheck;
                    }
            }
            else{
                count = 0;
            }
            previousCheck = currentCheck;
        }
    }

    count = 0;
    for (let i = 0; i < 2; i++) {
        //previousCheck = 0;
        for (let j = 0; j < 3; j++) {
            currentCheck = tempBoard[i][j];
            if (tempBoard[i + 1][j + 1] == currentCheck && tempBoard[i + 1][j + 1] != 0 &&
                tempBoard[i + 2][j + 2] == currentCheck && tempBoard[i + 2][j + 2] != 0 &&
                tempBoard[i + 3][j + 3] == currentCheck && tempBoard[i + 2][j + 3] != 0 &&
                currentCheck != 0) {
                return currentCheck;
            } else {
                count = 0;
            }
            
        }
    }

    //check for back slash diagnol
    count = 0
    for (let i = 5; i > 3; i--) {
        //previousCheck = 0;
        for (let j = 6; j > 3; j--) {
            currentCheck = tempBoard[i][j];
            if (tempBoard[i - 1][j - 3] == currentCheck && tempBoard[i - 1][j - 3] != 0 &&
                tempBoard[i - 2][j - 2] == currentCheck && tempBoard[i - 2][j - 2] != 0 &&
                tempBoard[i - 3][j - 1] == currentCheck && tempBoard[i - 3][j - 1] != 0 &&
                currentCheck != 0) {
                return currentCheck;
            } else {
                count = 0;
            }
            
        }
    }



    return null;

}



function deepCopy(arr){
    return arr = JSON.parse(JSON.stringify(arr));
}


var gameBoardModel = mongoose.model('GameBoard',gameBoardSchema)

var gameModel = mongoose.model('Game',gameSchema)

var UserModel = mongoose.model('User',userSchema)

function handleSignIn(req,res){
    let account = req.body.account;
    let passwd = req.body.password;
    if(account&&passwd){
        UserModel.findOne({userName:account,password:passwd},(err,result)=>{
            if(err) {
                throw err;
            }
            if(result){
                let id = result._id.toString();
                req.session.sessionId = id;
                result.onOrOff = true;
                result.save();
                res.send(id);
            }else{
                res.status(404)
                res.send("invalid userName or password")
            }
        })
    }
}

function createNewUser(req,res){
    let account = req.body.account;
    let passwd  = req.body.password;
    if(account&&passwd){
        UserModel.create(
            {userName : account,
            password:passwd,
            onOrOff:true,
            private:false
        },
        (err,result)=>{
            if(err)throw err;
            let id = result._id.toString();
            req.session.sessionId=id;
            res.send(id)
        }
        )
    }else{
        res.status(400)
    }
}

function handleGetUser(req,res){
   
    if(req.query.name){
        UserModel.find({userName:req.query.name,private:false},
            (err,result)=>{
            if(err)throw err
            if(result){
                console.log(result)
                res.send(JSON.stringify(result))
            }else{
                res.status(404);
                res.send("no user with given filter is found")
            }
        })
    }else{
        UserModel.find({},(e,r)=>{
            if (e) throw e;
            if(r){
                res.send(JSON.stringify(r));
            }else{
                res.status(404);
                res.send("no user with given filter is found")
            }
        })
    }
}

function handleGetUserByName(req,res){
    let name = req.path.substring(1)
    if(name){
        UserModel.find({userName:name},(e,r)=>{
            if(e) throw e;
            if(r){
                res.send(JSON.stringify(r));
            }else{
                res.status(404)
            }
        })
    }
}

function setActiveState(req,res){
    let id = req.session.sessionId;
    let value = req.query.publicOrPrivate;
    // console.log("set active is called id = "+id +" value"+value)
    if(id && value){
        UserModel.findOne({_id:id},(e,r)=>{
            if(e) throw e;
            if(r){
                
                r.private = (value == "true");
                r.save((err)=>{
                    if (err) throw err;
                    res.send("you have set you account to "+
                (r.private?"private":"public"))
                })
            }else{
                res.status(400)
                res.send("bad request")
            }
        })
    }

}

function findFriends(req,res){
    let id = req.session.sessionId;
    if(id){
        UserModel.findById(id,(err,result)=>{
            if(err) throw err;
            UserModel.find(
                {_id:{$in:result.friends}},
                (err,friends)=>{
                    if(err) throw err;  
                    res.send(JSON.stringify(friends))
                }
            )
        })
    }else{
        res.status(400)
    }
}
function findPendingFriends(req,res){
    let id = req.session.sessionId;
    if(id){
        UserModel.findById(id,(err,result)=>{
            if(err) throw err;
            UserModel.find(
                {_id:{$in:result.pendingFriends}},
                (err,friends)=>{
                    if(err) throw err;  
                    res.send(JSON.stringify(friends))
                }
            )
        })
    }else{
        res.status(400)
    }
}
function handleSendFriendsRequest(req,res){
    let id = req.session.sessionId;
    let friendsId = req.query.friendsId;
    if(id&&friendsId){
        UserModel.findByIdAndUpdate(
            id,
            {$addToSet:{pendingFriends : ObjectID(friendsId)}},
            {safe: true, new:true},
            (err,user)=>{
                UserModel.findByIdAndUpdate(
                    friendsId,
                    {$addToSet:{pendingFriends : ObjectID(id)}},
                    {safe: true, new:true},
                    (err,friend)=>{
                        res.send("you have successfully send the friend requests")
                        console.log(friend);
                        console.log("the above is friends !!!!!!!!!!!")
                        console.log(user)
                    }
                )
        })
    }else{
        res.status(400)
    }
}

function handleAcceptFriendRequest(req,res){
    let id = req.session.sessionId;
    let friendsId = req.query.friendsId;
    if(id&&friendsId){
        console.log("id = "+id);
        console.log("locate friendsId = "+friendsId)

        UserModel.findByIdAndUpdate(
            id,
            {$pull:{pendingFriends : ObjectID(friendsId)}},
            {safe: true, new:true},
            (err,result)=>{
            if(err) throw err;
        })

        UserModel.findByIdAndUpdate(
            friendsId,
            {$addToSet:{friends : ObjectID(id)}},
            {safe: true, new:true},
            (err,result)=>{
            if(err) throw err;
            console.log(result)
        })

        UserModel.findByIdAndUpdate(
            id,
            {$addToSet:{friends : ObjectID(friendsId)}},
            {safe: true, new:true},
            (err,result)=>{
            if(err) throw err;
            console.log(result);
        })

    }else{
        res.status(400)
    }

}

function handleRejectFriendRequest(req,res){
    let id = req.session.sessionId;
    let friendsId = req.query.friendsId;
    if(id&&friendsId){
        UserModel.findByIdAndUpdate(
            id,
            {$pull:{pendingFriends : ObjectID(friendsId)}},
            {safe: true, new:true},
            (err,result)=>{
            if(err) throw err;
            res.send("you have successfully rejected the request")
            console.log(result);
        })
    }else{
        res.status(400)
    }
}

function handleDeleteFriend(req,res){
    let id = req.session.sessionId;
    let friendsId = req.query.friendsId;
    if(id&&friendsId){
        UserModel.findByIdAndUpdate(
            id,
            {$pull:{friends : ObjectID(friendsId)}},
            {safe: true, new:true,useFindAndModify:false},
            (err,result)=>{
            if(err) throw err;
            res.send("you successfully removed your ex-friend")
            console.log("this is after remove")
            console.log(result);
        })
    }else{
        res.status(400)
    }
}

function handleLoadProfile(req,res){
    // console.log("handleLoadProfile is called")
    let id = req.session.profileId
    // console.log('the id = '+id)

    if(!id&&req.session.sessionId){
        id = req.session.sessionId
    }
    if(id){
        UserModel.findById(id).populate('gameHistory').exec((err,user)=>{
            numWin = 0;
            numFinished = 0;
            for (let index = 0; index < user.gameHistory.length; index++) {
                let game = user.gameHistory[index];
                if(game.winner){
                    numFinished +=1;
                    if(game.winner == user.userName){
                        numWin+=1;
                    }
                }
            }
            let winPercentage = numFinished == 0?0:(numWin/numFinished)*100;
            let out = {
                _id:user._id,
                userName:user.userName,
                numGame:numFinished,
                winPercentage:winPercentage,
                gameHistory:user.gameHistory
            }
            res.send(JSON.stringify(out))
        })
    }else{
        res.status(400)
    }

}


//the below is game functions


function handleStartNewGame(req,res){
    let hostId = req.session.sessionId;
    if(hostId){
        UserModel.findById(hostId,(err,host)=>{
            UserModel.find({_id:{$ne:hostId/* should have filter here for onOrOff
            */ }},(err,otherUsers)=>{
                if(err)throw err;
                let ranNum = (Math.floor(Math.random() *100* otherUsers.length)%otherUsers.length);
                let remote = otherUsers[ranNum]
                var remoteId = remote._id;
                gameModel.create({
                    host:ObjectID(hostId),
                    remote:ObjectID(remoteId),
                    hostName:host.userName,
                    remoteName:remote.userName
                },(err,game)=>{
                    host.playGame(game._id);
                    remote.playGame(game._id);
                    if(err)throw err;
                    req.session.gameId = game._id;
                    res.send(JSON.stringify(game));
                })
            })
        })
    }
    else{
        res.status(400);
    }
}

function handlePlay(req,res){
    let userId = req.session.sessionId;
    let gameId=req.session.gameId;
    let col = req.query.col;
    if(gameId&&col){
        gameModel.findById(gameId,(err,game)=>{
            if(userId == game.host && game.board.redOrBlack){
                game.play(col);
            }else if(userId == game.remote && !game.board.redOrBlack){
                game.play(col);
            }
            res.send(JSON.stringify(game))
        })
    }else{
        res.status(400)
    }
}

//req has query to a user 
function handleSearchForGameByUserName(req,res){
    let name = req.query.name;
    if(name){
        UserModel.findOne({userName:name}).populate('gameHistory').exec((err,user)=>{
            var result = [];
            if(err) throw err;
            if(!user){
                res.status(404)
                return;
            }
            for (let index = 0; index < user.gameHistory.length; index++) {
                let game = user.gameHistory[index];
                let out ={
                    remote:game.remoteName,
                    host:game.hostName,
                    id:game._id
                }
                result.push(out)
            }
            res.send(JSON.stringify(result))
        })
        
    }else{
        res.status(400)
    }
}

function handleGetGameInfo(req,res){
    let gameId =req.query.id;

    if(gameId){
    gameModel.findById(gameId,(err,game)=>{
        if(err)throw err;
        res.send(JSON.stringify(game));
    })}
    else{
        res.status(400)
    }
    
}

function handleGetUserGameHistory(req,res){
    let userId = req.session.sessionId;
    if(userId){
        UserModel.findById(userId).populate('gameHistory').exec((err,user)=>{
            if(err) throw err;
            if(!user){
                res.status(404)
                return;
            }
            let games = user.gameHistory;
            let result = []
            for (let index = 0; index < games.length; index++) {
                let game = games[index]
                if(game.winner){
                    active = false;
                }else{
                    active = true;
                }
                let gameInfo={
                    host:game.hostName,
                    remote:game.remoteName,
                    id:game._id,
                    isActive:active
                }
                result.push(gameInfo)
            }
            res.send(JSON.stringify(result))
        })
    }else{
        res.status(404);
    }

}

function handleSearchForGame(req,res){
    let playerStrName = req.query.player;
    let activeBool = req.query.active == 'true';
    let detailStr = req.query.detail;
    if(req.query.active !=undefined){
            gameModel.find().and(
            [
                {$or:[{remoteName:playerStrName},{hostName:playerStrName}]},
                {winner:{$exists: !activeBool}}
            ]
        ).exec((err,games)=>{
            console.log("!!!!!!!!!!!!!!!!")
            console.log(games)
            let result = []
            for (let index = 0; index < games.length; index++) {
                let game = games[index];
                let gameInfo = {
                    "hostName":game.hostName,
                    "remoteName":game.remoteName,
                    "status":game.winner == undefined?'inactive':"active",
                    "winner":game.winner ,
                    "numOfTurns":game.step.length
                }
                console.log()
                if(detailStr == 'full'){
                    gameInfo.steps=game.step
                }
                result.push(gameInfo);
            }
        
            res.send(JSON.stringify(result))
        })
    }else{
        gameModel.find().and(
            [
                {$or:[{remoteName:playerStrName},{hostName:playerStrName}]}
            ]
        ).exec((err,games)=>{
            let result = []
            for (let index = 0; index < games.length; index++) {
                let game = games[index];
                let gameInfo = {
                    "hostName":game.hostName,
                    "remoteName":game.remoteName,
                    "status":game.winner == undefined?'inactive':"active",
                    "winner":game.winner ,
                    "numOfTurns":game.step.length
                }
                if(detailStr == 'full'){
                    gameInfo.steps=game.step
                }
                result.push(gameInfo);
            }
        
            res.send(JSON.stringify(result))
        })

    }
}

function handleGetBoard(req,res){
    let id = req.query.id;
    if(id){
        gameModel.findById(id,(err,res)=>{
            res.send(JSON.stringify(res.board.board))
        })
    }else{
        res.status(400)
    }
}

function handleInitGame(req,res){
    console.log('handleInitGame is called')
    if(req.session.friendId){
        createNewGameWithFriend(req,res);
        return;
    }
    if(!req.session.gameId){
        console.log("no game id, create a new game")
        handleStartNewGame(req,res)
    }else{
        handleGetGameById(req,res)
    }
}
function handleGetGameById(req,res){
    let gameId = req.session.gameId;
    gameModel.findById(gameId,(err,game)=>{
        if(err)throw err;
        res.send(JSON.stringify(game));
    })

}
function handleConnectGame(req,res){
        let gameId = req.query.gameId;
        if(gameId){
            req.session.gameId = gameId;
            gameModel.findById(gameId,(err,game)=>{
                if(err)throw err;
                res.send('you are connecting')
            })
        }
}

function handleStartGameWithFriend(req,res){

    let friendId = req.query.friendId;
    if(friendId){
        UserModel.findById(friendId,(err,friend)=>{
            if(friend.onOrOff){
                req.session.friendId = friendId;
                res.send('you are creating game ')
            }
            else{
                res.status('400');
                res.send(' friend is not online')
            }
        })
        
    }
}

function createNewGameWithFriend(req,res){
    let hostId = req.session.sessionId;
    let remoteId = req.session.friendId;
    UserModel.findById(hostId,(err,host)=>{
        UserModel.findById(remoteId,(err,remote)=>{
            gameModel.create({
                host:ObjectID(hostId),
                remote:ObjectID(remoteId),
                hostName:host.userName,
                remoteName:remote.userName
            },(err,game)=>{
                host.playGame(game._id);
                remote.playGame(game._id);
                if(err)throw err;
                req.session.gameId = game._id;
                res.send(JSON.stringify(game));
            })
        })
    })
}



module.exports= {UserModel,gameBoardModel,gameModel,createNewUser,handleSignIn,handleGetUser,
    handleGetUserByName,setActiveState,handleSendFriendsRequest,
    handleAcceptFriendRequest,handleRejectFriendRequest,handleDeleteFriend,
    findFriends,findPendingFriends,handleStartNewGame,handlePlay,handleSearchForGameByUserName,
    handleGetGameInfo,handleGetUserGameHistory,handleSearchForGame,handleGetBoard,handleConnectGame,
    handleInitGame,handleGetGameById,handleStartGameWithFriend,handleLoadProfile,
    db,mongoose,gameBoardSchema};