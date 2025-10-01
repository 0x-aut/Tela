/*
This file is created to handle the events for the camera movement.
*/

import { onMounted, onUnmounted } from "vue";
import { ref } from "vue";
import type { Camera } from "../utils/webgl/camera";
import { useGlobalStore } from "../stores/global";

export const useCameraInput = (camera: Camera, onCameraUpdate?: () => void) => {
  const globalStore = useGlobalStore();
  let isDragging = false;
  let lastMouseX = 0;
  let lastMouseY = 0;

  const updateGlobalStore = () => {
    globalStore.setZoom(camera.zoom);
    globalStore.setCameraPosition(camera.position.x, camera.position.y);
    if (onCameraUpdate) {
      onCameraUpdate();
    }
  };

  const _handleMouseDown = (e: MouseEvent) => {
    // Only enable panning with middle mouse button or space + left click
    if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
      isDragging = true;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      e.preventDefault();
    }
  };

  const _handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastMouseX;
    const deltaY = e.clientY - lastMouseY;
    camera.setPosition(camera.position.x - deltaX / camera.zoom, camera.position.y - deltaY / camera.zoom);
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    updateGlobalStore();
    e.preventDefault();
  };

  const _handleMouseUp = () => {
    isDragging = false;
  };

  const _handleWheel = (e: WheelEvent) => {
    e.preventDefault();

    // Determine zoom factor based on wheel direction
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;

    const rect = camera.canvas?.getBoundingClientRect();
    if (!rect) return;

    // Get mouse position relative to canvas
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Convert to world coordinates
    const worldX = (mouseX / camera.zoom) + camera.position.x;
    const worldY = (mouseY / camera.zoom) + camera.position.y;

    camera.setZoom(camera.zoom * zoomFactor, worldX, worldY);
    updateGlobalStore();
  };

  const _handleKeyDown = (e: KeyboardEvent) => {
    // Handle Ctrl/Cmd + Plus for zoom in
    if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '=')) {
      e.preventDefault();
      const canvas = camera.canvas;
      if (!canvas) return;

      // Zoom towards center of canvas
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const worldX = (centerX / camera.zoom) + camera.position.x;
      const worldY = (centerY / camera.zoom) + camera.position.y;

      camera.setZoom(camera.zoom * 1.1, worldX, worldY);
      updateGlobalStore();
    }

    // Handle Ctrl/Cmd + Minus for zoom out
    if ((e.ctrlKey || e.metaKey) && (e.key === '-' || e.key === '_')) {
      e.preventDefault();
      const canvas = camera.canvas;
      if (!canvas) return;

      // Zoom towards center of canvas
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const worldX = (centerX / camera.zoom) + camera.position.x;
      const worldY = (centerY / camera.zoom) + camera.position.y;

      camera.setZoom(camera.zoom * 0.9, worldX, worldY);
      updateGlobalStore();
    }

    // Handle Ctrl/Cmd + 0 to reset zoom
    if ((e.ctrlKey || e.metaKey) && e.key === '0') {
      e.preventDefault();
      camera.setZoom(1.0);
      camera.setPosition(0, 0);
      updateGlobalStore();
    }
  };

  onMounted(() => {
    const canvas = camera.canvas;
    if (!canvas) return;

    canvas.addEventListener("mousedown", _handleMouseDown);
    canvas.addEventListener("mousemove", _handleMouseMove);
    canvas.addEventListener("mouseup", _handleMouseUp);
    canvas.addEventListener("wheel", _handleWheel, { passive: false });

    // This is to prevent the drag outside the canvas
    document.addEventListener('mousemove', _handleMouseMove);
    document.addEventListener('mouseup', _handleMouseUp);
    document.addEventListener('keydown', _handleKeyDown);

    // Initialize global store with camera values
    updateGlobalStore();
  });

  onUnmounted(() => {
    const canvas = camera.canvas;
    if (!canvas) return;
    canvas.removeEventListener("mousedown", _handleMouseDown);
    canvas.removeEventListener("mousemove", _handleMouseMove);
    canvas.removeEventListener("mouseup", _handleMouseUp);
    canvas.removeEventListener("wheel", _handleWheel);
    document.removeEventListener('mousemove', _handleMouseMove);
    document.removeEventListener('mouseup', _handleMouseUp);
    document.removeEventListener('keydown', _handleKeyDown);
  });

  return {
    updateGlobalStore
  };
}