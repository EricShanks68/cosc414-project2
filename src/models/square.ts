import {Vector2} from "./vector2";
import {Color} from "./color";

export class Square {
  resolution: number;
  veriticies: number[];
  location: Vector2;
  color: Color;

  constructor(resolution: number, veriticies: number[], location: Vector2, color: Color) {
    this.resolution = resolution;
    this.veriticies = veriticies;
    this.location = location;
    this.color = color;
  }


}
