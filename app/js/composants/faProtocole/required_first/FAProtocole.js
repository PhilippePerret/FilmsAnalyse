'use strict'
/**

  Class FAProtocole
  -----------------
  Pour gérer le protocole d'analyse d'une analyse

  L'instance s'obtient par `current_analyse.protocole`
**/

class FAProtocole {
/**
  Données du protocole : `FAProtocole.DATA` -- cf. data_protocole.js
**/
constructor(analyse){
  this.analyse = this.a = analyse
}

// Retourne true si l'étape d'identifiant +step_id+ (cf. DATA) est
// effectuée (checkée)
isChecked(step_id){
  return false
}

display(){
  F.notify("Affichage des données du protocole d'analyse.")
  this.show()
}
show(){this.fwindow.show()}

build(){
  var domElements = []
  var my = this
  var sousSteps = []

  domElements.push(DCreate('H2', {inner:'protocole d’analyse'}))

  for(var dstep of FAProtocole.DATA.steps){
    if (dstep.type === 'separator'){
      domElements.push(DCreate('DIV', {class: 'separator'}))
    } else {
      if (dstep.steps){
        sousSteps = []
        for(var dsstep of dstep.steps){
          sousSteps.push(this.buildStep(dsstep))
        }
      } else { sousSteps = null }
      domElements.push(this.buildStep(dstep, sousSteps))
    }
  }
  return domElements
}
buildStep(dstep, sousSteps){
  var step_id = `protocole-step-${dstep.id}`
  var els = [
    DCreate('INPUT', {type:'checkbox', id: step_id, value: dstep.id, checked: this.isChecked(dstep.id)?'CHECKED':null})
  , DCreate('LABEL', {inner: dstep.libelle, attrs:{for: step_id}})
  ]
  if (sousSteps) {
    els.push(DCreate('DIV', {class: 'protocole-sous-steps', append: sousSteps}))
  }
  return DCreate('DIV', {class:'protocole-step', append:els })
}
get fwindow(){return this._fwindow||defP(this,'_fwindow', new FWindow(this,{id:'protocole'}))}
}
