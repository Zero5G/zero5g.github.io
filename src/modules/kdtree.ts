class LimitedArray extends Array {
    readonly maxLength: number;
    private readonly _push: Function;
    /**
     * Limited array constructor
     * @param maxLength Maximum length of the array
     * @param arrayLength Starting length of array
     */
    constructor(maxLength: number, arrayLength?: number) {
        super(arrayLength);

        this._push = Array.prototype.push;
        this.maxLength = maxLength;
    }
    /**
     * Wrapper function that calls the original push function, the shifts the array until the array until maxLength is reached
     * @param item 
     * @returns Count of inserted items
     */
    public push(...items: any[]): number {
        if (items.length > this.maxLength) throw new Error(`Error cannot add more items than the max length of array. (${this.maxLength})`);

        this._push.apply(this, items);
        while (this.length > this.maxLength) this.shift();

        return items.length;
    }
}

class Point {
    public readonly coordinates: Array<number>;
    /**
     * Construct a point
     * @param coordinates Array of coordinates
     */
    constructor(coordinates: Array<number>) {
        this.coordinates = coordinates;
    }
    /**
     * Get coordinate
     * @param k Position of coordinate in array
     * @returns Coordinate value
     */
    public get(k: number): number {
        return this.coordinates[k % this._length()]; 
    }
    /**
     * Private method to get length
     * @returns Returns length of array
     */
    private _length(): number {
        return this.coordinates.length;
    }
    
    public get length(): number {
        return this._length();
    }
}
/** K-d tree node */
class TreeNode {
    private readonly dimension_count: number;
    readonly point: Point;

    public left: TreeNode | null = null;
    public right: TreeNode | null = null;
    /**
     * Constuct a k-d tree node
     * @param point Main point of a k-d tree node 
     */
    constructor(point: Point) {
        this.point = point;
        this.dimension_count = point.length;
    }
    /**
     * Get dimension (k) count
     */
    public get dim_count(): number {
        return this.dimension_count
    }
    /**
     * Add a node
     * @param node K-d tree node 
     * @param dim_count Dimension count (count of numbers in coordinates)
     */
    public add(node: TreeNode, dim_count: number = 0) {
        if (node.point.get(dim_count) < this.point.get(dim_count)) {
            if (this.left == null) {
                this.left = node;
            } else {
                this.left.add(node, dim_count + 1);
            }
        } else {
            if (this.right == null) {
                this.right = node;
            } else {
                this.right.add(node, dim_count + 1)
            }
        }
    }
}
/**
 * K-d tree
 */
class Tree {
    private root: TreeNode | null = null;
    private dimension_count: number = 0;
    /**
     * Create a k-d tree from dimension count
     * @param dimension_count Count of dimensions 
     * @returns Returns a k-d tree
     */
    public static fromDims(dimension_count: number): Tree {
        let tree = new Tree();
            tree.dimension_count = dimension_count;
            tree.root = null;
        return tree
    }
    /**
     * Create a K-d tree from a node
     * @param node K-d tree node 
     * @returns Returns a k-d tree
     */
    public static fromNode(node: TreeNode): Tree {
        let tree = new Tree();
            tree.root = node;
            tree.dimension_count = node.dim_count;
        return tree
    }
    /**
     * Create a K-d tree from an array of points
     * @param points Array of points 
     * @returns Returns a k-d tree
     */
    public static fromPoints(points: Array<Point>) {
        let tree = new Tree();
        tree.dimension_count = points.length;
        // tree.root = new TreeNode(points[0])

        points.forEach(point => {
            let node = new TreeNode(point);
            if (tree.root != null) {
                tree.root.add(node);
            } else {
                tree.root = node;
                // throw new Error("ERROR: The root is null.");
            }
        });
        return tree;
    }
    /**
     * Add a node to the k-d tree
     * @param point K-d tree nore or array of coordinates
     */
    public add(point: TreeNode | Array<number>) {
        let node;
        if (Array.isArray(point)) {
            node = new TreeNode(new Point(point));
        } else {
            node = point
        }

        if (this.root == null) {
            this.root = node;
        } else {
            this.root.add(node);
        }
    }
    /**
     * Find nearest point to your target
     * @param target Target of search
     * @returns Nearest point in the k-d tree
     */
    public nearest(target: Point | Array<number>, storage?: LimitedArray) {
        if (this.root != null) {
            if (Array.isArray(target)) target = new Point(target);
            return this._nearest(this.root, target, 0, storage);
        } else {
            throw new Error("ERROR: The root is null.");
        }
    }
    /**
     * Search algorithm
     * @param root Root node
     * @param target Target of search
     * @param depth 
     * @param multiple 
     * @returns Nearest point to the target
     */
    private _nearest(root: TreeNode | null, target: Point, depth: number, storage?: LimitedArray): TreeNode {
        //@ts-ignore
        if (root == null) { return; }

        let next: TreeNode | null = null;
        let other: TreeNode | null = null;

        if (target.get(depth) < root.point.get(depth)) {
            next = root.left;
            other = root.right;
        } else {
            next = root.right;
            other = root.left
        }

        let temp: TreeNode = this._nearest(next, target, depth + 1, storage);
        let best: TreeNode = this.closest(temp, root, target);

        let radius: number = this.distanceSquared(target, best.point);

        let distance = target.get(depth) - root.point.get(depth);

        if (radius >= distance * distance) {
            temp = this._nearest(other, target, depth + 1, storage);
            best = this.closest(temp, best, target);
        }

        if (storage != null) this.storeNodes(storage, best);

        return best;
    }
    private storeNodes(array: LimitedArray, node: TreeNode) {
        //@ts-ignore
        if (!array.includes(node.point)) {
            array.push(node.point);
        }
    }
    /**
     * Compares distances between two nodes (points) and a target
     * @param nodeA Node A
     * @param nodeB Node B
     * @param target Target point
     * @returns The closer node
     */
    private closest(nodeA: TreeNode, nodeB: TreeNode, target: Point) {
        if (nodeA == null) return nodeB;
        if (nodeB == null) return nodeA;

        const distanceA = this.distanceSquared(nodeA.point, target);
        const distanceB = this.distanceSquared(nodeB.point, target);

        if (distanceA < distanceB) {
            return nodeA;
        } else {
            return nodeB;
        }
    }
    /**
     * Distance between two points (squared)
     * @param a Point A
     * @param b Point B
     * @returns Distance squared
     */
    private distanceSquared(a: Point, b: Point) {
        let distance: number = 0;
        const dimensions = a.length;

        for (let i = 0; i < dimensions; i++) {
            distance += Math.pow(
                Math.abs(
                    a.get(i) - b.get(i)
                ), 2
            )
        }

        return distance;
    }
    /**
     * Distance between two points
     * @param a Point A
     * @param b Point B
     * @returns Distance
     */
    private distance(a: Point, b: Point) {
        return Math.sqrt(
            this.distanceSquared(a, b)
        )
    }
    public reset() {
        this.root = null;
    }
}

const points = [
    [10, 10],
    [80, 90],
    [5, 80],
    [100, 400],
    [70, 10],
    [5, 10]
]

export { Point, TreeNode, Tree };