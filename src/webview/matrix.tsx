import * as React from "react"
import { findPossibleMoves, switchSlide } from "./utils"
import { IMatrixProps } from "./interface"

const Matrix = ({data, onPress}: IMatrixProps): React.ReactElement => {
  return (
    <>
      {data.map((batch, batchI) => (
        <div className="batch" key={batchI}>
          {batch.map((slide: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined, slideI: React.Key | null | undefined) => {
            let className = "slide"
            let onClick = undefined
            const pattern = [batchI, slideI].join("|")
            if (findPossibleMoves(data).includes(pattern)) {
              className += " possible-move"
              onClick = (e: any) => {
                const to = switchSlide(data, pattern)
                e.currentTarget.classList.add(`to-${to}`)
                e.currentTarget.classList.add(`to`)
                setTimeout(() => { onPress(data) }, 80)
              }
            }
            if (slide === null) {
              className += " blank"
            }
            return (
              <span key={slideI} onClick={onClick} className={className}>
                {slide}
              </span>
            )
          })}
        </div>
      ))}
    </>
  )
}

export default Matrix
