let speed = 7;
let run;
let sound = true;
let gameboard = document.querySelector(".game-board");
let gamebuttons = document.querySelectorAll(".game-buttons button")

let scoreCount = 0;
let score = document.querySelector(".score");

let soundon = document.querySelector("#on");
let soundoff = document.querySelector("#off");
const foodbitesound = new Audio('EatBiteSound.mp3');
const gameoversound = new Audio('GameOverSound.mp3');

let foodX , foodY;
let snakeX = 10 , snakeY = 10;
let snakeArr = [];
let velocityX = 0 , velocityY = 0;



// Different functions to run game


// Game-Over
let gameover = () => {

    if(sound == true){
        foodbitesound.pause();
        gameoversound.play();
    }

    clearInterval(run);
    window.alert("Game-Over...Press ok to play again");
    location.reload();
}

// change food locations
let changefood = () => {
    foodX = Math.floor(Math.random()*20)+1 ;
    foodY = Math.floor(Math.random()*20)+1 ;
}



// change direction of snake head

let changedirection = (e) => {
    if(e.key == "ArrowDown" && velocityY != -1 ){
        velocityX = 0;
        velocityY = 1;
    }
    if(e.key == "ArrowUp" && velocityY != 1 ){
        velocityX = 0;
        velocityY = -1;
    }
    if(e.key == "ArrowLeft" && velocityX != 1 ){
        velocityX = -1;
        velocityY = 0;
    }
    if(e.key == "ArrowRight" && velocityX != -1 ){
        velocityX = 1;
        velocityY = 0;
    }
}

gamebuttons.forEach((key) => {
    key.addEventListener("click", () => {
        changedirection({ key : key.dataset.key });
    })
})

// Sound : On / Off
document.getElementById("off").style.display='none';

soundoff.addEventListener("click",()=>{
    sound = true; 
    document.getElementById("on").style.display='block';
    document.getElementById("off").style.display='none';
});
soundon.addEventListener("click",()=>{
    sound = false;
    document.getElementById("on").style.display='none';
    document.getElementById("off").style.display='block';
});



// In Game Things
const gameEngine = () => {

    // Adding first food element
    gameboard.innerHTML = `<div class="food" style="grid-area: ${foodY} / ${foodX};"></div>`;

    // Updating snake head position acordingly with velocity
    snakeX += velocityX; 
    snakeY += velocityY;

    // Game-Over : if snake hit walls
    if( snakeX<1 || snakeX>20 || snakeY<1 || snakeY>20 ){
        gameover();
    }

    // Eating food process
    if(snakeX == foodX && snakeY == foodY){
        
        if(sound == true){
            foodbitesound.play();
        }

        // Scoring process
        scoreCount += 1;
        score.innerHTML = `Score : ${scoreCount}`;

        changefood();   // Change food location

        snakeArr.push([foodX,foodY]);   // Add body-part after eating food

    }

    // Shifting values of body part one by one
    for(let i = snakeArr.length - 1 ; i > 0 ; i-- ){
        snakeArr[i] = snakeArr[i-1];
    }

    // Setting first element of snake Array to current position
    snakeArr[0] = [snakeX , snakeY];


    for(let i=0 ; i < snakeArr.length ; i++ ){
        // Add div for each body part after eating
        gameboard.innerHTML += `<div class="snake" style="grid-area: ${snakeArr[i][1]} / ${snakeArr[i][0]};"></div>`;

        // Game-Over : snake hit his own boady or not
        if( snakeArr[i][1]==snakeArr[0][1] && snakeArr[i][0]==snakeArr[0][0] && i!=0 ){
            gameover();
        }
    }

}



// Exicution things
changefood();
run = setInterval(gameEngine,(1000/speed));
document.addEventListener("keydown",changedirection);
