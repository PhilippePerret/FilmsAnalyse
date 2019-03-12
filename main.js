const electron = require('electron')
const { app, BrowserWindow } = require('electron')
const { Menu, MenuItem } = require('electron')
const path = require('path')
const ipc = electron.ipcMain

const Prefs = require('./app/js/main-process/Prefs.js')

var screenWidth   = null
var screenHeight  = null

const DATA_MENUS = require('./app/js/main-process/menu.js')

let mainMenuBar = null

global.mainW          = null
global.userPrefsPath  =
global.userPrefs      = null

app.on('ready', () => {

  // Chargement des préférences
  Prefs.init().load()

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
.on('quit', () => {
  // Si des préférences ont été modifiées, on les enregistré (en synchrone)
  Prefs.saveIfModified()

})

ipc.on('get-screen-dimensions', ev => {
  ev.returnValue = {width: screenWidth, height: screenHeight}
})
//
// /**
//  * Pour les préférences
//  */
// ipc.on('get-pref', (ev, data) => {
//   ev.returnValue = Prefs.get(data)
// })
// ipc.on('set-pref', (ev, data) => {
//   ev.returnValue = Prefs.set(data)
// })
