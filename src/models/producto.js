'use strict'

var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var ProductoSchema = Schema({
    nombreProducto: String,
    descripcion: String,
    stock: Number,
    factura: {type: Schema.Types.ObjectId, ref: 'factura'}
})

module.exports = mongoose.model('producto', ProductoSchema)