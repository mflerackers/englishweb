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

pages = [`The Story of Momotaro the Peach Boy. 
In ancient times, an elderly pair of people lived 
alone on an island in a huge river. They ate
 a lot of fish cooked with herbs and vegetables, 
 which the wife knew a lot about. The husband, 
 a gnarly old guy with a quick tongue, was always 
 talking about this and that.`,
 
 `Too much for the wife, in fact, so she never 
 responded much to his talk. The husband, Ojisan, 
 caught the fish, mainly salmon, as there were many 
 in the river. He caught more in the autumn, when 
 the salmon swam upstream past their house.`,
 
 `The wife, Obaasan, was hanging up the clothes one 
 day and saw a strange sight. Down the river was 
 slowly floating a giant peach. It was near the bank 
 so she took some scissors and snipped a length of 
 clothes line, attached a hook and threw it over the 
 peach.`,
 
 `She then pulled it closer ashore, grabbed a sword 
 from the closet and began to cut it into pieces that 
 could be eaten. Suddenly, a small voice said, "Please 
 don't poke me with your sword!". She was dumbfounded, 
 in shock, and said, "Who are you? Are you a ghost?" The 
 voice replied, "I don't know who I am, but I don't think I am a ghost. I can see myself."`,
 
 `Obaasan then made a hole in the center of the whole peach, 
 which was really big, and out popped a little baby boy, 
 with big blue eyes and rosy cheeks.
Obaasan took the baby boy home to meet her husband. 
They asked the boy who he was and why he was in the peach. 
The boy said he had no knowledge of who he was or why he was there. 
He said he only woke up, from a deep sleep when the tip of his 
toe was pricked by the scissors, sending a sharp pain through 
his body, which woke him up. He explained that he can't 
describe much from before that.`,

`However, he did remember that he came from a bright sunny place, 
with lots of white billowy clouds, music twinkling like the stars 
and hearing a soft voice saying that he was a gift for a lonely 
couple who had no clear purpose in their lives. He looked with new 
eyes at the old couple and without his will, his tongue spoke 
these words: "Heaven saw how lonely you were and sent me to you".
The old couple were both surprised and pleased as they were lonely 
and had no sense of purpose.`
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