import { Shape } from './Shape'

export class Triangle extends Shape {
  constructor(
    id: string,
    height: number,
    width: number,
    coordX: number,
    coordY: number
  ) {
    super(id, height, width, coordX, coordY, 'triangle')
  }
}
