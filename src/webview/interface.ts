export type IMATRIX = (number | null)[][]

export type IPostMessagePayload = {
  command: string
  data?: any
}

export type IMatrixProps = {
  data: IMATRIX
  onPress: (data: IMATRIX) => void
}