/* Camera utilities based on Steve Ruiz's zoom UI approach
 * This implements coordinate transformations between screen and canvas space
 * for infinite canvas interactions
 */

export interface Point {
  x: number;
  y: number;
}

export interface CameraState {
  x: number; // Camera position X on canvas
  y: number; // Camera position Y on canvas
  z: number; // Zoom level (1 = 100%)
}

export interface Viewport {
  width: number;
  height: number;
}

/**
 * Convert a point from screen coordinates to canvas coordinates
 * @param screenPoint - Point in screen space (pixels)
 * @param camera - Current camera state
 * @param viewport - Viewport dimensions
 * @returns Point in canvas space
 */
export function screenToCanvas(
  screenPoint: Point,
  camera: CameraState,
  viewport: Viewport
): Point {
  return {
    x: screenPoint.x / camera.z - viewport.width / 2 / camera.z + camera.x,
    y: screenPoint.y / camera.z - viewport.height / 2 / camera.z + camera.y,
  };
}

/**
 * Convert a point from canvas coordinates to screen coordinates
 * @param canvasPoint - Point in canvas space
 * @param camera - Current camera state
 * @param viewport - Viewport dimensions
 * @returns Point in screen space (pixels)
 */
export function canvasToScreen(
  canvasPoint: Point,
  camera: CameraState,
  viewport: Viewport
): Point {
  return {
    x: (canvasPoint.x - camera.x) * camera.z + viewport.width / 2,
    y: (canvasPoint.y - camera.y) * camera.z + viewport.height / 2,
  };
}

/**
 * Pan the camera by a delta in screen space
 * @param camera - Current camera state
 * @param delta - Pan delta in screen pixels
 * @returns New camera state
 */
export function panCamera(camera: CameraState, delta: Point): CameraState {
  return {
    ...camera,
    x: camera.x - delta.x / camera.z,
    y: camera.y - delta.y / camera.z,
  };
}

/**
 * Zoom the camera toward a specific point in screen space
 * @param camera - Current camera state
 * @param point - Point in screen space to zoom toward
 * @param delta - Zoom delta (negative = zoom in, positive = zoom out)
 * @param viewport - Viewport dimensions
 * @returns New camera state
 */
export function zoomCamera(
  camera: CameraState,
  point: Point,
  delta: number,
  viewport: Viewport
): CameraState {
  const zoom = camera.z;
  const nextZoom = Math.max(0.1, Math.min(10, zoom - delta * zoom)); // Clamp between 0.1 and 10

  // Get the point in canvas space before zoom
  const canvasPoint = screenToCanvas(point, camera, viewport);

  // Calculate new camera position to keep the canvas point under the cursor
  return {
    x: canvasPoint.x - (point.x - viewport.width / 2) / nextZoom,
    y: canvasPoint.y - (point.y - viewport.height / 2) / nextZoom,
    z: nextZoom,
  };
}

/**
 * Get the viewport bounds in canvas space
 * @param camera - Current camera state
 * @param viewport - Viewport dimensions
 * @returns Bounding box in canvas space
 */
export function getViewportBounds(
  camera: CameraState,
  viewport: Viewport
): { minX: number; minY: number; maxX: number; maxY: number } {
  const topLeft = screenToCanvas({ x: 0, y: 0 }, camera, viewport);
  const bottomRight = screenToCanvas(
    { x: viewport.width, y: viewport.height },
    camera,
    viewport
  );

  return {
    minX: topLeft.x,
    minY: topLeft.y,
    maxX: bottomRight.x,
    maxY: bottomRight.y,
  };
}

/**
 * Calculate CSS transform string for applying camera transformation
 * @param camera - Current camera state
 * @param viewport - Viewport dimensions
 * @returns CSS transform string
 */
export function getCameraTransform(
  camera: CameraState,
  viewport: Viewport
): string {
  const x = -camera.x * camera.z + viewport.width / 2;
  const y = -camera.y * camera.z + viewport.height / 2;
  return `translate(${x}px, ${y}px) scale(${camera.z})`;
}
