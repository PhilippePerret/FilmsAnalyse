'use strict'
/**
  Les méthodes "show" qui permettent d'afficher les events, les documents ou les temps
**/

// Permet de se rendre au temps voulu
function showTime(time){
  current_analyse.locator.setRTime(time)
}

// Permet d'éditer ou d'afficher l'event voulu (pour le moment, de l'éditer)
function showEvent(event_id){
  current_analyse.editEvent(event_id)
}

// Permet d'éditer un document
function showDocument(doc_id){
  current_analyse.editDocument(doc_id)
}

// Permet de se rendre à une scène donnée
function showScene(numero){
  current_analyse.locator.setRTime(FAEscene.getByNumero(numero).time)
}
