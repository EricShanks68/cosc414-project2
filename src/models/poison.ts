import {Circle} from "./circle";
import {Vector2} from "./vector2";
import {Color} from "./color";
import {Entity, EntityType} from "./entity";
import { Bacteria } from "./bacteria";
import { dist } from "src/functions/circleFunc";

export class Poison extends Circle implements Entity {

  alive: boolean;
  type: EntityType;
  growthRate: number;
  origPos: Vector2;
  maxRadius:number;

  constructor(resolution: number, radius: number, location: Vector2, color: Color, growthRate: number, maxRadius: number) {
    super(resolution, radius, location, color);
    this.maxRadius = maxRadius;
    this.growthRate = growthRate;
    this.origPos = new Vector2(location.x, location.y);
    this.alive = true;
    this.type = EntityType.Poison;
  }

  public update(): void{
    if(this.radius <= this.maxRadius) {
      this.radius += this.growthRate;
      this.color = new Color(this.color.r, this.color.g, this.color.b, 1-this.radius/this.maxRadius)
    }
    else this.die();

  }

  public die(): void {
    this.alive = false;
  }

  public killBacteria(b: Bacteria): void {
      if(dist(b.location, this.location) < b.radius + this.radius){
        b.growthRate = -0.5;
      }
  }

}
