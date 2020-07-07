'use strict'

var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var FacturaSchema = Schema({
    descripcion: String,
    usuario: {type: Schema.Types.ObjectId,ref: 'user'},
    numeroProductos: Number,
    productos: [{
        nombreProducto: String,
        cantidad: Number
    }]
})

module.exports = mongoose.model('factura', FacturaSchema)