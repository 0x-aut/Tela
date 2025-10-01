/* This is camera code for making an infinite canvas work
here we are going to have the zoom, position and offset values for the user
this will be maniuplated via events on the mouse and all of that
*/

export class Camera {
  public canvas: HTMLCanvasElement | null;
  public position: { x: number; y: number };
  public zoom: number;
  private minZoom: number = 0.1;
  private maxZoom: number = 10;

  constructor(canvas: HTMLCanvasElement | null = null) {
    this.canvas = canvas;
    this.position = { x: 0, y: 0 };
    this.zoom = 1.0;
  }

  setPosition(x: number, y: number) {
    this.position.x = x;
    this.position.y = y;
  }

  setZoom(newZoom: number, worldX?: number, worldY?: number) {
    const oldZoom = this.zoom;
    this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, newZoom));

    // Zoom towards a specific point (usually mouse position)
    if (worldX !== undefined && worldY !== undefined) {
      // Adjust position to zoom towards the point
      this.position.x = worldX - (worldX - this.position.x) * (this.zoom / oldZoom);
      this.position.y = worldY - (worldY - this.position.y) * (this.zoom / oldZoom);
    }
  }

  getViewMatrix(): Float32Array {
    // Create a 3x3 view matrix for 2D transformation
    // This centers the canvas at origin (0,0) and applies zoom/pan
    // Translation accounts for: centering + zoom + camera position
    if (!this.canvas) {
      const matrix = new Float32Array(9);
      matrix[0] = this.zoom;
      matrix[4] = this.zoom;
      matrix[8] = 1;
      return matrix;
    }

    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    // [zoom, 0, 0]
    // [0, zoom, 0]
    // [translateX, translateY, 1]
    const matrix = new Float32Array(9);
    matrix[0] = this.zoom;
    matrix[1] = 0;
    matrix[2] = 0;
    matrix[3] = 0;
    matrix[4] = this.zoom;
    matrix[5] = 0;
    matrix[6] = centerX - this.position.x * this.zoom;
    matrix[7] = centerY - this.position.y * this.zoom;
    matrix[8] = 1;
    return matrix;
  }

  // Convert screen coordinates to world coordinates
  screenToWorld(screenX: number, screenY: number): { x: number; y: number } {
    if (!this.canvas) return { x: 0, y: 0 };
    const rect = this.canvas.getBoundingClientRect();
    const canvasX = screenX - rect.left;
    const canvasY = screenY - rect.top;

    return {
      x: canvasX / this.zoom + this.position.x,
      y: canvasY / this.zoom + this.position.y
    };
  }

  // Get visible bounds in world coordinates
  getVisibleBounds(): { minX: number; minY: number; maxX: number; maxY: number } {
    if (!this.canvas) {
      return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
    }

    const width = this.canvas.width / this.zoom;
    const height = this.canvas.height / this.zoom;

    return {
      minX: this.position.x,
      minY: this.position.y,
      maxX: this.position.x + width,
      maxY: this.position.y + height
    };
  }

  // Check if a shape is visible in the current view
  isShapeVisible(shapeX: number, shapeY: number, shapeWidth: number, shapeHeight: number): boolean {
    const bounds = this.getVisibleBounds();

    // Add some padding to avoid culling shapes at the edge
    const padding = 50;

    return !(
      shapeX + shapeWidth / 2 < bounds.minX - padding ||
      shapeX - shapeWidth / 2 > bounds.maxX + padding ||
      shapeY + shapeHeight / 2 < bounds.minY - padding ||
      shapeY - shapeHeight / 2 > bounds.maxY + padding
    );
  }
}