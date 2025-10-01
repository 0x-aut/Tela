export class Shape {
  id: string
  height: number
  width: number
  coordX: number
  coordY: number
  opacity: number

  constructor(
    id: string,
    height: number,
    width: number,
    coordX: number,
    coordY: number,
    opacity: number = 1.0,
  ) {
    this.id = id
    this.height = height
    this.width = width
    this.coordX = coordX
    this.coordY = coordY
    this.opacity = opacity
  }

  // function hitBox(
  //   gl:
  // )
}