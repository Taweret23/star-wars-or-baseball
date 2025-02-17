console.log("🔥 Script Loaded: No Firebase, No Leaderboard");

// Names List
const starWarsNames = [
  "Beldorion Dour", "Dannik Jerriko", "BoShek Aalto", "Ponda Baba", "Greef Karga", 
  "Armitage Hux", "Quarsh Panaka", "Oppo Rancisis", "Jaxxon Toth", "Toryn Farr"
];

const baseballNames = [
  "Sicnarf Loopstok", "Rock Shoulders", "Stubby Clap", "Oil Can Boyd", "Ten Million"
];

let namePool = [];
let score = 0;
let gameOver = false;

function startGame() {
  console.log("🎮 Game started.");
  gameOver = false;

  document.getElementById("name-entry").style.display = "none"; 
  document.getElementById("game").style.display = "block";
  document.getElementById("buttons").style.display = "block";

  namePool = [...starWarsNames, ...baseballNames];
  shuffleNames();
  setNewQuestion();
}

function shuffleNames() {
  namePool.sort(() => Math.random() - 0.5);
}

function getRandomName() {
  if (namePool.length === 0) {
    endGame();
    return null;
  }
  return namePool.pop();
}

function setNewQuestion() {
  let newName = getRandomName();
  if (!newName) return;
  document.getElementById("question").textContent = newName;
}

function makeGuess(choice) {
  if (gameOver) return;

  let currentName = document.getElementById("question").textContent;
  let isStarWars = starWarsNames.includes(currentName);
  let correctAnswer = isStarWars ? "starwars" : "baseball";

  if (choice === correctAnswer) {
    document.getElementById("result").textContent = "✅ Correct!";
  } else {
    document.getElementById("result").textContent = "❌ Incorrect!";
  }

  setTimeout(() => {
    document.getElementById("result").textContent = "";
    setNewQuestion();
  }, 1000);
}

function endGame() {
  gameOver = true;
  document.getElementById("question").textContent = "Game Over!";
  document.getElementById("buttons").style.display = "none";
}
