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
  delete this.data
  delete this._menuCategories
  delete this._menusSousCategories
  delete this._menusProcedesSCat
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

updateData(){
  log.info('-> FAProcede::updateData')
  this.reset()
  this.iofile.load({after:this.afterUpdateData.bind(this)})
  log.info('<- FAProcede::updateData')
}
,

afterUpdateData(data){
  log.info('-> FAProcede::afterUpdateData')
  this.reset()
  this.data = data
  // Il faut procéder en checkant tous les formulaires ouverts,
  // pour qu'ils puissent placer leur observer de menu
  for(var ev_id in EventForm.eventForms){
    EventForm.eventForms[ev_id].updateMenusProcedes()
  }
  log.info('<- FAProcede::afterUpdateData')
}
,

showDescriptionOf(event_id){
  let menu = $(`form#form-edit-event-${event_id} div.div-procedes select`)
    , value     = menu.val()
    , cate_id   = menu.attr('data-cate-id')
    , scate_id  = menu.attr('data-scate-id')
    , msg
  if(menu.hasClass('menu-categories-procedes')){
    msg = this.descriptionCategorie(value)
  } else if(menu.hasClass('menu-sous-categories-procedes')){
    msg = this.descriptionSousCategorie(cate_id, value)
  } else {
    msg = this.descriptionProcede(cate_id, scate_id, value)
  }

  F.notice(`Information sur les procédés :${RC+RC}${msg}`)
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
