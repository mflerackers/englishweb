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

function randomColor(pos) {
    let tries = 100;
    while (tries--) {
        let color = 1 + Math.floor(Math.random() * Math.floor(5));
        if (checkNeighbours(color, xpos(pos), ypos(pos)))
            return color;
    }
    return 1;
}

const columns = 10;
const rows = 10;
const margin = 10;
let min = Math.min(canvas.width, canvas.height);
let size = (min-2*margin) / columns;
let grid = new Array(columns*rows).fill(0);
grid = grid.map((v, i) => randomColor(i));

let img;

const phonemes = ["AA", "AE", "AH", "AO", "JH"];
let voice = "monet";

let sounds = phonemes.map(phoneme => 
    new Howl({
        src: ["../../phonemes/"+voice+"/"+phoneme+".wav"],
        html5: true
    })
);

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
    
    drawDot(ctx, x, y, pos, dx, dy, s) {
        dx = dx || 0;
        dy = dy || 0;
        s = s || 1;
        //ctx.fillStyle = colors[getColor(pos)];
        //ctx.beginPath();
        //ctx.arc(20+x*50, 20+y*50+dy, 20 * s, 0, 2 * Math.PI);
        //ctx.rect(x*50+10+20*(1-s), y*50+10+20*(1-s)+dy, 40 * s, 40 * s);
        ctx.drawImage(img, getColor(pos)*50, 0, 50, 50, margin+x*size+size*0.5*(1-s)+dx, margin+y*size+size*0.5*(1-s)+dy, s * size, s * size);
        //ctx.fill();
    }
    
    update(dt) {
        
    }
    
    touchup(x, y) {
        pop(Math.floor((x-margin)/size), Math.floor((y-margin)/size));
    }
}

let state = new Idle();

const popTime = 0.5;

class Pop extends Idle {
    constructor(list, x, y) {
        console.log("popping", list);
        super();
        this.grid = new Array(columns*rows).fill(false);
        list.forEach(pos => { this.grid[pos] = true; });
        this.time = 0;
        this.x = x;
        this.y = y;
    }
    
    drawDot(ctx, x, y, pos) {
        if (this.grid[pos]) {
            let alpha = Math.min(1, this.time/popTime);
            let scale = (popTime-this.time)/popTime;
            if (this.x || this.y) {
                let dx = margin+x*size
                let dy = margin+y*size
                super.drawDot(ctx, x, y, pos, (this.x-dx)*alpha, (this.y-dy)*alpha, scale);
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
        /*else {
            checkChains();
        }*/
    }
    
    touchup(x, y) {}
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

/*function pop(x, y) {
    console.log("pop started");
    if (typeof x == 'number') {
        let color = getColor(x, y);
        if (color) {
            sounds[color-1].play();
            setState(new Pop([posxy(x, y)]));
        }
        else {
            console.log("no color to pop");
        }
    }
    else {
        setState(new Pop(x));
    }
    console.log("pop done");
}*/

function pop(x, y) {
    console.log("pop started");
    if (typeof x == 'number') {
        let color = getColor(x, y);
        let list = canPop(color, x, y);
        if (list && list.length > 2) {
            sounds[color-1].play();
            let phoneme = phonemes[color-1];
            let position = positions[phoneme] || [0, 0];
            console.log("positions", phoneme, position, positions)
            setState(new Pop(list, ...position));
        }
        else {
            console.log("no color to pop");
        }
    }
    else {
        setState(new Pop(x));
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

        img = this.createImageFromImageData(renderSprite(this.ctx));

        this.colors = {
            "none": "black",
            "AH": "rgb(255,242,89)",
            "AO": "rgb(120,63,4)",
            "ER": "rgb(225,124,167)",
            "IU": "rgb(244,190,127)"
        };

        this.recreateGradients();

        this.words = [
            [["h", "none"], ["ea", "EH"], ["v", "none"], ["e","AH"], ["n", "none"]], 
            [["s", "none"], ["aw", "AO"]], 
            [["h", "none"], ["ow", "OW"]],
            [["l", "none"], ["o", "OW"], ["nel", "none"], ["y", "IY"]],
            [["you", "IU"]],
            [["we", "none"], ["r", "ER"], ["e", "none"]],
        ];

        this.loop();
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

    resize() {
        super.resize();

        min = Math.min(canvas.width, canvas.height);
        size = (min-2*margin) / columns;

        this.ctx.font = `${size}px sans-serif`;

        if (this.colors) {
            this.recreateGradients();
        }
    }

    update(dt) {
        state.update(dt);
    }
    
    draw(ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        state.draw(ctx);

        // Draw words
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.textBaseline = "top"; 
        if (this.canvas.width > this.canvas.height) {
            this.words.forEach((w, i) => {
                let x = min + 20;
                let y = size + i * size;
                w.forEach(p => {
                    let [s, c] = p;
                    if (!positions[c])
                    positions[c] = [x, y];
                    c = this.colors[c];
                    ctx.save();
                    ctx.translate(x, y);
                    ctx.fillStyle = c;
                    ctx.fillText(s, 0, 0);
                    ctx.strokeText(s, 0, 0);
                    ctx.restore();
                    x += ctx.measureText(s).width;
                });
            });
        }
        else {
            this.words.forEach((w, i) => {
                ctx.fillText(w, 20, min + 20 + i * size);
                ctx.strokeText(w, 20, min + 20 + i * size);
            });
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