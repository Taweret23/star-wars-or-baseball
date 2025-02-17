console.log("🔥 Script Loaded: Checking Firebase Setup");

// 🔥 Firebase Setup (using compat libraries)
const firebaseConfig = {
  apiKey: "AIzaSyCgPtyZxO8I_tbHRYu8ZP87E5_n5vGagUs",
  authDomain: "star-wars-or-baseball.firebaseapp.com",
  projectId: "star-wars-or-baseball",
  storageBucket: "star-wars-or-baseball.appspot.com",
  messagingSenderId: "578105943516",
  appId: "1:578105943516:web:1a23e14116694499fb5b19"
};

let db;

// Initialize Firebase once the DOM is fully loaded.
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM fully loaded. Initializing Firebase...");
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
  console.log("✅ Firebase initialized successfully.");
  
  // Start listening for leaderboard updates in real-time.
  updateLeaderboard();
});

// Function to update leaderboard in real-time.
function updateLeaderboard() {
  db.collection("leaderboard")
    .orderBy("score", "desc")
    .limit(10) // Limit to top 10 scores (optional)
    .onSnapshot((snapshot) => {
      const leaderboardElement = document.getElementById("leaderboard");
      leaderboardElement.innerHTML = ""; // Clear existing list

      snapshot.forEach((doc) => {
        const data = doc.data();
        const li = document.createElement("li");
        li.textContent = `${data.name} - ${data.score}`;
        leaderboardElement.appendChild(li);
      });
    }, (error) => {
      console.error("Error updating leaderboard:", error);
    });
}

// Lists for names
const starWarsNames = [
  "Beldorion Dour", "Dannik Jerriko", "BoShek Aalto", "Ponda Baba", "Greef Karga", 
  "Armitage Hux", "Quarsh Panaka", "Oppo Rancisis", "Jaxxon Toth", "Toryn Farr",
  "Ransolm Casterfo", "Vober Dand", "Therm Scissorpunch", "Lobot Kryze", "Bib Fortuna",
  "Dexter Jettster", "Wilhuff Tarkin", "Sio Bibble", "Elan Sleazebaggano", "Momaw Nadon",
  "Pre Vizsla", "Salacious Crumb", "Tion Medon", "Rako Hardeen", "Baze Malbus", 
  "Cassian Andor", "Enric Pryde", "Shara Bey", "Carlist Rieekan", "Garven Dreis",
  "Biggs Darklighter", "Bodhi Rook", "Larma D'Acy", "Hurst Romodi", "Kendal Ozzel",
  "Maximilian Veers", "Piett Firmus", "Tasu Leech", "Bolla Ropal"
];

const baseballNames = [
  "Sicnarf Loopstok", "Rock Shoulders", "Stubby Clap", "Oil Can Boyd", "Ten Million", 
  "Bumpus Jones", "Jot Goar", "Ducky Hemp", "Egyptian Healy", "Welcome Gaston", 
  "Dick Such", "Dick Burns", "Oyster Burns", "Icicle Reeder", "Dick Hunt",
  "Candy Cummings", "Al Kaline", "Tuffy Gosewisch", "Lady Baldwin", "Pussy Tebeau",
  "Jigger Statz", "The Only Nolan", "Count Sensenderfer", "King Lear", "Lil Stoner",
  "Dizzy Trout", "Mysterious Walker", "Catfish Hunter", "Pete LaCock", "Johnny Dickshot",
  "Coco Crisp", "Dick Pole", "Pickles Dilhoeffer", "Razor Shines", "Tim Spooneybarger",
  "Boof Bonser", "Milton Bradley", "Chicken Wolf", "Cannonball Titcomb", "Orval Overall"
];

let namePool = [];
let playerName = "";
let score = 0;
let sicnarfModeUnlocked = false;
let gameOver = false;

function startGame() {
  console.log("🎮 startGame() called.");
  gameOver = false;

  playerName = document.getElementById("player-name").value.trim();
  if (playerName === "") {
    console.warn("⚠️ No name entered! Stopping game start.");
    alert("Please enter your name!");
    return;
  }
  console.log(`🎯 Player Name Entered: ${playerName}`);

  document.getElementById("name-entry").style.display = "none";
  document.getElementById("game").style.display = "block";
  document.getElementById("buttons").style.display = "block";

  // Reset and shuffle names.
  namePool = [...starWarsNames, ...baseballNames];
  shuffleNames();
  console.log("🎲 Names shuffled. Total names:", namePool.length);

  setNewQuestion();
}

function shuffleNames() {
  console.log("🔄 shuffleNames() called.");
  namePool.sort(() => Math.random() - 0.5);
}

function getRandomName() {
  if (namePool.length === 0) {
    console.log("⚠️ No more names left, ending game.");
    endGame();
    return null;
  }
  return namePool.pop();
}

function setNewQuestion() {
  let newName = getRandomName();
  if (!newName) {
    // endGame() has been triggered in getRandomName.
    return;
  }
  document.getElementById("question").textContent = newName;
}

function makeGuess(choice) {
  if (gameOver) return;

  console.log(`🧐 makeGuess() called. Player chose: ${choice}`);
  let currentName = document.getElementById("question").textContent;
  if (!currentName) {
    console.error("❌ Error: No name displayed!");
    return;
  }

  let isStarWars = starWarsNames.includes(currentName);
  let correctAnswer = isStarWars ? "starwars" : "baseball";

  if (choice === correctAnswer) {
    console.log("✅ Correct!");
    document.getElementById("result").textContent = "✅ Correct!";
    score++;

    // Activate Sicnarf mode if conditions are met.
    if (currentName === "Sicnarf Loopstok" && choice === "baseball" && !sicnarfModeUnlocked) {
      activateSicnarfMode();
    }
  } else {
    console.log("❌ Incorrect!");
    document.getElementById("result").textContent = "❌ Incorrect!";
  }
  document.getElementById("score").textContent = `Score: ${score}`;

  setTimeout(() => {
    document.getElementById("result").textContent = "";
    setNewQuestion();
  }, 1000);
}

function activateSicnarfMode() {
  sicnarfModeUnlocked = true;
  console.log("🔥 SICNARF LOOPSTOK MODE UNLOCKED 🔥");

  // Launch confetti effect.
  confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 } });

  // Change background to Sicnarf-themed image.
  document.body.style.backgroundImage = "url('sicnarf.jpeg')";
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";

  // Create and add a special button for Sicnarf mode.
  let sicnarfButton = document.createElement("button");
  sicnarfButton.textContent = "Sicnarf Loopstok";
  sicnarfButton.style.backgroundColor = "red";
  sicnarfButton.style.color = "yellow";
  sicnarfButton.onclick = () => makeSicnarfGuess();
  document.getElementById("buttons").appendChild(sicnarfButton);
}

function makeSicnarfGuess() {
  if (gameOver) return;

  let randomOutcome = Math.random() > 0.5 ? "✅ SICNARF!" : "❌ SICNARF!";
  document.getElementById("result").textContent = randomOutcome;

  if (randomOutcome.includes("✅")) {
    score++;
  }
  document.getElementById("score").textContent = `Score: ${score}`;

  setTimeout(() => {
    document.getElementById("result").textContent = "";
    setNewQuestion();
  }, 1000);
}

function endGame() {
  gameOver = true;
  document.getElementById("question").textContent = "Game Over! You've seen every name.";
  document.getElementById("buttons").style.display = "none";
  document.getElementById("result").textContent = `Final Score: ${score}`;
  submitScore(playerName, score);
}

function submitScore(name, score) {
  db.collection("leaderboard")
    .add({
      name,
      score,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => console.log("Score submitted!"))
    .catch((error) => console.error("Error submitting score: ", error));
}
