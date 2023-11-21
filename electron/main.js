const {app, BrowserWindow, Menu, dialog, ipcMain } = require('electron')
const {templateMenu} = require('./templateMenu')
const path = require('path')
const fs = require('fs')

let mainWindow = null
let file = null

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 600,
    minHeight: 400,
    title: 'Editor de Texto',
    icon: path.join(__dirname, '..', 'public', 'favicon.png'),
    webPreferences: {
      devTools: false,
      nodeIntegration: true,
      preload: `${__dirname}/preload.js`
    },
  })

  await mainWindow.loadFile(path.join(__dirname, '..', 'src', 'index.html'))
  mainWindow.on('closed', () => mainWindow = null)
  createNewFile()
}

app.on('ready', async () => createWindow())

app.on('window-all-closed', () => {if (process.platform !== 'darwin') app.quit()})

app.on('activate', () => {if (window === null) createWindow()})
//FIM DAS CONFIGURAÇÕES

ipcMain.on('update-content', (ev, data) => {
  file.content = data
})

const menu = Menu.buildFromTemplate(templateMenu(createNewFile, openFile, saveFile, saveFileAs))
Menu.setApplicationMenu(menu)

function createNewFile() {
  setFileValues('novo-arquivo.txt', '', false, `${app.getPath('documents')}\\novo-arquivo.txt`)

  mainWindow.webContents.send('set:file', file)
}

async function openFile() {
  const dialogFile = await dialog.showOpenDialog({
    defaultPath: file.path,
    filters: [{name: '.txt', extensions: ['txt']}]
  })

  if (dialogFile.canceled) return

  const dialogPath = dialogFile.filePaths[0]
  setFileValues(path.basename(dialogPath), readFile(dialogPath), true, dialogPath)
  mainWindow.webContents.send('set:file', file)
}

function saveFile() {
  if(!file.saved) return saveFileAs()
  return writeFile(file.path)
}

async function saveFileAs() {
  const dialogFile = await dialog.showSaveDialog({
    defaultPath: file.path,
    filters: [{name: '.txt', extensions: ['txt']}]
  })

  if (dialogFile.canceled) return
  writeFile(dialogFile.filePath)
}

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath,'utf8')
  } catch (e) {
    console.log(e)
    return ''
  }
}

function writeFile(filePath) {
  try {
    fs.writeFile(filePath, file.content, error => {
      if (error) throw error
      setFileValues(path.basename(filePath), file.content, true, filePath)
      mainWindow.webContents.send('set:file', file)
    })
  } catch (e) {console.log(e)}
}

function setFileValues(name, content, saved, path) {file = {name, content, saved, path}}