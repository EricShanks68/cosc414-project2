import {Sphere} from "./sphere";
import {Vector2} from "./vector2";
import {Vector3} from "./vector3";
import {Color} from "./color";
import {Entity, EntityType} from "./entity";

export class ExplosionParticle extends Sphere implements Entity {

  alive: boolean;
  type: EntityType;
  direction: Vector3;
  speed: number;
  origPos: Vector3;

  constructor(resolution: number, radius: number, location: Vector3, color: Color, direction: Vector3, speed: number,  rotation: Vector2) {
    super(resolution, radius, location, color, rotation);
    this.direction = direction;
    this.speed = speed;
    this.origPos = new Vector3(location.x, location.y, location.z);

    this.alive = true;
    this.type = EntityType.ExplosionParticle;
  }

  public update(): void{
    this.location.x -= this.direction.x * (this.speed * (0.04 + Math.random()*0.1));
    this.location.y -= this.direction.y * (this.speed * (0.04 + Math.random()*0.1));
    this.location.z += this.direction.z * (this.speed * (0.04 + Math.random()*0.1));
    if(this.radius > 0)
      this.radius-=0.001 ;//+ Math.random();
    else this.die();

  }

  public die(): void {
    this.alive = false;
  }

}
