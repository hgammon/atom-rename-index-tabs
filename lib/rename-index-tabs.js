'use babel'

import path from 'path'
import { CompositeDisposable } from 'atom'

export default {
  subscriptions: null,

  activate(state) {
    this.subscriptions = new CompositeDisposable()

    const handler = () => this.renameTabs()

    this.subscriptions.add(
      atom.workspace.observeTextEditors(editor => {
        this.subscriptions.add(editor.onDidDestroy(handler))
        this.subscriptions.add(editor.onDidChangePath(handler))
        this.subscriptions.add(editor.onDidChangeTitle(handler))
      })
    )
    this.subscriptions.add(
      atom.workspace.observePanes(pane => {
        this.subscriptions.add(pane.onDidMoveItem(handler))
        this.subscriptions.add(pane.onDidAddItem(handler))
        this.subscriptions.add(pane.onDidRemoveItem(handler))
      })
    )
    this.subscriptions.add(atom.workspace.onDidOpen(handler))

    setTimeout(handler, 1500)
  },

  deactivate() {
    this.subscriptions.dispose()
  },

  renameTabs() {
    const elements = document.querySelectorAll('li.tab .title')
    elements.forEach(element => {
      setTimeout(() => this.renameTab(element), 5)
    })
  },

  renameTab(element) {
    const name = element.getAttribute('data-name')
    const ext = path.extname(name)
    if (name && path.basename(name, ext) === 'index') {
      const dirs = element.getAttribute('data-path')
        ? path.dirname(element.getAttribute('data-path')).split(path.sep)
        : []
      element.innerText = dirs.length ? `${dirs[dirs.length - 1]}${ext}` : name
    }
  }
}
