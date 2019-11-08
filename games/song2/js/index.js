
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

let gameData = [
    "a bad bug on a bed",
    "a bear and a fox",
    "a bear wears a top hat",
    "a bobcat gets a haircut",
    "a box of red clams",
    "a cat on a bed",
    "a crab on the back of an elk",
    "a fat hen on a nest of eggs",
    "a fennec fox wants a snack",
    "a frog on the back of a dumptruck",
    "a grasshopper lands on a heron",
    "a hog has a dress on",
    "a llama on the deck of a tug",
    "a lot of bad bears",
    "a lot of fast pets",
    "a musk ox gets a snack of some grass",
    "a rat has a lot of hair",
    "a rat on a jet",
    "a wet cat has a bath",
    "bugs on the web are glad",
    "complex cats get dressed up",
    "fat rat has an umbrella",
    "some rats wear a red hat",
    "some red and black swans",
    "the gazelle has a black hat on",
    "wet frog on a bag"
]
let sentence = ""

var sound = new Howl({
    src: ['../../resources/a cat on a bed.m4a'],
    preload: true
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

    // Create words
    let index = Math.floor(Math.random() * gameData.length);
    sentence = gameData[index]

    // Load sound
    sound = new Howl({
        src: ["../../resources/" + sentence + ".m4a"],
        preload: true
    });

    // Load image
    let image = document.getElementById("image")
    let img = image.getElementsByTagName("img")[0]
    img.src = "../../resources/" + sentence + ".png"

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
                        sound.play()
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
