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
let size = (canvas.width-2*margin) / columns;
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
    
    drawDot(ctx, x, y, pos, dy, s) {
        dy = dy || 0;
        s = s || 1;
        //ctx.fillStyle = colors[getColor(pos)];
        //ctx.beginPath();
        //ctx.arc(20+x*50, 20+y*50+dy, 20 * s, 0, 2 * Math.PI);
        //ctx.rect(x*50+10+20*(1-s), y*50+10+20*(1-s)+dy, 40 * s, 40 * s);
        ctx.drawImage(img, getColor(pos)*50, 0, 50, 50, margin+x*size+size*0.5*(1-s), margin+y*size+size*0.5*(1-s)+dy, s * size, s * size);
        //ctx.fill();
    }
    
    update(dt) {
        
    }
    
    touchup(x, y) {
        pop(Math.floor((x-margin)/size), Math.floor((y-margin)/size));
    }
}

let state = new Idle();

const popTime = 0.400;

class Pop extends Idle {
    constructor(list) {
        console.log("popping", list);
        super();
        this.grid = new Array(columns*rows).fill(false);
        list.forEach(pos => { this.grid[pos] = true; });
        this.time = 0;
    }
    
    drawDot(ctx, x, y, pos) {
        if (this.grid[pos]) {
            super.drawDot(ctx, x, y, pos, 0, (popTime-this.time)/popTime);
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
            super.drawDot(ctx, x, y, pos, -50*(dropTime-this.time)/dropTime);
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
            setState(new Pop(list));
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

class GameApp extends App {

    constructor(div) {
        super(div);

        img = this.createImageFromImageData(renderSprite(this.ctx));
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

    resize() {
        super.resize();

        size = (canvas.width-2*margin) / columns;
    }

    update(dt) {
        state.update(dt);
    }
    
    draw(ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        state.draw(ctx);
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