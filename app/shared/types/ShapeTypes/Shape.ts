export class Shape {
  id: string
  type: string
  height: number
  width: number
  coordX: number
  coordY: number
  color: number[]

  constructor(
    id: string,
    height: number,
    width: number,
    coordX: number,
    coordY: number,
    type: string = 'rectangle',
    color: number[] = [1.0, 1.0, 1.0, 1.0]
  ) {
    this.id = id
    this.type = type
    this.height = height
    this.width = width
    this.coordX = coordX
    this.coordY = coordY
    this.color = color
  }

  // function hitBox(
  //   gl:
  // )
}