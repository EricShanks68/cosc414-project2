import {Vector2} from "../models/vector2";
import {Circle} from "../models/circle";

export function getCircumferencePoint (C: Circle): Vector2{
  //x = cx + r * cos(a)
  //y = cy + r * sin(a)
  const angle = Math.random() * 2*Math.PI;
  const x = C.location.x + C.radius * Math.cos(angle);
  const y = C.location.y + C.radius * Math.sin(angle);
  return new Vector2(x,y);
}

export function isPointInCircle(pos: Vector2, circle: Circle): boolean {

  console.log(pos);
  console.log(circle.location);

  //Distance Formula
  //d=√((x_2-x_1)²+(y_2-y_1)²)

  //(x_2-x_1)²
  const xSqr = Math.pow(pos.x - circle.location.x, 2);
  //(y_2-y_1)²
  const ySqr = Math.pow(pos.y - circle.location.y, 2);
  const dist = Math.sqrt(xSqr + ySqr);

  return dist < circle.radius;
}
