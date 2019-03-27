'use strict'
/**
* Class FAReport
* ---------------
* Classe permettant de produire des rapports, soit à l'écran,
* soit dans des fichiers.

USAGE
=====

  var rep = new FAReport(current_analyse, {type: '<type>'})
  rep.add(<message>[, <type>][, <options>])
    Le type peut être :
      title             Pour un titre
      normal (default)
      notice
      error


  rep.show()          => afficher à l'écran
  rep.saveInFile()    => sauvegarde dans un fichier

**/
class FAReport {
// ---------------------------------------------------------------------
// CLASSE

// Pour afficher le dernier rapport produit
static showLast(){
  if(undefined === this.reports) return F.notify("Pas de dernier rapport à afficher.", {error: true})
  else {
    this.reports[this.reports.length - 1].show()
  }
}
// Ajoute un rapport à la liste courante
static addReport(report){
  if(undefined === this.reports) this.reports = []
  this.reports.push(report)
}

// ---------------------------------------------------------------------
//  INSTANCE
constructor(reportType){
  this.analyse = this.a = current_analyse
  this.type     = reportType
  this.messages = []
  this.constructor.addReport(this)
}

// ---------------------------------------------------------------------
//  Méthode publiques

/**
* Pour ajouter un message
* +msg+       Le message String
* +type+      Le type. cf. ci-dessus
* +options+   Pas encore utilisé
*
**/
add(msg, type, options){
  this.messages.push({message: msg, type: (type || 'normal'), time: new Date().getTime()})
}
/**
* Méthode qui produit la sortie à l'écran
**/
show(){
  this.fwindow.show()
}
hide(){
  this.fwindow.hide()
}
/**
* Méthode qui produit la sortie dans un fichier
**/
saveInFile(){
  this.iofile.save({after: this.endSave.bind(this)})
}
endSave(){
  F.notice(`Le rapport a été sauvé dans "/reports/${this.fname}".`)
}

// ---------------------------------------------------------------------
// Méthodes de construction

// Appelée par la fwindow
build(){
  var css = DCreate('LINK', {attrs: {rel: 'stylesheet', href: './css/report.css'}})
  var btnclose = DCreate('BUTTON', {type: 'button', class: 'btn-close'})
  var contenu = DCreate('DIV',{class: 'report-contents', append: this.allObjMsgs()})
  return [css, btnclose, contenu]
}

/**
* Retourne tous les messages en tant qu'objet DOM
**/
allObjMsgs(){
  var msgs = []
  for(var msg of this.messages){
    msgs.push(DCreate('DIV', {class: `report-msg ${msg.type}`, inner: msg.message}))
  }
  return msgs
}
// ---------------------------------------------------------------------
// Méthodes d'évènements

observe(){
  this.fwindow.jqObj.find('button.btn-close').on('click', this.hide.bind(this))
  // On pourra observer les events cités, par exemple, pour pouvoir les
  // éditer.
}

// ---------------------------------------------------------------------
// Propriétés
get fwindow(){return this._fwindow||defP(this,'_fwindow', new FWindow(this, {}))}
get iofile(){return this._iofile || defP(this,'_iofile', new IOFile(this))}
get path(){return this._path || defP(this,'_path', path.join(this.a.folderReports, this.fname))}
get fname(){return this._fname || defP(this,'_fname', `report-${new Date().getTime()}.html`)}
}
