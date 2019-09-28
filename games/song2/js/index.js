
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

let gameData = {
    "a cat on a bed":["cat_on_a_bed.png"],
    "bugs on the web are glad":["cat_on_a_bed.png"],
    "a lot of fast pets":["fast pets.png"],
    "wet frog on a bag":["cat_on_a_bed.png"],
    "a bear and a fox":["fox.bear.png"],
    "a box of red clams":["cat_on_a_bed.png"],
    "a lot of bad bears":["cat_on_a_bed.png"],
    "an odd rat has an umbrella":["cat_on_a_bed.png"],
    "a hog has a dress on":["a hog in a dress.png"],
    "a bear wears a top hat":["cat_on_a_bed.png"],
    "a rat on a jet":["cat_on_a_bed.png"],
    "a rat has a lot of hair":["cat_on_a_bed.png"],
    "some rats wear a red hat":["cat_on_a_bed.png"],
    "a fat hen on a nest of eggs":["hen on eggs.png"],
    "a red cat got wet":["cat_on_a_bed.png"],
    "a bobcat gets a haircut":["cat_on_a_bed.png"],
    "complex cats get dressed up":["cat_on_a_bed.png"],
    "some red and black swans":["cat_on_a_bed.png"],
    "a bad bug on a bed":["cat_on_a_bed.png"],
    "a red frog on the back of a dump truck":["cat_on_a_bed.png"],
    "a crab on the back of an elk":["cat_on_a_bed.png"],
    "a bug on the back of a heron":["cat_on_a_bed.png"],
    "a fennec fox wants a snack":["cat_on_a_bed.png"],
    "the gazelle has a black hat on":["cat_on_a_bed.png"],
    "a llama on the deck of a tug":["cat_on_a_bed.png"],
    "a musk ox gets a snack of some grass":["cat_on_a_bed.png"],
}
let sentence = ""

var sound = new Howl({
    src: ['../../resources/animals.m4a'],
    preload: true,
    sprite: {
        "a cat on a bed":[1000,1500], 
        "bugs on the web are glad":[5250,2250],
        "a lot of fast pets":[11000,2500],
        "wet frog on a bag":[16250,2000],
        "a bear and a fox":[21500,2250],
        "a box of red clams":[26000,2250],
        "a lot of bad bears":[31000,2250],
        "an odd rat has an umbrella":[36000,3000],
        "a hog has a dress on":[42000,2000],
        "a bear wears a top hat":[46750,2500],
        "a rat on a jet":[51500,2000],
        "a rat has a lot of hair":[56500,2000],
        "some rats wear a red hat":[61750,2750],
        "a fat hen on a nest of eggs":[67500,2750],
        "a red cat got wet":[72500,2250],
        "a bobcat gets a haircut":[77250,2500],
        "complex cats get dressed up":[82500,2750],
        "some red and black swans":[88250,3000],
        "a bad bug on a bed":[88250,2750],
        "a red frog on the back of a dump truck":[97500,6600],
        "a crab on the back of an elk":[106500,2500],
        "a bug on the back of a heron":[111500,2750],
        "a fennec fox wants a snack":[116250,3250],
        "the gazelle has a black hat on":[123750,3000],
        "a llama on the deck of a tug":[129750,3500],
        "a musk ox gets a snack of some grass":[136500,4500],
    }
});

let phonemeSounds = {};

function getPhonemeSound(phoneme) {
    let sound = phonemeSounds[phoneme];
    if (!sound) {
        console.log("Caching sound " + phoneme);
        sound = new Howl({
            src: [`../../phonemes/arthur/${phoneme.toUpperCase()}.wav`],
            preload: true
        });
        phonemeSounds[phoneme] = sound;
    }
    return sound;
}

let pos = 0;
const noteDelay = 400;
const nextPlayDelay = 300;
const nextGameDelay = 800;

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
    else if (word == "a") {
        return "<span class='ah'>a</span>";
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

function buildGame() {

    const phonemes = ["aa", "ae", "ah", "eh"];

    let index = Math.floor(Math.random() * Object.keys(gameData).length);
    sentence = Object.keys(gameData)[index]
    let image = document.getElementById("image")
    let img = image.getElementsByTagName("img")[0]
    img.src = "../../resources/" + gameData[sentence][0]

    let song = document.getElementById("song");
    song.innerHTML = RiTa.tokenize(sentence).map(word=>phonemize(word)).join(" ")

    // Extract song
    let spans = song.querySelectorAll("span")
    let notes = []
    for (let i = 0; i < spans.length; ++i) {
        let note = phonemes.filter(phoneme=>spans[i].classList.contains(phoneme))
        if (note.length > 0) {
            spans[i].classList.add("phoneme-hidden")
            notes.push({phoneme:note[0], span:spans[i]})
        }
    }

    // Load sound
    for (let phoneme of phonemes) {
        getPhonemeSound(phoneme);
    }

    let piano = document.getElementById("piano");

    while (piano.firstChild) {
        piano.removeChild(piano.firstChild);
    }
    for (let i = 0; i < phonemes.length; i++) {
        let li = document.createElement("li");
        let phoneme = phonemes[i];
        li.innerHTML = "<span class=" + phoneme + ">⬤</span>"
        let phonemeSound = getPhonemeSound(phoneme);
        console.log(phoneme, sound);
        li.addEventListener("click", () => {
            phonemeSound.play();
            let note = notes[pos]
            if (note.phoneme == phoneme) {
                note.span.classList.remove("phoneme-hidden")
                pos++;
                if (pos >= notes.length) {
                    window.setTimeout(() => {
                        //buildGame();
                        piano.style.display = "none"
                        document.getElementById("image").style.display = "inline-block"
                        sound.play(sentence)
                    }, nextGameDelay);
                }
            }
            else {
                blockInput();
                reset();
                window.setTimeout(() => {
                    playSong(notes);
                }, nextPlayDelay);
            }
        });
        piano.appendChild(li);
    }

    blockInput();
    pos = 0;
    window.setTimeout(() => {
        playSong(notes);
    }, nextGameDelay);
}

function playSong(notes) {
    let song = document.getElementById("song");

    notes.forEach((note, i) => {
        window.setTimeout(() => {
            note.span.classList.remove("phoneme-hidden")
            let sound = getPhonemeSound(note.phoneme);
            console.log(note.phoneme, sound);
            sound.play();
        }, i*noteDelay);
        window.setTimeout(() => {
            note.span.classList.add("phoneme-hidden")
        }, notes.length * noteDelay + i*noteDelay);
        window.setTimeout(() => {
            allowInput();
        }, notes.length * 2 * noteDelay);
    });
}

function reset() {
    let notes = [...song.getElementsByTagName("li")];
    notes.forEach((note, i) => {
        note.span.classList.add("phoneme-hidden");
    });
    pos = 0;
}

function blockInput() {
    document.getElementById("block").style.visibility = "";
}

function allowInput() {
    document.getElementById("block").style.visibility = "hidden";
}

buildGame();
