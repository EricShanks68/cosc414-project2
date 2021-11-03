import { Injectable } from '@angular/core';
import {WebGLService} from "../WebGL/web-gl.service";
import {Square} from "../../../models/square";
import {toCanvasCoordinate} from "../../../functions/coordinateFunc";

@Injectable({
  providedIn: 'root'
})
export class SquareDrawerService extends WebGLService {

  private vertexSrc = [
    'attribute vec2 position;',
    'void main() {',
    ' gl_Position = vec4(position, 0.0, 1.0);',
    '}'
  ].join('\n');

  private fragmentSrc = [
    'precision highp float;',
    'uniform vec4 color;',
    'void main() {',
    ' gl_FragColor = color;',
    '}'
  ].join('\n');

  constructor() {
    super();
  }

  /**
   * Draws a circle to the WebGL Canvas
   * @param square the circle to be drawn
   */
  public drawSquare(square: Square): void {
    //Ensure the WebGL components have been initialized
    if(!this.initialize(this.vertexSrc, this.fragmentSrc)){
      console.log("Failed to initialize Circle Drawer Service.");
      return;
    }

    //Set the WebGL context to use the Circle Program and Buffer
    this.updateContext();

    //Insert the vertex positions into the buffer
    //const positions = this.calculateSquareVertices(square);

    const positions = [
        // Front face
        -1.0, -1.0,  1.0,
         1.0, -1.0,  1.0,
         1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,
      
        // Back face
        -1.0, -1.0, -1.0,
        -1.0,  1.0, -1.0,
         1.0,  1.0, -1.0,
         1.0, -1.0, -1.0,
      
        // Top face
        -1.0,  1.0, -1.0,
        -1.0,  1.0,  1.0,
         1.0,  1.0,  1.0,
         1.0,  1.0, -1.0,
      
        // Bottom face
        -1.0, -1.0, -1.0,
         1.0, -1.0, -1.0,
         1.0, -1.0,  1.0,
        -1.0, -1.0,  1.0,
      
        // Right face
         1.0, -1.0, -1.0,
         1.0,  1.0, -1.0,
         1.0,  1.0,  1.0,
         1.0, -1.0,  1.0,
      
        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0,
        -1.0,  1.0,  1.0,
        -1.0,  1.0, -1.0,
      ];
      
      const indices = [
        0,  1,  2,      0,  2,  3,    // front
        4,  5,  6,      4,  6,  7,    // back
        8,  9,  10,     8,  10, 11,   // top
        12, 13, 14,     12, 14, 15,   // bottom
        16, 17, 18,     16, 18, 19,   // right
        20, 21, 22,     20, 22, 23,   // left
      ];

      // create 12 vertices of a icosahedron
//var t = (1.0 + Math.sqrt(5.0)) / 2.0;

    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);

    //Pass the circle color into the fragment shader color uniform
    const colorUniform = this.gl.getUniformLocation(this.program, 'color');
    this.gl.uniform4fv(colorUniform, [square.color.r, square.color.g, square.color.b, square.color.a]);

    //Pass the circle vertices into the vertex shader position attribute
    const positionAttrib = this.gl.getAttribLocation(this.program, 'position');
    this.gl.enableVertexAttribArray(positionAttrib);
    this.gl.vertexAttribPointer(positionAttrib, 3, this.gl.FLOAT, false, 0, 0);

    //try
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffer.indices);

    //Draw the circle
    // this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    this.gl.drawElements(this.gl.TRIANGLES, 36, this.gl.UNSIGNED_SHORT,0);
  }

  /**
   * Calculates the vertices of the circle
   * @param square
   * @private
   * @return number[] an array of calculated vertex positions
   */
//   private calculateSquareVertices(square: Square): number[] {
//     const positions: number[] = [];

//     //Centre Point
//     positions.push(toCanvasCoordinate(square.location.x, this.gl.canvas.width)); //x
//     positions.push(toCanvasCoordinate(square.location.y, this.gl.canvas.height));

//     for(let i = 0; i<square.resolution+1; i++){
//       const angle = (i * 2 * Math.PI) / square.resolution;
//       const pointX = square.location.x + (square.veriticies)
//       const pointY = square.location.y + (square.veriticies);

//       positions.push(toCanvasCoordinate(pointX, this.gl.canvas.width));
//       positions.push(toCanvasCoordinate(pointY, this.gl.canvas.height));
//     }

//     return positions;
//   }

}

