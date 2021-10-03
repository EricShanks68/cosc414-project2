import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {Vector2} from "../../models/vector2";
import {Color} from "../../models/color";
import {CircleDrawerService} from "../services/CircleDrawer/circle-drawer.service";
import {Circle} from "../../models/circle";
import {getCircumferencePoint, isPointInCircle} from "../../functions/circleFunc";
import {Bacteria} from "../../models/bacteria";
import {getCursorPosition} from "../../functions/inputFunc";

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss']
})
export class SceneComponent implements AfterViewInit {

  running: boolean;
  score: number;
  gameOverText: string;

  canvasSize = new Vector2(720, 480);
  canvasColor = Color.Black;

  circle = new Circle(
    100, 180,
    new Vector2(360, 240),
    Color.White
  );

  bacteria: Bacteria[];

  @ViewChild('sceneCanvas') private canvas: ElementRef<HTMLCanvasElement> | undefined;

  constructor(private circleDrawer: CircleDrawerService) {
    this.running = true;
    this.score = 0;
    this.bacteria = [];
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

    this.startGame();

    console.log("Game over.");
  }

  private gameLoop(): void {
    //Clear scene
    this.circleDrawer.clearCanvas();

    //Draw Petri Dish
    this.circleDrawer.drawCircle(this.circle);

    const remove: Bacteria[] = [];

    //Update Bacteria
    for(const b of this.bacteria){
      b.update();
      if (b.triggerGameover) {
        this.gameOver()
      } else if(!b.alive){
        remove.push(b);
      }
    }

    //Delete killed bacteria
    for(const b of remove){
      const index = this.bacteria.indexOf(b);
      this.bacteria.splice(index, 1);
    }

    //Check win condition
    if(this.bacteria.length == 0){
      this.win();
    }

    //Draw Bacteria
    for(const b of this.bacteria){
      this.circleDrawer.drawCircle(b);
    }

    //Continue game loop
    if(this.running) {
      requestAnimationFrame(() => this.gameLoop());
    }

  }

  public startGame(): void{
    this.spawnBacteria(5);
    this.running = true;
    this.score = 0;
    this.gameLoop();
  }

  private gameOver(): void {
    this.running = false;
    this.gameOverText = "Game over! :(";
  }

  private win(): void {
    this.running = false;
    this.gameOverText = "You win!! :D";
  }

  private spawnBacteria(count: number): void{

    //Reset bacteria array
    this.bacteria = [];

    for(let i = 0; i < count; i++){
      const B = new Bacteria(
        100,
        5,
        getCircumferencePoint(this.circle),
        new Color(Math.random(), Math.random(), Math.random(), 1),
        0.1,
        50
      );

      this.bacteria.push(B);
    }

  }

  private mouseClick(e: MouseEvent): void {
    if(!this.canvas) return;

    const pos = getCursorPosition(this.canvas.nativeElement, e);

    for(let i = 0; i<=this.bacteria.length-1; i++) {
      const b = this.bacteria[this.bacteria.length-1-i];
      if(isPointInCircle(pos, b)){
        b.die();
        this.score++;
        return;
      }
    }

  }


}
