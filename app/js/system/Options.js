'use strict'

/**
  * Class Options
  * -------------
  * Gestion des options
  */

class Options {
constructor(analyse){
  this.a = this.analyse = analyse
}
get class(){return 'Options'}
get type(){return 'object'}

  // Options par défaut
static get DEFAULT_DATA(){
  return {
      'option_start_when_time_choosed':   true
    , 'option_lock_stop_points':          false
    , 'video_size':                       "medium"
    , 'option_start_3secs_before_event':  false
    , 'option_edit_in_mini_writer':       false
    , 'option_duree_scene_auto':          true
  }
}

get modified(){ return this._modified || false }
set modified(v){this._modified = v}

  // Obtenir l'option d'id <opid>
get(opid, defValue){
  // console.log("-> Options.get", opid, this.data)
  if(undefined === this.data[opid]){
    return defValue || this.DEFAULT_DATA[opid]
  } else {
    return this.data[opid]
  }
}

// Définir la valeur d'une option
set(opid, value){
  this.data[opid] = value
  this.onSetByApp(opid, value)
  this.save() // je préfère sauver tout de suite
  // this.modified = true
}

/**
 * En fonction de l'application, les choses à faire quand on change une
 * option.
 */
onSetByApp(opid, value){
  // console.log("Options#onSetByApp", opid, value)
  switch (opid) {
    case 'video_size':
      this.a.videoController.setSize(null, value)
      break
    case 'option_edit_in_mini_writer':
      UI.miniWriterizeTextFields(null, value)
      break
  }
}


setData(data)    { this.data = data }

saveIfModified() { this.modified && this.save() }
save(){
  if(!this.a) return false
  fs.writeFileSync(this.path, JSON.stringify(this.data),'utf8')
  if(fs.existsSync(this.path)){
    this.modified = false
    return true
  } else {
    throw(`Un problème est survenu à l'enregistrement des options dans "${this.path}"…`)
  }
}

load(){
  if(!this.a) throw("Impossible de charger les options d'une chose qui n'existe pas…")
  if(fs.existsSync(this.path)){
    this.data = require(this.path)
  } else {
    this.data = this.DEFAULT_DATA
  }
  this.modified = false
}

/**
  Réglage des options dans les menus (en asynchrone)
 */
setInMenus(){
  // Options générales
  log.info('-> Options#setInMenus')
  ipc.send('set-option', {menu_id: 'option_start_when_time_choosed', property: 'checked', value: this.startWhenTimeChosen})
  ipc.send('set-option', {menu_id: 'option_lock_stop_points', property: 'checked', value: this.lockStopPoints})
  ipc.send('set-option', {menu_id: 'option_start_3secs_before_event', property: 'checked', value: this.start3SecondsBefore})
  // Options propres à l'analyse courante
  ipc.send('set-option', {menu_id: `size-video-${this.videoSize}`, property: 'checked', value: true})
  ipc.send('set-option', {menu_id: 'option-locked', property: 'checked', value: this.appLocked})
  log.info('<- Options#setInMenus')
}

// Toutes les données options
get data(){return this._data||defP(this, '_data', this.constructor.DEFAULT_DATA)}
set data(v){this._data = v}

// ---------------------------------------------------------------------
// Toutes les valeurs, pour raccourcis
get appLocked(){ return !!this.a.locked }
get videoSize(){return this.get('video_size') || 'medium'}
get startWhenTimeChosen(){return !!this.get('option_start_when_time_choosed')}
get lockStopPoints(){return !!this.get('option_lock_stop_points')}
get start3SecondsBefore(){return !!this.get('option_start_3secs_before_event')}

// /fin valeurs d'options
// ---------------------------------------------------------------------

get path(){return this._path || defP(this, '_path', path.join(this.a.folder,'options.json'))}

}
