import { Injectable } from '@angular/core';
import {Color} from "../../../models/color";
import {Vector2} from "../../../models/vector2";

@Injectable({
  providedIn: 'root'
})
export abstract class WebGLService {


  private canvasSize: Vector2 | undefined;
  private canvasClearColor: Color | undefined;

  private _renderingContext: CanvasRenderingContext2D | ImageBitmapRenderingContext | WebGLRenderingContext | WebGL2RenderingContext | null | undefined;

  protected get gl(): WebGLRenderingContext {
    return this._renderingContext as WebGLRenderingContext;
  }

  protected vertexShader: WebGLShader | undefined;
  protected fragmentShader: WebGLShader | undefined;

  private _program: WebGLProgram | undefined;
  protected get program(): WebGLProgram {
    return <WebGLProgram>this._program;
  }

  private _buffer: WebGLBuffer | undefined;
  protected get buffer(): WebGLBuffer {
    return <WebGLBuffer>this._buffer;
  }

  protected constructor() {
    //empty
  }

  /**
   * Initializes the WebGL Rendering Context and Canvas
   * @param canvas the HTML Canvas Object
   * @param canvasSize the dimensions of the Canvas
   * @param clearColor the color the canvas is reset to when cleared
   */
  public initializeRenderingContext(canvas: HTMLCanvasElement, canvasSize: Vector2, clearColor: Color): boolean {
    this._renderingContext = canvas.getContext('webgl');
    if(!this.gl) {
      console.log("Unable to initialize WebGL. Your browser may not support it.");
      return false;
    }

    this.canvasSize = canvasSize;
    this.canvasClearColor = clearColor;

    this.setCanvasSize(this.canvasSize.x, this.canvasSize.y);
    this.setCanvasClearColor(this.canvasClearColor);
    this.clearCanvas();

    return true;
  }

  protected setCanvasSize(x: number, y: number): void {
    this.gl.canvas.width = x;
    this.gl.canvas.height = y;
  }

  protected setCanvasClearColor(color: Color): void {
    this.gl.clearColor(color.r, color.g, color.b, color.a);
  }

  public clearCanvas(): void {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  /**
   * Initializes all of the service's WebGL components
   * @private
   * @return boolean specifies whether initialization was successful
   */
  protected initialize(vertexSrc: string, fragmentSrc: string): boolean {
    if(this.isInitialized()){
      return true;
    }

    //Initialize Shaders
    this.initializeShader(this.gl.VERTEX_SHADER, vertexSrc);
    this.initializeShader(this.gl.FRAGMENT_SHADER, fragmentSrc);

    if(!this.vertexShader || !this.fragmentShader){
      return false;
    }

    //Initialize Program
    this.initializeProgram(this.vertexShader, this.fragmentShader);

    if(!this.program){
      return false;
    }

    this.initializeBuffer();

    return this.buffer != null;
  }

  private isInitialized(): boolean {
    return this.gl != null
      && this.vertexShader != null
      && this.fragmentShader != null
      && this.program != null
      && this.buffer != null;
  }

  protected updateContext(): void {
    this.gl.useProgram(this.program);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
  }

  /**
   * Used to initialize the service's vertex and fragment shaders ({@link WebGLShader})
   * @param type the shader type - either {@link VERTEX_SHADER} or {@link FRAGMENT_SHADER}
   * @param src the shader source code
   * @protected
   */
  protected initializeShader(type: number, src: string): void {
    const shader = this.gl.createShader(type);
    if (!shader) {
      console.log("Failed to create shader.");
      return;
    }
    this.gl.shaderSource(shader, src);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.log(
        ['An error occurred compiling the shader: ', this.gl.getShaderInfoLog(shader)].join('/n')
      );
      this.gl.deleteShader(shader);
      return;
    }

    if(type == this.gl.VERTEX_SHADER) {
      this.vertexShader = shader;
    }else if(type == this.gl.FRAGMENT_SHADER){
      this.fragmentShader = shader;
    }
  }

  /**
   * Used to initialize the service's {@link WebGLProgram}
   * @param vertexShader
   * @param fragmentShader
   * @protected
   */
  protected initializeProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): void {
    const program = this.gl.createProgram();
    if (!program) {
      console.log("Failed to create shader program.");
      return;
    }

    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      console.log(
        ['Unable to initialize the shader program: ', this.gl.getProgramInfoLog(program)].join('\n')
      );
      return;
    }

    this._program = program;
  }

  /**
   * Used to initialize the service's {@link WebGLBuffer}
   * @protected
   */
  protected initializeBuffer(): void {
    const buffer = this.gl.createBuffer();

    if(!buffer) {
      console.log("Unable to initialize buffer");
      return;
    }

    this._buffer = buffer;
  }

}
