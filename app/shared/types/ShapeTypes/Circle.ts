import { Shape } from './Shape'

export class Circle extends Shape {
  radius: number

  constructor(
    id: string,
    coordX: number,
    coordY: number,
    radius: number
  ) {
    // For circle, width and height are diameter
    super(id, radius * 2, radius * 2, coordX, coordY, 'circle')
    this.radius = radius
  }
}
