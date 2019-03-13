'use strict'
/**
 * Gestion du menu principal de l'application
 *
 * Grâce à la méthode ObjMenus.getMenu('<identifiant>'), on peut atteindre
 * un menu particulier s'il définit son ID (id: <valeur unique>)
 * On peut donc alors faire des choses comme :
 *
 *  var m = ObjMenus.getMenu('monIdDeMenu')
 *  m.label = "Un nouveau label"
 *  m.checked = true // pour le sélectionner
 *  m.enabled = false // pour le désactiver
 *  etc.
 */
// const electron = require('electron')
const { app } = require('electron')
const path    = require('path')
const ipc     = require('electron').ipcMain

const ObjMenus = {
    class: 'ObjMenus'
  , getMenuData: null
  , getMenu: function(id) {
      // var mainMenuBar = global.mainMenuBar
      var d = this.getMenuData[id]
      if(undefined == typeof(d)) throw(`Menu <${id}> is not defined…`)
      // console.log("d:", d)
      var m = mainMenuBar.items[d[0]].submenu.items[d[1]] ;
      // console.log("m:", m)
      // Si hiérarchie plus profonde
      if (d.length > 2){ m = m.submenu.items[d[2]] }
      // console.log("m final:", m)
      return m ;
    }
  , enableMenus: function(ids_list) {
      this.setMenusState(ids_list, true)
    }
  , disableMenus: function(ids_list) {
      this.setMenusState(ids_list, false)
    }
  , setMenusState: function(id_menus, state) {
      var my = this
      for(var mid of id_menus){
        my.getMenu(mid).enabled = state
      }
    }

    /**
     * Méthode qui actualise les menus lorsqu'une autre langue a été choisie
     * dans les options.
     */
  , updateLang: function(){
      let { Menu } = require('electron')
      global.mainMenuBar = Menu.buildFromTemplate(this.menuTemplate())
      Menu.setApplicationMenu(global.mainMenuBar);
    }

  , CURRENT_THING_MENUS: [] // les menus à activer quand un élément principal est ouvert
  , NEW_THING_MENUS: []
  , setMenuCurrentThing:function(on){
      var my = this
      my[on?'enableMenus':'disableMenus'](my.CURRENT_THING_MENUS)
    }

}
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
            , click: () => {mainW.webContents.executeJavaScript('current_analyse.setFilmStartTimeAt()')}
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
        {label: 'Annuler', role: 'undo'}
      , {label: 'Refaire', role: 'redo'}
      , {type:'separator'}
      , {label: 'Tout sélectionner', role: 'selectAll'}
      , {label: 'Copier', role: 'copy'}
      , {label: 'Couper', role: 'cut'}
      , {label: 'Coller', role: 'paste'}
      , {type:'separator'}
      , {label: 'Console web', role:'toggleDevTools'}
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
              , click:()=>{mainW.webContents.executeJavaScript('current_analyse.locator.getAndShowCurrentTime()')}
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
                // Note: option générale
                label: "Charger la dernière analyse au chargement"
              , id:     'load-last-on-launching'
              , type:   'checkbox'
              , click:  () => {
                  var checked = ObjMenus.getMenu('load-last-on-launching').checked
                  mainW.webContents.executeJavaScript(`FAnalyse.setGlobalOption('load_last_on_launching',${checked?'true':'false'})`)
                }
            }
          , {type:'separator'}
          , {
                label:  'Démarrer quand un temps est choisi'
              , id:     'option-start-when-time-choosed'
              , type:   'checkbox'
              , checked: false
              , enabled: true
              , click: () => { mainW.webContents.executeJavaScript('current_analyse && current_analyse.toggleOptionStartWhenPositionChoosed()')}
            }
          , {
                label:  "Verrouiller les points d'arrêt"
              , id:     'option-lock-stop-points'
              , type:   'checkbox'
              , checked: true
              , enabled: true // plus tard, à régler en fonction de la présence de l'analyse
              , click: () => { mainW.webContents.executeJavaScript('current_analyse && current_analyse.toggleOptionStopPointsLock()')}
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
                  , {label: 'Info', accelerator: 'CmdOrCtrl+Alt+O', click: ()=>{createEvent('info')}}
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

// Avant de construire le Menu, on mémorise les positions des menus
// qui possède un identifiant pour pouvoir les retrouver par `getMenu(id)`
var nbMainMenus = DATA_MENUS.length, nbSubMenus, nbSubSubMenus
  , iMainMenu, iSubMenu, iSubSubMenu
  , mainMenu, subMenu, subSubMenu
  , my = ObjMenus
  ;
my.getMenuData = {} // pour mettre toutes les données
for(iMainMenu = 0; iMainMenu < nbMainMenus; ++iMainMenu ){
  mainMenu = DATA_MENUS[iMainMenu]
  // mainMenu contient {label: 'Analyse', submenu: [] etc.}
  nbSubMenus = mainMenu.submenu.length
  for(iSubMenu = 0; iSubMenu < nbSubMenus; ++iSubMenu){
    subMenu = mainMenu.submenu[iSubMenu]
    if (subMenu.submenu){
      // Si c'est aussi un groupe de menu
      nbSubSubMenus = subMenu.submenu.length
      for(iSubSubMenu=0; iSubSubMenu < nbSubSubMenus; ++iSubSubMenu){
        subSubMenu = subMenu.submenu[iSubSubMenu]
        if(!subSubMenu.id){continue}
        my.getMenuData[subSubMenu.id] = [iMainMenu, iSubMenu, iSubSubMenu]
      }
    }
    if (!subMenu.id){ continue }
    // On l'enregistre dans les données pour pouvoir le récupérer facilement
    // par getMenu(id)
    // console.log("Ce menu a un ID:", subMenu, iMainMenu, iSubMenu)
    my.getMenuData[subMenu.id] = [iMainMenu, iSubMenu]
  }

}//fin de boucle sur tous les menus principaux


module.exports = DATA_MENUS


ipc.on('set-option', (ev, data) => {
  console.log("-> on set-option", data)
  var m = ObjMenus.getMenu(data.menu_id)
  m[data.property] = data.value
})
