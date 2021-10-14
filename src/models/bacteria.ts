import {Vector2} from "./vector2";
import {Color} from "./color";
import {Circle} from "./circle";
import {Entity, EntityType} from "./entity";

export class Bacteria extends Circle implements Entity {

  alive: boolean;
  type: EntityType;
  growthRate: number;
  maxRadius: number;
  triggerGameover: boolean;

  constructor(resolution: number, radius: number, location: Vector2, color: Color, growthRate: number, maxRadius: number) {
    super(resolution, radius, location, color);
    this.growthRate = growthRate;
    this.maxRadius = maxRadius;
    this.triggerGameover = false;

    this.alive = true;
    this.type = EntityType.Bacteria;
  }

  public update(): void {
    this.radius += this.growthRate;
    if(this.radius > this.maxRadius)
      this.triggerGameover = true;
  }

  public die(): void {
    this.radius = 0;
    this.alive = false;
  }


}
