console.log("🔥 Script Loaded: Checking Firebase Setup");

// 🔥 Firebase Setup
const firebaseConfig = {
    apiKey: "AIzaSyCgPtyZxO8I_tbHRYu8ZP87E5_n5vGagUs",
    authDomain: "star-wars-or-baseball.firebaseapp.com",
    projectId: "star-wars-or-baseball",
    storageBucket: "star-wars-or-baseball.appspot.com",
    messagingSenderId: "578105943516",
    appId: "1:578105943516:web:1a23e14116694499fb5b19"
};

let db;
document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ DOM fully loaded. Initializing Firebase...");
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    console.log("✅ Firebase initialized successfully.");
});

const starWarsNames = [...]; // (Your existing list)
const baseballNames = [...]; // (Your existing list)

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

function makeGuess(choice) {
    if (gameOver) return;

    console.log(`🧐 makeGuess() called. Player chose: ${choice}`);

    let currentName = document.getElementById("question").textContent;
    if (!currentName) {
        console.error("❌ Error: No name displayed!");
        return;
    }

    let isStarWars = starWarsNames.includes(currentName);
    let isBaseball = baseballNames.includes(currentName);
    let correctAnswer = isStarWars ? "starwars" : "baseball";

    if (choice === correctAnswer) {
        console.log("✅ Correct!");
        document.getElementById("result").textContent = "✅ Correct!";
        score++;

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

    confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 } });

    document.body.style.backgroundImage = "url('sicnarf.jpeg')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";

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

function setNewQuestion() {
    let newName = getRandomName();
    if (!newName) {
        endGame();
        return;
    }
    document.getElementById("question").textContent = newName;
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
      .add({ name, score, timestamp: firebase.firestore.FieldValue.serverTimestamp() })
      .then(() => console.log("Score submitted!"))
      .catch((error) => console.error("Error submitting score: ", error));
}
