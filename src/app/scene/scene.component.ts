import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {Vector2} from "../../models/vector2";
import {Color} from "../../models/color";
import {GameSettings} from "../../models/gameSettings";
import {Entity} from "../../models/entity";
import {SphereDrawerService} from "../services/SphereDrawer/sphere-drawer.service";
import {getCursorPosition} from "../../functions/inputFunc";
import {Sphere} from "../../models/sphere";
import { Vector3 } from "../../models/vector3";
import { normV2 } from 'src/functions/circleFunc';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss']
})
export class SceneComponent implements AfterViewInit {


  canvasSize = new Vector2(720, 480);
  canvasColor = Color.Black;

  sphere = new Sphere(15, 150,new Vector3(0,0, 0), Color.White, new Vector2(0,0));
  sphere2 = new Sphere(15, 75,new Vector3(-1.5,0, 0), Color.Green, new Vector2(0,0));

  drag = false;
  mouseStart = new Vector2(0,0);



  @ViewChild('sceneCanvas') private canvas: ElementRef<HTMLCanvasElement> | undefined;

  constructor(private sphereDrawer: SphereDrawerService) {
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

    this.animate();    
  }

  private animate(): void {
    this.sphereDrawer.clearCanvas();
    this.sphereDrawer.drawSphere(this.sphere);
    this.sphereDrawer.drawSphere(this.sphere2);
    requestAnimationFrame(() => this.animate());
  }

  private mouseDown(e: MouseEvent): void {     
     
    if(!this.canvas) return;

    this.drag = true;
    this.mouseStart = getCursorPosition(this.canvas.nativeElement, e);
    
      // //a
      // if(e.keyCode == 65){
      //   this.sphere.rotation.x += 0.1;
      //   this.sphere2.rotation.x += 0.1;
      // }
      // //d
      // if(e.keyCode == 68){
      //   this.sphere.rotation.x -= 0.1;
      //   this.sphere2.rotation.x -= 0.1;
      // }
      // //w
      // if(e.keyCode == 87){
      //   this.sphere.rotation.y -= 0.1;
      //   this.sphere2.rotation.y -= 0.1;
      // }
      // //s
      // if(e.keyCode == 83){
      //   this.sphere.rotation.y += 0.1;
      //   this.sphere2.rotation.y += 0.1;
      // }
    }

  private mouseMove(e: MouseEvent): void {

    if(!this.canvas || !this.drag) return;

    const mouseEnd = getCursorPosition(this.canvas.nativeElement, e);

    const dragged = new Vector2(this.mouseStart.x - mouseEnd.x, this.mouseStart.y - mouseEnd.y);
    
    this.sphere.rotation.x += dragged.x * 0.005;
    this.sphere2.rotation.x += dragged.x * 0.005;

    this.sphere.rotation.y += dragged.y * 0.005;
    this.sphere2.rotation.y += dragged.y * 0.005;

    this.mouseStart = mouseEnd;

  }

  private mouseUp(e: MouseEvent): void {
    if(!this.canvas) return;

    this.drag = false;
  }



}
