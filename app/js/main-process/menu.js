'use strict'

// const electron = require('electron')
const { app } = require('electron')
const path    = require('path')
// const ipc     = electron.ipcMain

/**
 * Définition des menus
 */
const DATA_MENUS = [
  {
      label: 'Analyse'
    , enabled: true
    , submenu: [
          {
              label: 'Nouvelle…'
            , accelerator: 'CmdOrCtrl+N'
            , click: () => { mainW.webContents.executeJavaScript('FAnalyse.onWantNewAnalyse()')}
          }
        , {type: 'separator'}
        , {
              label: 'Ouvrir…'
            , accelerator: 'CmdOrCtrl+O'
            , click: () => { mainW.webContents.executeJavaScript('FAnalyse.chooseAnalyse()')}
          }
        , { type: 'separator' }
        , {
              label: 'Enregistrer'
            , accelerator: 'CmdOrCtrl+S'
            , click: () => { mainW.webContents.executeJavaScript('current_analyse.saveIfModified()')}
          }
        , {
              label: 'Enregistrer sous…'
            , accelerator: 'CmdOrCtrl+Shift+S'
            , click: () => { mainW.webContents.send('save-as-analyse')}
          }
        , {type: 'separator'}
        , {
              label: 'Prendre le temps courant comme début…'
            , click: () => {mainW.webContents.send('set-film-start')}
          }
        , {
              label: 'Changer la vidéo du film…'
            // , click: () => {mainW.webContents.send('change-film-video')}
            , click: () => {mainW.webContents.executeJavaScript('FAnalyse.redefineVideoPath()')}
          }

        , {type: 'separator'}
        , {role: 'quit', label: 'Quitter', accelerator: 'CmdOrCtrl+Q'}
      ] // submenu du menu "Analyse"
  }
  /**
   * MENU ÉDITION
   */
 , {
     label: 'Édition'
   , role: 'edit'
   , submenu:[
        {label: 'Tout sélectionner', role: 'select all'}
      , {label: 'Copier', role: 'copy'}
      , {label: 'Couper', role: 'cut'}
      , {label: 'Coller', role: 'paste'}
   ]
 }

  /**
   * MENU VIDÉO
   */
  , {
        label: "Vidéo"
      , enabled: true
      , submenu: [
            {
                label: "Jouer"
              , accelerator: 'CmdOrCtrl+P'
              , click: () => {console.log("Jouer la vidéo")}
            }
          , {type: 'separator'}
          , {
                label: 'Taille'
              , submenu: [
                    {label: 'Petite',   type:'radio', click:()=>{setVideoSize('small')}}
                  , {label: 'Moyenne',  type:'radio', click:()=>{setVideoSize('medium')}, checked: true}
                  , {label: 'Large',    type:'radio', click:()=>{setVideoSize('large')}}
                ]
            }
          , {type: 'separator'}
          , {
                label: 'Temps courant…'
              , click:()=>{mainW.webContents.send('get-current-time')}
          }
          , {type: 'separator'}
          , {
                label: 'Image courante comme vignette de scène courante…'
              , click:()=>{mainW.webContents.send('current-image-for-current-scene')}
            }
        ]
    }
  /**
   *
   */
  , {
        label: 'Options'
      , submenu: [
          {
              label: 'Démarrer quand un temps est choisi'
            , type: 'checkbox'
            , enabled: true
            , click: () => {console.log("Démarrer au temps choisi")}
          }
        ]
    }
  , {
        label: 'Events'
      , submenu: [
            {
                label: 'Nouveau…'
              , submenu: [
                    {label: 'Event', accelerator: 'CmdOrCtrl+Alt+E', click: ()=>{createEvent('event')}}
                  , {label: 'Scène', accelerator: 'CmdOrCtrl+Alt+S', click: ()=>{createEvent('scene')}}
                  , {label: 'Dialogue', accelerator: 'CmdOrCtrl+Alt+D', click: ()=>{createEvent('dialog')}}
                  , {label: 'Action', accelerator: 'CmdOrCtrl+Alt+A', click: ()=>{createEvent('act')}}
                  , {label: 'Procédé', accelerator: 'CmdOrCtrl+Alt+P', click: ()=>{createEvent('proc')}}
                  , {label: 'Note', accelerator: 'CmdOrCtrl+Alt+N', click: ()=>{createEvent('note')}}
                  , {label: 'P/P', accelerator: 'CmdOrCtrl+Alt+F', click: ()=>{createEvent('pp')}}
                  , {label: 'QRD', accelerator: 'CmdOrCtrl+Alt+Q', click: ()=>{createEvent('qdr')}}
                  , {label: 'Info', accelerator: 'CmdOrCtrl+Alt+I', click: ()=>{createEvent('info')}}
                  , {type: 'separator'}
                  , {label: 'Diminutif', click: ()=>{createEvent('dim')}}
                  , {label: 'Brin', click: ()=>{createEvent('brin')}}
                ]
            }
        ]

    }
]

var dataMenuPreferences = {
      role:   'preferences'
    , label:  "Préférences"
    , accelerator: 'CmdOrCtrl+,'
    , click: () => {console.log("Je dois afficher les préférences")}
  }
if (process.platform === 'darwin') {
  DATA_MENUS.unshift({
      label: app.getName()
    , type: 'submenu'
    , submenu: [
        { role: 'about' }
      , { type: 'separator' }
      , dataMenuPreferences
      , { role: 'services' }
      , { type: 'separator' }
      , { role: 'hide' }
      , { role: 'hideothers' }
      , { role: 'unhide' }
      , { type: 'separator' }
      , { role: 'quit' }
    ]
  })
} else if(process.platform === 'win'){
  // Pour window
  DATA_MENUS[2].submenu.push({type:'separator'})
  DATA_MENUS[2].submenu.push(dataMenuPreferences)
} else {
  // Pour linux
  DATA_MENUS[1].submenu.push({type:'separator'})
  DATA_MENUS[1].submenu.push(dataMenuPreferences)
}

function setVideoSize(size){
  mainW.webContents.send('set-video-size', {size: size})
}
function createEvent(type){
  mainW.webContents.send('create-event', {type: type})
}

module.exports = DATA_MENUS
