class ExpandedResize {
    timeout: any;
    delay: number;
    running: boolean = false;


    constructor(delay: number) {
        this.delay = delay
        this.resizeHandler = this.resizeHandler.bind(this);
        window.addEventListener("resize", this.resizeHandler);
    }

    private endDispatch() {
        const resize_end = new Event("resizeEnd");
        window.dispatchEvent(resize_end);
        //this.running = false;
        console.log(this.running);
    }
    private resizeHandler() {
        // temp resize start dispatcher before I figure out a better solution
        if (this.running == false) {
            this.running = true;
            setTimeout(() => {
                const resize_start = new Event("resizeStart");
                console.log("Start");
                window.dispatchEvent(resize_start);
                this.running = false;
            }, this.delay / 10)
        }
        
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(this.endDispatch, this.delay);
    }
}

export { ExpandedResize };