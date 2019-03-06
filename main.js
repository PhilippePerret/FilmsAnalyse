const electron = require('electron')
const { app, BrowserWindow } = require('electron')
const path = require('path')

app.on('ready', ()=>{
  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize

  const mainW = new BrowserWindow({
      height: height - 40
    , width:  width - 40,
  })
  mainW.loadURL(`file://${path.resolve('./app/analyser.html')}`)
  mainW.toggleDevTools();

})
