import { distance as point2PointDistance } from './cogo';

/**
 * Add m values to a polyline
 * @param polyline 
 * @param startM 
 */
export const addMValuesToPolyline = (
  polyline: esri.Polyline,
  startM?: number,
): { polyline: esri.Polyline; distance: number } => {
  const { paths } = polyline;

  const path = paths[0];

  let distance = startM || 0;

  path.forEach((point, pointIndex) => {
    if (pointIndex === 0) {
      // first point m is start distance
      path[pointIndex][3] = distance;
    } else {
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
