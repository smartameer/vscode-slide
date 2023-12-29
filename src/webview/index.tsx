import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { getState, resetState, setState, triggerMessage } from './state'
import { GAME_ID, GAME_LEVEL, GAME_LEVEL_MODES, GAME_MOVES, SAVED_MATRIX, WINNING_HISTORY } from './constants'
import Matrix from './matrix'
import { generateMatrix, isCompleted, randomNumber, shuffle } from './utils'
import { IMATRIX } from './interface'

const gameMoves = getState(GAME_MOVES)
const savedMatrix = getState(SAVED_MATRIX)
const gameLevel = getState(GAME_LEVEL)

function App() {
  const defaultMatrix = generateMatrix(gameLevel ?? 4)
  const random = randomNumber(40, 100)
  const initialMatrix = savedMatrix ?? shuffle(random, defaultMatrix)
  const [matrix, setMatrix] = React.useState<IMATRIX|null>(initialMatrix)
  const [moves, setMoves] = React.useState<number>(gameMoves ?? 0)
  const [level, setLevel] = React.useState<number>(gameLevel ?? 4)
  const [id, setId] = React.useState<number|undefined>(undefined)
  const [gameOver, setGameOver] = React.useState<boolean>(false)

  React.useEffect(() => {
    window.addEventListener('message', event => {
      const message = event.data
      switch (message.command) {
        case 'new':
          let mode = GAME_LEVEL_MODES[message.level]
          const random = randomNumber(40, 100)
          resetState(GAME_MOVES)
          resetState(SAVED_MATRIX)
          resetState(GAME_LEVEL)
          resetState(GAME_ID)
          const newLoad = shuffle(random, generateMatrix(mode))
          setMatrix(newLoad)
          setMoves(0)
          setLevel(mode)
          setId(new Date().getTime())
          setState({ key: SAVED_MATRIX, value: newLoad })
          setState({ key: GAME_LEVEL, value: mode })
          setState({ key: GAME_ID, value: new Date().getTime() })
          triggerMessage('moves', { moves: 0 })
          break
        case 'scores':
          const wins = getState(WINNING_HISTORY) ?? {}
          triggerMessage('scores', { scores: Object.values(wins) })
          break
      }
    })
  }, [])

  React.useEffect(() => {
    const gameId = getState(GAME_ID)
    if (gameId) {
      setId(gameId)
    } else {
      setId(new Date().getTime())
      setState({ key: GAME_ID, value: new Date().getTime() })
    }
  }, [])

  const handlePress = (data: IMATRIX) => {
    setState({ key: GAME_MOVES, value: moves + 1 })
    setState({ key: SAVED_MATRIX,  value: data })
    setMoves(moves + 1)
    setMatrix(data)
    triggerMessage('moves', {moves: moves + 1})
  }

  React.useEffect(() => {
    if (moves > 0) {
      setGameOver(matrix !== null ? isCompleted(matrix, level) : false)
    } else {
      setGameOver(false)
    }
  }, [moves])

  React.useEffect(() => {
    if (gameOver) {
      const wins = getState(WINNING_HISTORY) ?? {}
      if (id && !wins.hasOwnProperty(id?.toString() as string)) {
        wins[id?.toString() as string] = {
          gameId: id,
          gameLevel: level,
          moves,
          winningDate: new Date().getTime()
        }
        setState({ key: WINNING_HISTORY, value: wins })
      }
    }
  }, [gameOver])


  return (
    <div className="container" data-id={`id-${id}`}>
      {matrix && (
        <div className={`${gameOver ? 'game-wrapper over': 'game-wrapper'} game-mode-${level}`}>
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
root.render(<App />)