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

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext('2d');

function randomColor(pos) {
    let tries = 100;
    while (tries--) {
        let color = 1 + Math.floor(Math.random() * Math.floor(5));
        if (checkNeighbours(color, xpos(pos), ypos(pos)))
        return color;
    }
    return 1;
}

let columns = 10;
let rows = 10;
let grid = new Array(columns*rows).fill(0);
grid = grid.map((v, i) => randomColor(i));

class Idle {
    constructor() {
        this.redraw = false;
    }
    
    draw() {
        let pos = 0;
        for (let j = 0; j < rows; j++) {
            for (let i = 0; i < columns; i++) {
                this.drawDot(i, j, pos++);
            }
        }
    }
    
    drawDot(x, y, pos) {
        ctx.fillStyle = colors[getColor(x, y)];
        ctx.beginPath();
        ctx.arc(20+x*50, 20+y*50, 20, 0, 2 * Math.PI);
        ctx.fill();
    }

    update() {

    }
}

let state = new Idle();
let time = 0;
let dirty = true;

let colors = ["white", "red", "blue", "green", "yellow", "purple"];

let img = renderSprite();

const popTime = 400;

class Pop extends Idle {
    constructor(list) {
        console.log("popping", list);
        super();
        this.grid = new Array(columns*rows).fill(false);
        list.forEach(pos => { this.grid[pos] = true; });
    }
    
    drawDot(x, y, pos) {
        if (this.grid[pos]) {
            ctx.fillStyle = colors[getColor(pos)];
            ctx.beginPath();
            ctx.arc(20+x*50, 20+y*50, 20*(popTime-time)/popTime, 0, 2 * Math.PI);
            ctx.fill();
        }
        else 
        super.drawDot(x, y, pos);
    }
    
    update() {
        dirty = true;
        if (time < popTime) {
            return;
        }
        this.grid.forEach((popped, pos) => { if (popped) setColor(0, pos); });
        setState(new Idle());
        drop();
    }
}

const dropTime = 100;

class Drop extends Idle {
    constructor(list) {
        console.log(`dropping`, list);
        super();
        this.list = list;
    }
    
    drawDot(x, y, pos) {
        if (this.list && y <= this.list[x]) {
            ctx.fillStyle = colors[getColor(pos)];
            ctx.beginPath();
            ctx.arc(20+x*50, 20+y*50-50*(dropTime-time)/dropTime, 20, 0, 2 * Math.PI);
            ctx.fill();
        }
        else {
            super.drawDot(x, y, pos);
        }
    }
    
    update() {
        dirty = true;
        if (time < dropTime) {
            return;
        }
        setState(new Idle());
        if (grid.some(color => color == 0)) {
            drop();
        }
        else {
            checkChains();
        }
    }
}

function onresize() {
    let div = document.getElementById("canvasContainer");
    canvas.width  = div.clientWidth;
    canvas.height = div.clientWidth;
    dirty = true;
}

window.addEventListener('resize', onresize, false);
onresize();

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

function pop(x, y) {
    console.log("pop started");
    if (typeof x == 'number') {
        let color = getColor(x, y);
        if (color) {
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
    console.log(list);
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
            console.log(`horizontal chain ${x-1}-${x+1},${y}`);
        }
    }
    
    let top = getColor(x, y-1);
    let bottom = getColor(x, y+1);
    if (top && bottom) {
        if (top == color && bottom == color) {
            set.add(posxy(x, y-1));
            set.add(posxy(x, y));
            set.add(posxy(x, y+1));
            console.log(`vertical chain ${x},${y-1}-${y+1}`);
        }
    }
    
    console.log(set, color, pos);
}

let prev = +new Date();

function draw() {
    let now = +new Date();
    let dt = now - prev;
    prev = now;
    state.update(dt);
    if (dirty) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        state.draw();
        dirty = false;
    }
    time += dt;
    window.requestAnimationFrame(draw);
}

draw();

function down(x, y) {
    
}

function move(x, y) {
    
}

function up(x, y) {
    pop(Math.floor(x/50), Math.floor(y/50));
}

function getmousePos(event) {
    if (event.changedTouches) {
        return [event.changedTouches[0].pageX, event.changedTouches[0].pageY];
    }
    else {
        return [event.clientX, event.clientY];
    }
}

canvas.addEventListener("mousedown", (event) => {
    let [x, y] = getmousePos(event);
    down(x, y);
    event.preventDefault();
});
canvas.addEventListener("mousemove", (event) => {
    let [x, y] = getmousePos(event);
    move(x, y);
    event.preventDefault();
});
canvas.addEventListener("mouseup", (event) => {
    let [x, y] = getmousePos(event);
    up(x, y);
    event.preventDefault();
});

canvas.addEventListener("touchstart", (event) => {
    let [x, y] = getmousePos(event);
    down(x, y);
    event.preventDefault();
});
canvas.addEventListener("touchmove", (event) => {
    let [x, y] = getmousePos(event);
    move(x, y);
    event.preventDefault();
});
canvas.addEventListener("touchend", (event) => {
    let [x, y] = getmousePos(event);
    up(x, y);
    event.preventDefault();
});