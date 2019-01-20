export class Simulate {
    constructor() {
        this.index = 0;
        this.points = [];
        this.timedelta = 1 / 60;
    }
    static from(x, y) {
        let s = new Simulate();
        return s.start(x, y);
    }
    reset() {
        this.index = 0;
        return this;
    }
    start(x, y) {
        this.points = [];
        return this.to(x, y);
    }
    to(x, y) {
        this.newPoint(parseCoordinates(x, y), 1);
        return this;
    }
    delta(x, y) {
        let newPoint = parseCoordinates(x, y);
        let prevCoord = this.getLastPoint().coord;
        newPoint.x += prevCoord.x;
        newPoint.y += prevCoord.y;
        this.newPoint(newPoint, 1);
        return this;
    }
    deltaPolar(angle, distance) {
        angle *= Math.PI / 180;
        let prevCoord = this.getLastPoint().coord;
        let coord = {
            x: prevCoord.x + (Math.cos(angle) * distance),
            y: prevCoord.y + (Math.sin(angle) * distance)
        };
        this.newPoint(coord, 1);
        return this;
    }
    toPolar(angle, distance) {
        angle *= Math.PI / 180;
        let coord = {
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance
        };
        this.newPoint(coord, 1);
        return this;
    }
    duration(duration) {
        this.getLastPoint().duration = duration;
        return this;
    }
    velocity(vel) {
        let p1 = this.getLastPoint();
        let p2 = this.getPreviousPoint();
        let d = distance(p1.coord, p2.coord);
        return this.duration(d / vel);
    }
    swipeRight(maxAngle, distance) {
        // x------>
        let angle = randomAngle(maxAngle);
        return this.deltaPolar(angle, distance);
    }
    swipeLeft(maxAngle, distance) {
        // <------x
        let angle = randomAngle(maxAngle) + 180;
        return this.deltaPolar(angle, distance);
    }
    swipeTop(maxAngle, distance) {
        let angle = randomAngle(maxAngle) + 90;
        return this.deltaPolar(angle, distance);
    }
    swipeBottom(maxAngle, distance) {
        let angle = randomAngle(maxAngle) - 90;
        return this.deltaPolar(angle, distance);
    }
    run(callback) {
        let points = this.points;
        let len = points.length - 1;
        let i = 0;
        for (; i < len; i++) {
            var p1 = points[i].coord;
            var p2 = points[i + 1].coord;
            var duration = points[i + 1].duration;
            var vectorX = p2.x - p1.x;
            var vectorY = p2.y - p1.y;
            var nuSteps = Math.ceil(duration / this.timedelta);
            vectorX /= nuSteps;
            vectorY /= nuSteps;
            for (let j = 0; j < nuSteps; j++) {
                callback({
                    x: p1.x + vectorX * j,
                    y: p1.y + vectorY * j
                });
            }
        }
        this.index = i;
        return this;
    }
    newPoint(coord, duration) {
        this.points.push({
            coord: coord,
            duration: duration,
        });
    }
    getLastPoint() {
        let len = this.points.length;
        if (len > 0) {
            return this.points[len - 1];
        }
        throw new Error('can not call point');
    }
    getPreviousPoint() {
        let len = this.points.length;
        if (len > 1) {
            return this.points[len - 2];
        }
        throw new Error('can not call point');
    }
}
function randomAngle(maxAngle) {
    return (Math.random() * maxAngle * 2) - maxAngle;
}
function distance(a, b) {
    let deltaX = a.x - b.x;
    let deltaY = a.y - a.y;
    return Math.hypot(deltaX, deltaY);
}
function parseCoordinates(coord, y) {
    if (typeof coord === 'number') {
        return { x: coord, y: y };
    }
    return coord;
}
//# sourceMappingURL=simulator.js.map