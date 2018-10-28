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
    ["🦇", "bat", "beat", "bet"],
    ["🤡", "clown", "crown", "cloud"],
    ["👹", "ogre", "odor", "okra"],
    ["👽", "alien","align","allies"],
    ["👅", "tongue","tone","tong"],
    ["👂", "ear", "eat", "earl"],
    ["💪", "arm", "air", "ale"],
    ["🧠", "brain", "bra", "brat"],
    ["👀", "eyes", "eat", "ever"],
    ["👶", "baby", "bath", "barn"],
    ["👦", "boy", "bay", "bomb"],
    ["🧒", "girl", "gift", "gin"],
    ["🧚", "fairy", "fail", "faint"],
    ["🚶", "walk", "wall", "wail"],
    ["🏃", "run", "rule", "rut"],
    ["⛷", "ski", "skin", "skirt"]
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

var sound = new Howl({
    src: ['data/similar-male.m4a'],
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
        fail:[514000,800],
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
        web:[111360,750],
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
        crab:[16600,800],
        rain:[168000,1000],
        bark:[169750,1000],
        cake:[171250,1000],
        can:[172750,1000],
        cane:[174250,1000],
        milk:[176000,1000],
        mist:[177500,1000],
        smile:[179000,1000],
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
    }
});

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
                sound.play(article.innerText);
                if (article.innerText.slice(-1) != "✓")
                    article.innerText += " ✓";
                window.setTimeout(buildGame, 500);
            });
        }
        else {
            article.addEventListener("click", () => {
                sound.play(article.innerText);
                if (article.innerText.slice(-1) != "✗")
                article.innerText += " ✗";
            });
        }
        section.appendChild(article);
    }
}

buildGame();
