'use strict'

const path = require('path')
const Application = require('spectron').Application
// const chaiAsPromised = require('chai-as-promised')
// const chai = require('chai')

function initialiseSpectron() {
   let electronPath = path.join(__dirname, "../../node_modules", ".bin", "electron");
   // const appPath = path.join(__dirname, "../../dist/osx/Films-darwin-x64/Films.app/Contents/MacOS/Films");
   const appPath = path.join(__dirname,'..')
   if (process.platform === "win32") {
       electronPath += ".cmd";
   }
   return new Application({
       path: electronPath,
       args: [appPath],
       env: {
           ELECTRON_ENABLE_LOGGING: true,
           ELECTRON_ENABLE_STACK_DUMPING: true,
           NODE_ENV: "development"
       },
       startTimeout: 20000,
       chromeDriverLogPath: '../chromedriverlog.txt'
  });
}
//
// global.before(function () {
//     chai.should();
//     chai.use(chaiAsPromised);
// });

module.exports = {
  initialiseSpectron: initialiseSpectron
}
