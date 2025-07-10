class ResizeEnd {
    timeout: any;
    delay: number;
    running: boolean = false;
    constructor(delay: number) {
        this.delay = delay;
        this.resizeHandler = this.resizeHandler.bind(this);
        window.addEventListener("resize", this.resizeHandler);
    }
    private endDispatch() {
        const resize_end = new Event("resizeEnd");
        window.dispatchEvent(resize_end);
        this.running = false;
    }
    private resizeHandler() {
        if (this.timeout) clearTimeout(this.timeout);
        if (!this.running) {
            console.log("AA");
            const resize_start = new Event("resizeStart");
            window.dispatchEvent(resize_start);
        }
        this.running = true;
        this.timeout = setTimeout(this.endDispatch, this.delay);
    }
}

export { ResizeEnd };