import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {Vector2} from "../../models/vector2";
import {Color} from "../../models/color";
import {SphereDrawerService} from "../services/SphereDrawer/sphere-drawer.service";
import {getCursorPosition} from "../../functions/inputFunc";
import {Sphere} from "../../models/sphere";
import {Vector3} from "../../models/vector3";
import {getCircumferencePoint} from "../../functions/sphereFunc";
import {Bacteria3D} from "../../models/bacteria3d";
import {GameSettings} from "../../models/gameSettings";
import {Entity, EntityType} from "../../models/entity";
import { Poison3D } from 'src/models/poison3d';
import {toCanvasCoordinate} from 'src/functions/coordinateFunc';
import {toScreenCoordinate} from 'src/functions/coordinateFunc';
import { m4 } from 'twgl.js';

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

  sphere = new Sphere(15, 1.5,new Vector3(0,0, 0), Color.White, Vector2.ZERO);

  drag = false;
  mouseStart = new Vector2(0,0);

  entities: Entity[];


  @ViewChild('sceneCanvas') private canvas: ElementRef<HTMLCanvasElement> | undefined;

  constructor(private sphereDrawer: SphereDrawerService) {

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
    if(!this.sphereDrawer.initializeRenderingContext(this.canvas.nativeElement, this.canvasSize, this.canvasColor)){
      console.log("Failed to initialize rendering context.");
      return;
    }

    window.addEventListener("mousedown", (e) => this.mouseDown(e), false);
    window.addEventListener("mousemove", (e) => this.mouseMove(e), false);
    window.addEventListener("mouseup", (e) => this.mouseUp(e), false);
    window.addEventListener("mousedown", (e) => this.mouseClick(e), false);


    this.gameLoop();
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
          const b = <Bacteria3D>e;
          b.update();
          if (b.loseLife) {
            this.lives--;
            removeEntities.push(b);
          }
        }
      }


      //Explosion specific logic

      // if(e.type == EntityType.ExplosionParticle){
      //   const ep = <ExplosionParticle>e;
      //   ep.update();
      // }

      //Poison specific logic
      if(e.type == EntityType.Poison){
        const p = <Poison3D>e;
        p.update();
        for(const e2 of this.entities){
          if(e2.type == EntityType.Bacteria){
            const b = <Bacteria3D>e2;
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
    this.sphereDrawer.clearCanvas();

    //Draw Petri Dish
    this.sphereDrawer.drawSphere(this.sphere);

    //Draw Entities
    for(const e of this.entities){
      switch (e.type) {
        case EntityType.Bacteria:
          this.sphereDrawer.drawSphere(<Bacteria3D>e);
          break;
        // case EntityType.ExplosionParticle:
        //   this.circleDrawer.drawCircle(<ExplosionParticle>e);
        //   break;
        case EntityType.Poison:
          this.sphereDrawer.drawSphere(<Poison3D>e);
          break;
        default: break;
      }
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

  private mouseDown(e: MouseEvent): void {
    if(!this.canvas) return;

    this.drag = true;
    this.mouseStart = getCursorPosition(this.canvas.nativeElement, e);
  }

  private mouseMove(e: MouseEvent): void {

    if(!this.canvas || !this.drag) return;

    const mouseEnd = getCursorPosition(this.canvas.nativeElement, e);

    const dragged = new Vector2(this.mouseStart.x - mouseEnd.x, this.mouseStart.y - mouseEnd.y);
    this.sphere.rotation.x += dragged.x * 0.005;
    this.sphere.rotation.y += dragged.y * 0.005;

    for(const e of this.entities){
      if(e.type == EntityType.Bacteria){
        const b = <Bacteria3D>e;
        b.rotation.x += dragged.x * 0.005;
        b.rotation.y += dragged.y * 0.005;
      }
    }

    this.mouseStart = mouseEnd;

  }

  private mouseUp(e: MouseEvent): void {
    if(!this.canvas) return;

    this.drag = false;
  }

  private mouseClick(e: MouseEvent): void {
    if(!this.canvas) return;
    const pixelValues = new Uint8Array(4);
    const pos = getCursorPosition(this.canvas.nativeElement, e);
    this.sphereDrawer.gl.readPixels(pos.x, pos.y, 1,1, this.sphereDrawer.gl.RGBA , this.sphereDrawer.gl.UNSIGNED_BYTE, pixelValues);

    //Delete clicked on Bacteria
    for(let i = 0; i<=this.entities.length-1; i++) {
      const entity = this.entities[this.entities.length - 1 - i];
      if (entity.type == EntityType.Bacteria) {
        const b = <Bacteria3D>entity;
        if(this.colorMatch(pixelValues, b.color)) {
          //this.createExplosion(this.gameSettings.explosionSize, b);
          b.die();
          return;
        }
      }
    }

    if(this.poisonCount < this.gameSettings.poisonCap){
      //Spray poison
      let clipX = 0;
      let clipY = 0;
      const rect = this.canvas.nativeElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      console.log("x: " + x );
      console.log("y: " + y );
      clipX = x / rect.width  *  2 - 1;
      clipY = y / rect.height * -2 + 1;

      const start = m4.transformPoint(, [clipX, clipY, -1]);

      const zPos = getCircumferencePoint(this.sphere);
      console.log("e" + e);
      console.log("x Pos " + zPos.x);
      console.log("y Pos " + zPos.y);
      console.log("mouse click x " + toCanvasCoordinate(pos.x,100) *0.1);
      console.log("mouse click y " + toCanvasCoordinate(pos.y, 100) * 0.1);
      console.log("zPos " + zPos.z);
      const p = new Poison3D(15, 0.5, new Vector3(toCanvasCoordinate(pos.x,100) *0.1, toCanvasCoordinate(pos.y, 100) * 0.1, 1), Color.Green, this.gameSettings.growthRate/100, 1, Vector2.ZERO);
      this.entities.push(p);
      this.poisonCount++;
    }


  }

  private colorMatch(pixels: Uint8Array, c: Color): boolean {
    return pixels[0] == Math.round(c.r*255) && pixels[1] == Math.round(c.g*255) && pixels[2] == Math.round(c.b*255);
  }

  private spawnBacteria(): void{

    //Don't spawn bacteria if the game has ended
    if(this.gameover) return;
    const chance = Math.random();
    if (chance >= this.spawnChance) return;

    //Increase spawn chance on successful spawn
    this.spawnChance += this.gameSettings.spawnChanceGrowth;

    //Only spawn bacteria if under the cap
    const bacteria: Bacteria3D[] = [];
    for(const e of this.entities){
      if(e.type == EntityType.Bacteria)
        bacteria.push(<Bacteria3D>e);
    }

    if(bacteria.length >= this.gameSettings.spawnCap) return;

    //Create the Bacteria
    const B = new Bacteria3D(
      15,
      0.1,
      getCircumferencePoint(this.sphere),
      new Color(Math.random(), 0, Math.random(), 1),
      this.sphere.rotation,
      this.gameSettings.growthRate/100,
      0.75,
    );

    //Add it to the entity array
    this.entities.push(B);
  }

  updateGameSettings(settings: GameSettings): void {
    if(settings)
      this.gameSettings = settings;
  }


}
