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

let score = 0;
let sicnarfModeUnlocked = false;

function getRandomName() {
    const allNames = [...starWarsNames, ...baseballNames];
    return allNames[Math.floor(Math.random() * allNames.length)];
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

    if (score >= 10 && !sicnarfModeUnlocked) {
        unlockSicnarfMode();
    }

    setNewQuestion();
}

function unlockSicnarfMode() {
    sicnarfModeUnlocked = true;
    document.body.classList.add("sicnarf-mode");
    document.getElementById("buttons").innerHTML += `<button onclick="makeGuess('sicnarf')">Sicnarf Loopstok</button>`;
    document.getElementById("result").textContent = "🔴 SICNARF MODE ACTIVATED 🔴";
}

function setNewQuestion() {
    document.getElementById("question").textContent = getRandomName();
}

// Start the game with a random name
setNewQuestion();
