const electron = require('electron')
const { app, BrowserWindow } = require('electron')
const path = require('path')
const ipc = electron.ipcMain

var screenWidth   = null
var screenHeight  = null

app.on('ready', ()=>{
  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize
  screenWidth   = width
  screenHeight  = height

  const mainW = new BrowserWindow({
      height: screenHeight - 40
    , width:  screenWidth - 40,
  })
  mainW.loadURL(`file://${path.resolve('./app/analyser.html')}`)
  mainW.toggleDevTools();

})

ipc.on('get-screen-dimensions', ev => {
  ev.returnValue = {width: screenWidth, height: screenHeight}
})
