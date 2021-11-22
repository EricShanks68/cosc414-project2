import {Vector3} from "../models/vector3";
import {Sphere} from "../models/sphere";
import {Color} from "../models/color";

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
  return dist(s1.location, s2.location);
}


export function smallerMoveIntoBigger (s1: Sphere, s2: Sphere, distance: number): void{
  const testNum = 100;
  const distancePart = distance / testNum;
  if(s1.radius < s2.radius){
    //A_moved = A + |(B-A)|*d
    s1.location = vector3Lerp(s1.location, s2.location, distancePart);
    s1.radius -= 0.005;
    s2.radius += 0.0005;
    s2.color = colorLerp(s2.color, s1.color, 0.01);
  } else{
    s2.location = vector3Lerp(s2.location, s1.location, distancePart);
    s1.radius += 0.0005;
    s2.radius -= 0.005;
    s1.color = colorLerp(s1.color, s2.color, 0.01);
  }

}

function colorLerp(c1: Color, c2: Color, a: number): Color {
  const r = lerp(c1.r, c2.r, a);
  const g = lerp(c1.g, c2.g, a);
  const b = lerp(c1.b, c2.b, a);
  return new Color(r, g, b, 1);
}

function vector3Lerp(v1: Vector3, v2: Vector3, a: number): Vector3{
  const x = lerp(v1.x, v2.x, a);
  const y = lerp(v1.y, v2.y, a);
  const z = lerp(v1.z, v2.z, a);
  return new Vector3(x,y,z);
}

function lerp(n1: number, n2: number, a: number): number {
  return n1 * (1 - a) + n2 * a;
}


export function isPointInSphere(sphere1: Sphere, sphere2: Sphere): boolean {

  const distance = dist(sphere1.location, sphere2.location);

  return distance < sphere1.radius + sphere2.radius;
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
