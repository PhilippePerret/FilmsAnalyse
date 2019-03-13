const electron = require('electron')
const { app, BrowserWindow } = require('electron')
const { Menu, MenuItem } = require('electron')
const path = require('path')
const ipc = electron.ipcMain

const Prefs = require('./app/js/main-process/Prefs.js')

var screenWidth   = null
var screenHeight  = null

const DATA_MENUS = require('./app/js/main-process/menu.js')

global.mainW          = null
global.userPrefsPath  =
global.userPrefs      = null
global.mainMenuBar    = null

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
  // mainW.toggleDevTools();

  mainW.on('close', (ev) => {
    // console.log("Je fais ça avant de fermer la fenêtre et quitter")
    // Maintenant, on sauve toujours car 1/ les données sauvées sont maigres
    // et 2/ elles contiennent le dernier temps
    mainW.webContents.executeJavaScript('current_analyse && current_analyse.saveData()')
    // ev.preventDefault() // pour empêcher la fermeture
  })

})
.on('quit', () => {
  // Si des préférences ont été modifiées, on les enregistré (en synchrone)
  Prefs.saveIfModified()

})

ipc.on('get-screen-dimensions', ev => {
  ev.returnValue = {width: screenWidth, height: screenHeight}
})
