export class Shape {
  id: string
  type: string
  height: number
  width: number
  coordX: number
  coordY: number
  color: string

  constructor(
    id: string,
    height: number,
    width: number,
    coordX: number,
    coordY: number,
    type: string = 'rectangle',
    color: string = '#FFFFFF'
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