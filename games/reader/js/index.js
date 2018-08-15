/**
*
* @source: https://english.fromatogra.com/games/matching/js/index.js
*
* @licstart  The following is the entire license notice for the 
*  JavaScript code in this page.
*
* Copyright (C) 2016-2018 Marc Flerackers
*
*
* The JavaScript code in this page is free software: you can
* redistribute it and/or modify it under the terms of the GNU
* General Public License (GNU GPL) as published by the Free Software
* Foundation, either version 3 of the License, or (at your option)
* any later version.  The code is distributed WITHOUT ANY WARRANTY;
* without even the implied warranty of MERCHANTABILITY or FITNESS
* FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
*
* As additional permission under GNU GPL version 3 section 7, you
* may distribute non-source (e.g., minimized or compacted) forms of
* that code without the copy of the GNU GPL normally required by
* section 4, provided you include this license notice and a URL
* through which recipients can access the Corresponding Source.
*
* @licend  The above is the entire license notice
* for the JavaScript code in this page.
*
*/

pages = [`Many years before in old Japan
there was an old man and his wife
living in a small village next to a river.
The old man was called ojiisan.
The old woman was called obaasan.
Ojiisan cut wood for his job.
Obaasan washed clothes for her job.
They lived alone and had no children.`,

`One day the old woman went to the river.
She had just begun washing the clothes when
to her surprise a giant peach
was floating down the river.
It was the biggest peach
she had ever seen and she
pulled it out of the water.
She took it home for supper.`,

`When she got her knife to cut it open,
she heard the voice of a child say,
'Wait don't cut me!'
Suddenly, the peach split open
and a beautiful baby boy jumped out.
The old people were very surprised!
More surprising, the baby boy said,
'Don't be afraid!
Heaven saw how lonely you were
without any children and sent me to you.'`,

`So, the old people happily took the baby
and raised him as their own son.
They named him 'Momotaro',
which means 'Peach Boy' in Japanese.
They loved him very much and
they raised him to be a very fine boy.`];

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

function refreshText(page) {
    let text = page.toLowerCase();
    
    let reader = document.getElementById("reader");
    reader.innerHTML = "";
    
    if (text.length == 0) {
        return;
    }
    
    let re = /([a-z]+)|([^a-z]+)/g;
    let m;
    let html = "";
    while (m = re.exec(text)) {
        let word = m[0];
        
        if (word == "one" || word == "once" || word == "usual" || word == "usually") {
            html += "<span class='weird'>" + word + "</span>";
        }
        else if (word == "obaasan") {
            html += "<span class='ow'>o</span>b<span class='aa'>aa</span>s<span class='ah'>a</span>n";
        }
        else if (word == "said") {
            html += "s<span class='eh'>ai</span>d";
        }
        else if (m[1]) {
            let phonemes = RiTa.getPhonemes(word).toUpperCase().split("-");
            phonemes = transformPhonemes(phonemes);
            
            console.log(phonemes);
            
            let result = null;
            try {
                result = matchPhonemes(word, phonemes);
            }
            catch (message) {
                reader.innerText = message + " while processing " + word;
                return;
            }
            
            console.log(result);
            
            for (matches of result) {
                for (c of [...matches.ch]) {
                    html += "<span class='" + getClasses(matches).toLowerCase() + "'>" + c + "</span>";
                }
            }
        }
        else {
            html += word;
        }
    }
    
    reader.innerHTML = html;
    
    document.getElementById("info").innerText = `Page ${currentPage+1} of ${pages.length}`;

    window.scrollTo(0,0);
}

let currentPage = 0;
let distance;

function touchdown(x, y) {
    distance = 0;
}

function touchmove(x, y, dx, dy) {
    distance += Math.abs(dx*dx+dy*dy);
    //window.scrollBy(0, -dy);
}

function touchup(x, y) {
    if (distance > 20 * 20){
        return;
    }
    if (x < reader.clientWidth * 0.25) {
        if (currentPage > 0) {
            refreshText(pages[--currentPage]);
        }
    }
    else {
        if (currentPage < pages.length-1) {
            refreshText(pages[++currentPage]);
        }
    }
}

refreshText(pages[currentPage]);

let reader = document.getElementById("reader");
let prevPos = [0, 0];
let didTouch = false;

reader.addEventListener("mousedown", (event) => {
    if (didTouch)
        return;
    prevPos = getmousePos(event);
    touchdown(...prevPos);
    //event.preventDefault();
}); 
reader.addEventListener("mousemove", (event) => {
    if (didTouch)
        return;
    let curPos = getmousePos(event);
    touchmove(...curPos, curPos[0]-prevPos[0], curPos[1]-prevPos[1]);
    prevPos = curPos;
    //event.preventDefault();
});
reader.addEventListener("mouseup", (event) => {
    if (didTouch) {
        didTouch = false;
        return;
    }
    wasDown = false;
    touchup(...getmousePos(event));
    //event.preventDefault();
});
reader.addEventListener("touchstart", (event) => {
    didTouch = true;
    prevPos = getmousePos(event);
    wasDown = true;
    touchdown(...prevPos);
    //event.preventDefault();
});
reader.addEventListener("touchmove", (event) => {
    let curPos = getmousePos(event);
    touchmove(...curPos, curPos[0]-prevPos[0], curPos[1]-prevPos[1]);
    prevPos = curPos;
    //event.preventDefault();
});
reader.addEventListener("touchend", (event) => {
    wasDown = false;
    touchup(...getmousePos(event));
    //event.preventDefault();
});

function getmousePos(event) {
    if (event.changedTouches) {
        return [event.changedTouches[0].pageX, event.changedTouches[0].pageY];
    }
    else {
        var rect = reader.getBoundingClientRect();
        return [event.clientX- rect.left, event.clientY - rect.top];
    }
}