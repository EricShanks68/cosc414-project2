import {Vector3} from "../models/vector3";
import {Sphere} from "../models/sphere";

export function getCircumferencePoint (s: Sphere): Vector3{
  // x = r * cos(s) * sin(t)
  // y = r * sin(s) * sin(t)
  // z = r * cos(t)
  const theta = Math.random() * Math.PI;
  const phi = Math.random() * 2 * Math.PI;

  const x = s.location.x + s.radius * Math.sin(theta) * Math.cos(phi);
  const y = s.location.y + s.radius * Math.sin(theta) * Math.sin(phi);
  const z = s.location.z + s.radius * Math.cos(theta);
  return new Vector3(x,y,z);
}

// export function isPointInCircle(pos: Vector2, circle: Circle): boolean {
//
//   const distance = dist(pos, circle.location);
//
//   return distance < circle.radius;
// }

export function dist(pos1: Vector3, pos2: Vector3): number {

  //Distance Formula
  //d=√((x_2-x_1)²+(y_2-y_1)²)

  //(x_2-x_1)²
  const xSqr = Math.pow(pos1.x - pos2.x, 2);
  //(y_2-y_1)²
  const ySqr = Math.pow(pos1.y - pos2.y, 2);

  const zSqr = Math.pow(pos1.z - pos2.z, 2);

  return Math.sqrt(xSqr + ySqr + zSqr);
}

export function normV3(v: Vector3): Vector3 {
  //||v|| = sqrt(x^2 + y^2 + z^2)
  const mag = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);

  return new Vector3(v.x/mag, v.y/mag, v.z/mag);
}
