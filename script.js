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

// Load leaderboard from local storage


function startGame() {
    playerName = document.getElementById("player-name").value.trim();
    if (playerName === "") {
        alert("Please enter your name!");
        return;
    }

    document.getElementById("name-entry").style.display = "none";
    document.getElementById("game").style.display = "block";

    setNewQuestion();
    updateLeaderboard();
}

let namePool = [];

function shuffleNames() {
    namePool = [...starWarsNames, ...baseballNames].sort(() => Math.random() - 0.5);
}


function getRandomName() {
    if (namePool.length === 0) {
        endGame(); // Ends the game when all names have been used
        return "";
    }
    return namePool.pop();
}

function endGame() {
    document.getElementById("question").textContent = "Game Over! You've seen every name.";
    document.getElementById("buttons").style.display = "none";
    document.getElementById("result").textContent = `Final Score: ${score}`;
}



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

    updateLeaderboard();
    setNewQuestion();
}

function unlockSicnarfMode() {
    sicnarfModeUnlocked = true;
    document.body.classList.add("sicnarf-mode");
    document.getElementById("buttons").innerHTML += `<button onclick="makeGuess('sicnarf')">Sicnarf Loopstok</button>`;
    document.getElementById("result").textContent = "🔥 SICNARF LOOPSTOK MODE UNLOCKED 🔥";
}

// 🔥 Firebase Setup
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Function to submit score to Firebase
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

// Load leaderboard from Firebase
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

// Update leaderboard display
function displayLeaderboard(leaderboard) {
    let leaderboardHTML = "";
    leaderboard.forEach((entry, index) => {
        leaderboardHTML += `<li>${index + 1}. ${entry.name} - ${entry.score}</li>`;
    });
    document.getElementById("leaderboard").innerHTML = leaderboardHTML;
}

// Submit score when a player makes a guess
function makeGuess(choice) {
    const currentName = document.getElementById("question").textContent;
    const isStarWars = starWarsNames.includes(currentName);
    const isBaseball = baseballNames.includes(currentName);

    let correct = false;

    if (sicnarfModeUnlocked) {
        if (choice === "sicnarf") {
            correct = Math.random() > 0.5;
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

    submitScore(playerName, score);
    setNewQuestion();
}
/ Keep only top 10 players

    

    let leaderboardHTML = "";
    leaderboard.forEach((entry, index) => {
        leaderboardHTML += `<li>${index + 1}. ${entry.name} - ${entry.score}</li>`;
    });

    document.getElementById("leaderboard").innerHTML = leaderboardHTML;
}

function setNewQuestion() {
    document.getElementById("question").textContent = getRandomName();
}
