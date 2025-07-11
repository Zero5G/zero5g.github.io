import * as CG from "./modules/canvas_graphics.js";
import { ExpandedResize } from "./modules/custom_events.js";

new ExpandedResize(500);

const dot_layer_id = 0;
const dot_interval = 30;
const dot_radius = 2.4;

const line_layer_id = 1;

const randomSign = () => Math.random() > 0.5 ? 1 : -1;

const background = document.querySelector("#background");

const graphics = new CG.Graphics(dot_layer_id, window.innerHeight, window.innerWidth);
    graphics.append(background, false, dot_layer_id);
const dot_layer = graphics.getLayer(dot_layer_id);

function generatePoints(height: number, width: number, interval: number): number[][] {
    let points: number[][] = [];

    // offset to fix js randoms low chance of points at the end
    const offset = 1.7;

    const rows = Math.floor(width / interval);
    const columns = Math.floor(height / interval);

    for (let r = 0; r < columns; r++) {
        for (let c = 0; c < rows; c++) {
            let sign = randomSign();
            let xy = [
                c * interval + Math.floor((Math.random() + offset) * interval * sign),
                r * interval + Math.floor((Math.random() + offset) * interval * sign),
            ];
            points.push(xy);
        }
    }

    return points;
}

let points;

function drawDots(graphics: CG.Graphics, layer_id: number, dots: number[][], radius: number) {
    const XY = new CG.XY(0, 0);
    dots.forEach(dot => {
        graphics.circle(layer_id,
            XY.fromArray(dot),
            radius,
            "black",
            true
        )
    });
}

function handleResizeStart() {
    dot_layer.clearAll();
}

function handleResizeEnd() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    dot_layer.resize(width, height);
    points = generatePoints(height, width, dot_interval)
    drawDots(graphics, dot_layer_id, points, dot_radius);
}

document.addEventListener("DOMContentLoaded", () => {
    console.log(window.innerHeight, window.innerWidth);
    points = generatePoints(window.innerHeight, window.innerWidth, dot_interval);
    drawDots(graphics, dot_layer_id, points, dot_radius);
})
//@ts-ignore
window.addEventListener("resizeStart", handleResizeStart);
//@ts-ignore
window.addEventListener("resizeEnd", handleResizeEnd);
