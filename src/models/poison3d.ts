import {Sphere} from "./sphere";
import {Vector2} from "./vector2";
import {Vector3} from "./vector3";
import {Color} from "./color";
import {Entity, EntityType} from "./entity";
import { Bacteria3D } from "./bacteria3d";
import { dist } from "src/functions/sphereFunc";

export class Poison3D extends Sphere implements Entity {

  alive: boolean;
  type: EntityType;
  growthRate: number;
  origPos: Vector3;
  maxRadius:number;

  constructor(resolution: number, radius: number, location: Vector3, color: Color, growthRate: number, maxRadius: number,rotation: Vector2) {
    super(resolution, radius, location, color, rotation);
    this.maxRadius = maxRadius;
    this.growthRate = growthRate;
    this.origPos = new Vector3(location.x, location.y, location.z);
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

  public killBacteria(b: Bacteria3D): void {
      if(dist(b.location, this.location) < b.radius + this.radius){
        b.growthRate = -0.5;
      }
  }

}
