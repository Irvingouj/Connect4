const cons = require('consolidate');
const e = require('express');
var express = require('express');
var router = express.Router();
const model = require('./dataBase.js')

router.use(express.json());

router.use(express.urlencoded({ extended: true }));


router.get('/',model.findFriends)

router.get("/pending",model.findPendingFriends)

router.delete('/',model.handleDeleteFriend)

router.delete('/pending',model.handleRejectFriendRequest)

//accept friend request
router.put('/pending',model.handleAcceptFriendRequest)

//send friend request
router.put('/friendRequest',model.handleSendFriendsRequest)

router.get("/startGame",model.handleStartGameWithFriend)


module.exports = router;