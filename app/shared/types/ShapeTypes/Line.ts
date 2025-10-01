import { Shape } from './Shape'

export class Line extends Shape {
  borderRadius: number

  constructor(
    id: string,
    length: number,
    thickness: number,
    coordX: number,
    coordY: number,
    borderRadius: number = 0
  ) {
    // For line, height is thickness and width is length
    super(id, thickness, length, coordX, coordY, 'line')
    this.borderRadius = borderRadius
  }
}
