import * as CG from "./modules/canvas_graphics.js";

const graphics = new CG.Graphics(0, window.innerHeight, window.innerWidth);

graphics.circle(0, new CG.XY(50, 50), 50, "red", true);

graphics.line(0,
    new CG.XY(30, 80), new CG.XY(40, 70), "blue"
)

graphics.append(
    document.body, true
);