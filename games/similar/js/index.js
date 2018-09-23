let games = [
    ["⛵", "boat", "boot", "bot"],
    ["👢", "boot", "boat", "bot"],
    [" 🤖", "bot", "boat", "boot"],
    ["🐁🐁", "mice", "maze", "mace"],
    ["💈", "pole", "pool", "poll"],
    ["🍀", "four",  "fore", "for"],
    ["📞", "call", "coal", "cool"],
    ["🥒", "sour", "sore", "sure"],
    ["🏰", "moat", "moth", "mote"],
    ["🏬", "mall", "mole", "mule"],
    ["🙂", "smile", "small", "smell"],
    ["🌽", "corn", "cone", "con"],
    ["💖", "heart", "hard", "hearth"],
    ["🦇", "bat", "beat", "bet"]
];

function getClasses(match) {
    if ((match.ph == "S" && match.ch == "c") ||
    (match.ph == "V" && match.ch == "f") ||
    (match.ph == "T" && match.ch == "d") ||
    (match.ph == "W" && match.ch == "u")) {
        return "weird";
    }
    else {
        return match.ph;
    }
}

function phonemize(word) {
    if (word == "one" || word == "once" || word == "usual" || word == "usually") {
        return "<span class='weird'>" + word + "</span>";
    }
    else if (word == "obaasan") {
        return "<span class='ow'>o</span>b<span class='aa'>aa</span>s<span class='ah'>a</span>n";
    }
    else if (word == "said") {
        return "s<span class='eh'>ai</span>d";
    }
    else {
        let phonemes = RiTa.getPhonemes(word).toUpperCase().split("-");
        phonemes = transformPhonemes(phonemes);
        
        console.log(phonemes);
        
        let result = null;
        try {
            result = matchPhonemes(word, phonemes);
        }
        catch (message) {
            alert(message + " while processing " + word);
            return;
        }
        
        console.log(result);
        
        let html = "";
        for (matches of result) {
            for (c of [...matches.ch]) {
                html += "<span class='" + getClasses(matches).toLowerCase() + "'>" + c + "</span>";
            }
        }
        return html;
    }
}

function randomize(list) {
    let newList = list.slice();
    for (let i = 0; i < newList.length; ++i) {
        let j = Math.floor(Math.random() * newList.length);
        let k = Math.floor(Math.random() * newList.length);
        let tmp = newList[j];
        newList[j] = newList[k];
        newList[k] = tmp;
    }
    return newList;
}

let game = null;

function buildGame() {
    
    let oldGame = game;
    while (oldGame == game) {
        game = games[Math.floor(Math.random()*(games.length))];
    }

    let header = document.getElementById("header");
    header.innerText = game[0];

    let answers = randomize(game.slice(1));

    let section = document.getElementById("section");
    while (section.firstChild) {
        section.removeChild(section.firstChild);
    }
    for (let i = 0; i < 3; i++) {
        let article = document.createElement("article");
        article.innerHTML = phonemize(answers[i]);
        console.log(phonemize(answers[i]));
        if (article.innerText == game[1]) {
            article.addEventListener("click", () => {
                if (article.innerText.slice(-1) != "✓")
                article.innerText += " ✓";
                window.setTimeout(buildGame, 500);
            });
        }
        else {
            article.addEventListener("click", () => {
                if (article.innerText.slice(-1) != "✗")
                article.innerText += " ✗";
            });
        }
        section.appendChild(article);
    }
}

buildGame();