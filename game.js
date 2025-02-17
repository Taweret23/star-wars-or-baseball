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

// 🎲 Declare namePool at the top so it's accessible everywhere
let namePool = [];
let playerName = "";
let score = 0;
let sicnarfModeUnlocked = false;

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

console.log("🔥 Initializing Firebase...");

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

console.log("✅ Firebase initialized successfully.");

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

    // 🛠 Reset and shuffle names before the first question
    namePool = [...starWarsNames, ...baseballNames]; 
    shuffleNames();
    
    console.log("🎲 Names shuffled. Total names:", namePool.length);
    setNewQuestion(); // Start with a question
    loadLeaderboard(); // Load leaderboard
}

// 🎲 Name Handling (No Repeats)
function shuffleNames() {
    console.log("🔄 shuffleNames() called.");

    if (namePool.length === 0) {
        console.error("❌ Error: Name pool is empty after shuffle!");
    } else {
        console.log(`✅ Names shuffled. ${namePool.length} names added.`);
    }
    namePool.sort(() => Math.random() - 0.5);
}

function getRandomName() {
    console.log("📢 getRandomName() called. Name pool size:", namePool.length);
    
    if (namePool.length === 0) {
        console.log("⚠️ No more names left, ending game.");
        endGame();
        return "";
    }

    let selectedName = namePool.pop();
    console.log(`🎯 New name picked: ${selectedName}`);
    return selectedName;
}

function endGame() {
    console.log("🏁 Game Over!");
    document.getElementById("question").textContent = "Game Over! You've seen every name.";
    document.getElementById("buttons").style.display = "none";
    document.getElementById("result").textContent = `Final Score: ${score}`;
    submitScore(playerName, score);
}

// 🏆 Leaderboard Functions
function submitScore(name, score) {
    console.log(`📊 Submitting Score: ${name} - ${score}`);
    db.collection("leaderboard").add({
        name: name,
        score: score,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        console.log("✅ Score submitted!");
        loadLeaderboard();
    }).catch(error => {
        console.error("🔥 Error submitting score:", error);
    });
}

// Set first question
function setNewQuestion() {
    console.log("🔄 setNewQuestion() called.");

    if (namePool.length === 0) {
        console.log("⚠️ No more names left, ending game.");
        endGame();
        return;
    }
    
    let newName = getRandomName();
    
    if (!newName) {
        console.error("❌ Error: newName is undefined or empty!");
        document.getElementById("question").textContent = "Error loading name. Refresh and try again.";
        return;
    }

    document.getElementById("question").textContent = newName;
    console.log("✅ New name selected:", newName);
}
