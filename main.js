const electron = require('electron');

const app = electron.app

const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
      width: 731,
      height: 411,
      frame: false,
      resizable: true,
      show: false,
      alwaysOnTop: false,
      opacity: 1,
      minWidth: 480,
      fullscreenable: true,
      webPreferences: {
          nodeIntegration: true
      }
})

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '/index.html'),
    protocol: 'file:',
    slashes: true
  }))
  // // //
  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}
let count = BrowserWindow.getAllWindows();
app.on('ready', function () {
    if (count == 0)
        {
            createWindow()
        }
    else {
        app.quit()
    }
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})



app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
