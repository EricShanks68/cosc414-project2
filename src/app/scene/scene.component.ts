import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {Vector2} from "../../models/vector2";
import {Color} from "../../models/color";
import {GameSettings} from "../../models/gameSettings";
import {Entity} from "../../models/entity";
import {SphereDrawerService} from "../services/SphereDrawer/sphere-drawer.service";
import {Sphere} from "../../models/sphere";
import {Vector3} from "../../models/vector3";

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss']
})
export class SceneComponent implements AfterViewInit {


  canvasSize = new Vector2(720, 480);
  canvasColor = Color.Black;

  sphere = new Sphere(15, 50,new Vector3(360,240, 3), Color.White, 0)
  sphere2 = new Sphere(5, 10,new Vector3(190,240, 2.95), Color.Green, 0)



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

    this.animate();

  }

  private animate(): void {
    this.sphereDrawer.clearCanvas();
    this.sphereDrawer.drawSphere(this.sphere);
    this.sphereDrawer.drawSphere(this.sphere2);
    this.sphere.rotation+=0.01;
    this.sphere2.rotation+=0.04;
    requestAnimationFrame(() => this.animate());
  }


}
