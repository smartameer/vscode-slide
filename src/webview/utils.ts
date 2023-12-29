import { GAME_LEVEL } from "./constants"
import { IMATRIX } from "./interface"

export function findPossibleMoves(grid: IMATRIX) {
  const [batch, column] = findNullPosition(grid)
  const possibleMoves = []
  if (grid[batch - 1] !== undefined) {
    possibleMoves.push([batch - 1, column].join("|"))
  }
  if (grid[batch + 1] !== undefined) {
    possibleMoves.push([batch + 1, column].join("|"))
  }
  if (grid[batch][column - 1] !== undefined) {
    possibleMoves.push([batch, column - 1].join("|"))
  }
  if (grid[batch][column + 1] !== undefined) {
    possibleMoves.push([batch, column + 1].join("|"))
  }
  return possibleMoves
}

export function isCompleted(matrix: IMATRIX, level: number) {
  return matrix.every((batch, batchI) =>
    batch.every((slide: null|number, slideI: number) => {
      return slide === batchI * level + slideI + 1 || slide === null
    })
  )
}

export function findNullPosition(grid: IMATRIX) {
  const batch = grid.findIndex(r => r.includes(null))
  const column = grid[batch].indexOf(null)
  return [batch, column]
}

export function switchSlide(grid: IMATRIX, slide: string) {
  const [nullX, nullY] = findNullPosition(grid)
  const [x, y] = slide.split("|") as [string, string]
  let direction = "e"

  if (parseInt(x, 10) > nullX) {
    direction = "n"
  }
  if (parseInt(x, 10) < nullX) {
    direction = "s"
  }
  if (parseInt(y, 10) > nullY) {
    direction = "w"
  }
  const xx = parseInt(x, 10) as number
  const yy = parseInt(y, 10) as number
  [grid[nullX][nullY], grid[xx][yy]] = [grid[xx][yy], grid[nullX][nullY]]
  return direction
}

export function shuffle(n: number, data: IMATRIX): IMATRIX {
  const matrix = JSON.parse(JSON.stringify(data))
  let lastPosition = findNullPosition(matrix).join("|")
  for (let i = 0; i < n; i++) {
    const moves = findPossibleMoves(matrix)
    const removeIndex = moves.indexOf(lastPosition)
    moves.splice(removeIndex, 1)
    const randomIndex = Math.floor(Math.random() * moves.length)
    const move = moves[randomIndex]
    lastPosition = findNullPosition(matrix).join("|")
    switchSlide(matrix, move)
  }
  return matrix
}

export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function generateMatrix(mode: number): IMATRIX {
  const matrix: IMATRIX = []
  for (let i = 0; i < mode; i++) {
    const items = Array.from({ length: mode}, (value, index) => {
      const val = (i * mode) + ( index + 1)
      return (val === mode * mode) ? null : val
    })
    matrix.push(items)
  }
  return matrix
}