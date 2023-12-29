import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { getState, resetState, setState, triggerMessage } from './state'
import { GAME_LEVEL, GAME_LEVEL_MODES, GAME_MOVES, SAVED_MATRIX } from './constants'
import Matrix from './matrix'
import { generateMatrix, isCompleted, randomNumber, shuffle } from './utils'
import { IMATRIX } from './interface'

// resetState(GAME_MOVES)
// resetState(SAVED_MATRIX)
const gameMoves = getState(GAME_MOVES)
const savedMatrix = getState(SAVED_MATRIX)
const gameLevel = getState(GAME_LEVEL)
const defaultMatrix = generateMatrix(gameLevel ?? 4)


function App() {
  const random = randomNumber(20, 50)
  const initialMatrix = savedMatrix ?? shuffle(random, defaultMatrix)
  const [matrix, setMatrix] = React.useState<IMATRIX|null>(initialMatrix)
  const [moves, setMoves] = React.useState<number>(gameMoves ?? 0)
  const [level, setLevel] = React.useState<number>(gameLevel ?? 4)

  React.useEffect(() => {
    window.addEventListener('message', event => {
      const message = event.data
      switch (message.command) {
        case 'new':
          let mode = GAME_LEVEL_MODES[message.level]
          const random = randomNumber(20, 50)
          resetState(GAME_MOVES)
          resetState(SAVED_MATRIX)
          resetState(GAME_LEVEL)
          const newLoad = shuffle(random, generateMatrix(mode))
          setMatrix(newLoad)
          setMoves(0)
          setLevel(mode)
          setState({
            key: SAVED_MATRIX,
            value: newLoad
          })
          setState({
            key: GAME_LEVEL,
            value: mode
          })
          triggerMessage('moves', {moves: 0})
          break
      }
    })
  }, [])

  const handlePress = (data: IMATRIX) => {
    setState({
      key: GAME_MOVES,
      value: moves + 1
    })
    setState({
      key: SAVED_MATRIX,
      value: data
    })
    setMoves(moves + 1)
    setMatrix(data)
    triggerMessage('moves', {moves: moves + 1})
  }

  const gameOver = matrix !== null ? isCompleted(matrix, level) : false

  return (
    <div className="container">
      {matrix && (
        <div className={`${gameOver ? 'game-wrapper over': 'game-wrapper'} game-mode-${level}`  }>
          <Matrix data={matrix} onPress={handlePress} />
          {gameOver && (
            <div className="game-over">You won in {moves} moves.</div>
          )}
        </div>
      )}
    </div>
  )
}




const container = document.getElementById('slide-game') as HTMLElement
const root = createRoot(container)
const render = () => root.render(<App />)

render()