"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.midpoint = exports.linearInterpolation = exports.distance = void 0;
const geometry_1 = require("@arcgis/core/geometry");
/**
 * Distance between two points.
 * @param point1 esri.Point | x,y key/value pair
 * @param point2 esri.Point | x,y key/value pair
 * @returns number
 */
const distance = (point1, point2) => {
    const { x: x1, y: y1 } = point1;
    const { x: x2, y: y2 } = point2;
    return Math.sqrt(Math.pow(Math.abs(x1 - x2), 2) + Math.pow(Math.abs(y1 - y2), 2));
};
exports.distance = distance;
/**
 * Point on the line between two points some distance from point one.
 * @param point1 esri.Point
 * @param point2 esri.Point
 * @param linearDistance number
 * @returns esri.Point
 */
const linearInterpolation = (point1, point2, linearDistance) => {
    const { x: x1, y: y1, spatialReference } = point1;
    const { x: x2, y: y2 } = point2;
    const steps = exports.distance(point1, point2) / linearDistance;
    return new geometry_1.Point({
        x: x1 + (x2 - x1) / steps,
        y: y1 + (y2 - y1) / steps,
        spatialReference,
    });
};
exports.linearInterpolation = linearInterpolation;
/**
 * Return midpoint of polyline.
 * @param polyline esri.Polyline
 * @returns esri.Point
 */
const midpoint = (polyline) => {
    const { paths: [path], spatialReference, } = polyline;
    const segements = path.map((p) => {
        const [x, y] = p;
        return { x, y };
    });
    let td = 0;
    let dsf = 0;
    for (let i = 0; i < segements.length - 1; i += 1) {
        td += exports.distance(new geometry_1.Point({ ...segements[i] }), new geometry_1.Point({ ...segements[i + 1] }));
    }
    for (let i = 0; i < segements.length - 1; i += 1) {
        if (dsf + exports.distance(new geometry_1.Point({ ...segements[i] }), new geometry_1.Point({ ...segements[i + 1] })) > td / 2) {
            const distanceToMidpoint = td / 2 - dsf;
            return exports.linearInterpolation(new geometry_1.Point({ ...segements[i], spatialReference }), new geometry_1.Point({ ...segements[i + 1], spatialReference }), distanceToMidpoint);
        }
        dsf += exports.distance(new geometry_1.Point({ ...segements[i] }), new geometry_1.Point({ ...segements[i + 1] }));
    }
    return new geometry_1.Point({
        ...segements[0],
        spatialReference,
    });
};
exports.midpoint = midpoint;
