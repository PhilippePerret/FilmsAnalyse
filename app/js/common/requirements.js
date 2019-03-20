'use strict'

const electron  = require('electron')
const remote    = electron.remote
const DIALOG    = remote.dialog
const ipc       = electron.ipcRenderer
const path      = require('path')
const fs        = require('fs')
const YAML      = require('js-yaml')
const glob      = require('glob')

const exec = require('child_process').exec


let ScreenWidth, ScreenHeight
