import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {Vector2} from "../../models/vector2";
import {Color} from "../../models/color";
import {CircleDrawerService} from "../services/CircleDrawer/circle-drawer.service";
import {Circle} from "../../models/circle";
import {getCircumferencePoint, isPointInCircle, norm} from "../../functions/circleFunc";
import {Bacteria} from "../../models/bacteria";
import {getCursorPosition} from "../../functions/inputFunc";
import {ExplosionParticle} from "../../models/explosionParticle";
import {GameSettings} from "../../models/gameSettings";
import {Entity, EntityType} from "../../models/entity";
import { Poison } from 'src/models/poison';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss']
})
export class SceneComponent implements AfterViewInit {

  running: boolean;
  gameover: boolean;

  gameSettings: GameSettings;

  score: number;
  lives: number;
  spawnChance: number;
  poisonCount: number;

  gameOverText: string;

  canvasSize = new Vector2(720, 480);
  canvasColor = Color.Black;

  circle = new Circle(
    100, 180,
    new Vector2(360, 240),
    Color.White
  );

  entities: Entity[];


  @ViewChild('sceneCanvas') private canvas: ElementRef<HTMLCanvasElement> | undefined;

  constructor(private circleDrawer: CircleDrawerService) {
    this.running = false;
    this.gameover = false;

    this.gameSettings = new GameSettings();

    this.score = 0;
    this.lives = 0;
    this.spawnChance = this.gameSettings.startSpawnChance;
    this.poisonCount = 0;

    this.entities = [];
    this.gameOverText = "";
  }

  ngAfterViewInit(): void {
    if (!this.canvas) {
      console.log('Canvas not supplied! Cannot bind WebGL context!');
      return;
    }

    //Initialize WebGL Service
    if(!this.circleDrawer.initializeRenderingContext(this.canvas.nativeElement, this.canvasSize, this.canvasColor)){
      console.log("Failed to initialize rendering context.");
      return;
    }

    this.canvas.nativeElement.addEventListener("mousedown", (e) => this.mouseClick(e));
  }

  public gameLoop(): void {
    this.tick();
    this.render();

    //Continue game loop
    if(this.running) {
      requestAnimationFrame(() => this.gameLoop());
    }

  }

  private tick(): void {

    //Spawn bacteria

    this.spawnBacteria();

    const removeEntities: Entity[] = [];

    //Update Entities
    for (const e of this.entities) {

      //Bacteria specific logic
      if(!this.gameover){
        if (e.type == EntityType.Bacteria) {
          const b = <Bacteria>e;
          b.update();
          if (b.loseLife) {
            this.lives--;
            removeEntities.push(b);
          }
        }
      }


      //Explosion specific logic

       if(e.type == EntityType.ExplosionParticle){
        const ep = <ExplosionParticle>e;
        ep.update();
      }

      //Poison specific logic
      if(e.type == EntityType.Poison){
        const p = <Poison>e;
        p.update();
        for(const e2 of this.entities){
          if(e2.type == EntityType.Bacteria){
            const b = <Bacteria>e2;
            p.killBacteria(b);
          }
        }
      }

      if (!e.alive) {
        if(e.type == EntityType.Bacteria) this.score++;
        else if(e.type == EntityType.Poison) this.poisonCount--;
        removeEntities.push(e);
      }
    }

    //Delete killed entities
    for (const e of removeEntities) {
      const index = this.entities.indexOf(e);
      this.entities.splice(index, 1);
    }

    //Check game over condition
    this.gameOverCheck();

    //Check win condition
    this.winCheck();
  }

  private render(): void {
    //Clear scene
    this.circleDrawer.clearCanvas();

    //Draw Petri Dish
    this.circleDrawer.drawCircle(this.circle);

    //Draw Entities
    for(const e of this.entities){
      switch (e.type) {
        case EntityType.Bacteria:
          this.circleDrawer.drawCircle(<Bacteria>e);
          break;
        case EntityType.ExplosionParticle:
          this.circleDrawer.drawCircle(<ExplosionParticle>e);
          break;
        case EntityType.Poison:
          this.circleDrawer.drawCircle(<Poison>e);
          break;
        default: break;
      }
    }
  }

  public startGame(): void{

    //Clear entities
    this.entities = [];
    this.gameover = false;

    //Reset game
    this.score = 0;
    this.lives = this.gameSettings.startLives;
    this.spawnChance = this.gameSettings.startSpawnChance;
    this.poisonCount = 0;

    //Start the game loop if it isn't already running
    if(!this.running){
      this.running = true;
      this.gameLoop();
    }
  }

  private gameOverCheck(): void {
    if(this.lives <= 0) {
      this.gameover = true;
      this.gameOverText = "Game over! :(";
    }
  }

  private winCheck(): void {
    if(this.score >= this.gameSettings.winScore) {
      this.gameover = true;
      this.gameOverText = "You win!! :D";
    }
  }

  private spawnBacteria(): void{

    //Don't spawn bacteria if the game has ended
    if(this.gameover) return;
    const chance = Math.random();
    if (chance >= this.spawnChance) return;

    //Increase spawn chance on successful spawn
    this.spawnChance += this.gameSettings.spawnChanceGrowth;

    //Only spawn bacteria if under the cap
    const bacteria: Bacteria[] = [];
    for(const e of this.entities){
      if(e.type == EntityType.Bacteria)
        bacteria.push(<Bacteria>e);
    }

    if(bacteria.length >= this.gameSettings.spawnCap) return;

    //Create the Bacteria
    const B = new Bacteria(
      100,
      5,
      getCircumferencePoint(this.circle),
      new Color(Math.random(), 0, Math.random(), 1),
      this.gameSettings.growthRate,
      75
    );

    //Add it to the entity array
    this.entities.push(B);
  }

  private createExplosion(particles: number, circle: Circle): void {
    for (let i = 0; i < particles; i++) {
      const direction = norm(new Vector2(-0.5 + Math.random(), -0.5 + Math.random()));
      const location = new Vector2(circle.location.x, circle.location.y);
      const radius = circle.radius/3;
      const speed = circle.radius/5;
      const color = new Color(
        circle.color.r * (0.7 + Math.random() * 0.3),
        circle.color.g * (0.7 + Math.random() * 0.3),
        circle.color.b * (0.7 + Math.random() * 0.3),
        1
      )

      const E = new ExplosionParticle(
        100,
        radius,
        location,
        color,
        direction,
        speed,
      );

      this.entities.push(E);
    }

  }

  private mouseClick(e: MouseEvent): void {
    if(!this.canvas || this.gameover) return;

    const pos = getCursorPosition(this.canvas.nativeElement, e);

    //Delete clicked on Bacteria
    for(let i = 0; i<=this.entities.length-1; i++) {
      const entity = this.entities[this.entities.length - 1 - i];
      if (entity.type == EntityType.Bacteria) {
        const b = <Bacteria>entity;
        if (isPointInCircle(pos, b)) {
          this.createExplosion(this.gameSettings.explosionSize, b);
          b.die();
          return;
        }
      }
    }

    if(this.poisonCount < this.gameSettings.poisonCap){
      //Spray poison
      const p = new Poison(50, 5, new Vector2(pos.x, pos.y), Color.Green, 0.4, 120);
      this.entities.push(p);
      this.poisonCount++;
    }

  }

  updateGameSettings(settings: GameSettings): void {
    if(settings)
      this.gameSettings = settings;
  }

}
