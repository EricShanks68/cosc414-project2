import {Vector2} from "../models/vector2";
import {Circle} from "../models/circle";
import {Vector3} from "../models/vector3";

export function getCircumferencePoint (C: Circle): Vector2{
  //x = cx + r * cos(a)
  //y = cy + r * sin(a)
  const angle = Math.random() * 2*Math.PI;
  const x = C.location.x + C.radius * Math.cos(angle);
  const y = C.location.y + C.radius * Math.sin(angle);
  return new Vector2(x,y);
}

export function isPointInCircle(pos: Vector2, circle: Circle): boolean {

  const distance = dist(pos, circle.location);

  return distance < circle.radius;
}

export function dist(pos1: Vector2, pos2: Vector2): number{

  //Distance Formula
  //d=√((x_2-x_1)²+(y_2-y_1)²)

  //(x_2-x_1)²
  const xSqr = Math.pow(pos1.x - pos2.x, 2);
  //(y_2-y_1)²
  const ySqr = Math.pow(pos1.y - pos2.y, 2);
  return Math.sqrt(xSqr + ySqr);
}

export function normV2(v: Vector2): Vector2 {
  //||v|| = sqrt(x^2 + y^2)
  const mag = Math.sqrt(v.x * v.x + v.y * v.y);

  return new Vector2(v.x/mag, v.y/mag);
}

export function normV3(v: Vector3): Vector3 {
  //||v|| = sqrt(x^2 + y^2 + z^2)
  const mag = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);

  return new Vector3(v.x/mag, v.y/mag, v.z/mag);
}
