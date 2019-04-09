'use strict'

/**
  Module permettant de gérer les procédés dans toute l'analyse,
  à commencer par le formulaire d'event et l'export
**/

Object.assign(FAProcede,{
// ---------------------------------------------------------------------
//  CLASS

init(){
  this.iofile.load({after:this.afterLoading.bind(this)})
  this.inited = true
}
,

reset(){
  return this // chainage
}
,

/**
  Après le chargement, on reçoit toutes les données procédés
  C'est le contenu complet du fichier `data/data_procedes.yaml`.
**/
afterLoading(data){
  // console.log("data procédés",data)
  this.data = data
}
,

get iofile(){return this._iofile||defP(this,'_iofile', new IOFile(this))}
,

// path au fichier contenant toutes les données des procédés
get path(){
  if(undefined === this._path) this._path = path.join(APPFOLDER,'app','js','data','data_procedes.yaml')
  return this._path
}



})
