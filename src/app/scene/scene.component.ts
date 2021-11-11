import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {Vector2} from "../../models/vector2";
import {Color} from "../../models/color";
import {SphereDrawerService} from "../services/SphereDrawer/sphere-drawer.service";
import {getCursorPosition} from "../../functions/inputFunc";
import {Sphere} from "../../models/sphere";
import { Vector3 } from "../../models/vector3";
import {getCircumferencePoint} from "../../functions/sphereFunc";
import {Bacteria3D} from "../../models/bacteria3d";
import {toCanvasCoordinate, toScreenCoordinate} from "../../functions/coordinateFunc";
import {GameSettings} from "../../models/gameSettings";
import {Entity, EntityType} from "../../models/entity";

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss']
})
export class SceneComponent implements AfterViewInit {


  canvasSize = new Vector2(720, 480);
  canvasColor = Color.Black;


  sphere = new Sphere(15, 1.5,new Vector3(0,0, 0), Color.White, Vector2.ZERO);
  sphere2: Sphere;
  sphere3: Sphere;
  sphere4: Sphere;

  drag = false;
  mouseStart = new Vector2(0,0);

  entities: Entity[];
  gameSettings: GameSettings;



  @ViewChild('sceneCanvas') private canvas: ElementRef<HTMLCanvasElement> | undefined;

  constructor(private sphereDrawer: SphereDrawerService) {
    this.sphere2 = new Sphere(0, 0, Vector3.ZERO, Color.White, Vector2.ZERO);
    this.sphere3 = new Sphere(0, 0, Vector3.ZERO, Color.White, Vector2.ZERO);
    this.sphere4 = new Sphere(0, 0, Vector3.ZERO, Color.White, Vector2.ZERO);

    this.entities = [];
    this.gameSettings = new GameSettings();

  }

  ngAfterViewInit(): void {
    if (!this.canvas) {
      console.log('Canvas not supplied! Cannot bind WebGL context!');
      return;
    }

    let randomPoint = getCircumferencePoint(this.sphere);
    this.sphere2 = new Sphere(15, 0.5, randomPoint, Color.Red, Vector2.ZERO);

    randomPoint = getCircumferencePoint(this.sphere);
    this.sphere3 = new Sphere(15, 0.6, randomPoint, Color.Green, Vector2.ZERO);

    randomPoint = getCircumferencePoint(this.sphere);
    this.sphere4 = new Sphere(15, 0.4, randomPoint, Color.Blue, Vector2.ZERO);

    //Initialize WebGL Service
    if(!this.sphereDrawer.initializeRenderingContext(this.canvas.nativeElement, this.canvasSize, this.canvasColor)){
      console.log("Failed to initialize rendering context.");
      return;
    }

    window.addEventListener("mousedown", (e) => this.mouseDown(e), false);
    window.addEventListener("mousemove", (e) => this.mouseMove(e), false);
    window.addEventListener("mouseup", (e) => this.mouseUp(e), false);
    window.addEventListener("mousedown", (e) => this.mouseClick(e), false);


    this.animate();
  }

  private animate(): void {
    this.sphereDrawer.clearCanvas();
    this.sphereDrawer.drawSphere(this.sphere);
    this.sphereDrawer.drawSphere(this.sphere2);
    this.sphereDrawer.drawSphere(this.sphere3);
    this.sphereDrawer.drawSphere(this.sphere4);
    requestAnimationFrame(() => this.animate());
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
    this.sphere2.rotation.x += dragged.x * 0.005;
    this.sphere3.rotation.x += dragged.x * 0.005;
    this.sphere4.rotation.x += dragged.x * 0.005;

    this.sphere.rotation.y += dragged.y * 0.005;
    this.sphere2.rotation.y += dragged.y * 0.005;
    this.sphere3.rotation.y += dragged.y * 0.005;
    this.sphere4.rotation.y += dragged.y * 0.005;


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
    this.sphereDrawer.gl.readPixels(e.x, e.y, 1,1, this.sphereDrawer.gl.RGBA , this.sphereDrawer.gl.UNSIGNED_BYTE, pixelValues);
    this.sphereDrawer.gl.flush();
    this.sphereDrawer.gl.finish();
    console.log(pixelValues);

    //Delete clicked on Bacteria
    for(let i = 0; i<=this.entities.length-1; i++) {
      const entity = this.entities[this.entities.length - 1 - i];
      if (entity.type == EntityType.Bacteria) {
        const b = <Bacteria3D>entity;
        if(b.color.r == pixelValues[0]) {
          //this.createExplosion(this.gameSettings.explosionSize, b);
          b.die();
          return;
        }
      }
    }

  }

  private spawnBacteria(): void{

    const bacteria: Bacteria3D[] = [];
    for(const e of this.entities){
      if(e.type == EntityType.Bacteria)
        bacteria.push(<Bacteria3D>e);
    }

    //Create the Bacteria
    const B = new Bacteria3D(
      100,
      5,
      getCircumferencePoint(this.sphere),
      new Color(Math.random(), 0, Math.random(), 1),
      this.gameSettings.growthRate,
      75,
      Vector2.ZERO
    );

    //Add it to the entity array
    this.entities.push(B);
  }


}
