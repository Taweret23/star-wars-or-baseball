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

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 🛠 Game Logic
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
    
    playerName = document.getElementById("player-name").value.trim();
    if (playerName === "") {
        console.warn("⚠️ No name entered! Stopping game start.");
        alert("Please enter your name!");
        return;
    }

    console.log(`🎯 Player Name Entered: ${playerName}`);

    document.getElementById("name-entry").style.display = "none";
    document.getElementById("game").style.display = "block";

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
        return "";
    }
    return namePool.pop();
}

function makeGuess(choice) {
    if (gameOver) return; // Prevents scoring after game ends

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

        // 🏆 Sicnarf Loopstok Mode Unlock Condition
        if (currentName === "Sicnarf Loopstok" && choice === "baseball" && !sicnarfModeUnlocked) {
            sicnarfModeUnlocked = true;
            activateSicnarfMode();
        }
    } else {
        console.log("❌ Incorrect!");
        document.getElementById("result").textContent = "❌ Incorrect!";
    }

    document.getElementById("score").textContent = `Score: ${score}`;

    setTimeout(() => {
        setNewQuestion();
        document.getElementById("result").textContent = "";
    }, 1000);
}

function activateSicnarfMode() {
    console.log("🔥 SICNARF LOOPSTOK MODE UNLOCKED 🔥");

    confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 } });

    document.body.style.backgroundImage = "url('sicnarf.jpeg')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";

    document.getElementById("game-container").style.color = "gold";
    document.getElementById("game-container").style.textShadow = "3px 3px 5px red";

    let message = document.createElement("h1");
    message.textContent = "🔥 SICNARF LOOPSTOK MODE UNLOCKED 🔥";
    message.style.color = "red";
    message.style.fontSize = "2em";
    message.style.textAlign = "center";
    message.style.animation = "flash 1s infinite alternate";
    
    document.getElementById("game-container").prepend(message);

    let sicnarfButton = document.createElement("button");
    sicnarfButton.textContent = "Sicnarf Loopstok";
    sicnarfButton.style.backgroundColor = "red";
    sicnarfButton.style.color = "yellow";
    sicnarfButton.onclick = () => makeSicnarfGuess();

    document.getElementById("buttons").appendChild(sicnarfButton);

    let style = document.createElement("style");
    style.innerHTML = `
        @keyframes flash {
            from { opacity: 1; }
            to { opacity: 0.5; }
        }
    `;
    document.head.appendChild(style);
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
        setNewQuestion();
        document.getElementById("result").textContent = "";
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
    db.collection("leaderboard").add({ name, score, timestamp: firebase.firestore.FieldValue.serverTimestamp() });
}
