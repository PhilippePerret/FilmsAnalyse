'use strict'
/**
 * Class File
 * -----------
 * Pour la gestion des fichiers
 */
class IOFile {
  constructor(p){
    this.path = p
  }

  // ---------------------------------------------------------------------
  //  Méthodes d'entrée sortie

  /**
   * Sauvegarde "prudente" du fichier. On l'enregistre d'abord dans un fichier
   * temporaire, puis une fois qu'on s'est assuré de sa validité, on le met
   * en bon fichier tout en faisant un backup de l'original.
   */
  save(options){
    this.options = options
    this.checkBackupFolder()
    try {
      this.saved = false
      if(this.options.as_json) this.code = JSON.stringify(this.code)
      this.code !== undefined || raise(T('code-to-save-is-undefined'))
      this.code !== null      || raise(T('code-to-save-is-null'))
      this.code.length > 0    || raise(T('code-to-save-is-empty'))
      if(this.tempExists()) fs.unlinkSync(this.tempPath)
      fs.writeFile(this.tempPath,this.code,'utf8', this.afterTempSaved.bind(this))
    } catch (e) { return F.error(e) }
  }
  afterTempSaved(err){
    try {
      if(err) throw(err)
      this.tempExists() || raise(T('temps-file-unfound',{fpath: this.tempPath}))
      this.tempSize > 0 || raise(T('temp-file-empty-stop-save',{fpath: this.tempPath}))
      if (this.isBackupable) this.backup()
      else this.endSave()
    } catch (e) { return F.error(e)}
  }
  endSave(err){
    try {
      if (err) return F.error(err)
      fs.rename(this.tempPath, this.path, (err)=>{
        if (err) F.error(err)
        else {
          // FIN !
          this.saved = true
          if('function' === typeof this.methodAfterSaving){
            this.methodAfterSaving()
          }
        }
      })
    } catch (e) {F.error(e)}
  }

  /**
   * Procédure intelligente de chargement, en tenant compte du fait que le
   * fichier peut exister mais être vide.
   *
   * Note : utiliser plutôt la méthode `loadIfExists` pour bénéficier de
   * toutes les protections et l'utilisation de backups
   */
  load(){
    var my = this
    my.loaded = false
    fs.readFile(this.path, 'utf8', (err, data) => {
      err ? F.error(err) : my.code = data
      my.endLoad(!err)
    })
  }
  // La différence avec la méthode précédente, c'est qu'elle ne génère pas
  // d'erreur en cas d'inexistence du fichier
  loadIfExists(options, fn_pour_suivre){
    var my = this
    this.loaded = false
    // Noter que la méthode peut être rappelée depuis elle-même, donc
    // sans redéfinir options ou fn_pour_suivre. Donc il ne faut les
    // définir que s'ils sont définis.
    if(undefined !== options) my.options = options
    if(undefined !== fn_pour_suivre) my.methodAfterLoading = fn_pour_suivre
    if(false === this.exists()) my.endLoad(false)
    if(my.size === 0) {
      my.retrieveBackup()
    } else {
      // On peut charger
      my.load()
    }
    my = null
  }
  endLoad(success){
    this.loaded = success
    if('function' === typeof this.methodAfterLoading){
      // console.log("---> methodAfterLoading", this.options)
      this.methodAfterLoading(this.options.as_json ? this.dejsonedCode : this.code)
    }
  }

  backup(){
    var my = this
    try {
      fs.rename(my.path, my.backupPath, my.endSave.bind(my))
    } catch (e) {F.error(e)}
    my = null
  }

  retrieveBackup(){
    var my = this
    try {
      // On doit tenter la procédure de retreive de backup
      fs.unlinkSync(this.path)
      if(this.backupExists()){
        fs.copyFile(my.backupPath,my.path, (err) => {
          if(err){ F.error(err) ; my.endLoad }
          console.log("Fichier récupéré du backup:", my.path)
          // Puis on réessaye…
          return this.loadIfExists()
        })
      } else {
        // Pas de backup… j'abandonne
        my.endLoad(false)
      }
    } catch (e) {
      F.error(e)
    }
    my = null
  }

  /**
   * Méthode qui vérifie la présence du dossier backup et le crée si nécessaire
   */
  checkBackupFolder(){
    if(fs.existsSync(this.backupFolder)) return true
    fs.mkdirSync(this.backupFolder)
  }

  // ---------------------------------------------------------------------
  //  Méthode de test
  exists()        { return fs.existsSync(this.path) }
  tempExists()    { return fs.existsSync(this.tempPath)}
  backupExists()  { return fs.existsSync(this.backupPath)}

  get isBackupable(){ return this.exists() && this.size > 0 }
  // ---------------------------------------------------------------------
  //  Données

  get options(){return this._options}
  set options(v){ this._options = v || {} }

  set code(v){this._code = v}
  get code(){return this._code}

  get dejsonedCode(){
    if(undefined === this._dejsonedCode){
      try {
        this._dejsonedCode = JSON.parse(this.code)
      } catch (e) {
        console.log("ERROR JSON AVEC:", this.pathii)
        F.error('Une erreur s’est produite en lisant le fichier '+this.path)
        F.error(e)
        this._dejsonedCode = null
      }
    }
    return this._dejsonedCode
  }

  get size(){ return fs.statSync(this.path).size }
  get tempSize(){ return fs.statSync(this.tempPath).size }
  get backupSize(){ return fs.statSync(this.backupPath).size }

  get methodAfterSaving(){return this._methodAfterSaving}
  set methodAfterSaving(v){this._methodAfterSaving = v}
  get methodAfterLoading(){return this._methodAfterLoading}
  set methodAfterLoading(v){this._methodAfterLoading = v}

  // ---------------------------------------------------------------------
  //  Données de path

  get folder(){
    return this._folder || defP(this,'_folder', path.dirname(this.path))
  }
  get backupFolder(){
    return this._bckFolder || defP(this,'_bckFolder', path.join(this.folder,'.backups'))
  }
  get name(){
    return this._name || defP(this,'_name',path.basename(this.path))
  }
  get backupPath(){
    return this._backupPath || defP(this,'_backupPath',path.join(this.backupFolder,this.name))
  }
  get tempPath(){
    return this._tempPath || defP(this,'_tempPath', `${this.path}.temp`)
  }
}
