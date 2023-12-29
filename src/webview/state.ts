import { IPostMessagePayload, IVSCodeAPI } from "./interface"

const vscode: IVSCodeAPI = (global as any).acquireVscodeApi()

export const setState = ({ key, value }: { key: string; value: any }) => {
  const previousState = vscode.getState()
  const state = previousState ? { ...previousState } : {}
  vscode.setState({ ...state, [key]: value })
}

export const getState = (key: string) => {
  const previousState = vscode.getState()

  return previousState ? previousState[key] : null
}

export const resetState = (key: string) => {
  const previousState = vscode.getState()
  const state = previousState ? { ...previousState } : {}
  if (state[key]) {
    delete state[key]
  }
  vscode.setState({ ...state })
}

export const triggerMessage = (key: string, data?: any) => {
  const payload = {
    command: key
  } as IPostMessagePayload
  if (data) {
    payload.data = data
  }
  vscode.postMessage(payload)
}