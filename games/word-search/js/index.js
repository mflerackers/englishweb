/**
*
* @source: https://english.fromatogra.com/games/word-search/js/index.js
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

function drawHighlight(ctx, x, y, width, height, radius=20, fill=true, stroke=false) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
} 

class Span {
  constructor(from, to, word) {
    this.from = from;
    this.to = to;
    this.word = word;
    this.length = word ? word.length : this.to - this.from + 1;
  }
  
  positions(word) {
    if (this.word || this.length < word.length) {
      return [];
    }
    return new Array(this.length-word.length).fill(0).map((v, i) => this.from + i);
  }
}

class Grid {
  constructor(w, h, gridSize) {
    this.rows = new Array(h).fill(0).map(_ => [new Span(0, w-1)]);
    this.columns = new Array(w).fill(0).map(_ => [new Span(0, h-1)]);
  }
  
  rowPositions(row, word) {
    return this.rows[row].map(span => span.positions(word)).reduce((a, p) => a.concat(p), []);
  }
  
  columnPositions(column, word) {
    return this.columns[column].map(span => span.positions(word)).reduce((a, p) => a.concat(p), []);
  }
  
  rowInsert(index, pos, word) {
    this.spanInsert(this.rows[index], pos, word);
  }
  
  columnInsert(index, pos, word) {
    this.spanInsert(this.columns[index], pos, word);
  }
  
  spanInsert(spans, pos, word) {
    for (let i = 0; i < spans.length; i++) {
      let span = spans[i];
      if (pos > span.to)
        continue;
      let newSpans = [];
      if (span.from < pos) { newSpans.push(new Span(span.from, pos-1)); }
      newSpans.push(new Span(pos, pos + word.length - 1, word));
      if (span.to > pos + word.length - 1) { newSpans.push(new Span(pos + word.length, span.to)); }
      spans.splice(i, 1, ...newSpans);
      break;
    }
  }
  
  getSpanWord(spans, pos, length) {
    let word = null;
    console.log(spans, pos, length)
    spans.filter(span => span.word).some(span => {
      if (span.from == pos && span.length == length) {
        span.found = true;
        word = span.word;
        return true;
      }
      return false;
    });
    return word;
  }
  
  getRowWord(row, pos, length) {
    return this.getSpanWord(this.rows[row], pos, length);
  }
  
  getColumnWord(column, pos, length) {
    return this.getSpanWord(this.columns[column], pos, length);
  }
 
  getGrid() {
    if (!this.grid) {
      let width = this.columns.length;
      let height = this.rows.length;
      this.grid = new Array(width * height).fill(0).map(_ => String.fromCharCode(Math.floor(Math.random() * 26) + 97));
      this.rows.forEach((row, r) => row.filter(span => span.word).forEach(span => {
        let offset = r*width+span.from;
        for (let i = 0; i < span.word.length; i++) {
          this.grid[offset+i] = span.word[i];
        }
      }));
      this.columns.forEach((column, c) => column.filter(span => span.word).forEach(span => {
        let offset = span.from*width + c;
        for (let i = 0; i < span.word.length; i++) {
          this.grid[offset+i*width] = span.word[i];
        }
      }));
    }
    return this.grid;
  }
  
  renderHtml(parent) {
    let grid = this.getGrid();
    let width = this.columns.length;
    let height = this.rows.length;
                      
    let table = document.createElement("table");
    for (let j = 0; j < height; j++) {
      let tr = document.createElement("tr");
      for (let i = 0; i < width; i++) {
        let td = document.createElement("td");
        let text = document.createTextNode(grid[j*width+i]);
        td.appendChild(text);
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }
    parent.appendChild(table);
  }
  
  renderCanvas(ctx) {
    let grid = this.getGrid();
    let width = this.columns.length;
    let height = this.rows.length;
    
    let gridSize = canvas.width / width;
    
    ctx.fillStyle = "yellow";
    ctx.textAlign = "center";
    
    this.rows.forEach((row, i) => row.filter(span => span.word && span.found).forEach(span => {
      drawHighlight(ctx, span.from * gridSize, i * gridSize, 
                    span.length * gridSize, gridSize, 
                    gridSize * 0.5, true, false);
    }));
    
    this.columns.forEach((column, i) => column.filter(span => span.word && span.found).forEach(span => {
      drawHighlight(ctx, i * gridSize, span.from * gridSize,
                    gridSize, span.length * gridSize, gridSize * 0.5, true, true);
    }));
    
    this.rows.forEach((row, i) => row.filter(span => span.word && span.found).forEach(span => {
      drawHighlight(ctx, span.from * gridSize, i * gridSize, 
                    span.length * gridSize, gridSize, gridSize *0.5, false, true);
    }));
    
    ctx.fillStyle = "black";
    ctx.font = (gridSize * 0.5) + 'px sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    for (let j = 0; j < height; j++) {
      for (let i = 0; i < width; i++) {
        ctx.fillText(grid[j*width+i], 
                     gridSize * 0.5 + i * gridSize, 
                     gridSize * 0.5 + j * gridSize);
      }
    }
  }
}

class Puzzle {
  constructor(w, h, words) {
    // TODO: validate that words fit the grid
    this.grid = new Grid(w, h);
    this.sel = null;
  }
  
  generate(words) {
    // Sort long to short
    words.sort((a, b) => b.length - a.length);
    
    words.forEach(word => {
      this.grid.rowInsert(1, 2, word);
      this.grid.columnInsert(1, 2, word);
    });
  }
  
  fill(words) {
    this.words = [];
    if (words.h) {
      words.h.forEach(word => {
        this.grid.rowInsert(word[0], word[1], word[2]);
        this.words.push(word[2]);
      });
    }
    if (words.v) {
      words.v.forEach(word => {
        this.grid.columnInsert(word[0], word[1], word[2]);
        this.words.push(word[2]);
      });
    }
    return this;
  }
  
  renderHtml(parent) {
    this.grid.renderHtml(parent);
  }
  
  renderCanvas(ctx) {
    this.grid.renderCanvas(ctx);
  }
  
  // Checks whether there is a word at the given selection
  getWord(x, y, w, h) {
    if (w > h)
      return this.grid.getRowWord(y, x, w);
    else
      return this.grid.getColumnWord(x, y, h);
  }
  
  // Renders the word list in html
  renderList(parent) {
    this.words.forEach(word => {
      let li = document.createElement("li");
      let text = document.createTextNode(word);
      li.appendChild(text);
      parent.appendChild(li);
    });
  }
  
  clientToGrid(x, y) {
    let gridSize = canvas.width / this.grid.rows.length;
    x = Math.floor(x / gridSize);
    y = Math.floor(y / gridSize);
    return [x, y];
  }
  
  ondraw(ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.renderCanvas(ctx);
    if (this.sel)
      this.sel.draw(ctx);
  }
  
  ondown(ctx, x, y) {
    [x, y] = this.clientToGrid(x, y);
    this.sel = new Selection(x, y);
    this.ondraw(ctx);
  }
  
  onmove(ctx, x, y) {
    if (!this.sel) return;
    [x, y] = this.clientToGrid(x, y);
    this.sel.extendTo(x, y);
    this.ondraw(ctx);
  }
  
  onup(ctx, x, y) {
    if (!this.sel) return;
    let word = this.getWord(this.sel.x, this.sel.y, this.sel.w, this.sel.h);
    if (word) {
      let list = document.getElementById("list");
      let elements = list.getElementsByTagName("li");
      Array.prototype.some.call(elements, li => {
        if (li.innerText == word) {
          li.classList.add("found");
          return true;
        }
        return false;
      })
    }
    console.log(word);
    this.sel = null;
    this.ondraw(ctx);
  }
}

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext('2d');

let puzzle = new Puzzle(8, 8).fill({h:[[2, 2, "apple"], [4, 0, "pear"], [6, 0, "peach"], [7, 4, "kiwi"]], v:[[2, 1, "banana"], [5, 2, "lemon"], [6, 1, "berry"]]});
puzzle.renderCanvas(ctx);
puzzle.renderList(document.getElementById("list"));

function onresize() {
  let div = document.getElementById("canvasContainer");
  canvas.width  = div.clientWidth;
  canvas.height = div.clientWidth;
  puzzle.ondraw(ctx);
}

window.addEventListener('resize', onresize, false);
onresize();

let sel = null;

class Selection {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 1;
    this.h = 1;
  }
  
  draw(ctx) {
    let x = this.w > 0 ? this.x : this.x + this.w + 1;
    let y = this.h > 0 ? this.y : this.y + this.h + 1;
    let w = this.w > 0 ? this.w : -this.w;
    let h = this.h > 0 ? this.h : -this.h;
    let gridSize = canvas.width / puzzle.grid.rows.length;
    drawHighlight(ctx, x * gridSize, y * gridSize, w * gridSize, h * gridSize, gridSize * 0.5, false, true);
  }
  
  extendTo(x, y) {
    let dx = x - this.x;
    let dy = y - this.y;
    if (Math.abs(dx) >= Math.abs(dy)) {
      this.h = 1;
      if (dx >= 0)
        this.w = dx + 1;
      else
        this.w = dx - 1;
    }
    else {
      this.w = 1;
      if (dy >= 0)
        this.h = dy + 1;
      else
        this.h = dy - 1;
    }
  }
}

function down(x, y) {
  puzzle.ondown(ctx, x, y);
}

function move(x, y) {
  puzzle.onmove(ctx, x, y);
}

function up(x, y) {
  puzzle.onup(ctx, x, y);
}

function getmousePos(event) {
  if (event.changedTouches)
    return [event.touches[0].pageX, event.touches[0].pageY];
  else
    return [event.clientX, event.clientY];
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