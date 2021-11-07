import {Color} from "./color";
import {Vector3} from "./vector3";

export class Sphere {
  resolution: number;
  radius: number;
  location: Vector3;
  color: Color;
  rotation: number;

  constructor(resolution: number, radius: number, location: Vector3, color: Color, rotation: number) {
    this.resolution = resolution;
    this.radius = radius;
    this.location = location;
    this.color = color;
    this.rotation = rotation;
  }
}
