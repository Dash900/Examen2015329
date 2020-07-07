'use strict'

var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var UserSchema = Schema({
    nombre: String,
    usuario: String,
    email: String,
    password: String,
    rol: String,
    carrito:[{
        producto: {type: Schema.Types.ObjectId, ref: 'producto'},
        nombreProducto: String,
        cantidad: Number
    }],
    numeroFacturas: Number
})

module.exports = mongoose.model('user', UserSchema)