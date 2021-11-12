import {Vector2} from "./vector2";
import {Color} from "./color";
import {Circle} from "./circle";
import {Entity, EntityType} from "./entity";
import {Sphere} from "./sphere";
import {Vector3} from "./vector3";

export class Bacteria3D extends Sphere implements Entity {

  alive: boolean;
  type: EntityType;
  growthRate: number;
  maxRadius: number;
  loseLife: boolean;

  constructor(resolution: number, radius: number, location: Vector3, color: Color, rotation: Vector2, growthRate: number, maxRadius: number, ) {
    super(resolution, radius, location, color, rotation);
    this.growthRate = growthRate;
    this.maxRadius = maxRadius;
    this.loseLife = false;

    this.alive = true;
    this.type = EntityType.Bacteria;
  }

  public update(): void {
    this.radius += this.growthRate;
    if(this.radius > this.maxRadius)
      this.loseLife = true;
    else if(this.radius <= 0 && this.alive){
      this.alive = false;
    }
  }

  public die(): void {
    this.radius = 0;
    this.alive = false;
  }


}
