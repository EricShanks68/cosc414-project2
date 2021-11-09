import {Color} from "./color";
import {Vector2} from "./vector2";
import {Vector3} from "./vector3";

export class Sphere {
  resolution: number;
  radius: number;
  location: Vector3;
  color: Color;
  rotation: Vector2;

  constructor(resolution: number, radius: number, location: Vector3, color: Color, rotation: Vector2) {
    this.resolution = resolution;
    this.radius = radius;
    this.location = location;
    this.color = color;
    this.rotation = rotation;
  }
}
