import { IPostMessagePayload } from "./interface"

const vsCode = (global as any).acquireVsCodeApi()

export const setState = ({ key, value }: { key: string; value: any }) => {
  const previousState = vsCode.getState()
  const state = previousState ? { ...previousState } : {}
  vsCode.setState({ ...state, [key]: value })
}

export const getState = (key: string) => {
  const previousState = vsCode.getState()

  return previousState ? previousState[key] : null
}

export const resetState = (key: string) => {
  const previousState = vsCode.getState()
  const state = previousState ? { ...previousState } : {}
  if (state[key]) {
    delete state[key]
  }
  vsCode.setState({ ...state })
}

export const triggerMessage = (key: string, data?: any) => {
  const payload = {
    command: key
  } as IPostMessagePayload
  if (data) {
    payload.data = data
  }
  vsCode.postMessage(payload)
}