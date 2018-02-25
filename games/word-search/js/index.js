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
    if (this.word && this.length < word.length) {
      return [];
    }
    return new Array(this.length-word.length).fill(0).map((v, i) => this.from + i);
  }
}

class Grid {
  constructor(w, h) {
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
    
    ctx.fillStyle = "yellow";
    ctx.textAlign = "center";
    
    this.rows.forEach((row, i) => row.filter(span => span.word && span.found).forEach(span => {
      drawHighlight(ctx, span.from * 40, i * 40, span.length * 40, 40, 20, true, false);
    }));
    
    this.columns.forEach((column, i) => column.filter(span => span.word && span.found).forEach(span => {
      drawHighlight(ctx, i * 40, span.from * 40, 40, span.length * 40, 20, true, true);
    }));
    
    this.rows.forEach((row, i) => row.filter(span => span.word && span.found).forEach(span => {
      drawHighlight(ctx, span.from * 40, i * 40, span.length * 40, 40, 20, false, true);
    }));
    
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    for (let j = 0; j < height; j++) {
      for (let i = 0; i < width; i++) {
        ctx.fillText(grid[j*width+i], 20 + i * 40, 20 + j * 40);
      }
    }
  }
}

class Puzzle {
  constructor(w, h, words) {
    // TODO: validate that words fit the grid
    this.grid = new Grid(w, h);
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
   
  getWord(x, y, w, h) {
    if (w > h)
      return this.grid.getRowWord(y, x, w);
    else
      return this.grid.getColumnWord(x, y, h);
  }
  
  renderList(parent) {
    this.words.forEach(word => {
      let li = document.createElement("li");
      let text = document.createTextNode(word);
      li.appendChild(text);
      parent.appendChild(li);
    });
  }
}

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext('2d');

let puzzle = new Puzzle(8, 8).fill({h:[[2, 2, "apple"], [4, 0, "pear"], [6, 0, "peach"], [7, 4, "kiwi"]], v:[[2, 1, "banana"], [5, 2, "lemon"], [6, 1, "berry"]]});
puzzle.renderCanvas(ctx);
puzzle.renderList(document.getElementById("list"));

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
    drawHighlight(ctx, x * 40, y * 40, w * 40, h * 40, 20, false, true);
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

canvas.addEventListener("mousedown", (event) => {
  let x = Math.floor(event.clientX / 40);
  let y = Math.floor(event.clientY / 40);
  sel = new Selection(x, y);
  ctx.clearRect(0, 0, 400, 400);
  puzzle.renderCanvas(ctx);
  sel.draw(ctx);
});

canvas.addEventListener("mousemove", (event) => {
  if (!sel) return;
  let x = Math.floor(event.clientX / 40);
  let y = Math.floor(event.clientY / 40);
  sel.extendTo(x, y);
  ctx.clearRect(0, 0, 400, 400);
  puzzle.renderCanvas(ctx);
  sel.draw(ctx);
});

canvas.addEventListener("mouseup", (event) => {
  if (!sel) return;
  word = puzzle.getWord(sel.x, sel.y, sel.w, sel.h);
  if (word) {
    let list = document.getElementById("list");
    let elements = list.getElementsByTagName("li");
    Array.prototype.some.call(elements, li => {
      if (li.innerText == word) {
        console.log(li)
        li.classList.add("found");
        return true;
      }
      return false;
    })
  }
  console.log(word);
  sel = null;
  ctx.clearRect(0, 0, 400, 400);
  puzzle.renderCanvas(ctx);
});