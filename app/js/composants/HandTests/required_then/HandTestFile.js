'use strict'

class HandTestFile {
constructor(path, options){
  this.HTestPath = this.path = path
}

run(){
  HandTests.writePath(this.relpath)
  this.index_htest = -1
  this.nextTest() // on commence
}

/**
  Joue le test suivant
**/
nextTest(){
  HandTests.resetStepList()
  let test_id = Object.keys(this.data)[++this.index_htest]
  if(test_id){
    this.currentHTest = new HandTest(this, test_id, this.data[test_id])
    this.currentHTest.run()
  } else {
    // Fin des tests de ce fichier
    HandTests.nextHTestFile()
  }
}

get data(){return this._data||defP(this,'_data',YAML.safeLoad(fs.readFileSync(this.HTestPath,'utf8')))}
get relpath(){return this.path.replace(new RegExp(HandTests.folder),'.')}
}
