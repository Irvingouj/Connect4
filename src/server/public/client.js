// const { ALPN_ENABLED } = require("constants");

//Profile Page
function loadProfile(){
    // alert('load Profile is called')
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        // alert(this.status)
        if (this.readyState == 4 && this.status == 200){ 
            let user = JSON.parse(this.responseText);
            // console.log(user)
            // alert(user)
            let name = document.getElementById('name');
            let numGame = document.getElementById('numGame');
            let winP = document.getElementById('winPercentage')
            name.innerText = 'Player name:'+user.userName;
            numGame.innerText = 'Total number of game played:'+user.numGame;
            winP.innerText = 'Win percentage:'+user.winPercentage+'%'  

            let gameList = user.gameHistory;
            let listRoot = document.getElementById("matchHistory")

            for (let index = 0; index < gameList.length; index++) {
                let game = gameList[index];
                let node = createListElement(game.hostName,game.remoteName,game._id)
                listRoot.appendChild(node)
            }
            
        }
    }
    xhttp.open("GET", "/users/loadProfile",true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(); 
}

function createListElement(hostName,remoteName,id){
    var newNode=document.createElement("li");
    newNode.setAttribute("class","history");
    newNode.setAttribute("id",id)
    
    var newLeftImage = document.createElement("img");
    newLeftImage.setAttribute("src","video_game_icon-01.png")
    newLeftImage.setAttribute("alt","icon")
    newLeftImage.setAttribute("class","historyLeft");

    var newRightImage = document.createElement("img");
    newRightImage.setAttribute("src","video_game_icon-01.png")
    newRightImage.setAttribute("alt","icon")
    newRightImage.setAttribute("class","historyRight");

    var text = document.createElement("p")

    text.innerText = hostName +" vs "+remoteName;
    
   
    newNode.appendChild(newLeftImage);
    newNode.appendChild(text);
    newNode.appendChild(newRightImage)
   
    return newNode;
}


function viewProfile(id){
    var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                    alert('connecting with user with id='+id)
                    window.location.replace("profile.html");
            }
        }
        xhttp.open("GET", "/users/viewProfile?id="+id,true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.send();

}
const image = "video_game_icon-01.png"

// welcome and login page
// here is two basic example of How I use AJAX,used for log-in a
function signIn(){
    let userName = document.getElementById('Account').value;
    let passwd = document.getElementById('pwd').value;
    if(userName.length < 3 || passwd.length < 3){
        alert('not valid input for account or password')
        return;
    }
    let out = JSON.stringify({account : userName,password:passwd});

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            UserId = this.responseText;
            alert(' you will sign in as '+UserId)
            location.href = './profile.html?id='+UserId;

        }else if(this.readyState == 4&&
            (this.status == 400 || this.status == 404)){
            alert(this.responseText);
        }
    };
    xhttp.open("POST", "/signIn", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(out);
}

function signUp(){
    
    let userName = document.getElementById('Account').value;
    let passwd = document.getElementById('pwd').value;
    // alert("passwd is "+passwd)
    if(userName.length < 3 || passwd.length < 3){
        alert('not valid input for account or password')
        return;
    }
    let out = JSON.stringify({account : userName,password:passwd});


    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert("signUp Sucessfully, id = "+ this.responseText)
            location.href = "./userAccountPage.html";
        }
    };
    xhttp.open("POST", "/signUp", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(out);

}



// user profile page
function startGame(){
    window.open("gamePage.html")
  }

function privateCheck(){

}


// friend function
   
    

    //remove a friend with query parameter friendId=id
    function remove(id){

        //remove all friends in the list
        var friend=document.getElementById(id);
        let node = friend.parentNode;
        while (node.firstChild) {
            node.removeChild(node.lastChild);
        }

        //send remove friends request
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
               alert(this.responseText);
            }
        };
        xhttp.open("DELETE", "/friends?friendsId="+id, true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.send();
       
        //read all friends in the list
        addFriendWithAJAX()




    }
    function refuse(id){
        //remove all friends in the list
        var friend=document.getElementById(id);
        let node = friend.parentNode;
        while (node.firstChild) {
            node.removeChild(node.lastChild);
        }

        //send remove friends request
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
               alert(this.responseText);
            }
        };
        xhttp.open("DELETE", "/friends/pending?friendsId="+id, true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.send();
       
        //read all friends in the list
        addPendingFriendWithAJAX()

    }
    function accept(id){
        //remove all friends in friends list
        var node=document.getElementById("exsitingFriends");
        while (node.firstChild) {
            node.removeChild(node.lastChild);
        }

        //remove all friends in pending friends list
        var friend=document.getElementById(id);
        let node2 = friend.parentNode;
        while (node2.firstChild) {
            node2.removeChild(node2.lastChild);
        }

        //send the add friend request
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
               alert(this.responseText);
            }
        };
        xhttp.open("PUT", "/friends/pending?friendsId="+id, true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.send();
        

        // updates the list
        addPendingFriendWithAJAX()
        addFriendWithAJAX()


        
    }

    function createNewSearchFriend(img,name,onOrOff,id){
        var newNode=document.createElement("li");
        newNode.setAttribute("class","friend")
        newNode.setAttribute("id",id);

        var newImage=document.createElement("img");
        newImage.setAttribute("src",img)
        newImage.setAttribute("class","friend")
        

        var newDiv=document.createElement("div");
        newDiv.setAttribute("class","name")
        newDiv.innerHTML=name;

        var newButton=document.createElement("button");
        newButton.innerHTML="add";
        newButton.addEventListener("click",function(){
            sendFriendRequest(newNode.id);
        });

        var newPara=document.createElement("p");
        newPara.innerHTML=onOrOff;

        newNode.appendChild(newImage);
        newDiv.appendChild(newButton);
        newDiv.appendChild(newPara);
        newNode.appendChild(newDiv);

        return newNode;
    }
    

    function startGameWithFriend(friendId){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            // alert('load Game is recived')
                if (this.readyState == 4 && this.status == 200) {
                    alert(this.responseText);
                    window.location.href = "gamePage.html";
                }else if(this.readyState == 4 && this.status == 400){
                    alert(this.responseText);
                }
        };
        xhttp.open("GET", "/friends/startGame?friendId="+friendId, true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.send();

    }

    function createNewFriend(img,name,onOrOff, id){
        var newNode=document.createElement("li");
        newNode.setAttribute("class","friend")
        newNode.setAttribute("id",id);


        // newNode.addEventListener('click',()=>{
        //     startGameWithFriend(newNode.id)
        // }
            
        // )

        var newImage=document.createElement("img");
        newImage.setAttribute("src",img)
        newImage.setAttribute("class","friend")
        newImage.addEventListener("click",function(){
            viewProfile(newNode.id);
        })

        var newDiv=document.createElement("div");
        newDiv.setAttribute("class","name")
        newDiv.innerHTML=name;

        var newButton=document.createElement("button");
        newButton.innerHTML="remove";
        newButton.addEventListener("click",function(){
            remove(newNode.id);
        });
        var newButton2=document.createElement("button");
        newButton2.innerHTML="view";
        newButton2.addEventListener("click",function(){
            viewProfile(newNode.id);
        });
        var newButton3=document.createElement("button");
        newButton3.innerHTML="play";
        newButton3.addEventListener('click',()=>{
            startGameWithFriend(newNode.id)
        })

        var newPara=document.createElement("p");
        newPara.innerHTML=onOrOff?'online':'offline';

        
        newNode.appendChild(newImage);
        newDiv.appendChild(newButton);
        newDiv.appendChild(newButton2)
        newDiv.appendChild(newButton3)
        newDiv.appendChild(newPara);
        newNode.appendChild(newDiv);

        return newNode;
    }

    function createNewPendingFriend(img,name,onOrOff,id ){
        var newNode=document.createElement("li");
        newNode.setAttribute("class","friend")
        newNode.setAttribute("id",id);
        // pendingFriendCount++;


        var newImage=document.createElement("img");
        newImage.setAttribute("src",img)
        newImage.setAttribute("class","friend")
        newImage.addEventListener("click",function(){
            checkUserProfile(newNode.id);
        })

        var newDiv=document.createElement("div");
        newDiv.setAttribute("class","name")
        newDiv.innerHTML=name;

        var newButtonAccept=document.createElement("button");
        newButtonAccept.innerHTML="accept";
        newButtonAccept.addEventListener("click",function(){
            accept(newNode.id);
        });

        var newButtonRefuse=document.createElement("button");
        newButtonRefuse.innerHTML="refuse";
        newButtonRefuse.addEventListener("click",function(){
            refuse(newNode.id);
        })

        newNode.appendChild(newImage);
        newDiv.appendChild(newButtonAccept);
        newDiv.appendChild(newButtonRefuse);
        newNode.appendChild(newDiv);

        return newNode;
    }

    function addFriendWithAJAX(){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log(this.responseText)
                addFriend(JSON.parse(this.responseText));
            }
        };
        xhttp.open("GET", "/friends", true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.send();
    }

    function addFriend(list){
        var friendList=document.getElementById("exsitingFriends");
        for (let index = 0; index < list.length; index++) {

            let node=createNewFriend(
                image,
                list[index].userName,
                list[index].onOrOff,
                list[index]._id);
            
            friendList.appendChild(node);
        }
    }

    function addPendingFriendWithAJAX(){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                addPendingFriend(JSON.parse(this.responseText));
            }
        };
        xhttp.open("GET", "/friends/pending", true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.send();
    }
    function addPendingFriend(list){
        var friendList=document.getElementById("pendingFriend");
        for (let index = 0; index < list.length; index++) {
            let node=createNewPendingFriend(image,
                list[index].userName,
                list[index].onOrOff?'online':'offline',
                list[index]._id,
                );
            friendList.appendChild(node);
        }
    }

    function sendFriendRequest(id){
        alert("send friend request to "+id)
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                alert(this.responseText);
            }
        };
        xhttp.open("PUT", "/friends/friendRequest?friendsId="+id, true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.send();
    }

    function searchFriends(){
      
        let searchText = document.getElementById("searchBarFriend").value
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && 
                (this.status == 200 || this.status == 304)) {
                let userArr = JSON.parse(this.responseText);
                for (let index = 0; index < userArr.length; index++) {
                    let user = userArr[0]
                    let friend = createNewSearchFriend("video_game_icon-01.png",
                            user.userName,user.onOrOff?"Online":"Offline"
                            ,user._id)
                    let searchBox = document.getElementById("searchFriend")
                    searchBox.appendChild(friend)
                }
                
            }else if(this.status == 400){
                alert("no such a user")
            }
        };

        xhttp.open("GET", "/users?name="+searchText, true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.send();

    }

    function searchGame(){
        let searchText = document.getElementById("searchBarGame").value

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let gameBox = document.getElementById("searchGame");
                let list = JSON.parse(this.responseText)
                for (let index = 0; index < list.length; index++) {
                    let game = list[index]
                    gameBox.appendChild(createNewHistoryElement(game.host,game.remote,game._id))
                }
            }else if (this.status == 400){
                alert("cannot find such a game")
            }
        };
        xhttp.open("GET", "/games/search?name="+searchText, true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.send();

        
    }

    function checkUserProfile(id){
        location.href = './profile.html?id='+id
    }
        
    
    function friendsPageInit(){

        addFriendWithAJAX();
        addPendingFriendWithAJAX();
    }

// history page function
    function createNewHistoryElement(hostName,remoteName,id){
        var newNode=document.createElement("li");
        newNode.setAttribute("class","history");
        newNode.setAttribute("id",id)
        newNode.addEventListener("click",function(){
            //show information at gameResultInfoDiv
            displayHistory(newNode.id);
        })

        // var newPara = document.createElement("p");
        // newPara.innerHTML = id;

        var newLeftImage = document.createElement("img");
        newLeftImage.setAttribute("src","video_game_icon-01.png")
        newLeftImage.setAttribute("alt","icon")
        newLeftImage.setAttribute("class","historyLeft");

        var newRightImage = document.createElement("img");
        newRightImage.setAttribute("src","video_game_icon-01.png")
        newRightImage.setAttribute("alt","icon")
        newRightImage.setAttribute("class","historyRight");

        var text = document.createElement("p")

        text.innerText = hostName +" vs "+remoteName;
        
       
        newNode.appendChild(newLeftImage);
        newNode.appendChild(text);
        newNode.appendChild(newRightImage)
        // newNode.appendChild(newPara)

        return newNode;
    }

    function createNewActiveElement(hostName,remoteName,id){
        var newNode=document.createElement("li");
        newNode.setAttribute("class","history");
        newNode.setAttribute("id",id)
        newNode.addEventListener("click",function(){
            loadGame(newNode.id);
        })
        console.log('loadGame is loaded in')

        var newLeftImage = document.createElement("img");
        newLeftImage.setAttribute("src","video_game_icon-01.png")
        newLeftImage.setAttribute("alt","icon")
        newLeftImage.setAttribute("class","historyLeft");

        var newRightImage = document.createElement("img");
        newRightImage.setAttribute("src","video_game_icon-01.png")
        newRightImage.setAttribute("alt","icon")
        newRightImage.setAttribute("class","historyRight");

        var text = document.createElement("p")
        text.innerText = hostName +" vs "+ +" "+remoteName
        console.log( id.substring(20))
        
        newNode.appendChild(newLeftImage);
        newNode.appendChild(text);
        newNode.appendChild(newRightImage)

        return newNode;
    }

    function historyPageOnload(){
        let historyList = document.getElementById("historyList");
        let activeList = document.getElementById("activeList");

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let games = JSON.parse(this.responseText)

                for (let index = 0; index < games.length; index++) {
                    game = games[index];
                    let node = createNewHistoryElement(game.host,
                        game.remote,game.id)
                    if(game.isActive){
                        let node = createNewActiveElement(game.host,
                            game.remote,game.id)
                        activeList.appendChild(node)
                    }else{
                        let node = createNewHistoryElement(game.host,
                            game.remote,game.id)
                        historyList.appendChild(node)
                    }
                }
                
            }
        };
        xhttp.open("GET", "/games/userHistory", true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.send();
    }

    function displayHistory(id){
        let winner = document.getElementById("winner")
        let gameId = document.getElementById("gameId") 
        let numOfTurns = document.getElementById("numOfTurns")
        let steps = document.getElementById("steps")
        let para = document.getElementById("vsName")
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let game = JSON.parse(this.responseText);
                para.innerText = game.hostName+"  vs  "+game.remoteName
                winner.innerText = 'winner is '+game.winner;
                gameId.innerText = 'game id: '+game._id;
                numOfTurns.innerText = "total number of turns:"+game.step.length;
                steps.innerText = game.step;
            }
        };
        xhttp.open("GET", "/games/getWinner?id="+id, true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.send();
    }

    function loadGame(gameId){
        
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            // alert('load Game is recived')
                if (this.readyState == 4 && this.status == 200) {
                    alert(this.responseText);
                    window.location.href = "gamePage.html";
                }
        };
        xhttp.open("GET", "/games/connectGame?gameId="+gameId, true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.send();
    }


    


