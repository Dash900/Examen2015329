'use strict'

var express = require("express")
var UsuarioController = require("../controllers/userController")
var md_auth = require("../middlewares/authenticated")

//SUBIR IMAGEN
var multiparty = require('connect-multiparty')

//RUTAS
var api = express.Router()
api.post('/registrar-admin', UsuarioController.registrar);
api.post('/login', UsuarioController.login)



module.exports = api;


