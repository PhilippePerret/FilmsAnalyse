const { app, BrowserWindow } = require('electron')
const path = require('path')

app.on('ready', ()=>{
  const mainW = new BrowserWindow({
    height: 900, width: 1400,
  })
  mainW.loadURL(`file://${path.resolve('./app/main.html')}`)
  mainW.toggleDevTools();

})
