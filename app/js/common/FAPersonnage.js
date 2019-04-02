'use strict'
/**
  Class FAPersonnage
  ------------------
  Gestion des personnages
**/

class FAPersonnage {
// ---------------------------------------------------------------------
//  CLASS

static init(){
  if(this.exists){
    this._data = YAML.safeLoad(fs.readFileSync(this.path,'utf8'))
  }
}

/**
Réinitialiser la donnée. Comme par exemple après une modification
du fichier de données.
**/
static reset(){
  delete this._data
  delete this._diminutifs
  return this // chainage
}

/**
  Récupère les diminutifs dans données des personnages et les
  renvoie (souvent pour les diminutifs eux-mêmes)
**/
static get diminutifs(){
  if(undefined === this._diminutifs){
    this._diminutifs = {}
    for(var pseudo in this.data){
      if(this.data[pseudo].dim){
        this._diminutifs[this.data[pseudo].dim] = this.data[pseudo].pseudo
      }
    }
  }
  return this._diminutifs
}

// Retourne le personnage de pseudo +pseudo+ (instance FAPersonnage)
static get(pseudo){
  if(undefined === this.personnages) this.personnages = {}
  if(undefined === this.personnages[pseudo]){
    this.personnages[pseudo] = new FAPersonnage(current_analyse,this.data[pseudo])
  }
  return this.personnages[pseudo]
}

static get data(){return this._data || {}}
static exists(){return fs.existsSync(this.path)}
static get path(){return this._path||defP(this,'_path',this.a.filePathOf('dpersonnages.yaml'))}
static get a(){return current_analyse}

// ---------------------------------------------------------------------
//  INSTANCE
constructor(analyse){

}

}
