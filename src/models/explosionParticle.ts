import {Circle} from "./circle";
import {Vector2} from "./vector2";
import {Color} from "./color";
import {Entity, EntityType} from "./entity";

export class ExplosionParticle extends Circle implements Entity {

  alive: boolean;
  type: EntityType;
  direction: Vector2;
  speed: number;
  origPos: Vector2;

  constructor(resolution: number, radius: number, location: Vector2, color: Color, direction: Vector2, speed: number) {
    super(resolution, radius, location, color);
    this.direction = direction;
    this.speed = speed;
    this.origPos = new Vector2(location.x, location.y);

    this.alive = true;
    this.type = EntityType.ExplosionParticle;
  }

  public update(): void{
    this.location.x -= this.direction.x * (this.speed * (0.25 + Math.random()*0.75));
    this.location.y -= this.direction.y * (this.speed * (0.25 + Math.random()*0.75));
    if(this.radius > 0)
      this.radius-=0.5 + Math.random();
    else this.die();

  }

  public die(): void {
    this.alive = false;
  }

}
