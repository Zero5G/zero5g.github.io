/**
 * @param x
 * @param y
 * @param column
 * @param line
 */
class Point {
    constructor(x, y, line, column) {
        this.x = x;
        this.y = y;
        this.column = column;
        this.line = line;
    }
}
class Manager {
    constructor() {
        const canvas = document.createElement("canvas");
            canvas.id = "bg";
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        document.body.appendChild(canvas);
        this.lineCanvas = canvas;
        this.lineCtx = this.lineCanvas.getContext("2d");
        this.points = [];
    }
    clearAll() {
        this.lineCtx.clearRect(
            0, 0,
            this.lineCanvas.getBoundingClientRect().width, 
            this.lineCanvas.getBoundingClientRect().height
        );
    }
    /**
     * @param {Point} point
     * @param {Array} points 
     */
    closest(point, points) {
        let distance = Number.MAX_VALUE;
        let closest;
        points.forEach(p => {
            const cd = this.distance(p, point);
            if (cd < distance) {
                distance = cd;
                closest = p;
            }
        });
        return closest;
    }
    closest_points(point, number) {
        let points = [...this.points];
        let cpoints = [];
        for (let i = 0; i < number; i++) {
            let closest = this.closest(point, points);
            cpoints.push(closest);
            points.splice(
                points.indexOf(closest), 1
            );
        }
        return cpoints;
    }
    /**
     * 
     * @param {Point} a 
     * @param {Point} b 
     * @returns Distance between 2 points
     */
    distance(a, b) {
        const test = Math.sqrt(
            Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2)
        );
        return test;
    }
    /**
     * 
     * @param {Point} a 
     * @param {Point} b 
     */
    drawLine(a, b) {
        this.lineCtx.beginPath();
        this.lineCtx.moveTo(a.x, a.y);
        this.lineCtx.lineTo(b.x, b.y);
        this.lineCtx.stroke();
    }
    /**
     * @param {MouseEvent} mouse
     */
    singleLine(mouse) {
        const m = new Point(mouse.clientX, mouse.clientY);
        this.clearAll();
        this.drawLine(this.closest(m, this.points), m);
    }
    multiLine(mouse) {
        const m = new Point(mouse.clientX, mouse.clientY);
        const closest = this.closest_points(m, 5);
        this.clearAll();
        closest.forEach(p => {
            this.drawLine(p, m);   
        });
    }
    //////////////////////////////////////
    // NOT DONE
    // Requires ordering of points to look correct
    connectMultiLine(mouse) {
        const m = new Point(mouse.clientX, mouse.clientY);
        const closest = this.closest_points(m, 5);
        this.clearAll();
        closest.forEach(p => {
            this.drawLine(p, m);   
        });
        this.lineCtx.beginPath();
        this.lineCtx.moveTo(closest[1].x, closest[1].y);
        closest.shift();
        closest.forEach(p => {
            this.lineCtx.lineTo(p.x, p.y);
        })
        this.lineCtx.lineTo(closest[1].x, closest[1].y);
        this.lineCtx.stroke();
    }
    gen(point_distance) {
        const column_points = window.innerWidth / point_distance;
        const line_points = window.innerHeight / point_distance;

        for (let line = 1; line <= line_points; line++) {
            for (let column = 1; column <= column_points; column++) {
                this.points.push(
                    new Point(
                        column * point_distance,
                        line * point_distance,
                        line,
                        column
                    )
                )
            }
        }
    }
    genRandom(point_distance) {
        const column_points = window.innerWidth / point_distance;
        const line_points = window.innerHeight / point_distance;

        for (let line = 1; line <= line_points; line++) {
            for (let column = 1; column <= column_points; column++) {
                this.points.push(
                    new Point(
                        column * point_distance * Math.random(),
                        line * point_distance * Math.random(),
                        line,
                        column
                    )
                )
            }
        }
    }
}
const manager = new Manager();
manager.genRandom(60);
document.addEventListener("mousemove", (e) => { manager.multiLine(e) })