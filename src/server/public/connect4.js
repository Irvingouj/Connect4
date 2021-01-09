const gameboard = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
];


let intervalReference = setInterval(()=>{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let game = JSON.parse(this.responseText)
           let gameboardT = game.board.board;
           updateBoard(parseBoard(gameboardT))
           if(game.winner){
            alert('winner is '+game.winner)
            clearInterval(intervalReference);
         }
        }
    };
    xhttp.open("GET", "/games/refreshGame", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send();
},1000)

function initGame(){
    alert('initGameIsCalled')
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let game = JSON.parse(this.responseText)
           let gameboardT = game.board.board;
           document.getElementById('remote').innerHTML = game.remoteName;
           document.getElementById('host').innerHTML = game.hostName;
           updateBoard(parseBoard(gameboardT))
          
        }
    };
    xhttp.open("POST", "/games/initGame", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send();
    

    
}

function play(col) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let game = JSON.parse(this.responseText)
            if(game.winner){
                return;
            }

            alert('it is '+(game.board.redOrBlack == true?"red":"black")+"'s turn")
            console.log("game.board.redOrBlack = "+game.board.redOrBlack+"of type "+typeof(game.board.redOrBlack))
           let gameboardT = game.board.board;
           updateBoard(parseBoard(gameboardT))
        }
    };
    xhttp.open("PUT", "/games/play?col="+col, true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send();
    
}

function parseBoard(gameboardT){
    let gameboard = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0]
    ];
    gameboardT=gameboardT.reverse();

    for (let index = 0; index < gameboardT.length; index++) {
        for (let jndex = 0; jndex < gameboardT[0].length; jndex++) {
            if(gameboardT[index][jndex] == 1){

                gameboard[index][jndex]=1;

            }else if(gameboardT[index][jndex] == 2){
                gameboard[index][jndex]=2;

            }
        }
    }

    return gameboard;
}
function updateBoard(gameboard) {
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 7; col++) {
            if (gameboard[row][col] === 1) {
                document.getElementById('cell'+row+col).style.backgroundColor = '#FF0000';
            } else if (gameboard[row][col] === 2) {
                document.getElementById('cell'+row+col).style.backgroundColor = '#000000';
            }
        }
    }
}

function nextChessColor(col) {
    let row = -1;
    for (let i = 5; i >= 0; i--) {
        if (gameboard[i][col] === 0) {
            row = i;
            break;
        }
    }
}


