import * as CG from "./modules/canvas_graphics.js";
import { ResizeEnd } from "./modules/custom_events.js";

new ResizeEnd(500);

const dot_layer_id = 0;
const line_layer_id = 1;

const background = document.querySelector("#background");

const graphics = new CG.Graphics(dot_layer_id, window.innerHeight, window.innerHeight);
    graphics.append(background, false, dot_layer_id);
const dot_layer = graphics.getLayer(dot_layer_id);

function handleResizeStart() {
    dot_layer.clearAll();
}

function handleResizeEnd(event: UIEvent) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    dot_layer.resize(width, height);
    draw();
}

function draw() {
    graphics.circle(0, new CG.XY(50, 50), 50, "red", true);

    graphics.line(0,
        new CG.XY(30, 80), new CG.XY(400, 700), 8, "blue"
    )
}
draw();
//@ts-ignore
window.addEventListener("resizeEnd", handleResizeEnd);
//@ts-ignore
window.addEventListener("resizeStart", handleResizeStart);
/* const observer = new ResizeObserver(handleBodyResize);
    observer.observe(document.body); */