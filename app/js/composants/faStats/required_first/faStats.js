'use strict'
/**
  Class FAStats
**/

class FAStats {
/**
  @param {Instance} owner   Une instance d'un objet de l'analyse, comme un
                            brin, un document, un event, etc.
**/
constructor(owner){
  this.a = this.analyse = current_analyse
  this.owner = owner
}

/**
  Retourne le temps de présence de l'élément, en fonction des scènes dans
  lesquelles il se trouve, ou en fonction de sa durée si elle est définie.
  Note : recalculé chaque fois, donc ne pas abuser
**/
tempsPresence(){
  return this.otimePresence.horloge_as_duree
}

pourcentagePresence(){
  return asPourcentage(this.a.duration, this.otimePresence.seconds)
}

get otimePresence(){
  return new OTime(this.owner.duration || this.owner.duree || this.calcDuree())
}

/**
  On calcule le temps de présence en fonction des scènes de l'élément
**/
calcDuree(){
  if('undefined' !== typeof this.owner.scene){
    return this.owner.scene.duree
  } else if ('undefined' !== typeof this.owner.scenes){
    var duree = 0
    for(var scene of this.owner.scenes) duree += scene.duree
    return duree
  } else {
    let msg_err = `Impossible de trouver la durée d'un élément de type "${this.owner.type || this.owner.constructor.name}". Il devrait posséder au moins une propriété 'scene' (renvoyant l'instance FAEscene) ou 'scenes' (renvoyant la liste Array des instances FAEscene).`
    log.error(msg_err/*, backtrace*/)
    F.error(msg_err)
    return 0
  }
}


}
