/*
This file is created to handle the events for the camera movement.
*/

import { onMounted, onUnmounted } from "vue";
import { ref } from "vue";
import type { Camera } from "~/utils/camera";

export const useCameraInput = (camera: Camera) => {
  let isDragging = false;
  let lastMouseX = 0;
  let lastMouseY = 0;

  const _handleMouseDown = (e: MouseEvent) => {
    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    e.preventDefault();
  };

  const _handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastMouseX;
    const deltaY = e.clientY - lastMouseY;
    camera.setPosition(camera.position.x - deltaX / camera.zoom, camera.position.y - deltaY / camera.zoom);
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    e.preventDefault();
  };

  const _handleMouseUp = () => {
    isDragging = false;
  };

  const _handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1; // This is to zoom in or out according to the zoom range
    const rect = camera.canvas?.getBoundingClientRect();
    if (!rect) return;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    // Now we will convert to world coordinates (refine later via testing)
    const worldX = (mouseX / camera.zoom) + camera.position.x;
    const worldY = (mouseY / camera.zoom) + camera.position.y;
    camera.setZoom(camera.zoom * zoomFactor, worldX, worldY);
  }

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
  });
}