const electron = require('electron')
const { app, BrowserWindow } = require('electron')
const { Menu, MenuItem } = require('electron')
const path = require('path')
const ipc = electron.ipcMain

var screenWidth   = null
var screenHeight  = null

const DATA_MENUS = require('./app/js/main-process/menu.js')

let mainMenuBar = null

global.mainW = null

app.on('ready', () => {

  // Construction des menus
  // Note : on a besoin de `mainMenuBar` pour retrouver les menus par
  // leur identifiant (cf. le modules modules/menus.js)
  mainMenuBar = Menu.buildFromTemplate(DATA_MENUS)
  Menu.setApplicationMenu(mainMenuBar);

  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize
  screenWidth   = width
  screenHeight  = height

  mainW = new BrowserWindow({
      height: screenHeight - 40
    , width:  screenWidth - 40,
  })
  mainW.loadURL(`file://${path.resolve('./app/analyser.html')}`)
  mainW.toggleDevTools();

})

ipc.on('get-screen-dimensions', ev => {
  ev.returnValue = {width: screenWidth, height: screenHeight}
})
