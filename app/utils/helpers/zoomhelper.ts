/**
 * Zoom helper utilities for the infinite canvas
 *
 * Note: This functionality is now implemented in:
 * - app/utils/webgl/camera.ts - Camera class with zoom and pan
 * - app/composables/useCameraInput.ts - Mouse/keyboard input handling
 * - app/stores/global.ts - Reactive zoom state management
 *
 * The unified camera system handles:
 * - Mouse wheel zoom (with zoom-to-cursor)
 * - Keyboard shortcuts (Ctrl/Cmd +/- for zoom, Ctrl/Cmd 0 to reset)
 * - Middle mouse or Shift+drag for panning
 * - Reactive zoom percentage display
 */

export function useZoomHelper(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  renderFunction:() => void,
  options: Record<any, any> = {}
) {
  // Camera functionality is now handled by the Camera class and useCameraInput composable
  // This function is kept for backwards compatibility but is no longer needed
  console.warn('useZoomHelper is deprecated. Use Camera class and useCameraInput composable instead.');
}