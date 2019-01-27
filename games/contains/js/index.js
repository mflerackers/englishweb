let games = [
    ["🤡", "clown", "aw", "ow", "ey"],
    ["👹", "ogre", "ow", "aw", "ey"],
    ["👽", "alien", "ey", "ih", "iu"],
    ["👅", "tongue", "ah", "aa", "aw"],
    ["👂", "ear", "ih", "ah", "oy"],
    ["💪", "arm", "aa", "ah", "aw"],
    ["🧠", "brain", "ey", "ih", "ow"],
    ["👀", "eyes", "ay", "ih", "er"],
    ["👶", "baby", "ey", "aw", "ow"],
    ["👦", "boy", "oy", "aw", "ow"],
    ["🧒", "girl", "er", "iy", "ow"],
    ["🐄", "cow", "aw", "ao", "ah"],
    ["👩‍🍳", "cook", "uh", "ow", "ih"],
    ["👸", "queen", "kw", "jh", "sh"],
    ["👼", "angel", "ey", "uw", "oy"],
    ["🧚", "fairy", "eh", "iy", 'iu'],
    ["🚶", "walk", "ao", "ae", "ih"],
    ["🏃", "run", "ah", "ay", "aw"],
    ["⛷", "ski", "iy", "ah", "ih"],
    ["🏌", "golf", "ao", "uw", "ow"],
    ["🏄", "surf", "er", "ul", "aa"],
    ["🏊", "swim", "ih", "iy", "ey"],
    ["🐶", "dog", "ao", "aa", "ah"],
    ["🐦", "bird", "er", "eh", "uw"],
    ["🦆", "duck", "ah", "uh", "ow"],
    /*["🧚", "fairy", "fail", "faint"],
    ["🚶", "walk", "wall", "wail"],
    ["🏃", "run", "rule", "rut"],
    ["⛷", "ski", "skin", "skirt"],
    ["🏌", "golf", "goal", "gone"],
    ["🏄", "surf", "sure", "suit"],
    ["🏊", "swim", "swing", "swine"],
    ["🐶", "dog", "dome", "do"],
    ["🐦", "bird", "bike", "bit"],
    ["🦆", "duck", "dune", "dull"],
    ["🐸", "frog", "from", "front"],
    ["🐍", "snake", "snail", "snack"],
    ["🐳", "whale", "whole", "what"],
    ["🐠", "fish", "fir", "fire"],
    ["🐌", "snail", "snap", "snow"],
    ["🐜", "ant", "art", "auto"],
    ["🐝", "bee", "been", "bean"],
    ["🕸", "web", "week", "when"],
    ["🌺", "flower", "lower", "flow"],
    ["🌲", "tree", "treat", "threat"],
    ["🍁", "leaf", "flea", "weather"],
    ["🍇", "grapes", "grasp", "gratin"],
    ["🍐", "pear", "hear", "bear"],
    ["🥝", "kiwi", "kit", "kite"],
    ["🍞", "bread", "read", "heard"],
    ["🥩", "steak", "streak", "break"],
    ["🥚", "egg", "get", "green"],
    ["🍚", "rice", "niece", "cries"],
    ["🦀", "crab", "rain", "bark"],
    ["🎂", "cake", "can", "cane"],
    ["🥛", "milk", "mist", "smile"],
    ["🏠", "house", "hose", "use"],
    ["⛺", "tent", "the", "there"],
    ["🏙", "city", "ice", "cut"],
    ["♨", "fire", "fin", "fine"],
    ["🚙", "car", "are", "area"],
    ["🚚", "truck", "under", "round"],
    ["🚤", "boat", "oasis", "boot"],
    ["👢", "boot", "boa", "bot"],
    [" 🤖", "bot", "bowl", "book"],
    ["🐁🐁", "mice", "maze", "mat"],
    ["💈", "pole", "pool", "poll"],
    ["🍀", "four",  "fore", "for"],
    ["📞", "call", "coal", "cool"],
    ["🥒", "sour", "sore", "sure"],
    ["🏰", "moat", "moth", "mote"],
    ["🏬", "mall", "mole", "mule"],
    ["🙂", "smile", "small", "smell"],
    ["🌽", "corn", "cone", "con"],
    ["💖", "heart", "hard", "hearth"],
    ["🦇", "bat", "beat", "bet"],
    ["⛪", "church", "chord", "chrome"],
    ["🎪", "circus", "city", "cactus"],
    ["🤽‍♀️", "woman", "women", "womb"],
    ["👭", "women", "woman", "wolf"],
    ["🐺", "wolf", "world", "wonder"],
    ["1", "one", "wonder", "wand"],
    ["🧒", "child", "china", "chill"],
    ["👨‍👩‍👧‍👦", "children", "choir", "china"],
    ["☃", "chilly", "choir", "quest"],
    ["🔥", "fire", "fir", "fry"],
    ["🌫", "fog", "fork", "four"],
    ["🌨", "snow", "now", "out"],
    ["☔", "rain", "aisle", "fly"],
    ["🛫", "fly", "island", "icy"],
    ["🚆", "train", "trade", "aisle"],
    ["😇", "angel", "angle", "hanger"],
    ["👸", "queen", "choir", "chorus"],
    ["🐺", "coyote", "coy", "phony"],
    ["😡", "angry", "above", "adult"],
    ["👨‍🦰", "adult", "apron", "any"],
    ["🙇‍♀️", "bow", "bowl", "cow"],
    ["🐄", "cow", "slow", "about"],
    ["👩‍🍳", "cook", "food", "book"],
    ["👩‍✈️", "pilot", "pill", "fight"],
    ["💂", "guard", "grade", "figure"],
    ["👼", "angel", "angle", "anger"],
    ["🧞", "genie", "genuine", "getting"],
    ["🧟", "zombie", "zone", "zoo"],
    ["💆", "massage", "message", "mass"],
    ["🧜‍♀️", "mermaid", "aisle", "sail"],
    ["🧗", "climber", "limber", "clamor"],
    ["🤺", "fencer", "answer", "cancer"],
    ["🤹", "juggle", "giant", "judge"],
    ["👨‍⚖️", "judge", "gouge", "goose"]*/
];

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
let loading = true;

var wordSound = new Howl({
    src: ['../similar/data/similar-male.m4a'],
    preload: true,
    sprite: {
        clown:[1200,800],
        crown:[2750,750],
        cloud:[4200,800],
        ogre:[5750,650],
        odor:[7000,750],
        okra:[8500,750],
        alien:[10000,1000],
        align:[11500,1000],
        allies:[13200,1200],
        tongue:[14750,750],
        tone:[16250,1000],
        tong:[17600,900],
        ear:[19000,750],
        eat:[20500,700],
        earl:[22000,800],
        arm:[23250,1250],
        air:[24500,1100],
        ale:[26000,1000],
        brain:[27500,1000],
        bra:[29000,800],
        brat:[30400,800],
        eyes:[32000,1000],
        eat:[33400,800],
        ever:[34800,800],
        baby:[36250,1000],
        bath:[37750,1050],
        barn:[39250,1000],
        boy:[40500,1000],
        bay:[42000,1000],
        bomb:[43500,1000],
        girl:[45000,1000],
        gift:[46750,1000],
        gin:[48400,800],
        fairy:[50000,1000],
        fail:[51400,800],
        faint:[53000,750],
        walk:[54200,1000],
        wall:[55600,1000],
        wail:[57200,1000],
        run:[58750,1000],
        rule:[60000,1250],
        rut:[61750,1000],
        ski:[63250,1000],
        skin:[64800,1200],
        skirt:[66500,1000],
        golf:[68250,1000],
        goal:[70000,800],
        gone:[71500,750],
        surf:[73000,1000],
        sure:[74600,900],
        suit:[75750,1000],
        swim:[77000,1000],
        swing:[78400,1000],
        swine:[79800,1200],
        dog:[81600,900],
        dome:[83000,1000],
        do:[84600,800],
        bird:[86000,1000],
        bite:[87600,800],
        bit:[89000,750],
        duck:[90500,750],
        dune:[92000,1000],
        dull:[93500,900],
        frog:[95000,1000],
        from:[96600,900],
        front:[98000,1000],
        snake:[99400,1000],
        snap:[101000,1000],
        snow:[102800,1000],
        ant:[104500,900],
        art:[106500,1000],
        auto:[107750,1000],
        bee:[109200,1000],
        been:[110800,800],
        bean:[112200,800],
        web:[113600,750],
        week:[114800,800],
        when:[116250,1000],
        flower:[117750,1000],
        lower:[119000,1000],
        flow:[120600,1000],
        tree:[122000,1000],
        treat:[123500,1000],
        threat:[125000,1000],
        leaf:[126500,1000],
        flea:[128000,1000],
        weather:[129500,1000],
        grapes:[131000,1250],
        grasp:[132750,1000],
        gratin:[134500,1000],
        pear:[136250,750],
        hear:[138000,8000],
        bear:[139600,900],
        kiwi:[142000,1000],
        kit:[143500,750],
        kite:[145000,1000],
        bread:[146600,800],
        read:[148000,1000],
        heard:[149750,1000],
        steak:[151600,1000],
        streak:[153000,1200],
        break:[154800,1000],
        egg:[156500,900],
        get:[158400,750],
        green:[160000,1200],
        rice:[161750,1000],
        niece:[163200,1000],
        cries:[165000,1000],
        crab:[166400,1000],
        rain:[168000,1000],
        bark:[169750,1000],
        cake:[171250,1000],
        can:[172750,1000],
        cane:[174250,1000],
        milk:[176000,1000],
        mist:[177500,1000],
        smile:[17900,1000],
        house:[180800,1000],
        hose:[182400,1100],
        use:[183880,1000],
        tent:[185600,1000],
        the:[187000,1000],
        there:[188500,1000],
        city:[190200,1000],
        ice:[191800,1000],
        cut:[193500,1000],
        fire:[195000,1000],
        fin:[196600,900],
        fine:[198200,1000],
        car:[199800,1000],
        are:[201250,1000],
        area:[202750,1000],
        truck:[204400,800],
        under:[205800,1000],
        round:[207250,1000],
        boat:[209000,800],
        oasis:[210200,1200],
        boot:[212000,750],
        boa:[213400,1000],
        bot:[215000,750],
        bowl:[216400,800],
        book:[217800,800],
        mice:[219250,1000],
        maze:[220500,1250],
        mat:[222250,750],
        pole:[223750,1000],
        pool:[225250,750],
        poll:[226800,800],
        four:[228400,1000],
        fore:[228400,1000],
        for:[228400,1000],
        call:[233000,1000],
        coal:[234500,1000],
        cool:[236000,1000],
        sour:[237400,1000],
        sore:[238800,1000],
        sure:[240400,1000],
        moat:[241800,1000],
        moth:[243250,1000],
        mote:[245000,1000],
        mall:[246500,1250],
        mole:[248500,1000],
        mule:[249800,1000],
        smile:[251500,1250],
        small:[253000,1200],
        smell:[254500,1000],
        core:[256200,1000],
        cone:[257600,1000],
        con:[259000,1000],
        heart:[260500,1000],
        hard:[262000,1000],
        hearth:[263500,1000],
        bat:[265000,750],
        beat:[266250,1000],
        bet:[267750,1000],
        church:[269250,1000],
        chord:[270250,1000],
        chrome:[271250,1000],
        circus:[272500,900],
        city:[273500,1000],
        cactus:[274750,1000],
        woman:[276800,1000],
        women:[277800,1000],
        womb:[279000,1000],
        wolf:[284000,800],
        world:[285200,1000],
        wonder:[286200,1250],
        one:[288000,1000],
        wand:[290750,1000],
        child:[292250,1000],
        china:[293500,1000],
        chill:[294800,1000],
        children:[296400,1000],
        choir:[297750,1000],
        china:[299000,1000],
        chilly:[300500,1000],
        quest:[303000,1000],
        fire:[304750,1000],
        fir:[306000,1000],
        fry:[307400,800],
        fog:[308750,1000],
        fork:[310000,1000],
        four:[311500,750],
        snow:[312800,1000],
        now:[314400,800],
        out:[315500,1000],
        rain:[317000,1000],
        aisle:[318200,1000],
        fly:[319400,1000],
        island:[322800,1000],
        icy:[324000,1000],
        train:[325200,1200],
        trade:[327000,1000],
        snail:[328600,1200],
        time:[330500,1000],
        bike:[332000,1000],
        chorus:[334000,1000],
        queen:[335200,1200],
        coyote:[336750,1000],
        coy:[338250.1000],
        phony:[339750,1000],
        angry:[341000,1200],
        above:[342500,1000],
        adult:[343500,1000],
        apron:[345000,1200],
        any:[346500,1000],
        bow:[347800,1200],
        bowl:[349200,1000],
        cow:[350500,1000],
        slow:[351750,1250],
        about:[353200,1000],
        what:[355500,750],    
        fish:[356750,800],
        cook:[358000,1000],
        food:[359400,800],
        book:[360750,750],
        pilot:[362000,800],
        pill:[363250,800],
        fight:[365800,800],
        guard:[367750,750],
        grade:[367000,1000], 
        figure:[368600,800],  
        angel:[369800,1000],  
        angle:[372000,800],
        anger:[373400,800],
        genie:[374600,800],  
        genuine:[376000,1000],
        getting:[377400,800],
        zombie:[378800,800],
        zone:[380200,800],
        zoo:[381420,900],
        massage:[382750,1000],
        message:[384200,800],
        mass:[385500,750],
        mermaid:[386800,1000],
        sail:[388000,750],
        climber:[389250,750],
        limber:[390800,800],
        clamor:[392250,750],
        fencer:[393500,900],
        answer:[395000,1000],
        judge:[396250,750],
        gouge:[397600,800],
        goose:[398800,800],
    }
});

wordSound.once('load', function(){
    loading = false;
    hideDialog("loading");
});

phonemeSounds = {};

function getPhonemeSound(phoneme) {
    let sound = phonemeSounds[phoneme];
    if (!sound) {
        sound = new Howl({
            src: [`../../phonemes/arthur/${phoneme.toUpperCase()}.wav`],
            preload: true
        });
        phonemeSounds = sound;
    }
    return sound;
}

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
    header.innerHTML = `<span>${game[0]}</span>`;

    let word = game[1];
    let answers = randomize(game.slice(2));

    let span = header.getElementsByTagName("span");
    span[0].addEventListener("click", () => {
        wordSound.play(word);
    });

    let section = document.getElementById("section");
    while (section.firstChild) {
        section.removeChild(section.firstChild);
    }
    for (let i = 0; i < 3; i++) {
        let article = document.createElement("article");
        let phoneme = answers[i].toLowerCase();
        article.innerHTML = "<div><span class=" + phoneme + ">⬤</span></div>";
        let sound = getPhonemeSound(phoneme);
        if (answers[i] == game[2]) {
            article.addEventListener("click", () => {
                sound.play();
                if (article.innerText.slice(-1) != "✓") {
                    article.innerHTML += "<div style='margin-top:-22vh;'><span>✓</span></div>";
                }
                if (++index < stages.length) {
                    window.setTimeout(()=>{ buildGame(stages, index) }, 800);
                }
                else {
                    showScore(index);
                }
            });
        }
        else {
            article.addEventListener("click", () => {
                sound.play();
                if (article.innerText.slice(-1) != "✗") {
                    article.innerHTML += "<div style='margin-top:-22vh;'><span>✗</span></div>";
                    miss(index);
                }
            });
        }
        section.appendChild(article);
    }

    wordSound.play(word);

    return word;
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