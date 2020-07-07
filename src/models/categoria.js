'use strict'

var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var CategoriaSchema = Schema({
    nombreCategoria: String,
    descripcion: String,
    producto: {type: Schema.Types.ObjectId, ref:'producto'},
})

module.exports = mongoose.model('categoria', CategoriaSchema)