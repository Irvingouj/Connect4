const cons = require('consolidate');
const e = require('express');
var express = require('express');
var router = express.Router();
const model = require('./dataBase.js')

router.use(express.json());

router.use(express.urlencoded({ extended: true }));

router.get('/',model.handleSearchForGame)

router.get('/userHistory',model.handleGetUserGameHistory)

router.get('/getWinner',model.handleGetGameInfo)

router.get('/search',model.handleSearchForGameByUserName)

router.post('/newGame',model.handleStartNewGame)

router.put('/play',model.handlePlay)

router.get('/board',model.handleGetBoard)

router.get('/connectGame',model.handleConnectGame)

router.post('/initGame',model.handleInitGame)

router.get('/refreshGame',model.handleGetGameById)



module.exports = router;