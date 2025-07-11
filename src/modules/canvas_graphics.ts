class XY {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    public fromArray(coordinates: Array<number>): XY {
        if (coordinates.length == 2) {
            return new XY(coordinates[0], coordinates[1]);
        } else {
            throw new Error("Cannot create XY object, invalid value count in array.");
        }
    }
}

class Layer {
    readonly id: number;
    readonly ctx: CanvasRenderingContext2D;
    readonly element: HTMLCanvasElement;
    readonly css_id: string;

    _height: number;
    _width: number;

    constructor(id: number, css_id: string, height: number, width: number) {
        this.id = id;
        this.css_id = css_id;
        this._height = height;
        this._width = width;

        let canvas = document.createElement("canvas");
            canvas.id = css_id;
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

    public set width(new_width: number) {
        this.element.width = new_width;
        this._width = new_width;
    }
    public get width(): number { return this._width }
    
    public resize(new_width: number, new_height: number) {
        this._width = new_width;
        this._height = new_height;
        
        this.element.width = new_width;
        this.element.height = new_height;
    }

    public clear(start: XY, end: XY) {
        this.ctx.clearRect(start.x, start.y, end.x, end.y)  
    }

    public clearAll() {
        this.clear(new XY(0, 0), new XY(this._width, this._height))
    }
}
class Graphics {
    _layers: Layer[] = [];
    default_fill: string | CanvasGradient | CanvasPattern = "rgb(0 0 0 / 100%)";
    default_stroke: string | CanvasGradient | CanvasPattern = "rgb(0 0 0 / 100%)";
    default_line_width: number = 1;

    constructor() {
        const layer = document.createElement("canvas").getContext("2d");
        if (layer) {
            this.default_fill = layer.fillStyle;
            this.default_stroke = layer.strokeStyle;
            this.default_line_width = layer.lineWidth;
        }
    }

    public newLayer(layer_id: number, css_id: string, height: number, width: number): Layer | void {
        if (!this._layers.find(
            ({ id }) => id === layer_id
        )) {
            const layer = new Layer(layer_id, css_id, height, width);
            this._layers.push(layer);
            return layer;
        } else {
            throw new Error("Layer with that ID already exists.");
        }
    }

    public getLayer(layer_id: number): Layer {
        const layer = this._layers.find(
            ({ id }) => id === layer_id
        )
        
        if (layer != undefined) {
            return layer;
        } else {
            throw new Error("Layer not found.");
        }
    }

    public line(layer_id: number, start: XY, end: XY, width: number, style: string) {
        const ctx = this.getLayer(layer_id).ctx;
            ctx.lineWidth = width;
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
        this.draw(ctx, style, false);
    }

    public circle(layer_id: number, center: XY, radius: number, style: string, full: boolean = true) {
        const ctx = this.getLayer(layer_id).ctx;
            ctx.beginPath();
            ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
        this.draw(ctx, style, full);
    }
    
    private draw(ctx: CanvasRenderingContext2D, style: string, full: boolean) {
        if (full) {
            ctx.fillStyle = style;
            ctx.fill();
            ctx.fillStyle = this.default_fill;
        } else {
            ctx.strokeStyle = style;
            ctx.stroke();
            ctx.strokeStyle = this.default_stroke;
        }
        ctx.closePath();
    }

    public append(parent: Element | null, all: boolean = false, layer_id?: number) {
        if (parent == null) { return; }
        if (all) {
            this._layers.forEach(l => {
                parent.appendChild(l.element);
            })
        } else {
            if (typeof layer_id != "number") { throw new Error("Layer id not set.") } 
            parent.appendChild(
                this.getLayer(layer_id).element
            );
        }
    }

    public resizeAll(new_width: number, new_height: number) {
        this._layers.forEach(l => {
            l.resize(new_width, new_height);
        })
    }
}

export { XY, Layer, Graphics };