'use strict'

var express = require("express")
var FacturaController = require("../controllers/facturaController")
var md_auth = require("../middlewares/authenticated")

//SUBIR IMAGEN
var multiparty = require('connect-multiparty')

//RUTAS
var api = express.Router()
api.post('/registrar-factura', md_auth.ensureAuth, FacturaController.registrarFactura);
api.post('/agregar-producto/:idFactura', md_auth.ensureAuth, FacturaController.agregarProducto);
api.put('/producto-usuario/:idFactura/:idProducto', md_auth.ensureAuth, FacturaController.productoUsuario)


/* Factura por Usuario */
api.get('/factura-carrito/:idUsuario', md_auth.ensureAuth, FacturaController.facturaUsuario)

/* Carrito */
api.put('/agregar-carrito/:idUsuario/:idProducto', md_auth.ensureAuth, FacturaController.agregarCarrito)
api.put('/editar-carrito/:idUsuario', md_auth.ensureAuth, FacturaController.editarCarrito)
api.delete('/eliminar-carrito/:idCarrito', md_auth.ensureAuth, FacturaController.eliminarCarrito)

/* Usuarios */
api.post('/registrar-usuarios', md_auth.ensureAuth, FacturaController.registrarUsuario)
api.put('/editar-usuarios/:idUsuario', md_auth.ensureAuth, FacturaController.editarUsuario)
api.delete('/eliminar-usuarios/:idUsuario', md_auth.ensureAuth, FacturaController.eliminarUsuario)

module.exports = api;


