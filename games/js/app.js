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