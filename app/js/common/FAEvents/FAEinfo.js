'use strict'

class FAEinfo extends FAEvent {
  constructor(data){
    super(data)
  }

  get resume(){return this.content}

}
