let games = [
    /*"comb", "climb", "debt", "tomb", "dumb", "bomb", "doubt", "numb", "thumb", "womb",
    "muscle", "scissors",
    "yacht",
    "handkerchief", "Wednesday",
    "vegetable", "bridge", "clothes",
    "align", "alight", "champagne", "high", "light", "reign", "though", "sign",
    "right", "drought", "eight", "weigh", "sigh", "night",
    "choir", "hour", "honor", "honest", "herb", "rhyme", "rhythm", "thyme", "Thailand", "psychology", "why",
    "business", "parliament",
    "know", "knot", "knee", "knife", "knight", "knock", "knowledge",
    "calm", "folk", "salmon", "talk", "walk", "could", "should", "would", "folk", "half", "calf", "chalk", "yolk",
    "autumn", "column", "damn", "government", "solemn",
    "corps", "coup", "cupboard", "raspberry", "receipt", "coup", "psychology",
    "aisle", "island", "debris", "isle",
    "beret", "Chevrolet", "depot", "listen", "whistle", "wrestle", "trestle", "mortgage", "apostle", "match", "watch", "etch",
    "baguette", "biscuit", "building", "circuit", "disguise", "guard", "guess", "guest", "guilt", "guitar", "tongue",
    "who", "whole", "write", "wrong", "two", "sword", "wrist", "answer", "wrap", "wrote",
    "rendezvous"*/
    "times", "people", "lived", "alone", "island", "huge", "knew", "vegetables", "which", "wife", 
    "knew", "gnarly", "tongue", "talking", "caught", "salmon", "autumn", "house", "clothes", "strange", 
    "sight", "some", "scissors", "snipped", "line", "attached", "ashore", "sword", "could", "voice", 
    "please", "poke", "dumbfounded", "who", "ghost", "hole", "whole", "popped", "little", "knowledge", 
    "there", "through", "explained", "came", "place", "white", "like", "lonely", "couple", "purpose", 
    "lives", "eyes", "these", "surprised", "pleased", "sense", "purpose"
];

var wordSound = new Howl({
    src: ['data/silent-male.m4a'],
    preload: true,
    sprite: {
        times:[1000,1000], 
		people:[2200,800], 
		lived:[3300,700],
		alone:[4400,800], 
		island:[5600,1000],
		huge:[7000,1000], 
		knew:[8250,1000], 
		vegetables:[9600,1000], 
		which:[11200,1000], 
		wife:[12500,750], 
		knew:[13500,1000], 
		gnarly:[14800,1000], 
		tongue:[16250,1000], 
		talking:[17600,1000],
		caught:[18900,800],
		salmon:[20100,1000], 
		autumn:[21600,800], 
		house:[22800,1000], 
		clothes:[24000,1200], 
		strange:[25500,1100], 
		sight:[27000,1000],
		some:[29200,1000], 
		scissors:[29600,1400], 
		snipped:[31200,1200], 
		line:[32800,1000], 
		attached:[34200,1200],		 
		ashore:[35750,1000], 
		sword:[37200,1000], 
		could:[38600,800], 
		voice:[39800,1200], 
		please:[41400,1200], 
		poke:[43000,1000], 
		dumbfounded:[44400,1200], 
		who:[45800,1000], 
		ghost:[47200,1000], 
		hole:[48500,1000], 
		whole:[48500,1000],
		popped:[51200,800], 
		little:[52600,800], 
		knowledge:[54000,1000], 
		there:[55500,1000], 
		through:[57000,800], 
		explained:[58200,1300], 
		came:[59800,1000], 
		place:[61200,1200], 
		white:[62600,1000], 
		like:[64000,1000], 
		lonely:[65500,1300], 
		couple:[67000,1000], 
		purpose:[68400,1000],
		lives: [69600,1400],
    }
});

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
                if (matches.ph == "S" && c == "c")
                    html += "<span class='weird'>" + c + "</span>";
                else
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

let loading = true;
let count = 0;
let found = 0;

wordSound.once('load', function(){
    loading = false;
    hideDialog("loading");
});

// For now just locally, later these will come from the server
function fetchStages() {
    let gameIndexes = []
    for (let i = 0; i < games.length; i++) {
        gameIndexes[i] = i;
    }
    gameIndexes = randomize(gameIndexes).slice(0, 5);
    return gameIndexes.map(i => games[i]);
}

function buildGame(stages, index) {
    
    let game = stages[index];

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
            else {
                miss(index);
            }
            span.className = span._class;
            if (found == count) {
                let spans = article.getElementsByTagName("span");
                for (let span of spans) {
                    span.className = span._class;
                }
                wordSound.play(game);
                if (++index < stages.length) {
                    window.setTimeout(()=>{ buildGame(stages, index) }, 1600);
                }
                else {
                    showScore(index);
                }
            }
        });
    }
}

function getSettings() {
    console.log("loading", document.cookie)
    let settingsString = document.cookie.match(new RegExp("settings=([^;]+)"));
    settingsString && (settingsString = settingsString[1]);
    console.log("loading", settingsString);
    let settings = JSON.parse(settingsString) || {tutorial:true};
    console.log("loading", settings);
    return settings;
}

function setSettings(settings) {
    console.log("saving", settings);
    settingsString = "settings=" + JSON.stringify(settings);
    console.log("saving", settingsString);
    document.cookie = settingsString;
}

let onDialogClosed;

function showDialog(name) {
    document.getElementById(name).classList.add("show");
    return new Promise((resolve, reject) => { onDialogClosed = resolve; });
}

function hideDialog(name) {
    document.getElementById(name).classList.remove("show");
    setSettings({tutorial:false});
    if (onDialogClosed) onDialogClosed();
}

function shouldShowTutorial() {
    return getSettings().tutorial;
}

let scores;

function miss(index) {
    scores[index] == 0 || (scores[index]--);
    console.log(scores[index]);
}

function getScore(index) {
    return scores.reduce((a,s) => a+s) / index;
}

function showScore(index) {
    let scoreDiv = document.getElementById("score");
    let ul = scoreDiv.getElementsByTagName("ul")[0];
    ul.className = "stars" + Math.floor(getScore(index));
    scoreDiv.classList.add("show");
}

function hideScore() {
    let scoreDiv = document.getElementById("score");
    scoreDiv.classList.remove("show");
}

function firstInteraction() {
    if (shouldShowTutorial()) {
        showDialog("tutorial").then(()=>{ wordSound.play(word); });
    }
    else {
        showDialog("start").then(()=>{ wordSound.play(word); });
    }
}

function main() {
    let stages = fetchStages();
    scores = stages.map(s => 3);

    hideScore();

    let word = buildGame(stages, 0);

    if (loading) {
        showDialog("loading").then(firstInteraction);
    }
    else {
        firstInteraction();
    }
}

main();