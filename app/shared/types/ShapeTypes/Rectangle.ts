import { Shape } from './Shape';

export class Rectangle extends Shape {
  borderRadius: number

  constructor(
    id: string,
    height: number,
    width: number,
    coordX: number,
    coordY: number,
    opacity: number = 1.0,
    borderRadius: number = 0
  ) {
    super(id, height, width, coordX, coordY, opacity);
    this.borderRadius = borderRadius
  }
}