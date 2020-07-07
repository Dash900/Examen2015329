'use strict'

var express = require("express")
var ProductoController = require("../controllers/productoController")
var md_auth = require("../middlewares/authenticated")

//SUBIR IMAGEN
var multiparty = require('connect-multiparty')

//RUTAS

/* CRUD Productos */
var api = express.Router()
api.post('/agregar-producto', md_auth.ensureAuth, ProductoController.agregarProducto);
api.put('/editar-producto/:idProducto', md_auth.ensureAuth, ProductoController.editarProducto)
api.delete('/eliminar/:idProducto', md_auth.ensureAuth, ProductoController.eliminarProducto)
api.get('/mostrar-id/:idProducto', md_auth.ensureAuth, ProductoController.mostrarProductoId)
api.get('/mostrar-todos', md_auth.ensureAuth, ProductoController.mostrarTodos)

/* Control Stock */
api.get('/control-producto/:idProducto', md_auth.ensureAuth, ProductoController.controlProducto)

/* Buscar */
api.get('/producto-cliente/:nombreProducto', md_auth.ensureAuth, ProductoController.productoCliente)



module.exports = api;


