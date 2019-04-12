'use strict'

class HandTestFile {
constructor(path, options){
  this.HTestPath = this.path = path

  this.ref = `<<HandTestFile relpath="${this.relpath}">>`
}

run(){
  log.info(`-> ${this.ref}#run`)
  HandTests.writePath(this.relpath)
  this.index_htest = -1
  this.nextTest() // on commence
  log.info(`<- ${this.ref}#run`)
}

/**
  Joue le test suivant
**/
nextTest(){
  log.info(`-> ${this.ref}#nextTest`)
  HandTests.resetStepList()
  let test_id = Object.keys(this.data)[++this.index_htest]
  log.info(`     this.index_htest = ${this.index_htest}`)
  log.info(`     test_id = ${test_id}`)
  if(test_id){
    this.currentHTest = new HandTest(this, test_id, this.data[test_id])
    this.currentHTest.run()
  } else {
    // Fin des tests de ce fichier
    HandTests.nextHTestFile()
  }
  log.info(`<- ${this.ref}#nextTest`)
}

get data(){return this._data||defP(this,'_data',YAML.safeLoad(fs.readFileSync(this.HTestPath,'utf8')))}
get relpath(){return this.path.replace(new RegExp(HandTests.folder),'.')}
}
