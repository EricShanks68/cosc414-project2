import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss']
})
export class SceneComponent implements AfterViewInit {

  canvasDimensions = {x: 720, y: 480};
  canvasClearColor = {r: 0, g: 0, b: 0, a: 1};

  @ViewChild('sceneCanvas') private canvas: ElementRef<HTMLCanvasElement> | undefined;
  private _renderingContext: CanvasRenderingContext2D | ImageBitmapRenderingContext | WebGLRenderingContext | WebGL2RenderingContext | null | undefined;

  private get gl(): WebGLRenderingContext {
    return this._renderingContext as WebGLRenderingContext;
  }

  constructor() {
    //empty
  }

  ngAfterViewInit(): void {
    if (!this.canvas) {
      console.log('Canvas not supplied! Cannot bind WebGL context!');
      return;
    }

    //Initialize WebGL context
    this._renderingContext = this.canvas.nativeElement.getContext('webgl');
    if(!this.gl) {
      console.log("Unable to initialize WebGL. Your browser may not support it.")
      return;
    }

    //Set Canvas Dimensions
    this.gl.canvas.width = this.canvas.nativeElement.clientWidth;
    this.gl.canvas.height = this.canvas.nativeElement.clientHeight;

    //Initialize Canvas
    this.gl.clearColor(
      this.canvasClearColor.r,
      this.canvasClearColor.g,
      this.canvasClearColor.b,
      this.canvasClearColor.a
    );

    // Clear the colour as well as the depth buffer.
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

}
