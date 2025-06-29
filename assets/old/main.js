class Manager {
    constructor() {
        const canvas = document.createElement("canvas");
            canvas.id = "bg";
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        document.body.appendChild(canvas);
        this.element = canvas;
        this.ctx = this.element.getContext("2d");
        this.points = [];
    }
    fill(line, count) {
        for (let i = 0; i < line; i++) {
            let line = [];
            for (let j = 0; j < count; j++) {
                line[j] = new Point(j, i, this);
            }
            this.points[i] = line;
        }
    }
    clearAll() {
        this.ctx.clearRect(0, 0, this.element.getBoundingClientRect().width, this.element.getBoundingClientRect().height);
    }
}
/**
 * @param {MouseEvent} e
 * @param {Manager} manager
 * @param {Point} point
 */
function handleHover(e, manager, point) {
    manager.clearAll();
    const mouse = {
        x: e.clientX,
        y: e.clientY,
    };
    const center = point.center();
    const ctx = manager.ctx;
        ctx.beginPath();
        ctx.moveTo(mouse.x, mouse.y);
        ctx.lineTo(center.x, center.y);
        ctx.stroke();
}
class Point {
    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Manager} manager 
     */
    constructor(x, y, manager) {
        this.x = x;
        this.y = y;
        this.element = document.createElement("div");
        this.element.style.width = "133px";
        this.element.style.height = "133px";
        this.element.id = `x${x}y${y}point`;
        this.element.className = `point`;
        this.element.addEventListener("mousemove", (e) => { handleHover(e, manager, this) });
        //console.log(this.element.onmousemove);
        document.body.appendChild(this.element);
    }
    init(manager) {
        this.element.addEventListener("mousemove", (e) => { handleHover(e, manager, this) });
        //console.log(this.element.onmousemove);
        document.body.appendChild(this.element);
    }
    del() {
        this.element.remove();
    }
    box() {
        return this.element.getBoundingClientRect();
    }
    center() {
        const box = this.box();
        return {
            x: (box.width / 2) + box.x,
            y: (box.height / 2) + box.y,
        }
    }
}
const manager = new Manager();
manager.fill(1, 1);