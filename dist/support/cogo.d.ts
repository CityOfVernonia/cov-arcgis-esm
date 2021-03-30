import { Point } from '@arcgis/core/geometry';
/**
 * Distance between two points.
 * @param point1 esri.Point | x,y key/value pair
 * @param point2 esri.Point | x,y key/value pair
 * @returns number
 */
export declare const distance: (point1: Point | {
    x: number;
    y: number;
}, point2: Point | {
    x: number;
    y: number;
}) => number;
/**
 * Point on the line between two points some distance from point one.
 * @param point1 esri.Point
 * @param point2 esri.Point
 * @param linearDistance number
 * @returns esri.Point
 */
export declare const linearInterpolation: (point1: Point, point2: Point, linearDistance: number) => Point;
/**
 * Return midpoint of polyline.
 * @param polyline esri.Polyline
 * @returns esri.Point
 */
export declare const midpoint: (polyline: esri.Polyline) => Point;
