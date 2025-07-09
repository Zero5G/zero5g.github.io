import { NumericLiteral } from "typescript";

class Layer {
    readonly id: number;
    readonly ctx: CanvasRenderingContext2D;
    readonly element: HTMLCanvasElement;

    _height: number;
    _width: number;

    constructor(id: number, height: number, width: number) {
        this.id = id;
        this._height = height;
        this._width = width;

        let canvas = document.createElement("canvas");
            canvas.height = height;
            canvas.width = width;
        this.element = canvas;

        let ctx = canvas.getContext("2d");
        if (ctx == null) {
            throw new Error("Could not get 2D context for canvas.");
        } else {
            this.ctx = ctx;
        }
    }

    public set height(new_height: number) {
        this.element.height = new_height;
        this._height = new_height;
    }
    public get height(): number { return this._height }

    public set width(new_width : number) {
        this.element.width = new_width;
        this._width = new_width;
    }
    public get width(): number { return this._width }
    
    public clear() {
        this.ctx.clearRect(0, 0, this._width, this._height)
    }
}
class Graphics {
    _layers: Array<Layer> = [];

    constructor(layer_id: number, height: number, width: number) {
        this.newLayer(layer_id, height, width);
    }

    public newLayer(layer_id: number, height: number, width: number) {
        if (!this._layers.find(
            ({ id }) => { id === layer_id }
        )) {
            this._layers.push(
                new Layer(layer_id, height, width)
            );
        } else {
            throw new Error("Layer with that ID already exists.");
        }
    }

}