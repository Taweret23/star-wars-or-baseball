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

let playerName = "";
let score = 0;
let sicnarfModeUnlocked = false;

// 🔥 Firebase Setup
const firebaseConfig = {
    apiKey: "AIzaSyCgPtyZxO8I_tbHRYu8ZP87E5_n5vGagUs",
    authDomain: "star-wars-or-baseball.firebaseapp.com",
    projectId: "star-wars-or-baseball",
    storageBucket: "star-wars-or-baseball.appspot.com",
    messagingSenderId: "578105943516",
    appId: "1:578105943516:web:1a23e14116694499fb5b19"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function startGame() {
    playerName = document.getElementById("player-name").value.trim();
    if (playerName === "") {
        alert("Please enter your name!");
        return;
    }

    document.getElementById("name-entry").style.display = "none";
    document.getElementById("game").style.display = "block";

    shuffleNames(); // Force shuffle before first question
    console.log("Game started. Names shuffled:", namePool); // Debugging log
    setNewQuestion(); // Start with a question
    loadLeaderboard(); // Load leaderboard
}


// 🎲 Name Handling (No Repeats)
let namePool = [];

function shuffleNames() {
    namePool = [...starWarsNames, ...baseballNames];
    namePool.sort(() => Math.random() - 0.5);
    console.log("Names shuffled:", namePool); // Debugging log
}

function getRandomName() {
    if (namePool.length === 0) {
        console.log("No more names left, ending game.");
        endGame();
        return "";
    }
    return namePool.pop();
}

function endGame() {
    document.getElementById("question").textContent = "Game Over! You've seen every name.";
    document.getElementById("buttons").style.display = "none";
    document.getElementById("result").textContent = `Final Score: ${score}`;
    submitScore(playerName, score);
}

// 🏆 Leaderboard Functions
function submitScore(name, score) {
    db.collection("leaderboard").add({
        name: name,
        score: score,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        console.log("Score submitted!");
        loadLeaderboard();
    }).catch(error => {
        console.error("Error submitting score:", error);
    });
}

function loadLeaderboard() {
    db.collection("leaderboard")
        .orderBy("score", "desc")
        .limit(10)
        .get()
        .then(snapshot => {
            let leaderboard = snapshot.docs.map(doc => doc.data());
            displayLeaderboard(leaderboard);
        });
}

function displayLeaderboard(leaderboard) {
    let leaderboardHTML = "";
    leaderboard.forEach((entry, index) => {
        leaderboardHTML += `<li>${index + 1}. ${entry.name} - ${entry.score}</li>`;
    });
    document.getElementById("leaderboard").innerHTML = leaderboardHTML;
}

// 🕹️ Gameplay Logic
function makeGuess(choice) {
    const currentName = document.getElementById("question").textContent;
    const isStarWars = starWarsNames.includes(currentName);
    const isBaseball = baseballNames.includes(currentName);

    let correct = false;

    if (sicnarfModeUnlocked) {
        if (choice === "sicnarf") {
            correct = Math.random() > 0.5; // Sicnarf is randomly correct or wrong
        } else if (choice === "starwars" && isStarWars) {
            correct = true;
        } else if (choice === "baseball" && isBaseball) {
            correct = true;
        }
    } else {
        if (choice === "starwars" && isStarWars) {
            correct = true;
        } else if (choice === "baseball" && isBaseball) {
            correct = true;
        }
    }

    if (correct) {
        score++;
        document.getElementById("result").textContent = "Correct! 🎉";
    } else {
        score = Math.max(0, score - 1);
        document.getElementById("result").textContent = "Wrong! ❌";
    }

    document.getElementById("score").textContent = `Score: ${score}`;

    if (currentName === "Sicnarf Loopstok" && choice === "baseball" && !sicnarfModeUnlocked) {
        unlockSicnarfMode();
    }

    setNewQuestion();
}

function unlockSicnarfMode() {
    sicnarfModeUnlocked = true;
    document.body.classList.add("sicnarf-mode");
    document.getElementById("buttons").innerHTML += `<button onclick="makeGuess('sicnarf')">Sicnarf Loopstok</button>`;
    document.getElementById("result").textContent = "🔥 SICNARF LOOPSTOK MODE UNLOCKED 🔥";
}

// Set first question
function setNewQuestion() {
    if (namePool.length === 0) {
        console.log("No more names left, ending game.");
        endGame();
        return;
    }
    
    let newName = getRandomName();
    
    if (!newName) {
        console.error("Error: newName is undefined or empty!");
        document.getElementById("question").textContent = "Error loading name. Refresh and try again.";
        return;
    }

    document.getElementById("question").textContent = newName;
    console.log("New name selected:", newName); // Debugging log
}

