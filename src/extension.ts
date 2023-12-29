import * as vscode from 'vscode'
import SlideGameProvider from './SlideGameProvider'

export function activate(context: vscode.ExtensionContext) {

  const provider = new SlideGameProvider(context.extensionUri)
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(SlideGameProvider.viewType, provider)
  )
  context.subscriptions.push(
    vscode.commands.registerCommand('slide.new', async () => {
      const ack = await vscode.window.showInformationMessage(
        'Do you want to start a new game?',
        'Yes',
        'No'
      )
      if (ack === 'Yes') {
        await provider.newGame()
      }
    }),
    vscode.commands.registerCommand('slide.settings', async () => {
      const level = vscode.workspace.getConfiguration().get('slide.gameLevel')
      const quickPick = vscode.window.createQuickPick()
      quickPick.title = 'Slide game level'
      quickPick.items = [
        {
          label: SlideGameProvider.MODE.EASY,
          picked: level === SlideGameProvider.MODE.EASY,
        },
        {
          label: SlideGameProvider.MODE.NORMAL,
          picked: level === SlideGameProvider.MODE.NORMAL,
        },
        {
          label: SlideGameProvider.MODE.HARD,
          picked: level === SlideGameProvider.MODE.HARD,
        }
      ]
      quickPick.onDidChangeSelection(async (selection) => {
        if (selection.length > 0 && level !== selection[0].label) {
          void vscode.workspace.getConfiguration().update(
            'slide.gameLevel',
            selection[0].label,
            vscode.ConfigurationTarget.Global
          ).then(async () => {
            const ack = await vscode.window.showInformationMessage(
              'Do you want to start a new game in ' + selection[0].label + ' mode?',
              'Yes',
              'No'
            )
            if (ack === 'Yes') {
              await provider.newGame()
            } else {
              await vscode.window.showInformationMessage('Your next game will be in ' + selection[0].label + ' mode.')
            }
          })
        }
        quickPick.hide()
        return true
      })
      quickPick.onDidHide(() => quickPick.dispose)
      quickPick.show()
    }),
  )
}

export function deactivate() {}