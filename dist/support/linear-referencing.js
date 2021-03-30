import esriRequest from '@arcgis/core/request';
import { distance as point2PointDistance } from './cogo';
/**
 * Add m values to a polyline
 * Polyline spatial reference must be source feature service spatial reference
 * Does not support multi-part geometry
 * @param polyline
 * @param startM
 */
export const addMValues = (polyline, startM) => {
    const { paths } = polyline;
    const path = paths[0];
    let distance = startM || 0;
    path.forEach((point, pointIndex) => {
        if (pointIndex === 0) {
            // first point m is start distance
            path[pointIndex][3] = distance;
        }
        else {
            // all other m values are aggregate distance
            const previousPoint = path[pointIndex - 1];
            distance =
                distance + point2PointDistance({ x: previousPoint[0], y: previousPoint[1] }, { x: point[0], y: point[1] });
            path[pointIndex][3] = distance;
        }
    });
    polyline.paths[0] = path;
    return { polyline, distance };
};
/**
 * Add z values to polyline from DEM image service
 * Polyline spatial reference must be image service spatial reference
 * Does not support multi-part geometry
 * @param polyline
 * @param imageServiceUrl
 * @returns
 */
export const addZValues = (polyline, imageServiceUrl) => {
    const { paths } = polyline;
    const path = paths[0];
    let startZ = 0;
    let endZ = 0;
    // promise
    return new Promise((resolve, reject) => {
        // map request for each elevation query for each point
        const requests = path.map((point) => {
            return esriRequest(imageServiceUrl, {
                query: {
                    geometryType: 'esriGeometryPoint',
                    returnGeometry: false,
                    returnCatalogItems: false,
                    geometry: {
                        x: point[0],
                        y: point[1],
                    },
                },
            });
        });
        // execute requests
        Promise.all(requests)
            .then((results) => {
            // set z value for each point
            results.forEach((result, resultIndex) => {
                const value = parseFloat(result.value);
                if (resultIndex === 0)
                    startZ = value;
                if (resultIndex === path.length - 1)
                    endZ = value;
                path[resultIndex][2] = value;
            });
            polyline.paths[0] = path;
            resolve({
                polyline,
                startZ,
                endZ,
            });
        })
            .catch((error) => {
            reject(error);
        });
    }); // end returned promise
};
/**
 * Return array of ids (object or global) of polyline features without z values
 * Also checks for z = 0 as well, so no suited for at or below sea level data
 * Does not support multi-part geometry
 * @param features
 * @param idField
 * @returns
 */
export const noZValueIds = (features, idField) => {
    const ids = [];
    features.forEach((feature) => {
        const polyline = feature.geometry;
        const { paths } = polyline;
        const point = paths[0][0];
        // if first point is not a number or 0 z values aren't valid
        if (isNaN(point[2]) || point[2] === 0) {
            ids.push(feature.attributes[idField]);
        }
    });
    return ids;
};
/**
 * Return array of ids (object or global) of polyline features without m values
 * Does not support multi-part geometry
 * @param features
 * @param idField
 * @returns
 */
export const noMValueIds = (features, idField) => {
    const ids = [];
    features.forEach((feature) => {
        const polyline = feature.geometry;
        const { paths } = polyline;
        const point = paths[0][0];
        // if first point is not a number m values aren't valid
        if (isNaN(point[3])) {
            ids.push(feature.attributes[idField]);
        }
    });
    return ids;
};
