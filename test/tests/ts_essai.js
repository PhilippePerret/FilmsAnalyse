const test_helper = require('../support/spectron-helper')
const app = test_helper.initialiseSpectron()

const chaiAsPromised = require('chai-as-promised')
const chai = require('chai')

global.before(function () {
    chai.should();
    chai.use(chaiAsPromised);
});

describe("Mon premier test", function(){
  before(()=>{
    return app.start()
  })
  after(()=>{
    if(app.isRunning()){return app.stop()}
  })
  it("lance l'application", function(){
    assert_equal(4, 2+2)
    return app.client.waitUntilWindowLoaded()
      .getTitle().should.eventually.equal('Analyse de films');
  })
})
