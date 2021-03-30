/**
 * Add m values to a polyline
 * Polyline spatial reference must be source feature service spatial reference
 * Does not support multi-part geometry
 * @param polyline
 * @param startM
 */
export declare const addMValues: (polyline: esri.Polyline, startM?: number | undefined) => {
    polyline: esri.Polyline;
    distance: number;
};
/**
 * Add z values to polyline from DEM image service
 * Polyline spatial reference must be image service spatial reference
 * Does not support multi-part geometry
 * @param polyline
 * @param imageServiceUrl
 * @returns
 */
export declare const addZValues: (polyline: esri.Polyline, imageServiceUrl: string) => Promise<esri.Error | {
    polyline: esri.Polyline;
    startZ: number;
    endZ: number;
}>;
/**
 * Return array of ids (object or global) of polyline features without z values
 * Also checks for z = 0 as well, so no suited for at or below sea level data
 * Does not support multi-part geometry
 * @param features
 * @param idField
 * @returns
 */
export declare const noZValueIds: (features: esri.Graphic[], idField: string) => string[];
/**
 * Return array of ids (object or global) of polyline features without m values
 * Does not support multi-part geometry
 * @param features
 * @param idField
 * @returns
 */
export declare const noMValueIds: (features: esri.Graphic[], idField: string) => string[];
