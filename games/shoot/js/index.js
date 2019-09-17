/**
*
* @source: https://english.fromatogra.com/games/matching/js/index.js
*
* @licstart  The following is the entire license notice for the 
*  JavaScript code in this page.
*
* Copyright (C) 2016-2019 Marc Flerackers
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

function project(x, y, vx, vy) {
    let dvv = vx*vx+vy*vy;
    let dxy = x*vx+y*vy;
    let s = dxy / dvv;
    return [s*vx, s*vy];
  }
  
  class Ball {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.vx = 0;
      this.vy = 0;
      this.ax = 0;
      this.ay = 0;
      this.collides = false;
    }
    
    update(dt) {
      this.vx += dt * this.ax;
      this.vy += dt * this.ay;
      this.x += dt * this.vx;
      this.y += dt * this.vy;
    }
    
    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 20, 0, 2 * Math.PI, false);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }
  
  class Crossbow {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.angle = 0;
    }
    
    update(dt) {
      
    }
    
    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.fillStyle = "black";
      ctx.fillRect(-5, -50, 10, 100);
      ctx.beginPath();
      ctx.moveTo(-10, -40);
      ctx.lineTo(-0, -60);
      ctx.lineTo(10, -40);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }
  
  const colors = ["red", "blue", "green", "orange"];
  
  class GameApp extends App {
    constructor(div) {
      super(div);
      this.objects = [];
      this.grid = [];
      for (let j = 0; j < 4; j++) {
        let odd = j & 1;
        let count = odd ? 8 : 7;
        for (let i = 0; i < count; i++) {
          let color = colors[Math.floor(Math.random()*colors.length)];
          let ball = new Ball((odd ? 22.5 : 45) + i * 45, 20 + j * 45, color);
          this.grid[this.indexFromCoord(i, j)] = ball;
          this.objects.push(ball);
        }
      }
      
      this.crossbow = new Crossbow(20 +(45 * 7)*0.5, 400);
      this.objects.push(this.crossbow);
      this.newBall();
      this.state = "idle";
      this.loop();
    }
    
    indexFromCoord(i, j) {
      return j*8+i;
    }
    
    indexFromPos(x, y) {
      return this.indexFromCoord(...this.coordFromPos(x, y));
    }
    
    coordFromPos(x, y) {
      let j = Math.round((y - 20) / 45);
      let odd = j & 1;
      let padding = (odd ? 22.5 : 45);
      let i = Math.round((x - padding) / 45);
      i = Math.max(0, i);
      return [i, j];
    }
    
    coordFromIndex(index) {
      return [Math.floor(index % 8), Math.floor(index / 8)];
    }
    
    posFromCoord(i, j) {
      let odd = j & 1;
      let padding = (odd ? 22.5 : 45);
      return [padding + 45 * i, 20 + 45 * j];
    }
    
    rowFromIndex(index) {
      return Math.floor(index / 8);
    }
    
    columnFromIndex(index) {
      return Math.floor(index % 8);
    }
    
    isOddRow(index) {
      return Math.floor(index / 8) & 1;
    }
    
    neighbours(index) {
      let list = []
      let column = this.columnFromIndex(index);
      if (this.isOddRow(index)) {
        if (column > 0) {
          list.push(index - 9); // Left top
          list.push(index - 1); // Left
          list.push(index + 7); // Left bottom
        }
        if (column < 7) {
          list.push(index - 8); // Right top
          list.push(index + 1); // Right
          list.push(index + 8); // Right bottom
        }
      }
      else {
        list.push(index - 8); // Left top
        if (column > 0)
          list.push(index - 1); // Left
        list.push(index + 8); // Left bottom
        
        list.push(index - 7); // Right top
        if (column < 8)
          list.push(index + 1); // Right
        list.push(index + 9); // Right bottom
      }
      return list;
    }
    
    newBall() {
      let color = colors[Math.floor(Math.random()*colors.length)];
      this.ball = new Ball(20 +(45 * 7)*0.5, 400, color);
      this.objects.push(this.ball);
    }
    
    checkBalls(index, color) {
      let list = this.neighbours(index);
      if (!list.some(i => this.grid[i] && this.grid[i].color == color))
        return;
      // Search for all connected same colored balls
      let checked = new Set([index]);
      let unchecked = new Set(list.filter(i => this.grid[i] && this.grid[i].color == color));
      // While we have balls which are not checked yet
      while (unchecked.size > 0) {
        // Check next unchecked ball
        index = unchecked.values().next().value;
        checked.add(index);
        unchecked.delete(index);
        // Add every same colored ball which hasn't been checked yet
        this.neighbours(index).filter(i => this.grid[i] && this.grid[i].color == color && !checked.has(i)).forEach(i => unchecked.add(i));
      }
      // Make all same colored balls which touch fall
      checked.forEach(i => {
        let o = this.grid[i];
        o.ay = 980;
        this.grid[i] = null;
      });
      // Make all balls not connected to the ceiling fall
      checked.clear();
      // Add all ceiling balls
      for (let i = 0; i < 8; i++) {
        if (this.grid[i]) {
          unchecked.add(i);
        }
      }
      while (unchecked.size > 0) {
        // Check next unchecked ball
        index = unchecked.values().next().value;
        checked.add(index);
        unchecked.delete(index);
        // Add every connected ball not yet collected
        this.neighbours(index).filter(i => this.grid[i] && !checked.has(i)).forEach(i => unchecked.add(i));
      }
      // Make all unconnected balls fall
      this.grid.forEach((o, i) => {
        if (!o || checked.has(i))
          return;
        o.ay = 980;
        this.grid[i] = null;
      });
    }
    
    update(dt) {
      for (let o of this.objects)
        o.update(dt);
      if (this.state == "shooting") {
        // Remove ballif it has escaped the field
        if (this.ball.y < 0) {
          this.objects.splice(this.objects.indexOf(this.ball), 1);
          this.newBall();
          this.state = "idle";
          return;
        }
        // Remove all balls that have fallen past the field
        for (let i = this.objects.length-1; i >= 0; i--) {
          if (this.objects[i].y > canvas.height)
            this.objects.splice(i, 1);
        }
        // Check walls
        if (this.ball.x < 20 || this.ball.x > 40 + 45 * 7) {
          this.ball.vx *= -1;
        }
        // Check balls
        let [x, y] = [this.ball.x, this.ball.y];
        let vx, vy;
        for (let o of this.objects) {
          if (o == this.ball || o == this.crossbow)
            continue;
          vx = x - o.x;
          vy = y - o.y;
          if (vx*vx+vy*vy < 40*40) {
            // Stop movement
            this.ball.vx = 0;
            this.ball.vy = 0;
            // Do collision response
            let l = Math.sqrt(vx*vx+vy*vy);
            let s = 40 - Math.sqrt(vx*vx+vy*vy);
            this.ball.y += s*vy/l;
            this.ball.x += s*vx/l;
            // Clamp to grid
            let [i, j] = this.coordFromPos(this.ball.x, this.ball.y);
            [this.ball.x, this.ball.y] = this.posFromCoord(i, j);
            // Place into grid
            let index = this.indexFromCoord(i, j);
            if (this.grid[index])
              alert("bug");
            this.grid[index] = this.ball;
            // Eliminate same colored balls
            this.checkBalls(index, this.ball.color);
            // Next ball
            this.newBall();
            this.state = "idle";
            return;
          }
        }
      }
    }
    
    draw() {
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let o of this.objects)
        o.draw(this.ctx);
      this.ctx.fillStyle = "black";
      this.ctx.fillText(this.objects.length, 10, 10);
    }
    
    touchdown(x, y) {
      let vx = this.crossbow.x - x;
      let vy = this.crossbow.y - y;
      if ((vx*vx+vy*vy) < 20*20)
        this.state = "aiming";
    }
    
    touchmove(x,y) {
      //let index = this.indexFromPos(x, y);
      //console.log(index, this.coordFromPos(x, y), this.neighbours(index));
      if (this.state != "aiming" || y < this.crossbow.y)
        return;
      let vx = this.crossbow.x - x;
      let vy = this.crossbow.y - y;
      let angle = Math.atan2(vy, vx);
      this.crossbow.angle = Math.PI * 0.5 + angle;
    }
    
    touchup(x, y) {
      if (this.state != "aiming")
        return;
      let vx = Math.cos(this.crossbow.angle - Math.PI * 0.5);
      let vy = Math.sin(this.crossbow.angle - Math.PI * 0.5);
      this.state = "shooting";
      // TODO check pullback distance
      this.ball.vx = vx * 900;
      this.ball.vy = vy * 900;
    }
  }
  
  let app = new GameApp(document.getElementById("canvasContainer"));