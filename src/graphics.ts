import * as CG from "./modules/canvas_graphics.js";
import { ExpandedResize } from "./modules/custom_events.js";

new ExpandedResize(500);

const dot_layer_id = 0;
const line_layer_id = 1;

const background = document.querySelector("#background");

const graphics = new CG.Graphics(dot_layer_id, window.innerHeight, window.innerHeight);
    graphics.append(background, false, dot_layer_id);
const dot_layer = graphics.getLayer(dot_layer_id);

function generatePoints(height: number, width: number, interval: number): number[][] {
    let points: number[][] = [];

    const count_x = Math.floor(width / interval);
    const count_y = Math.floor(height / interval);

    for (let i = 0; i < count_x; i++) {
        for (let j = 0; j < count_y; j++) {
            
        }
    }

    return points;
}

function handleResizeStart() {
    dot_layer.clearAll();
}

function handleResizeEnd() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    dot_layer.resize(width, height);
}

document.addEventListener("DOMContentLoaded", () => {

})
//@ts-ignore
window.addEventListener("resizeEnd", handleResizeEnd);
//@ts-ignore
window.addEventListener("resizeStart", handleResizeStart);
