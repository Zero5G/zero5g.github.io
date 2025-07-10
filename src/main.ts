import * as CG from "./modules/canvas_graphics.js";

const graphics = new CG.Graphics(0, window.innerHeight, window.innerWidth);
const background = document.querySelector("#background");

graphics.append(
    //@ts-ignore
    background, true
)