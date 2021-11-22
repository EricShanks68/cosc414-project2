import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {Vector2} from "../../models/vector2";
import {Color} from "../../models/color";
import {SphereDrawerService} from "../services/SphereDrawer/sphere-drawer.service";
import {getCursorPosition} from "../../functions/inputFunc";
import {Sphere} from "../../models/sphere";
import {Vector3} from "../../models/vector3";
import {getCircumferencePoint, normV3,getDistanceBetweenTwoSpheres,smallerMoveIntoBigger,isPointInSphere} from "../../functions/sphereFunc";
import {Bacteria3D} from "../../models/bacteria3d";
import {GameSettings} from "../../models/gameSettings";
import {Entity, EntityType} from "../../models/entity";
import {ExplosionParticle} from "../../models/explosionParticle"

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

  sphere1 = new Sphere(15, 1,new Vector3(1,1, 0), Color.Red, Vector2.ZERO);

  sphere2 = new Sphere(15, 0.8,new Vector3(1.5,1, 0), Color.Blue, Vector2.ZERO);

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

      if(e.type == EntityType.ExplosionParticle){
        const ep = <ExplosionParticle>e;
        ep.update();
      }
      //
      // //Poison specific logic
      // if(e.type == EntityType.Poison){
      //   const p = <Poison>e;
      //   p.update();
      //   for(const e2 of this.entities){
      //     if(e2.type == EntityType.Bacteria){
      //       const b = <Bacteria>e2;
      //       p.killBacteria(b);
      //     }
      //   }
      // }

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
    this.sphereDrawer.drawSphere(this.sphere1);
    this.sphereDrawer.drawSphere(this.sphere2);

    //Draw Entities
    for(const e of this.entities){
      switch (e.type) {
        case EntityType.Bacteria:
          this.sphereDrawer.drawSphere(<Bacteria3D>e);
          break;
        case EntityType.ExplosionParticle:
          this.sphereDrawer.drawSphere(<ExplosionParticle>e);
          break;
        // case EntityType.Poison:
        //   this.circleDrawer.drawCircle(<Poison>e);
        //   break;
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
          this.createExplosion(this.gameSettings.explosionSize, b);
          b.die();
          return;
        }
      }
    }

  }

  private colorMatch(pixels: Uint8Array, c: Color): boolean {
    return Math.abs(pixels[0] - Math.round(c.r*255) + pixels[1] - Math.round(c.g*255) + pixels[2] - Math.round(c.b*255)) <= 1;
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

    //check if bacteria are overlapping and do thing
    if(bacteria.length > 1){
      console.log("Initial call in spawn");
    this.collisioncheck1(this.sphere1, this.sphere2);
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

  private createExplosion(particles: number, sphere: Sphere): void {
    for (let i = 0; i < particles; i++) {
      const direction = normV3(new Vector3(-0.5 + Math.random(), -0.5 + Math.random(), -0.5 + Math.random()));
      const location = new Vector3(sphere.location.x, sphere.location.y, sphere.location.z);
      const radius = sphere.radius/2;
      const speed = sphere.radius;
      const rotation = Vector2.ZERO;
      const color = new Color(
        sphere.color.r * (0.7 + Math.random() * 0.3),
        sphere.color.g * (0.7 + Math.random() * 0.3),
        sphere.color.b * (0.7 + Math.random() * 0.3),
        1
      )

      const E = new ExplosionParticle(
        15,
        radius,
        location,
        color,
        direction,
        speed,
        rotation,
      );

      this.entities.push(E);
    }

  }

  private collisioncheck1(s1: Sphere, s2: Sphere): void{
    console.log("collision check first");
        if(s1 != undefined || s2 != undefined ){
          console.log(" before is sphere call");
       // if(isPointInSphere(entity1, entity2) || isPointInSphere(entity2, entity1)){
          console.log("after sphere call");
          this.bacteriaCollision(s1, s2);
       // }
      }
       //can access bacteria, or will have to make bacteria[] returned from spawn bacteria?
      }

  // private collisioncheck(bacteria:Bacteria3D[]): void{
  //   console.log("collision check first");
  //   for(let i = 0; i<= bacteria.length-1; i++){
  //     const entity1 = bacteria[i];
  //     for(let j = 1; j <= bacteria.length; j++){
  //       const entity2 = bacteria[j];
  //       console.log("after loop");
  //       if(entity1 != undefined || entity1 != undefined ){
  //         console.log(" before is sphere call");
  //      // if(isPointInSphere(entity1, entity2) || isPointInSphere(entity2, entity1)){
  //         console.log("after sphere call");
  //         this.bacteriaCollision(entity1, entity2);
  //      // }
  //     }
  //      //can access bacteria, or will have to make bacteria[] returned from spawn bacteria?
  //     }
  //   }
  // }

  public bacteriaCollision(s1:Sphere, s2:Sphere): void{
    console.log("collision function");
    if(s1 != undefined || s2 != undefined ){
    const distance = getDistanceBetweenTwoSpheres(s1,s2);
    console.log("get distance?");
    smallerMoveIntoBigger(s1, s2, distance);
    console.log("smaller in bigger?");
    }
  }

  updateGameSettings(settings: GameSettings): void {
    if(settings)
      this.gameSettings = settings;
  }


}
