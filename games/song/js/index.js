
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

function buildGame() {

    const phonemes = ["aa", "ae", "ah", "ao", "aw", "ay", "eh", "er", "ey", "iu", "iy", "jh", "kw", "ow", "oy", "sh", "uh", "uw"];

    notes = randomize(phonemes).slice(0, 3);

    for (let phoneme of notes) {
        getPhonemeSound(phoneme);
    }

    let song = document.getElementById("song");

    while (song.firstChild) {
        song.removeChild(song.firstChild);
    }
    for (let i = 0; i < 5; i++) {
        let li = document.createElement("li");
        let phoneme = notes[Math.floor(Math.random() * notes.length)];
        li.innerHTML = `<span>♪</span>`;
        li.phoneme = phoneme;
        song.appendChild(li);
    }

    let piano = document.getElementById("piano");

    while (piano.firstChild) {
        piano.removeChild(piano.firstChild);
    }
    for (let i = 0; i < 3; i++) {
        let li = document.createElement("li");
        let phoneme = notes[i];
        li.innerHTML = "<span class=" + phoneme + ">⬤</span>"
        let sound = getPhonemeSound(phoneme);
        console.log(phoneme, sound);
        li.addEventListener("click", () => {
            sound.play();
            let notes = [...song.getElementsByTagName("li")];
            let note = notes[pos]
            if (note.phoneme == phoneme) {
                note.getElementsByTagName("span")[0].className = note.phoneme;
                pos++;
                if (pos >= notes.length) {
                    window.setTimeout(() => {
                        buildGame();
                    }, nextGameDelay);
                }
            }
            else {
                blockInput();
                reset();
                window.setTimeout(() => {
                    playSong();
                }, nextPlayDelay);
            }
        });
        piano.appendChild(li);
    }

    blockInput();
    pos = 0;
    window.setTimeout(() => {
        playSong();
    }, nextGameDelay);
}

function playSong() {
    let song = document.getElementById("song");
    let notes = [...song.getElementsByTagName("li")];

    notes.forEach((note, i) => {
        window.setTimeout(() => {
            note.getElementsByTagName("span")[0].className = note.phoneme;
            let sound = getPhonemeSound(note.phoneme);
            console.log(note.phoneme, sound);
            sound.play();
        }, i*noteDelay);
        window.setTimeout(() => {
            note.getElementsByTagName("span")[0].className = "";
        }, notes.length * noteDelay + i*noteDelay);
        window.setTimeout(() => {
            allowInput();
        }, notes.length * 2 * noteDelay);
    });
}

function reset() {
    let notes = [...song.getElementsByTagName("li")];
    notes.forEach((note, i) => {
        note.getElementsByTagName("span")[0].className = "";
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
