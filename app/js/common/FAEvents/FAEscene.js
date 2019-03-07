'use strict'

class FAEscene extends FAEvent {
  constructor(data){
    super(data)
    this.decor = data.decor
    this.effet = data.effet
    this.lieu  = data.lieu
  }

  get resume(){return this.content}

}
