// Buttons
var startBtn = document.querySelector("#start");
var closeBtn = document.querySelector(".close");
var saveBtn = document.querySelector("#save");

//Quiz stuff
var questionaireDiv = document.querySelector("#questions");
var currentQuestion = document.querySelector("#currentQuestion");
var optionsDiv = document.querySelector("#optionsDiv");
var optionsUl = document.querySelector("#optionsUl");
var index = -1;
var userChoices;
var quiz = [
    {
        question: "What is the shorthand for JavaScript?",
        choices: ["Java", "JS", "Javascript", "Ecmascript"],
        answer: "JS"
    },
    {
        question: "What is OOP?",
        choices: ["Object-oriented programming", "an oopsy", "opting out", "oreo or peppers"],
        answer: "Object-oriented programming"
    },
    {
        question: "What is the DOM?",
        choices: ["Dropout Men", "Document Object Model", "dude ok man", "dogs on me"],
        answer: "Document Object Model"
    },
];

// High Scores Lists
var leaderBoardList = document.querySelector("#leaderBoardList");
var enterName = document.querySelector("#enterName");
var leaderBoardlink = document.querySelector("#leaderBoardLink");
var modalEl = document.querySelector("#modal-container");
var modalNameEl = document.querySelector("#modal-name");
var leaderBoardForm = document.querySelector("#leaderBoardForm");
var leaderBoard = [];

// Timer and score declarations.
var timer = document.getElementById("timer");
var currentTimer = 60;
var timesUp = document.querySelector("#timesup");
timesUp.style.display = "none";
var score = 0;

//Starts Timer.
function startTimer(event) {
    event.preventDefault()
    startBtn.style.display = "none";
    modalEl.style.display = "none";
    leaderBoardlink.style.display = "none";

    var timeInterval = setInterval(function () {
        timer.textContent = "Time: " + currentTimer;
        currentTimer--;

        if (currentTimer === 0 || currentTimer < 0) {
            timer.textContent = "";
            timesUp.style.display = "block";
            leaderBoardlink.style.display = "none";
            currentQuestion.textContent = "";
            optionsUl.style.display = "none";
            startBtn.style.display = "block";
            startBtn.textContent = "Try Again";
            startBtn.addEventListener("click", function (event) {
                window.location.reload();
            });
            clearInterval(timeInterval);
        } else if (index > quiz.length - 1) {
            timer.textContent = "";
            init();
            clearInterval(timeInterval);
        }

    }, 1000);
    startQuiz(1);
}

//Starts quiz and displays questions.
function startQuiz(direction) {

    index += direction;
    currentQuestion.textContent = "";
    optionsUl.innerHTML = "";
    optionsUl.style.listStyleType = "none";
    currentQuestion.textContent = quiz[index].question;
    userChoices = quiz[index].choices;

    userChoices.forEach(function (option) {
        var optionsLi = document.createElement("li");
        optionsLi.style.padding = "5px";
        var optionBtn = document.createElement("button");
        optionBtn.style.width = "300px";
        optionBtn.style.height = "50px";
        optionsLi.appendChild(optionBtn);
        optionBtn.textContent = option;
        optionsDiv.appendChild(optionsUl);
        optionsUl.appendChild(optionsLi);
        optionsLi.addEventListener("click", (checkAnswer));
    });
}

//Checks answers.
function checkAnswer(event) {
    var element = event.target;
    if (element.textContent === quiz[index].answer) {
        score++;
        alert("CORRECT! Score: " + score);
        startQuiz(1);
    } else {
        alert("WRONG! -10 seconds!");
        currentTimer -= 10;
        startQuiz(1);
    }
    if (index > quiz.length - 1) {
        init();
    }
}

//Opens High scores.
function init() {
    modalEl.style.display = "block";

    var storedleaderBoard = JSON.parse(localStorage.getItem("leaderBoard"));

    if (storedleaderBoard) {
        storedleaderBoard.sort(function(a,b){
            return b.score - a.score; });
        leaderBoard = storedleaderBoard;
    }
    renderleaderBoard();
}

//grabs scores from local storage.
function renderleaderBoard() {
    leaderBoardList.innerHTML = "";

    for (var i = 0; i < leaderBoard.length; i++) {
        var currentIndex = leaderBoard[i];
        var li = document.createElement("li");
        li.textContent = currentIndex.initials + ": " + currentIndex.score;
        leaderBoardList.appendChild(li);
    }
}

//Saves score to local storage.
function storeleaderBoard() {
    localStorage.setItem("leaderBoard", JSON.stringify(leaderBoard));
}

//High score button. Display High scores.
leaderBoardlink.addEventListener("click", function (event) {
    event.preventDefault();
    event.stopPropagation();
    init();
    modalEl.style.display = "block";
    currentQuestion.textContent = "";
    startBtn.style.display = "none";
    timer.textContent = "";
    optionsUl.style.display = "none";
    saveBtn.style.display = "none";
    enterName.style.display = "none";
});

//Closes High scores.
function close() {
    modalEl.style.display = "none";
    index = 0;
    startBtn.style.display = "block";
    currentTimer = 60;
    window.location.reload("refresh");
}

//Saves user name and score.
saveBtn.addEventListener("click", function (event) {
    event.preventDefault();
    console.log(leaderBoard);
    if (!enterName.value ) {
        alert("Enter Your Name");
    } else {
        var userScore = {
            initials: enterName.value,
            score: score
        };
        enterName.value = "";
        leaderBoard.push(userScore);
        storeleaderBoard();
        renderleaderBoard();
    }
    modalEl.style.display = "none";
    window.location.reload("refresh");
});
closeBtn.addEventListener("click", close);
startBtn.addEventListener("click", startTimer);
