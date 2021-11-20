import { Injectable } from '@angular/core';
import {WebGLService} from "../WebGL/web-gl.service";
import * as matrix from 'gl-matrix';
import {Sphere} from "../../../models/sphere";
import {toCanvasCoordinate} from "../../../functions/coordinateFunc";
import { m4 } from 'twgl.js';

@Injectable({
  providedIn: 'root'
})
export class SphereDrawerService extends WebGLService {

  private vertexSrc = [
    'attribute vec3 position;',
    'uniform mat4 uModelViewMatrix;',
    'uniform mat4 uProjectionMatrix;',
    'varying vec4 vColor;',
    'void main() {',
    ' gl_PointSize = 3.0;',
    ' gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(position, 1.0);',
    ' vColor = vec4(position.x, position.y, 0.5, 1);',
    '}'
  ].join('\n');

  private fragmentSrc = [
    'precision highp float;',
    'uniform vec4 color;',
    'varying vec4 vColor;',
    'void main() {',
    ' gl_FragColor = color;',
    '}'
  ].join('\n');

  constructor() {
    super();
  }

  /**
   * Draws a circle to the WebGL Canvas
   * @param sphere the sphere to be drawn
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
    const vertices = this.calculateSphereVertices(sphere);
    const indices = this.calculateSphereIndices(sphere);

    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);

    const indexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), this.gl.STATIC_DRAW);


    const projectionMatrix = matrix.mat4.create();
    matrix.mat4.perspective(
      projectionMatrix,
      45 * Math.PI / 180,
      this.gl.canvas.width / this.gl.canvas.height,
      -10,
      10
    );

    const projection = this.gl.getUniformLocation(this.program, 'uProjectionMatrix');
    this.gl.uniformMatrix4fv(projection, false, projectionMatrix);

    const modelViewMatrix = matrix.mat4.create();

    matrix.mat4.translate(
      modelViewMatrix,     // destination matrix
      modelViewMatrix,     // matrix to translate
      [0, 0, -10] // amount to translate
    );

    matrix.mat4.rotate(modelViewMatrix, modelViewMatrix, sphere.rotation.x, [0, 1, 0])
    matrix.mat4.rotate(modelViewMatrix, modelViewMatrix, sphere.rotation.y, [1, 0, 0])


    const modelView = this.gl.getUniformLocation(this.program, 'uModelViewMatrix');
    this.gl.uniformMatrix4fv(modelView, false, modelViewMatrix);

    //Pass the circle color into the fragment shader color uniform
    const colorUniform = this.gl.getUniformLocation(this.program, 'color');
    this.gl.uniform4fv(colorUniform, [sphere.color.r, sphere.color.g, sphere.color.b, sphere.color.a]);

    //Pass the circle vertices into the vertex shader position attribute
    const positionAttrib = this.gl.getAttribLocation(this.program, 'position');
    this.gl.enableVertexAttribArray(positionAttrib);
    this.gl.vertexAttribPointer(positionAttrib, 3, this.gl.FLOAT, false, 0, 0);

    //Draw the circle
    this.gl.drawElements(this.gl.TRIANGLES, indices.length, this.gl.UNSIGNED_BYTE, 0);

    //create the inverse mapping to clip space 
    const projxmodel = matrix.mat4.create();
    let invertMat = m4.translation([1, 2, 3]); 
    const p1temp = matrix.mat4.multiply(projxmodel, projectionMatrix, modelViewMatrix);
    invertMat = m4.inverse(p1temp);
  }
  /**
   * Calculates the vertices of the circle
   * @param circle
   * @private
   * @return number[] an array of calculated vertex positions
   */
  private calculateSphereVertices(sphere: Sphere): number[] {
    const vertices: number[] = [];

    for (let j = 0; j <= sphere.resolution; j++) {
      const aj = j * Math.PI / sphere.resolution;
      const sj = Math.sin(aj);
      const cj = Math.cos(aj);
      for (let i = 0; i <= sphere.resolution; i++) {
        const ai = i * 2 * Math.PI / sphere.resolution;
        const si = Math.sin(ai);
        const ci = Math.cos(ai);

        vertices.push(sphere.location.x + sphere.radius * si * sj);  // X
        vertices.push(sphere.location.y + sphere.radius * cj);       // Y
        vertices.push(sphere.location.z + sphere.radius * ci * sj);  // Z
      }
    }

    return vertices;
  }

  private calculateSphereIndices(sphere: Sphere){
    const indices: number[] = [];

    for (let j = 0; j < sphere.resolution; j++) {
      for (let i = 0; i < sphere.resolution; i++) {
        const p1 = j * (sphere.resolution+1) + i;
        const p2 = p1 + (sphere.resolution+1);

        indices.push(p1);
        indices.push(p2);
        indices.push(p1 + 1);

        indices.push(p1 + 1);
        indices.push(p2);
        indices.push(p2 + 1);
      }
    }

    return indices;
  }




}

