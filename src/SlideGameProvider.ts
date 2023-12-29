import * as vscode from 'vscode'

export default class SlideGameProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'slide.game'
  private _view?: vscode.WebviewView
  public static MODE = {
    EASY: '3 x 3',
    NORMAL: '4 x 4',
    HARD: '5 x 5',
  }
  constructor (
    private readonly _extensionUri: vscode.Uri
  ) { }

  public resolveWebviewView (
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ): void {
    this._view = webviewView

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this._extensionUri, 'media')
      ]
    }

    webviewView.webview.html = this.getWebviewContent(webviewView.webview)

    webviewView.webview.onDidReceiveMessage(message => {
      switch(message.command) {
        case 'moves':
          webviewView.badge = { tooltip: 'Moves', value: message.data.moves }
          break
      }
    })
    if (!vscode.workspace.getConfiguration().has('slide.gameLevel')) {
      void vscode.workspace.getConfiguration().update(
        'slide.gameLevel',
        SlideGameProvider.MODE.NORMAL,
        vscode.ConfigurationTarget.Global
      )
    }
  }

  private getWebviewContent (webview: vscode.Webview): string {
    const nonce = this.getNonce()

    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "main.js")
    )
    const stylesPathOnDisk = vscode.Uri.joinPath(this._extensionUri, 'media', 'styles.css')
    const styleMainUri = webview.asWebviewUri(stylesPathOnDisk)

    return `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}' 'unsafe-eval';">
          <title>Slide Game</title>
          <link href="${styleMainUri.toString()}" rel="stylesheet">
        </head>
        <body data-vscode-context='{"preventDefaultContextMenuItems":true,"webviewSection":"game"}'>
          <div id="slide-game" class="slider-game"></div>
          <script nonce="${nonce}" src="${scriptUri}"></script>
        </body>
      </html>`
  }

  public async newGame (): Promise<void> {
    const currentView = this._view
    const level = vscode.workspace.getConfiguration().get('slide.gameLevel')
    await currentView?.webview.postMessage({ command: 'new', level })
  }

  private getNonce (): string {
    let text = ''
    // eslint-disable-next-line max-len
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < 32; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
  }
}