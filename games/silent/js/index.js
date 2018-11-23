let games = [
    "comb", "climb", "debt", "tomb", "dumb", "bomb", "doubt", "numb", "thumb", "womb",
    "muscle", "scissors",
    "yacht",
    "handkerchief", "Wednesday",
    "vegetable", "bridge", "clothes",
    "align", "alight", "champagne", "high", "light", "reign", "though", "sign",
    "right", "drought", "eight", "weigh", "sigh", "night",
    "choir", "hour", "honour", "honest", "herb", "rhyme", "rhythm", "thyme", "Thailand", "psychology", "why",
    "business", "parliament",
    "know", "knot", "knee", "knife", "knight", "knock", "knowledge",
    "calm", "folk", "salmon", "talk", "walk", "could", "should", "would", "folk", "half", "calf", "chalk", "yolk",
    "autumn", "column", "damn", "government", "solemn",
    "corps", "coup", "cupboard", "raspberry", "receipt", "coup", "psychology",
    "aisle", "island", "debris", "isle",
    "beret", "Chevrolet", "depot", "listen", "whistle", "wrestle", "trestle", "mortgage", "apostle", "match", "watch", "etch",
    "baguette", "biscuit", "building", "circuit", "disguise", "guard", "guess", "guest", "guilt", "guitar", "tongue",
    "who", "whole", "write", "wrong", "two", "sword", "wrist", "answer", "wrap", "wrote",
    "rendezvous"
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
    if (word == "one" || word == "once" || word == "usual" || word == "usually" || word == "genuine") {
        return "<span class='weird'>" + word + "</span>";
    }
    else if (word == "obaasan") {
        return "<span class='ow'>o</span>b<span class='aa'>aa</span>s<span class='ah'>a</span>n";
    }
    else if (word == "said") {
        return "s<span class='eh'>ai</span>d";
    }
    else {
        let phonemes = RiTa.getPhonemes(word).toUpperCase().split("-").filter(ph => ph.length > 0);
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
let count = 0;
let found = 0;

function buildGame() {
    
    let oldGame = game;
    while (oldGame == game) {
        game = games[Math.floor(Math.random()*(games.length))].toLowerCase();
    }

    let header = document.getElementById("header");

    let section = document.getElementById("section");
    while (section.firstChild) {
        section.removeChild(section.firstChild);
    }
    
    let article = document.createElement("article");
    article.innerHTML = phonemize(game);
    section.appendChild(article);

    let silents = article.getElementsByClassName("silent");
    count = silents.length;
    found = 0;

    header.innerText = found + "/" + count;

    let spans = article.getElementsByTagName("span");
    for (let span of spans) {
        span._class = span.className;
        span.className = null;

        span.addEventListener("click", () => {
            if (span.className == span._class)
                return;
            if (span._class == "silent") {
                found++;
                header.innerText = found + "/" + count;
            }
            span.className = span._class;
            if (found == count) {
                let spans = article.getElementsByTagName("span");
                for (let span of spans) {
                    span.className = span._class;
                }
                window.setTimeout(buildGame, 2000);
            }
        });
    }
}

buildGame();
