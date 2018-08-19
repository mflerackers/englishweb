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

class App {
    constructor(div) {
        this.div = div;
        this.canvas = document.getElementById("canvas");
        this.ctx = canvas.getContext('2d');
        this.dirty = true;
        this.prev = +new Date();
        this.prevPos = [0, 0];
        
        this.resize();
        
        window.addEventListener('resize', () => this.resize(), false);
        
        this.canvas.addEventListener("mousedown", (event) => {
            this.prevPos = App.getmousePos(event)
            this.touchdown(...this.prevPos);
            event.preventDefault();
        }); 
        this.canvas.addEventListener("mousemove", (event) => {
            let curPos = App.getmousePos(event);
            this.touchmove(...curPos, curPos[0]-this.prevPos[0], curPos[1]-this.prevPos[1]);
            this.prevPos = curPos;
            event.preventDefault();
        });
        this.canvas.addEventListener("mouseup", (event) => {
            this.touchup(...App.getmousePos(event));
            event.preventDefault();
        });
        this.canvas.addEventListener("touchstart", (event) => {
            this.prevPos = App.getmousePos(event)
            this.touchdown(...this.prevPos);
            event.preventDefault();
        });
        this.canvas.addEventListener("touchmove", (event) => {
            let curPos = App.getmousePos(event);
            this.touchmove(...curPos, curPos[0]-this.prevPos[0], curPos[1]-this.prevPos[1]);
            this.prevPos = curPos;
            event.preventDefault();
        });
        this.canvas.addEventListener("touchend", (event) => {
            this.touchup(...App.getmousePos(event));
            event.preventDefault();
        });
    }
    
    resize() {
        this.canvas.width  = this.div.clientWidth;
        this.canvas.height = this.div.clientHeight;
        this.dirty = true;
    }
    
    loop() {
        let now = +new Date();
        let dt = now - this.prev;
        this.prev = now;
        this.update(dt/1000)
        if (this.dirty)
            this.draw(this.ctx);
        window.requestAnimationFrame(() => this.loop());
    }
    
    update(dt) {}
    
    draw(ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.rect(0, 0, 100, 100);
        ctx.fill();
    }
    
    touchdown(x, y) { console.log("down", x, y); }
    
    touchmove(x, y) {}
    
    touchup(x, y) {}
    
    static getmousePos(event) {
        if (event.changedTouches) {
            return [event.changedTouches[0].pageX, event.changedTouches[0].pageY];
        }
        else {
            var rect = event.target.getBoundingClientRect();
            return [event.clientX- rect.left, event.clientY - rect.top];
        }
    }
}

const columns = 10;
const rows = 10;
const margin = 10;
let min = Math.min(canvas.width, canvas.height);
let size = (min-2*margin) / columns;
let grid;

let img;

let phonemes;
let nextRandom;
let voice = "monet";
let sounds;

function randomColor(pos) {
    //let tries = 100;
    //while (tries--) {
        let color = Math.floor(Math.random() * Math.floor(nextRandom.length));
        color = 1 + phonemes.indexOf(nextRandom[color]);
        //if (checkNeighbours(color, xpos(pos), ypos(pos)))
            return color;
    //}
    //return 1;
}

let positions = {};

class Idle {
    constructor() {
        this.redraw = false;
    }
    
    draw(ctx) {
        let pos = 0;
        for (let j = 0; j < rows; j++) {
            for (let i = 0; i < columns; i++) {
                this.drawDot(ctx, i, j, pos++);
            }
        }
    }

    drawDotRaw(ctx, color, x, y, s) {
        ctx.drawImage(img, color*50, 0, 50, 50, x, y, s * size, s * size);
    }
    
    drawDot(ctx, i, j, pos, dx, dy, s) {
        dx = dx || 0;
        dy = dy || 0;
        s = s || 1;
        this.drawDotRaw(ctx, getColor(pos), margin+i*size+size*0.5*(1-s)+dx, margin+j*size+size*0.5*(1-s)+dy, s);
    }
    
    update(dt) {
        
    }
    
    touchup(x, y) {
        pop(Math.floor((x-margin)/size), Math.floor((y-margin)/size));
    }
}

let state = new Idle();

const popTime = 1.0;

class Pop extends Idle {
    constructor(list, trajectories, finished) {
        console.log("popping", list, trajectories);
        super();
        this.grid = new Array(columns*rows).fill(false);
        list.forEach((pos, i) => { this.grid[pos] = trajectories[i] || true; });
        this.finished = finished;
        this.time = 0;
    }
    
    drawDot(ctx, x, y, pos) {
        let popping = this.grid[pos];
        if (popping) {
            let alpha = Math.min(1, this.time/popTime);
            let scale = (popTime-this.time)/popTime;
            if (Array.isArray(popping)) {
                let [dx, dy] = evaluateCatmulRom(popping, alpha);
                super.drawDot(ctx, x, y, pos, dx, dy, scale);
            }
            else {
                super.drawDot(ctx, x, y, pos, 0, 0, scale);
            }
        }
        else 
            super.drawDot(ctx, x, y, pos);
    }
    
    update(dt) {
        this.time += dt;
        if (this.time < popTime) {
            return;
        }
        this.grid.forEach((popped, pos) => { if (popped) setColor(0, pos); });
        if (this.finished) {
            this.finished();
        }
        setState(new Idle());
        drop();
    }
    
    touchup(x, y) {}
}

const dropTime = 0.100;

class Drop extends Idle {
    constructor(list) {
        console.log(`dropping`, list);
        super();
        this.list = list;
        this.time = 0;
    }
    
    drawDot(ctx, x, y, pos) {
        if (this.list && y <= this.list[x]) {
            super.drawDot(ctx, x, y, pos, 0, -50*(dropTime-this.time)/dropTime);
        }
        else {
            super.drawDot(ctx, x, y, pos);
        }
    }
    
    update(dt) {
        this.time += dt;
        if (this.time < dropTime) {
            return;
        }
        setState(new Idle());
        if (grid.some(color => color == 0)) {
            drop();
        }
        else if (getApp().isLastWord() && getApp().isCurrentWordFinished()) {
            setState(new End());
        }
        /*else {
            checkChains();
        }*/
    }
    
    touchup(x, y) {}
}

class End extends Idle {
    constructor() {
        console.log(`end`);
        super();
    }
    
    touchup(x, y) {
        x -= min*0.5;
        y -= min*0.5;
        if (x*x+y*y < size*size*0.25) {
            window.location.href = 'https://english.fromatogra.com';
        }
    }
}

function setState(s) {
    state = s;
    time = 0;
}

function getState() {
    return state;
}

function xpos(pos) {
    return Math.floor(pos % columns);
}

function ypos(pos) {
    return Math.floor(pos / columns);
}

function posxy(x, y) {
    return y*columns+x;
}

function getColor(x, y) {
    if (y == undefined) {
        if (x < 0 || x >= columns*rows)
            return null;
        return grid[x];
    }
    if (x < 0 || x >= columns || y < 0 || y >= rows)
        return null;
    return grid[posxy(x, y)];
}

function setColor(color, x, y) {
    if (y == undefined) {
        if (x < 0 || x >= columns*rows)
            return;
        grid[x] = color;
    }
    else {
        if (x < 0 || x >= columns || y < 0 || y >= rows)
            return;
        grid[posxy(x, y)] = color;
    }
}

function pop(i, j) {
    console.log("pop started");
    if (typeof i == 'number') {
        let color = getColor(i, j);
        let list = canPop(color, i, j);
        if (list && list.length > 2) {
            sounds[color-1].play();
            let phoneme = phonemes[color-1];
            let position = positions[phoneme];
            let trajectories;
            let finished;
            if (position) {
                let [x2, y2, part] = position;
                trajectories = list.map(pos => {
                    let x = xpos(pos);
                    let y = ypos(pos);
                    let dx = margin+x*size;
                    let dy = margin+y*size;
                    return calcTrajectory(0, 0, x2-dx, y2-dy);
                });
                finished = function() {
                    part[4] = 1;
                    if (getApp().isCurrentWordFinished()) {
                        app.nextWord();
                    }
                }
            }
            else {
                trajectories = [];
            }
            setState(new Pop(list, trajectories, finished));
        }
        else {
            console.log("no color to pop");
        }
    }
    else {
        setState(new Pop(i));
    }
    console.log("pop done");
}

function drop() {
    console.log("drop started");
    let list = new Array();
    for (let i = 0; i < columns; i++) {
        for (let j = rows-1; j >= 0; j--) {
            if (list[i] == undefined) {
                if (getColor(i, j) == 0) {
                    list[i] = j;
                    if (j > 0)
                        setColor(getColor(i, j-1), i, j);
                    else
                        setColor(randomColor(), i, j);
                }
            }
            else {
                if (j > 0)
                    setColor(getColor(i, j-1), i, j);
                else
                    setColor(randomColor(), i, j);
            }
        }
    }
    //console.log(list);
    if (list.length > 0)
        setState(new Drop(list));
    else
        console.log("nothing to drop");
    console.log("drop done");
}

function checkChains() {
    // look for chains
    let set = new Set();
    grid.forEach((color, pos) => checkChain(set, color, pos));
    
    if (set.size == 0)
        return;
    
    pop(Array.from(set));
}

function checkNeighbours(color, x, y) {
    
    let leftleft = getColor(x-2, y);
    let left = getColor(x-1, y);
    if (leftleft == color && left == color)
        return false;
    
    let toptop = getColor(x, y-2);
    let top = getColor(x, y-1);
    if (toptop == color && top == color)
        return false;
    
    return true;
}

function checkChain(set, color, pos) {
    
    let x = xpos(pos);
    let y = ypos(pos);
    
    let left = getColor(x-1, y);
    let right = getColor(x+1, y);
    if (left && right) {
        if (left == color && right == color) {
            set.add(posxy(x-1, y));
            set.add(posxy(x, y));
            set.add(posxy(x+1, y));
            //console.log(`horizontal chain ${x-1}-${x+1},${y}`);
        }
    }
    
    let top = getColor(x, y-1);
    let bottom = getColor(x, y+1);
    if (top && bottom) {
        if (top == color && bottom == color) {
            set.add(posxy(x, y-1));
            set.add(posxy(x, y));
            set.add(posxy(x, y+1));
            //console.log(`vertical chain ${x},${y-1}-${y+1}`);
        }
    }
    
    //console.log(set, color, pos);
}

function getNeighbours(pos) {
    let list = [];
    let [x, y] = [xpos(pos), ypos(pos)];
    if (x > 0) {
        list.push(pos-1);
    }
    if (x < columns-1) {
        list.push(pos+1);
    }
    if (y > 0) {
        list.push(pos-columns);
    }
    if (y < rows-1) {
        list.push(pos+columns);
    }
    return list;
}

function canPop(color, x, y) {
    let toCheck = new Set([posxy(x, y)]);
    let collected = new Set();

    while(toCheck.size > 0) {
        let pos = toCheck.values().next().value;
        collected.add(pos);
        toCheck.delete(pos);

        getNeighbours(pos).forEach(p => {
            if (!collected.has(p) && getColor(p) == color) { toCheck.add(p); }
        });
    }

    return collected.size ? [...collected] : false;
}

function evaluateLine(p1x, p1y, p2x, p2y, t) {
    return [p1x + (p2x-p1x)*t, p1y + (p2y-p1y)*t];
}

function evaluateCatmulRomSegment3(p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y, t) {
    let a = 0.5*(((  -t+2)*t-1)*t);
    let b = 0.5*((( 3*t-5)*t  )*t+2);
    let c = 0.5*(((-3*t+4)*t+1)*t);
    let d = 0.5*(((   t-1)*t  )*t);
    let x = a*p0x+b*p1x+c*p2x+d*p3x;
    let y = a*p0y+b*p1y+c*p2y+d*p3y;
    return [x,y];
  }
  
  function evaluateCatmulRom(points, t) {
      let count = (points.length / 2)-1;
      let s = t * count;
      let i = Math.floor(s);
      t = s - i;
      i *= 2;
      if (i == 0) {
        return evaluateCatmulRomSegment3(points[0], points[1], points[0], points[1], points[2], points[3], points[4], points[5], t);
      }
      else if (i >= count) {
        return evaluateCatmulRomSegment3(points[points.length-6], points[points.length-5], points[points.length-4], points[points.length-3], points[points.length-2], points[points.length-1], points[points.length-2], points[points.length-1], t);
      }
      else {
        return evaluateCatmulRomSegment3(points[i-2], points[i-1], points[i], points[i+1], points[i+2], points[i+3], points[i+4], points[i+5], t);
      }
  }

  function calcTrajectory(x1, y1, x2, y2) {
    // Vector from p1 to p2
    let [vx, vy] = [x2-x1, y2-y1];
    // Vector perpendicular to v
    let [nx, ny] = [-vy, vx];
    // Random up or down from -1 to 1
    let dir = Math.random()*2 -1;
    // Point 25% on the way, 25% distance from the line
    let [x11, y11] = [x1+0.25*vx+dir*0.25*nx, y1+0.25*vy+dir*0.25*ny];
    // Point 75% on the way, 125% distance from the line on the other side
    let [x22, y22] = [x1+0.75*vx-dir*0.125*nx, y1+0.75*vy-dir*0.125*ny];
    return [x1, y1, x11, y11, x22, y22, x2, y2];
  }

const wordLists = [
    ["heaven","saw","how","lonely","you","were"],
    ["the","old","people","were","amazed"],
    ["and","very","cute","baby","boy","jumped","out"],
    ["without","any","children","and","sent","me","to","you"],
    ["the","baby","said","dont","be","afraid"],
    ["the","voice","said","wait","dont","cut","me"],
    ["when","she","heard","human","voice","from","inside","it"]
  ];

class GameApp extends App {

    constructor(div) {
        super(div);

        this.words = [
            [["h", "none"], ["ea", "EH"], ["v", "none"], ["e","AH"], ["n", "none"]], 
            [["s", "none"], ["aw", "AO"]], 
            [["h", "none"], ["ow", "OW"]],
            [["l", "none"], ["o", "OW"], ["nel", "none"], ["y", "IY"]],
            [["you", "IU"]],
            [["we", "none"], ["r", "ER"], ["e", "none"]],
        ];

        this.currentWord = 0;

        phonemes = [];
        this.words.forEach(word => {
            phonemes = [...phonemes, ...word.filter(w => w[1] != "none").map(w => w[1])];
        });
        phonemes = Array.from(new Set(phonemes));
        console.log("all", phonemes);

        this.fillNextRandom();

        // We do this in two parts so checkneighbours won't complain
        grid = new Array(columns*rows).fill(0);
        grid = grid.map((v, i) => randomColor(i));

        img = this.createImageFromImageData(renderSprite(this.ctx, phonemes));

        sounds = phonemes.map(phoneme => 
            new Howl({
                src: ["../../phonemes/"+voice+"/"+phoneme+".wav"],
                html5: true
            })
        );

        this.colors = {
            "none": "black",
            "AH": "rgb(255,242,89)",
            "AO": "rgb(120,63,4)",
            "ER": "rgb(225,124,167)",
            "IU": "rgb(244,190,127)"
        };

        this.layoutWords();
        this.recreateGradients();

        this.loop();
    }

    layoutWords() {
        let left, x, y;
        if (this.canvas.width > this.canvas.height) {
            left = x = min + 20;
            y = margin + size * 0.5;
        }
        else {
            left = x = 20;
            y = min;
        }

        this.words.forEach((word, i) => {
            word.forEach(part => {
                let [s, c, px, py, level] = part;
                part[2] = x;
                part[3] = y;
                x += this.ctx.measureText(s).width;
            });
            x = left;
            y += size;
        });

        this.fillPositions();
    }

    fillPositions() {
        this.words[this.currentWord].forEach(part => {
            if (part[1] == "none") {
                return;
            }
            let [s, c, px, py, level] = part;
            positions[c] = [px, py, part];
        });
    }

    fillNextRandom() {
        nextRandom = [];
        for (let i = this.currentWord; i < this.words.length; i++) {
            let word = this.words[i];
            nextRandom = [...nextRandom, ...word.filter(w => w[1] != "none" && !nextRandom.includes(w[1])).map(w => w[1])];
            if (nextRandom.length >= 5)
                break;
        }
        if (nextRandom.length > 5)
            nextRandom = nextRandom.slice(5);
        console.log("random", nextRandom);
    }

    nextWord() {
        if (this.isLastWord()) {
            return;
        }
        this.currentWord++;
        this.fillNextRandom();
        this.fillPositions();
    }

    createImageFromImageData(imagedata) {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = imagedata.width;
        canvas.height = imagedata.height;
        ctx.putImageData(imagedata, 0, 0);
        
        var image = new Image();
        image.src = canvas.toDataURL();
        return image;
    }

    recreateGradients() {
        let eh = this.ctx.createLinearGradient(0, 0, 0, size);
        eh.addColorStop(0,  "rgb(120,63,4)");
        eh.addColorStop(0.5,"rgb(120,63,4)");
        eh.addColorStop(0.5,"rgb(244,190,127)");
        eh.addColorStop(1,  "rgb(244,190,127)");

        this.colors["EH"] = eh;

        let iy = this.ctx.createLinearGradient(0, 0, 0, size);
        iy.addColorStop(0,  "rgb(1,153,124)");
        iy.addColorStop(0.5,"rgb(1,153,124)");
        iy.addColorStop(0.5,"rgb(120,63,4)");
        iy.addColorStop(1,  "rgb(120,63,4)");

        this.colors["IY"] = iy;

        let ow = this.ctx.createLinearGradient(0, 0, 0, size);
        ow.addColorStop(0,  "rgb(221,76,54)");
        ow.addColorStop(0.5,"rgb(221,76,54)");
        ow.addColorStop(0.5,"rgb(137,104,158)");
        ow.addColorStop(1,  "rgb(137,104,158)");

        this.colors["OW"] = ow;
    }

    isCurrentWordFinished() {
        return this.words[this.currentWord].every(pos => pos[1] == "none" || pos[4]);
    }

    isLastWord() {
        return this.currentWord == this.words.length-1;
    }

    resize() {
        super.resize();

        min = Math.min(canvas.width, canvas.height);
        size = (min-2*margin) / columns;

        this.ctx.font = `${size}px sans-serif`;

        if (this.colors) {
            this.layoutWords();
            this.recreateGradients();
        }
    }

    update(dt) {
        state.update(dt);
    }
    
    draw(ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw words
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.textBaseline = "top"; 
        this.words.forEach((w, i) => {
            w.forEach(p => {
                let [s, c, px, py, level] = p;
                c = c == "none" || level ? this.colors[c] : "white";
                ctx.save();
                ctx.translate(px, py);
                ctx.fillStyle = c;
                ctx.fillText(s, 0, 0);
                ctx.strokeText(s, 0, 0);
                if (i > this.currentWord) {
                    ctx.fillStyle = "#00808080";
                    ctx.fillRect(0, -5, 200, size);
                }
                ctx.restore();
            });
        });

        // Draw game
        state.draw(ctx);

        // Draw finish button
        if (this.isLastWord() && this.isCurrentWordFinished()) {
            ctx.fillStyle = "purple";
            ctx.save();
            ctx.translate(min*0.5, min*0.5);
            ctx.beginPath();
            ctx.arc(0, 0, size, 0 , 2*Math.PI);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.moveTo(-size*0.5, -size*0.5);
            ctx.lineTo(size*0.5,0);
            ctx.lineTo(-size*0.5, size*0.5);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
            ctx.restore();
        }
    }
    
    touchdown(x, y) {
        
    }
    
    touchmove(x, y, dx, dy) {
        
    }
    
    touchup(x, y) {
        getState().touchup(x, y);
    }
}

let app = new GameApp(document.getElementById("canvasContainer"));

function getApp() {
    return app;
}