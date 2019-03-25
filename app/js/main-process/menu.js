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

const CURRENT_THING_MENUS = [
  'save-analyse', 'save-as-analyse', 'export-as-pdf', 'export-as-epub',
  'export-as-kindle', 'export-as-docbook', 'display-infos-film',
  'display-full-analyse', 'display-full-analyse-forcer', 'display-pfa',
  'display-fondamentales', 'display-statistiques', 'new-eventer', 'open-writer',
  'display-timeline', 'display-analyse-state'
]
// Note : les ID des menus de documents seront ajoutés "à la volée"

// Les submenus du writer, qui doivent être calculés en fonction des types
// de documents.
const FAWriterSubmenus = [
      {
          label: "Ouvrir/fermer le FAWriter"
        , id: 'open-writer'
        , accelerator: 'CmdOrCtrl+Shift+W'
        , enabled: false
        , click: () => {execJsOnCurrent('openDocInWriter')}
      }
    , {type:'separator'}
  ]

const DATA_DOCS = require('../composants/faWriter/required_first/min.js')

function openDocInWriter(doc_id){
  mainW.webContents.executeJavaScript(`current_analyse && current_analyse.openDocInWriter("${doc_id}")`)
}
var curType = null
for(var doc_id in DATA_DOCS){
  if (DATA_DOCS[doc_id] === 'separator'){
    FAWriterSubmenus.push({type:'separator'})
    continue
  }
  var ddoc = DATA_DOCS[doc_id]
  var menu_id = `open-doc-${doc_id}`
  CURRENT_THING_MENUS.push(menu_id)
  var method = openDocInWriter.bind(null, doc_id)
  FAWriterSubmenus.push({
      label:    ddoc.hname
    , id:       menu_id
    , enabled:  false
    , click:    method
  })
}

// console.log("FAWriterSubmenus:", FAWriterSubmenus)

const ObjMenus = {
    class: 'ObjMenus'
  , mainMenuBar: null // défini par le main.js
  , getMenuData: null
  , getMenu: function(id) {
      var d = this.getMenuData[id]
      if(undefined == typeof(d)) throw(`Menu <${id}> is not defined…`)
      var m = this.mainMenuBar.items[d[0]].submenu.items[d[1]] ;
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
     * Méthode qui actualise les menus par exemple lorsqu'on change
     * un label.
     *
     * Note : ne fonctionne pas encore vraiment, car l'état n'est pas
     * conservé, par exemple les menus enabled ou disabled ne conservent pas
     * leur état, il faudrait tout reprendre.
     */
  , updateMenus: function(){
      let { Menu } = require('electron')
      global.mainMenuBar = Menu.buildFromTemplate(this.data_menus)
      Menu.setApplicationMenu(global.mainMenuBar);
    }

    // les menus à activer quand un élément principal est ouvert (une analyse)
  , setMenuCurrentThing:function(on){
      var my = this
      my[on?'enableMenus':'disableMenus'](CURRENT_THING_MENUS)
    }

    /**
     * Pour modifier le label d'un menu
     */
  , setLabelMenu:function(menu_id, menu_label){
      var m = this.getMenu(menu_id).label = menu_label
      this.updateMenus();
      // var cloneM = m.clone()
    }
}

// Fonctions pratiques

function execJsOnCurrent(method, arg){
  if(arg){
    // console.log("execJsOnCurrent()",`current_analyse && current_analyse.${method}('${arg}')`)
    if ('string'==typeof arg) arg = `'${arg}'`
    mainW.webContents.executeJavaScript(`current_analyse && current_analyse.${method}(${arg})`)
  } else {
    mainW.webContents.executeJavaScript(`current_analyse && current_analyse.${method}()`)
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
            , click: () => {
                mainW.webContents.executeJavaScript('FAnalyse.chooseAnalyse()')
              }
          }
        , { type: 'separator' }
        , {
              label: 'Enregistrer'
            , id: 'save-analyse'
            , enabled: false
            , accelerator: 'CmdOrCtrl+S'
            , click: () => {execJsOnCurrent('saveIfModified')}
          }
        , {
              label: 'Enregistrer sous…'
            , id: 'save-as-analyse'
            , enabled: false
            , accelerator: 'CmdOrCtrl+Shift+S'
            , click: () => { mainW.webContents.send('save-as-analyse')}
          }
        , {type:'separator'}
        , {
              label: 'Choisir la vidéo du film…'
            // , click: () => {mainW.webContents.send('change-film-video')}
            , click: () => {mainW.webContents.executeJavaScript('FAnalyse.redefineVideoPath()')}
          }

        , {type: 'separator'}
        , {
              label: 'Exporter comme…'
            , submenu:[
                  {
                      label: 'PDF…'
                    , id: 'export-as-pdf'
                    , enabled: false
                    , click:()=>{execJsOnCurrent('exportAs', 'pdf')}
                  }
                , {
                      label: 'Livre ePub…'
                    , id: 'export-as-epub'
                    , enabled: false
                    , click:()=>{execJsOnCurrent('exportAs', 'epub')}
                  }
                , {
                      label: 'Livre Kindle…'
                    , id: 'export-as-kindle'
                    , enabled: false
                    , click:()=>{execJsOnCurrent('exportAs', 'kindle')}
                  }
                , {
                      label: 'DocBook…'
                    , id: 'export-as-docbook'
                    , enabled: false
                    , click:()=>{execJsOnCurrent('exportAs', 'docbook')}
                  }
            ]
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
   * MENU AFFICHAGE
   */
  , {
        label: "Affichage"
      , enabled: true
      , submenu: [
            {
              label: "Analyse complète"
              , id: 'display-full-analyse'
              , accelerator: 'CmdOrCtrl+Alt+Shift+A'
              , enabled: false
              , click: () => {execJsOnCurrent('displayFullAnalyse')}
            }
          , {
              label: "Analyse complète (actualiser)"
              , id: 'display-full-analyse-forcer'
              , accelerator: 'CmdOrCtrl+Shift+A'
              , enabled: false
              , click: () => {execJsOnCurrent('displayFullAnalyse', true)}
            }
          , {type:'separator'}
          , {
                label: "Informations sur le film"
              , id: 'display-infos-film'
              , enabled: false
              , click: () => {execJsOnCurrent('displayInfosFilm')}
            }
          , {type:'separator'}
          , {
                label: "Paradigme de Field Augmenté"
              , id: 'display-pfa'
              , accelerator: 'CmdOrCtrl+Alt+Shift+P'
              , enabled: false
              , click: ()=>{execJsOnCurrent('displayPFA')}
            }
          , {
                label: "Fondamentales"
              , id: 'display-fondamentales'
              , accelerator: 'CmdOrCtrl+Alt+Shift+F'
              , enabled: false
              , click: ()=>{execJsOnCurrent('displayFondamentales')}
            }
          , {
                label: "Statistiques"
              , id: 'display-statistiques'
              , accelerator: 'CmdOrCtrl+Alt+Shift+S'
              , enabled: false
              , click: ()=>{execJsOnCurrent('displayStatistiques')}
            }
          , {type:'separator'}
          , {
                label: "Avancement de l'analyse"
              , id: 'display-analyse-state'
              , accelerator: 'CmdOrCtrl+Alt+S'
              , click: () => {execJsOnCurrent('displayAnalyseState')}
            }
          , {type:'separator'}
          , {
                label: 'Afficher/masquer la Timeline'
              , id: 'display-timeline'
              , accelerator: 'CmdOrCtrl+Shift+T'
              , click: () => {execJsOnCurrent('displayTimeline')}
            }
      ]
    }
  /**
   * MENU DOCUMENTS
   */
  , {
        label: "Documents"
      , enabled: true
      , submenu: FAWriterSubmenus
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
                    {label: 'Petite',   id: 'size-video-small', type:'radio', click:()=>{setVideoSize('small')}}
                  , {label: 'Moyenne',  id: 'size-video-medium', type:'radio', click:()=>{setVideoSize('medium')}}
                  , {label: 'Large',    id: 'size-video-large', type:'radio', click:()=>{setVideoSize('large')}}
                ]
            }
          , {
                label: 'Vitesse de lecture'
              , submenu: [
                    {label: 'Image/image', id: 'video-speed-rx009', type:'radio', click:()=>{setVideoSpeed(0.07)}}
                  , {label: 'Ralenti / 8', id: 'video-speed-rx010', type:'radio', click:()=>{setVideoSpeed(0.12)}}
                  , {label: 'Ralenti / 4', id: 'video-speed-rx025', type:'radio', click:()=>{setVideoSpeed(0.25)}}
                  , {label: 'Ralenti / 2', id: 'video-speed-rx05', type:'radio', click:()=>{setVideoSpeed(0.5)}}
                  , {label: 'Normale', id: 'video-speed-x1', type:'radio', click:()=>{setVideoSpeed(1)}, selected: true}
                  , {label: 'x 2', id: 'video-speed-x2', type:'radio', click:()=>{setVideoSpeed(2)}}
                  , {label: 'x 4', id: 'video-speed-x4', type:'radio', click:()=>{setVideoSpeed(4)}}
                  , {label: 'x 8', id: 'video-speed-x8', type:'radio', click:()=>{setVideoSpeed(8)}}
                  , {label: 'x 12', id: 'video-speed-x12', type:'radio', click:()=>{setVideoSpeed(12)}}
                  , {label: 'x 16', id: 'video-speed-x16', type:'radio', click:()=>{setVideoSpeed(16)}}
                ]
            }
          , {type: 'separator'}
          , {
                label: 'Temps courant…'
              , click:()=>{execJsOnCurrent('getAndShowCurrentTime')}
          }
          , {type: 'separator'}
          , {
                label: 'Temps courant comme début du film…'
              , click: () => {execJsOnCurrent('runTimeFunction', 'FilmStartTime')}
            }
          , {
                label: 'Temps courant comme fin du film (avant générique)…'
              , click: () => {execJsOnCurrent('runTimeFunction','FilmEndTime')}
            }
          , {
                label: 'Temps courant comme fin du générique de fin…'
              , click: () => {execJsOnCurrent('runTimeFunction','EndGenericFin')}
            }
          , {type: 'separator'}
          , {
                label: 'Image courante comme vignette de scène courante…'
              , click:()=>{mainW.webContents.send('current-image-for-current-scene')}
            }
        ]
    }
  /**
    * Menu des events
    */
  , {
    label: 'Events'
  , submenu: [
        {
            label: 'Nouvel Eventer…'
          , id: 'new-eventer'
          , enabled: false
          , click: () => {execJsOnCurrent('createNewEventer')}
        }
      , {type:'separator'}
      , {
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

  /**
   *
   */
  , {
        label: 'Options'
      , submenu: [
            {
                // Note: option générale
                label: "Charger la dernière analyse au chargement"
              , id:     'load_last_on_launching'
              , type:   'checkbox'
              , checked: false
              , click:  () => {
                  var checked = ObjMenus.getMenu('load_last_on_launching').checked
                  mainW.webContents.executeJavaScript(`FAnalyse.setGlobalOption('load_last_on_launching',${checked?'true':'false'})`)
                }
            }
          , {type:'separator'}
          , {
                label: 'Démarrer 3 secondes avant l’event'
              , id:    'option_start_3secs_before_event'
              , type:  'checkbox'
              , checked:  false
              , enabled: true
              , click: ()=>{
                  var c = ObjMenus.getMenu('option_start_3secs_before_event').checked ? 'true' : 'false'
                  mainW.webContents.executeJavaScript(`current_analyse && current_analyse.options.set('option_start_3secs_before_event',${c})`)
              }
            }
          , {
                label:  'Démarrer quand un temps est choisi'
              , id:     'option_start_when_time_choosed'
              , type:   'checkbox'
              , checked: false
              , enabled: true
              , click: () => {
                  var c = ObjMenus.getMenu('option_start_when_time_choosed').checked ? 'true' : 'false'
                  mainW.webContents.executeJavaScript(`current_analyse && current_analyse.options.set('option_start_when_time_choosed',${c})`)
                }
            }
          , {
                label:  "Verrouiller les points d'arrêt"
              , id:     'option_lock_stop_points'
              , type:   'checkbox'
              , checked: true
              , enabled: true // plus tard, à régler en fonction de la présence de l'analyse
              , click: () => {
                  var c = ObjMenus.getMenu('option_lock_stop_points').checked ? 'true' : 'false'
                  mainW.webContents.executeJavaScript(`current_analyse && current_analyse.options.set('option_lock_stop_points',${c})`)
                }
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
  mainW.webContents.executeJavaScript(`current_analyse && current_analyse.options.set('video_size','${size}')`)
}
function setVideoSpeed(speed){
  mainW.webContents.send('set-video-speed', {speed: speed})
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


ObjMenus.data_menus = DATA_MENUS

module.exports = ObjMenus
// module.exports = DATA_MENUS


ipc.on('set-option', (ev, data) => {
  // console.log("-> on set-option", data)
  var m = ObjMenus.getMenu(data.menu_id)
  m[data.property] = data.value
})

ipc.on('display-analyse', ev => {
  FAWindows.displayAnalyse()
})
ipc.on('current-analyse-exist', (ev, yesOrNo) => {
  ObjMenus.setMenuCurrentThing(yesOrNo)
})

// Pour les tests, pour pouvoir simuler un choix de menu
// Dans le test, on met :
//  ipc.send('click-menu', {menu_id: <id du menu>})
ipc.on('click-menu', (e, data) => {
  ObjMenus.getMenu(data.menu_id).click()
})
