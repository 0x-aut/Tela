/* This is camera code for making an infinite canvas work
here we are going to have the zoom, position and offset values for the user
this will be maniuplated via events on the mouse and all of that
*/

export class Camera {
  position: { x: number; y: number };
  zoom: number;
  minZoom: number;
  maxZoom: number;
  canvas: HTMLCanvasElement | null;

  constructor(canvas: HTMLCanvasElement | null = null) {
    this.position = { x: 0, y: 0 }; // Camera position in world space
    this.zoom = 1.0; // Zoom level (1.0 = normal)
    this.minZoom = 0.1; // Minimum zoom out
    this.maxZoom = 10.0; // Maximum zoom in
    this.canvas = canvas;
  }

  setPosition(x: number, y: number) {
    this.position.x = x;
    this.position.y = y;
  }

  setZoom(newZoom: number, worldX?: number, worldY?: number) {
    // Clamp zoom to min/max range
    const clampedZoom = Math.max(this.minZoom, Math.min(this.maxZoom, newZoom));

    // If zooming towards a specific point, adjust position to keep that point fixed
    if (worldX !== undefined && worldY !== undefined) {
      const zoomRatio = clampedZoom / this.zoom;
      this.position.x = worldX - (worldX - this.position.x) * zoomRatio;
      this.position.y = worldY - (worldY - this.position.y) * zoomRatio;
    }

    this.zoom = clampedZoom;
  }

  getViewMatrix(): number[] {
    // Create a 3x3 transformation matrix for 2D camera
    // This combines translation (camera position) and scaling (zoom)
    // Matrix format: [scaleX, 0, 0, 0, scaleY, 0, translateX, translateY, 1]
    const canvasWidth = this.canvas?.width || 800;
    const canvasHeight = this.canvas?.height || 600;

    // Center the view and apply zoom and pan
    const translateX = canvasWidth / 2 - this.position.x * this.zoom;
    const translateY = canvasHeight / 2 - this.position.y * this.zoom;

    return [
      this.zoom, 0, 0,
      0, this.zoom, 0,
      translateX, translateY, 1
    ];
  }

  screenToWorld(screenX: number, screenY: number): { x: number; y: number } {
    // Convert screen coordinates to world coordinates
    const canvasWidth = this.canvas?.width || 800;
    const canvasHeight = this.canvas?.height || 600;

    const worldX = (screenX - canvasWidth / 2) / this.zoom + this.position.x;
    const worldY = (screenY - canvasHeight / 2) / this.zoom + this.position.y;

    return { x: worldX, y: worldY };
  }

  worldToScreen(worldX: number, worldY: number): { x: number; y: number } {
    // Convert world coordinates to screen coordinates
    const canvasWidth = this.canvas?.width || 800;
    const canvasHeight = this.canvas?.height || 600;

    const screenX = (worldX - this.position.x) * this.zoom + canvasWidth / 2;
    const screenY = (worldY - this.position.y) * this.zoom + canvasHeight / 2;

    return { x: screenX, y: screenY };
  }

  getVisibleBounds(): { minX: number; minY: number; maxX: number; maxY: number } {
    // Calculate the visible rectangle in world space for viewport culling
    const canvasWidth = this.canvas?.width || 800;
    const canvasHeight = this.canvas?.height || 600;

    const halfWidth = (canvasWidth / 2) / this.zoom;
    const halfHeight = (canvasHeight / 2) / this.zoom;

    return {
      minX: this.position.x - halfWidth,
      minY: this.position.y - halfHeight,
      maxX: this.position.x + halfWidth,
      maxY: this.position.y + halfHeight
    };
  }

  isVisible(x: number, y: number, width: number, height: number): boolean {
    // Check if an object is within the visible bounds (viewport culling)
    const bounds = this.getVisibleBounds();
    const margin = 50; // Add margin to avoid popping

    return !(
      x + width < bounds.minX - margin ||
      x - width > bounds.maxX + margin ||
      y + height < bounds.minY - margin ||
      y - height > bounds.maxY + margin
    );
  }
}