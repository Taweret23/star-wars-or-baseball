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

// Wait for Firebase to fully load before running game logic
document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ DOM fully loaded. Initializing Firebase...");
    
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    console.log("✅ Firebase initialized successfully.");
});

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
    
    // 🎉 Confetti Explosion 🎉
    confetti({
        particleCount: 200,
        spread: 90,
        origin: { y: 0.6 } // Confetti falls from the top
    });

    // Change background to Sicnarf's image
    document.body.style.backgroundImage = "url('sicnarf.jpeg')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";

    // Change text color for better contrast
    document.getElementById("game-container").style.color = "gold";
    document.getElementById("game-container").style.textShadow = "3px 3px 5px red";

    // Add flashing Sicnarf message
    let message = document.createElement("h1");
    message.textContent = "🔥 SICNARF LOOPSTOK MODE UNLOCKED 🔥";
    message.style.color = "red";
    message.style.fontSize = "2em";
    message.style.textAlign = "center";
    message.style.animation = "flash 1s infinite alternate";
    
    document.getElementById("game-container").prepend(message);

    // Add flashing effect to text
    let style = document.createElement("style");
    style.innerHTML = `
        @keyframes flash {
            from { opacity: 1; }
            to { opacity: 0.5; }
        }
    `;
    document.head.appendChild(style);
}


function setNewQuestion() {
    let newName = getRandomName();
    if (!newName) {
        document.getElementById("question").textContent = "Error loading name.";
        return;
    }
    document.getElementById("question").textContent = newName;
}
