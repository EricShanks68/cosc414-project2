import {Vector2} from "./vector2";
import {Color} from "./color";

export class Circle {
  resolution: number;
  radius: number;
  location: Vector2;
  color: Color;

  constructor(resolution: number, radius: number, location: Vector2, color: Color) {
    this.resolution = resolution;
    this.radius = radius;
    this.location = location;
    this.color = color;
  }


}
