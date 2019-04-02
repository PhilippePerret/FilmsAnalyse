'use strict'
/**
  Class Fonds
  -----------
  Pour les fondamentales
**/

class Fonds {
// ---------------------------------------------------------------------
//  CLASSE
static init(analyse){
  this.analyse = this.a = analyse
  this.loaded = false
  if(this.exists()) this.load()
}

/**
  Méthode qui charge les fondamentales si
  elles existent.
**/
static load(){
  this.iofile.load({after: this.afterLoading.bind(this)})
}
static afterLoading(ydata){
  this.yaml_data = ydata
  this.loaded = true
}

/**
  Méthode principale qui retourne le code pour
  l'export des Fondamentales, i.e. le code qui sera
  inscrit dans l'eBook
**/
static export(options){
  let str = ''
  for(var fid in this.fds){
    str += this.fds[fid].export()
  }
  return str
}

// Retourne true si le fichier existe
static exists(){return fs.existsSync(this.path)}

/**
  Retourne les cinq fondamentales
  C'est une table avec en clé :
    fd1, fd2, etc.
**/
static get fds(){
  if(undefined === this._fds){
    this._fds = {
      fd1: new PersonnageFondamental(this.a, this.yaml_data.fd1)
    , fd2: new QuestionDramatiqueFondamentale(this.a, this.yaml_data.fd2)
    , fd3: new OppositionFondamentale(this.a, this.yaml_data.fd3)
    , fd4: new ReponseDramatiqueFondamentale(this.a, this.yaml_data.fd4)
    , fd5: new ConceptFondamental(this.a, this.yaml_data.fd5)
    }
  }
  return this._fds
}

static get iofile(){return this._iofile||defP(this,'_iofile', new IOFile(this))}
// Path au fichier des fondamentales
static get path(){return this._path||defP(this,'_path', this.a.fondsFilePath)}

// ---------------------------------------------------------------------
//  INSTANCES
//  Une Fondamentale
constructor(analyse){
  this.analyse = this.a = analyse
}

/**
  La méthode d'export commune à toutes les fondamentales

  +Options+
    :as     Pour déterminer si le retour doit être sous forme
            de string (défaut) ou sous forme de DOMElement ('dom')
            à append au document.
**/
export(options){
  let appends = [
    DCreate('H2', {class:'title', inner: this.hname})
  ]
  appends = this.addElementsTo(appends)
  let div = DCreate('DIV', {id: `fond${this.id}`, append: appends})
  if(options && options.as === 'dom'){
    return div
  } else {
    return div.outerHTML
  }
}

get formater(){
  if(undefined === this._formater){
    let fatexte = new FATexte('')
    this._formater = fatexte.formate.bind(fatexte)
  }
  return this._formater
}

// ---------------------------------------------------------------------
//  Méthodes d'helpers communes
get divDescription(){
  if(!this.description) return null
  if(undefined === this._divDescription){
    this._divDescription = DCreate('DIV', {class: 'libval normal', append:[
      DCreate('LABEL', {inner: 'Description'})
      , DCreate('SPAN', {class:'value', inner: this.formater(this.description)})
    ]})
  }

  return this._divDescription
}

// ---------------------------------------------------------------------
//  Données communes
get description(){return this.ydata.description}
get ydata(){return this._ydata}


// Le nom humain de la fondamentale, d'après sont 'type'
get hname(){return this._hname||defP(this,'_hname',this.type.titleize())}
}





class PersonnageFondamental extends Fonds {
constructor(analyse, ydata){
  super(analyse)
  this._ydata = ydata
}

// ---------------------------------------------------------------------
//  Méthodes d'export

/**
  Pour ajouter les éléments DOM à la méthode `export` principale
**/
addElementsTo(els){
  els.push(this.divPseudo)
  this.divDescription && els.push(this.divDescription)
  return els
}

// ---------------------------------------------------------------------
// Méthodes d'Helpers
get divPseudo(){
  return DCreate('DIV', {class: 'libval normal', append:[
    DCreate('LABEL', {inner: 'Pseudo'})
  , DCreate('SPAN', {class:'value', inner: this.formater(this.pseudo)})
  ]})
}

// ---------------------------------------------------------------------
// Données propres
get pseudo(){return this.ydata.pseudo}
// ---------------------------------------------------------------------
// Données générales
get type(){return 'personnage fondamental'}
get id(){return 1}
}



class QuestionDramatiqueFondamentale extends Fonds {
  constructor(analyse, ydata){
    super(analyse)
    this._ydata = ydata
  }

// ---------------------------------------------------------------------
//  Méthodes d'export

/**
  Pour ajouter les éléments DOM à la méthode `export` principale
**/
addElementsTo(els){
  this.divDescription && els.push(this.divDescription)

  return els
}

// ---------------------------------------------------------------------
// Données propres

// ---------------------------------------------------------------------
// Données générales
get type(){return 'question dramatique fondamentale'}
get id(){return 2}
}







class OppositionFondamentale extends Fonds {
  constructor(analyse, ydata){
    super(analyse)
    this._ydata = ydata
  }
// ---------------------------------------------------------------------
//  Méthodes d'export

/**
  Pour ajouter les éléments DOM à la méthode `export` principale
**/
addElementsTo(els){

  this.divDescription && els.push(this.divDescription)
  return els
}

// ---------------------------------------------------------------------
// Données propres

// ---------------------------------------------------------------------
// Données générales
get type(){return 'opposition fondamentale'}
get id(){return 3}
}






class ReponseDramatiqueFondamentale extends Fonds {
  constructor(analyse, ydata){
    super(analyse)
    this._ydata = ydata
  }
// ---------------------------------------------------------------------
//  Méthodes d'export

/**
  Pour ajouter les éléments DOM à la méthode `export` principale
**/
addElementsTo(els){

  this.divDescription && els.push(this.divDescription)
  return els
}

// ---------------------------------------------------------------------
// Données propres

// ---------------------------------------------------------------------
// Données générales
get type(){return 'réponse dramatique fondamentale'}
get id(){return 4}
}









class ConceptFondamental extends Fonds {
constructor(analyse, ydata){
  super(analyse)
  this._ydata = ydata
}
// ---------------------------------------------------------------------
//  Méthodes d'export

/**
  Pour ajouter les éléments DOM à la méthode `export` principale
**/
addElementsTo(els){

  this.divDescription && els.push(this.divDescription)
  return els
}

// ---------------------------------------------------------------------
// Données propres

// ---------------------------------------------------------------------
// Données générales
get type(){return 'concept fondamental'}
get id(){return 5}
}


module.exports = Fonds
