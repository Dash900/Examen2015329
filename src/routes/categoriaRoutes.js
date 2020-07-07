'use strict'

var express = require("express")
var CategoriaController = require("../controllers/categoriaController")
var md_auth = require("../middlewares/authenticated")

//SUBIR IMAGEN
var multiparty = require('connect-multiparty')

//RUTAS
var api = express.Router()

/* CRUD Categorias */
api.post('/agregar-categoria', md_auth.ensureAuth, CategoriaController.agregarCategoria);
api.put('/editar-categoria/:idCategoria', md_auth.ensureAuth, CategoriaController.editarCategoria)
api.delete('/eliminar-categoria/:idCategoria', md_auth.ensureAuth, CategoriaController.eliminarCategoria)
api.get('/mostrar-categorias', md_auth.ensureAuth, CategoriaController.mostrarTodos)

/* Productos por Categoria */
api.get('/categoria-producto', md_auth.ensureAuth, CategoriaController.categoriaProducto )




module.exports = api;