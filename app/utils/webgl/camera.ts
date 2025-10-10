/* This is camera code for making an infinite canvas work
 * Based on Steve Ruiz's zoom UI approach with WebGL integration
 * Camera state is managed in the global store and applied here
 */

import type { CameraState, Point, Viewport } from '../camera';
import { screenToCanvas, canvasToScreen, panCamera, zoomCamera, getViewportBounds } from '../camera';

export interface Camera {
  position: Point;
  zoom: number;
  canvas: HTMLCanvasElement | null;

  setPosition(x: number, y: number): void;
  setZoom(zoom: number, focusX?: number, focusY?: number): void;
  getState(): CameraState;
  setState(state: CameraState): void;
  updateViewMatrix(): void;
}

export function createCamera(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  resolutionUniformLocation: WebGLUniformLocation | null,
  viewMatrixUniformLocation: WebGLUniformLocation | null,
  canvas: HTMLCanvasElement | null = null,
  options: Record<any, any> | null = null
): Camera {
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.SCISSOR_TEST);

  // Camera state following Steve's approach
  let cameraState: CameraState = {
    x: options?.initialX ?? 0,
    y: options?.initialY ?? 0,
    z: options?.initialZoom ?? 1,
  };

  const camera: Camera = {
    get position() {
      return { x: cameraState.x, y: cameraState.y };
    },
    get zoom() {
      return cameraState.z;
    },
    canvas,

    setPosition(x: number, y: number) {
      cameraState.x = x;
      cameraState.y = y;
      this.updateViewMatrix();
    },

    setZoom(zoom: number, focusX?: number, focusY?: number) {
      if (focusX !== undefined && focusY !== undefined && canvas) {
        // Zoom toward a specific point
        const viewport: Viewport = {
          width: canvas.width,
          height: canvas.height,
        };
        const point: Point = { x: focusX, y: focusY };
        const delta = (zoom - cameraState.z) / cameraState.z;
        cameraState = zoomCamera(cameraState, point, -delta, viewport);
      } else {
        // Simple zoom
        cameraState.z = Math.max(0.1, Math.min(10, zoom));
      }
      this.updateViewMatrix();
    },

    getState() {
      return { ...cameraState };
    },

    setState(state: CameraState) {
      cameraState = { ...state };
      this.updateViewMatrix();
    },

    updateViewMatrix() {
      if (!canvas || !viewMatrixUniformLocation) return;

      // Create a view matrix for 2D camera
      const viewMatrix = new Float32Array([
        cameraState.z, 0, 0, 0,
        0, cameraState.z, 0, 0,
        0, 0, 1, 0,
        -cameraState.x * cameraState.z + canvas.width / 2,
        -cameraState.y * cameraState.z + canvas.height / 2,
        0, 1,
      ]);

      gl.uniformMatrix4fv(viewMatrixUniformLocation, false, viewMatrix);

      // Update resolution uniform
      if (resolutionUniformLocation) {
        gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
      }
    },
  };

  // Initialize the view matrix
  camera.updateViewMatrix();

  return camera;
}

// Legacy export for backward compatibility
export const Camera = createCamera;
