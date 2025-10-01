import { Shape } from './Shape'

export class Line extends Shape {
  startX: number
  startY: number
  endX: number
  endY: number
  thickness: number
  borderRadius: number

  constructor(
    id: string,
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    thickness: number = 2,
    borderRadius: number = 0
  ) {
    // Calculate center point and dimensions for the base Shape class
    const centerX = (startX + endX) / 2;
    const centerY = (startY + endY) / 2;
    const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    super(id, thickness, length, centerX, centerY, 'line')

    this.startX = startX
    this.startY = startY
    this.endX = endX
    this.endY = endY
    this.thickness = thickness
    this.borderRadius = borderRadius
  }
}
