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
    
    loadLeaderboard();
});

// 🛠 Game Logic
const starWarsNames = [...];  // Keep the full list here
const baseballNames = [...];  // Keep the full list here

let namePool = [];
let playerName = "";
let score = 0;
let sicnarfModeUnlocked = false;

function startGame() {
    console.log("🎮 startGame() called.");

    playerName = document.getElementById("player-name").value.trim();
    if (playerName === "") {
        console.warn("⚠️ No name entered! Stopping game start.");
        alert("Please enter your name!");
        return;
    }

    console.log(`🎯 Player Name Entered: ${playerName}`);

    document.getElementById("name-entry").style.display = "none";
    document.getElementById("game").style.display = "block";

    shuffleNames();
    setNewQuestion();
}

function shuffleNames() {
    console.log("🔄 shuffleNames() called.");
    namePool = [...starWarsNames, ...baseballNames];
    for (let i = namePool.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [namePool[i], namePool[j]] = [namePool[j], namePool[i]];
    }
    console.log("✅ Names shuffled. Total names:", namePool.length);
}

function getRandomName() {
    if (namePool.length === 0) {
        console.log("⚠️ No more names left, ending game.");
        submitScore();  // Submit final score when game ends
        return "GAME OVER";
    }
    return namePool.pop();
}

function makeGuess(choice) {
    console.log(`🧐 makeGuess() called. Player chose: ${choice}`);

    let currentName = document.getElementById("question").textContent;
    if (!currentName || currentName === "GAME OVER") {
        console.error("❌ Error: No name displayed or game over!");
        return;
    }

    let isStarWars = starWarsNames.includes(currentName);
    let isBaseball = baseballNames.includes(currentName);

    let correctAnswer = isStarWars ? "starwars" : "baseball";

    if (choice === "sicnarf") {
        let isCorrect = Math.random() < 0.5;
        document.getElementById("result").textContent = isCorrect ? "🔥 SICNARF!" : "❌ SICNARF?!";
        if (isCorrect) score++;
    } else if (choice === correctAnswer) {
        document.getElementById("result").textContent = "✅ Correct!";
        score++;

        if (currentName === "Sicnarf Loopstok" && choice === "baseball" && !sicnarfModeUnlocked) {
            console.log("🎉 Sicnarf Mode Unlock Condition MET!");
            sicnarfModeUnlocked = true;
            activateSicnarfMode();
        }
    } else {
        document.getElementById("result").textContent = "❌ Incorrect!";
    }

    document.getElementById("score").textContent = `Score: ${score}`;

    setTimeout(() => {
        setNewQuestion();
        document.getElementById("result").textContent = "";
    }, 500);
}

function activateSicnarfMode() {
    console.log("🔥 SICNARF LOOPSTOK MODE UNLOCKED 🔥");

    let modeMessage = document.createElement("h1");
    modeMessage.innerHTML = "🔥 SICNARF LOOPSTOK MODE UNLOCKED 🔥";
    modeMessage.style.color = "red";
    modeMessage.style.textAlign = "center";
    modeMessage.style.fontSize = "2em";
    modeMessage.style.textShadow = "3px 3px 5px yellow";
    document.getElementById("game-container").prepend(modeMessage);

    confetti({
        particleCount: 200,
        spread: 90,
        origin: { y: 0.6 }
    });

    document.body.style.backgroundImage = "url('sicnarf.jpeg')";
    document.body.style.backgroundSize = "cover";

    if (!document.getElementById("sicnarf-button")) {
        let sicnarfButton = document.createElement("button");
        sicnarfButton.id = "sicnarf-button";
        sicnarfButton.textContent = "Sicnarf Loopstok";
        sicnarfButton.onclick = () => makeGuess("sicnarf");
        sicnarfButton.style.background = "red";
        sicnarfButton.style.color = "gold";
        sicnarfButton.style.fontWeight = "bold";
        sicnarfButton.style.marginTop = "10px";
        document.getElementById("buttons").appendChild(sicnarfButton);
    }
}

function setNewQuestion() {
    let newName = getRandomName();
    document.getElementById("question").textContent = newName;

    if (newName === "GAME OVER") {
        document.getElementById("buttons").style.display = "none";
        document.getElementById("result").textContent = "You've seen all names!";
    } else {
        document.getElementById("buttons").style.display = "block";
    }
}

// 🏆 Submit Score to Firebase
function submitScore() {
    console.log(`📊 Submitting Score: ${playerName} - ${score}`);
    if (!db) {
        console.error("🔥 Firebase database not initialized.");
        return;
    }

    db.collection("leaderboard").add({
        name: playerName,
        score: score,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        console.log("✅ Score submitted!");
        loadLeaderboard();
    }).catch(error => {
        console.error("🔥 Error submitting score:", error);
    });
}

// 🏆 Load & Display Leaderboard
function loadLeaderboard() {
    console.log("📊 Loading leaderboard...");

    if (!db) {
        console.error("🔥 Firebase database not initialized.");
        return;
    }

    let leaderboardList = document.getElementById("leaderboard");
    leaderboardList.innerHTML = "";

    db.collection("leaderboard")
        .orderBy("score", "desc")
        .limit(5)  // Show only top 5 scores
        .get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                let entry = document.createElement("li");
                let data = doc.data();
                entry.textContent = `${data.name}: ${data.score}`;
                leaderboardList.appendChild(entry);
            });
            console.log("✅ Leaderboard updated.");
        })
        .catch(error => {
            console.error("🔥 Error loading leaderboard:", error);
        });
}
