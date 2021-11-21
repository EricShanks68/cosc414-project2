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

export function getDistanceBetweenTwoSpheres (s1: Sphere, s2: Sphere): number{
  //d = ((x2 - x1)2 + (y2 - y1)2 + (z2 - z1)2)1/2   
  const x1 = s1.location.x;
  const x2 = s2.location.x;
  const y1 = s1.location.y;
  const y2 = s2.location.y;   
  const z1 = s1.location.z;
  const z2 = s2.location.z;
 const distance = (Math.sqrt(x2 -x1) + Math.sqrt(y2-y1) + Math.sqrt(z2-z1));
  return distance;
}


export function smallerMoveIntoBigger (s1: Sphere, s2: Sphere, distance: number): void{
  const distancePart = distance / 5;
  if(s1.radius < s2.radius){
    //A_moved = A + |(B-A)|*d
    s1.location.x = s1.location.x + Math.abs(s2.location.x - s1.location.x) * distancePart;
    s1.location.y = s1.location.y + Math.abs(s2.location.y - s1.location.y) * distancePart;
    s1.location.z = s1.location.z + Math.abs(s2.location.z - s1.location.z) * distancePart;
  } else{
    s2.location.x = s2.location.x + Math.abs(s1.location.x - s2.location.x) * distancePart;
    s2.location.y = s2.location.y + Math.abs(s1.location.y - s2.location.y) * distancePart;
    s2.location.z = s2.location.z + Math.abs(s1.location.z - s2.location.z) * distancePart;

  }
 
}


// export function isPointInCircle(pos: Vector2, circle: Circle): boolean {
//
//   const distance = dist(pos, circle.location);
//
//   return distance < circle.radius;
// }

export function isPointInSphere(pos: Vector3, sphere: Sphere): boolean {

  const distance = dist(pos, sphere.location);

  return distance < sphere.radius;
}


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
