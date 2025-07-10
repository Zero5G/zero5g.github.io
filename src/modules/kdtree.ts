//@ts-nocheck
class LimitedArray {
    readonly max_length: number;
    
    array: Array<any>;
    /**
     * 
     * @param length Max length of array
     */
    constructor(length) {
        this.max_length = length;
    }
    /**
     * Push item into array
     * @param item 
     */
    public push(item) {
        this.array.push(item);
        
        while (this.array.length > this.max_length) {
            this.array.shift()
        }        
    }
    /**
     * Pop item from array
     */
    public pop(): any {
        return this.array.pop();
    }
    /**
     * Get item from array
     * @param item_number Number of item in array
     * @returns Item from array
     */
    public get(item_number): any {
        return this.array[item_number];
    }
    /**
     * Set item on position
     * @param item_number 
     * @param item 
     */
    public set(item_number, item) {
        this.array[item_number] = item;
    }
}

class Point {
    readonly coordinates: Array<number>;
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
     * Private method to get lenth
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
    readonly dim_count: number;
    readonly point: Point;

    left: TreeNode;
    right: TreeNode;
    /**
     * Constuct a k-d tree node
     * @param point Main point of a k-d tree node 
     */
    constructor(point: Point) {
        this.point = point;
        this.dim_count = point.length;
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
    root: TreeNode;
    dim_count: number;
    /**
     * Create a K-d tree from dimension count
     * @param dimension_count Count of dimensions 
     * @returns Returns a k-d tree
     */
    fromDims(dimension_count): Tree {
        let tree = new Tree();
            tree.dim_count = dimension_count;
            tree.root = null;
        return tree
    }
    /**
     * Create a K-d tree from a node
     * @param node K-d tree node 
     * @returns Returns a k-d tree
     */
    fromNode(node: TreeNode): Tree {
        let tree = new Tree();
            tree.root = node;
            tree.dim_count = node.dim_count;
        return tree
    }
    /**
     * Create a K-d tree from an array of points
     * @param points Array of points 
     * @returns Returns a k-d tree
     */
    fromPoints(points: Array<Point>) {
        this.dim_count = points.length;
        this.root = new TreeNode(points[0])

        points.forEach(point => {
            let node = new TreeNode(point);
            this.root.add(node);
        });
    }
    /**
     * Add a node to the k-d tree
     * @param point K-d tree nore or array of coordinates
     */
    add(point: TreeNode | Array<number>) {
        let node;
        if (typeof point !== "object") {
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
    public nearest(target: Point) {
        return this._nearest(this.root, target, 0);
    }
    /**
     * Search algorithm
     * @param root Root node
     * @param target Target of search
     * @param depth 
     * @param multiple 
     * @returns Nearest point to the target
     */
    private _nearest(root: TreeNode, target: Point, depth: number/*,  multiple?: Array<any> */): TreeNode {
        if (root == null) { return null }

        let next: TreeNode = null;
        let other: TreeNode = null;

        if (target.get(depth) < root.point.get(depth)) {
            next = root.left;
            other = root.right;
        } else {
            next = root.right;
            other = root.left
        }

        let temp: TreeNode = this._nearest(next, target, depth + 1);
        let best = this.closest(temp, root, target);

        let radious = this.distanceSquared(target, best.point);

        let distance = target.get(depth) - root.point.get(depth);

        if (radious >= distance * distance) {
            temp = this._nearest(other, target, depth + 1);
            best = this.closest(temp, best, target);
        }

        return best;
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
}

export { Point, TreeNode, Tree };