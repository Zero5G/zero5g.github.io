import * as CG from "./modules/canvas_graphics.js";

const graphics = new CG.Graphics(0, window.innerHeight, window.innerWidth);
const background = document.querySelector("#background");

graphics.circle(0, new CG.XY(50, 50), 50, "red", true);

graphics.line(0,
    new CG.XY(30, 80), new CG.XY(400, 700), 8, "blue"
)

graphics.append(
    //@ts-ignore
    background, true
);