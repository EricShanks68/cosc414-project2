import { Injectable } from '@angular/core';
import {WebGLService} from "../WebGL/web-gl.service";
import {Sphere} from "../../../models/sphere";
import {toCanvasCoordinate} from "../../../functions/coordinateFunc";

@Injectable({
  providedIn: 'root'
})
export class SphereDrawerService extends WebGLService {

  private vertexSrc = [
    'attribute vec4 position;',
    'uniform mat4 RotMatrix',
    'void main() {',
    ' gl_Position = position * RotMatrix;',
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
   * @param sphere the circle to be drawn
   */
  public drawSphere(sphere: Sphere): void {
    //Ensure the WebGL components have been initialized
    if(!this.initialize(this.vertexSrc, this.fragmentSrc)){
      console.log("Failed to initialize Circle Drawer Service.");
      return;
    }

    //Set the WebGL context to use the Circle Program and Buffer
    this.updateContext();

    //Insert the vertex positions into the buffer
    const vert = this.calculateSphereVertices(sphere);
    const ind = this.calculateSphereIndices(sphere);
    
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);

    //Pass the circle color into the fragment shader color uniform
    const colorUniform = this.gl.getUniformLocation(this.program, 'color');
    this.gl.uniform4fv(colorUniform, [sphere.color.r, sphere.color.g, sphere.color.b, sphere.color.a]);

    //Pass the circle vertices into the vertex shader position attribute
    const positionAttrib = this.gl.getAttribLocation(this.program, 'position');
    this.gl.enableVertexAttribArray(positionAttrib);
    this.gl.vertexAttribPointer(positionAttrib, 2, this.gl.FLOAT, false, 0, 0);

    //Draw the circle
    this.gl.drawArrays(this.gl.TRIANGLES, 0, positions.length/2);
  }

  /**
   * Calculates the vertices of the circle
   * @param circle
   * @private
   * @return number[] an array of calculated vertex positions
   */
  private calculateSphereVertices(sphere: Sphere): number[] {
    const vert: number[] = [];

    for(let i = 0; i<sphere.resolution+1; i++){
      const angle = (i * Math.PI) / sphere.resolution;
      const pointX = sphere.location.x + (sphere.radius * Math.cos(angle));
      const pointY = sphere.location.y + (sphere.radius * Math.sin(angle));

      for(let j = 0; j < sphere.resolution; j++){
        const angle2 = (i * 2 * Math.PI) / sphere.resolution;
        const pointX2 = sphere.location.x + (sphere.radius * Math.cos(angle2));
        const pointY2 = sphere.location.y + (sphere.radius * Math.sin(angle2));

        vert.push(toCanvasCoordinate(pointX * pointX2, this.gl.canvas.width));
        vert.push(toCanvasCoordinate(pointY, this.gl.canvas.height));
        //do something with z axis?
        vert.push(pointX * pointY2);
        vert.push(0);
      }
      // for (j = 0; j <= SPHERE_DIV; j++) {
      //   aj = j * Math.PI / SPHERE_DIV;
      //   sj = Math.sin(aj);
      //   cj = Math.cos(aj);
      //   for (i = 0; i <= SPHERE_DIV; i++) {
      //     ai = i * 2 * Math.PI / SPHERE_DIV;
      //     si = Math.sin(ai);
      //     ci = Math.cos(ai);

      //     vertices.push(si * sj);  // X
      //     vertices.push(cj);       // Y
      //     vertices.push(ci * sj);  // Z
      //   }
    }

    return vert;
  }

  private calculateSphereIndices(sphere: Sphere): number[] {
    const ind: number[] = [];

    for(let i = 0; i<sphere.resolution; i++){
      for(let j = 0; j<sphere.resolution; j++){
       const p1 = j * (sphere.resolution+1) + i;
       const p2 = p1 + (sphere.resolution+1);

       ind.push(p1);
       ind.push(p2);
       ind.push(p1 + 1);

       ind.push(p1 + 1);
       ind.push(p2);
       ind.push(p2 + 1);
      }
    }


    // // Indices
    // for (j = 0; j < SPHERE_DIV; j++) {
    //   for (i = 0; i < SPHERE_DIV; i++) {
    //     p1 = j * (SPHERE_DIV+1) + i;
    //     p2 = p1 + (SPHERE_DIV+1);

    //     indices.push(p1);
    //     indices.push(p2);
    //     indices.push(p1 + 1);

    //     indices.push(p1 + 1);
    //     indices.push(p2);
    //     indices.push(p2 + 1);
    //   }
    // }

    return ind;
  }

}

