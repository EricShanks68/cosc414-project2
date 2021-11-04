import {Vector3} from "./vector3";
import {Color} from "./color";

export class Sphere {
  resolution: number;
  radius: number;
  location: Vector3;
  color: Color;

  constructor(resolution: number, radius: number, location: Vector3, color: Color) {
    this.resolution = resolution;
    this.radius = radius;
    this.location = location;
    this.color = color;
  }


}
