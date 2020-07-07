'use strict'

//VARIABLES GLOBALES
const express = require("express")
const app = express()
const bodyParser = require("body-parser")

//CARGA DE RUTAS
var user_routes = require("./routes/userRoutes")
var product_routes = require("./routes/productoRoutes")
var categoria_routes = require("./routes/categoriaRoutes")
var factura_routes = require("./routes/facturaRoutes")


//MIDDLEWARES
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

//CABECERAS
app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Acces-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method')
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE')

    next();
})

//RUTAS 
app.use('/api', user_routes, product_routes, categoria_routes, factura_routes)

//EXPORTAR
module.exports = app;