/* This is camera code for making an infinite canvas work
here we are going to have the zoom, position and offset values for the user
this will be maniuplated via events on the mouse and all of that
*/

export class Camera {
  private _position: {
    x: number,
    y: number,
  } = {x: 0, y: 0};
  private _zoom: number = 1.0;
  private _canvas: HTMLCanvasElement | null = null;

  constructor(canvas?: HTMLCanvasElement) {
    if (canvas) this._canvas = canvas;
  }

  get position() {
    return { ...this._position };
  }
  get zoom() {
    return this._zoom;
  }
  get canvas() {
    return this._canvas;
  }

  // Next we will set the position for the camera (can also be 'manually' set via events)
  setPosition(x: number, y: number) {
    this._position = {x, y};
    this._updateCanvasOffset();
  }

  setZoom(zoom: number, centerX: number = 0, centerY: number = 0) {
    // This function is to zoom towards the center of the mouse
    const oldZoom = this._zoom;
    this._zoom = Math.max(0.1, Math.min(10, zoom));
    // The line above for future context means we are simply changing the zoom to be between 0.1 and 10
    // if (this._canvas) {
    //   const rect = this._canvas.getBoundingClientRect();
    //   const dx = (centerX - rect.left) / rect.width * 2 - 1;
    //   const dy = (centerY - rect.top) / rect.height * 2 - 1;
    //   this._position.x -= dx * (1 / oldZoom - 1 / this._zoom);
    //   this._position.y -= dy * (1 / oldZoom - 1 / this._zoom);
    //   this._updateCanvasOffset();
    // }
    this._position.x = centerX - (centerX - this._position.x) * (this._zoom / oldZoom);
    this._position.y = centerY - (centerY - this._position.y) * (this._zoom / oldZoom);
    this._updateCanvasOffset();
  }

  getViewMatrix(): Float32Array {
    /*
    This function is to return a view matrix for the webgl rendering in the format:
    2d matrix: [scaleX, skewX, transX, skewY, scaleY, transY, 0, 0, 1]
    simplified it means: scale uniform, translate
    */

    const matrix = new Float32Array([
      this._zoom, 0, -this._position.x * this._zoom,
      0, this._zoom, -this._position.y * this._zoom,
      0, 0, 1
    ]);
    
    return matrix;
  }

  private _updateCanvasOffset() {
    if (this._canvas) {
      // Though this is an optional function, we have to apply it for non webgl rendering
      this._canvas.style.transform = `translate(${-this._position.x}px, ${-this._position.y}px) scale(${this._zoom})`;
    }
  }

  reset() {
    this._position = {x: 0, y: 0};
    this._zoom = 1.0;
    this._updateCanvasOffset();
  }

}