 /**
 * @param x
 * @param y
 * @param column
 * @param row
 */
class Point {
    constructor(x, y, row, column) {
        this.x = x;
        this.y = y;
        this.column = column;
        this.row = row;
    }
}
/**
 * @param {Point} point
 * @param {Point} base_point
 */
function filterNear(point, base_point, range) {
    const column = point.column < base_point.column + range && point.column > base_point.column - range;
    const row = point.row < base_point.row + range && point.row > base_point.row - range;
    return column && row;
}
class Manager {
    constructor() {
        const dotCanvas = document.createElement("canvas");
            dotCanvas.className = "bg";
            dotCanvas.width = window.innerWidth;
            dotCanvas.height = window.innerHeight;
            dotCanvas.style.zIndex = 98;
        document.body.appendChild(dotCanvas);
        this.dotCanvas = dotCanvas;
        this.dotCtx = this.dotCanvas.getContext("2d");

        const lineCanvas = document.createElement("canvas");
            lineCanvas.className = "bg";
            lineCanvas.width = window.innerWidth;
            lineCanvas.height = window.innerHeight;
            lineCanvas.style.zIndex = 99;
        document.body.appendChild(lineCanvas);
        this.lineCanvas = lineCanvas;
        this.lineCtx = this.lineCanvas.getContext("2d");
        this.points = [];
    }
    drawDots(radius) {
        this.points.forEach(p => {
            this.dotCtx.beginPath();
            this.dotCtx.arc(p.x, p.y, radius, 0, 2 * Math.PI)
            this.dotCtx.fill();
        });
    }
    clearPoints() {
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
    closestPoints(point, number) {
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
    optiClosestPoints(point, number) {
        let closest = this.last_closest ? this.last_closest : this.closest(point, this.points);
        let points = this.points.filter(
            (f) => filterNear(f, closest, 6)
        );
        console.log(points);
        let cpoints = [];
        for (let i = 0; i < number; i++) {
            closest = this.closest(point, points)
            cpoints.push(closest);
            points.splice(
                points.indexOf(closest), 1
            );
        }
        this.last_closest = closest;
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
        const closest = this.closestPoints(m, 5);
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
        const closest = this.closestPoints(m, 5);
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
        this.clearPoints();
        const column_points = window.innerWidth / point_distance;
        const row_points = window.innerHeight / point_distance;

        for (let row = 1; row <= row_points; row++) {
            for (let column = 1; column <= column_points; column++) {
                this.points.push(
                    new Point(
                        column * point_distance,
                        row * point_distance,
                        row,
                        column
                    )
                )
            }
        }
    }
    genRandom(point_distance) {
        this.clearPoints();
        const column_points = window.innerWidth / point_distance;
        const row_points = window.innerHeight / point_distance;

        for (let row = 1; row <= row_points; row++) {
            for (let column = 1; column <= column_points; column++) {
                const rand1 = Math.random();
                const rand2 = Math.random();
                this.points.push(
                    new Point(
                        column * point_distance + point_distance * rand1 * (rand1 > 0.5 ? -1 : 1),
                        row * point_distance + point_distance * rand2 * (rand1 > 0.5 ? -1 : 1),
                        row,
                        column
                    )
                )
            }
        }
    }
}
const manager = new Manager();
manager.genRandom(50);
manager.drawDots(1.5);
document.addEventListener("mousemove", (e) => { manager.multiLine(e) })