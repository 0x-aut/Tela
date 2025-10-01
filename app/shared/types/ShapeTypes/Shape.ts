export class Shape {
  id: string
  type: string
  height: number
  width: number
  coordX: number
  coordY: number

  constructor(
    id: string,
    height: number,
    width: number,
    coordX: number,
    coordY: number,
    type: string = 'rectangle'
  ) {
    this.id = id
    this.type = type
    this.height = height
    this.width = width
    this.coordX = coordX
    this.coordY = coordY
  }

  // function hitBox(
  //   gl:
  // )
}