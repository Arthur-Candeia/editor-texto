const { shell } = require('electron')

function templateMenu(createNewFile, openFile, saveFile, saveFileAs) {

  return [
    {
      label: 'Arquivo',
      submenu: [
        {
          label: 'Novo',
          accelerator: 'CmdOrCtrl+N',
          click() {
            createNewFile()
          }
        },
        {
          label: 'Abrir',
          accelerator: 'CmdOrCtrl+Shift+A',
          click() {
            openFile()
          }
        },
        {
          label: 'Salvar',
          accelerator: 'CmdOrCtrl+S',
          click() {
            saveFile()
          }
        },
        {
          label: 'Salvar como',
          accelerator: 'CmdOrCtrl+Shift+S',
          click() {
            saveFileAs()
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Fechar',
          accelerator: 'CmdOrCtrl+W',
          role: process.platform === 'darwin' ? 'close' : 'quit'
        }
      ]
    },
    {
      label: 'Editar',
      submenu: [
        {
          label: 'Desfazer',
          role: 'undo'
        },
        {
          label: 'Refazer',
          role: 'redo'
        },
        {
          type: 'separator'
        },
        {
          label: 'Copiar',
          role: 'copy'
        },
        {
          label: 'Recortar',
          role: 'cut'
        },
        {
          label: 'Colar',
          role: 'paste'
        },
      ]
    },
    {
      label: 'Ajuda',
      submenu: [
        {
          label: 'Contato',
          click() {
            shell.openExternal('https://arthur-candeia.com.br/')
          }
        }
      ]
    }
  ]
}

module.exports = {templateMenu}