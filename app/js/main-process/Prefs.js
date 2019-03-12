'use strict'
/**
 * Object Prefs
 * ------------
 * Gestion [universelle] des préférences
 *
 * Version 1.0.0
 *
 * Dans le main process (qui doit requérir ce module), on trouve des méthodes
 * IPC qui vont récupérer les données
 *
 * Pour obtenir des valeurs dans le renderer, on doit utiliser :
 * dataPrefs = <ipcRenderer>.sendSync('get-prefs', <table data>)
 * Avec <table data> qui est une table contenant les clés à recevoir, avec
 * la valeur par défaut en valeur.
 *
 * Note : utiliser en parallèle avec le module `Prefs-renderer.js`
 *
 */
const electron = require('electron')
const {app} = require('electron')
const path  = require('path')
const fs    = require('fs')
const ipc   = electron.ipcMain

const Prefs = {
    class: 'Prefs'

  , inited:     false
  , modified:   false
    // Données
  , prefsPath: null     // chemin d'accès au fichier préférence
  , userPrefs:    {}    // Préférence de l'utilisateur
  , analysePrefs: {}    // Préférence de l'analyse courante

    /**
     * Récupérer une valeur en préférences
     */
  , get:function(anyPref, defaultValue){
      if('string' === typeof anyPref){
        // Si une simple préférence est envoyée
        // Note : cette méthode sert aussi aux autre condition
        return this.userPrefs[anyPref] || this.analysePrefs[anyPref] || defaultValue
      } else if (Array.isArray(anyPref)) {
        // Si une liste de clés de préférence est envoyée
        var dPrefs = {}
        for(var kpref of anyPref){
          var vpref = this.get(kpref, undefined)
          if(undefined !== vpref) dPrefs[kpref] = vpref
        }
        return dPrefs
      } else if (anyPref instanceof Object) {
        // Si un tableau de préférence est envoyé
        for(var kpref in anyPref){
          var vpref = this.get(kpref, undefined)
          if(undefined !== vpref) anyPref[kpref] = vpref
        }
        return anyPref // avec toutes les valeurs affectées
      } else {
        throw("[Prefs#get] Je ne sais pas comment traiter : ", anyPref)
      }
    }
    /**
     * +tpref+    'analyse' ou 'user'
     * +kpref+    La clé de la préférence
     * +vpref+    Valeur à donner à la préférence
     */
  , set:function(tpref, kpref, vpref){
      if ('string' === typeof tpref){
        switch (tpref) {
          case 'analyse':
            this.analysePrefs[kpref] = vpref
            break
          case 'user':
            this.userPrefs[kpref] = vpref
            break
        }
      } else if ( Array.isArray(tpref) ){
        for(var dpref of tpref){
          this.set(dpref.type, (dpref.key || dpref.id), dpref.value)
        }
      } else if ( tpref instanceof Object ){
        for(var kpref of tpref){
          var dpref = tpref[kpref]
          this.set(kpref, (dpref.type || 'user'), dpref.value)
        }
      }
      this.modified = true
    }

    /**
     * Initialisation des préférences
     */
  , init:function(){
      if (this.inited) throw("On ne devrait pas initier deux fois les préférences.")
      this.userPrefsPath = path.join(app.getPath('userData'), 'user-preferences.json')
      this.inited = true
      return this // chainage
    }

  , saveIfModified:function(){
      this.modified && this.save()
    }
    /**
     * Sauver les préférences
     */
  , save:function(){
      fs.writeFileSync(this.userPrefsPath, JSON.stringify(this.userPrefs), 'utf8')
      console.log("Préférences User actualisées.")
      // TODO Faire pareil avec les préférences de l'analyse
      // TODO Il faudrait trouver un autre nom que "analyse" pour que ce module
      // puisse être utilisé partout.
    }

    /**
     * Charger les préférences
     */
  , load:function(){
      this.loadUserPrefs()
    }

  , loadUserPrefs:function(){
      if(fs.existsSync(this.userPrefsPath)){
        this.userPrefs = require(this.userPrefsPath)
      } else {
        // Pour les créer maintenant
        this.userPrefs = {
          "load_last_on_launching": true,
          // "last_analyse_folder": "/Users/philippeperret/Programmation/Electron/FilmsAnalyse/analyses/her"
          "last_analyse_folder": "./analyses/her"
        }
        this.save()
      }
    }
}


/**
 * Pour les préférences
 */
ipc.on('get-pref', (ev, data) => {
  console.log("Dans ipc on get-pref, je reçois :", data)
  console.log("La valeur retournée est :", Prefs.get(data))
  ev.returnValue = Prefs.get(data)
})
ipc.on('set-pref', (ev, data) => {
  ev.returnValue = Prefs.set(data)
})

module.exports = Prefs
