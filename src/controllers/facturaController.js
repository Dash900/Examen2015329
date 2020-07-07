'use strict'

var bcrypt = require("bcrypt-nodejs")
var Factura = require("../models/factura")
var Usuarios = require("../models/usuarios")
var Producto = require("../models/producto")

/*Factura*/

function registrarFactura(req, res){
    var factura = new Factura();
    var params = req.body;

    factura.user = req.user.rol

    if (req.user.rol == 'ROL_ADMINISTRADOR') {
        if(params.descripcion && params.usuario){
            factura.descripcion = params.descripcion;
            factura.usuario = params.usuario;

            factura.save((err, facturaGuardada)=>{
                if(err) return res.status(500).send({ message: 'Error en la peticion de Factura '})
                if(!facturaGuardada) return res.status(404).send({ message: 'Error al agregar la Factura'})

                if (facturaGuardada) {
                    Usuarios.findByIdAndUpdate(params.usuario, { $inc: { numeroFacturas: 1 } }, { new: true }, (err, usuarioEditado) => {
                        if (err) return res.status(500).send({ message: 'Error' })
                        if (!usuarioEditado) return res.status(404).send({ message: 'Factura no guardada' })
                        return res.status(200).send({ factura: facturaGuardada, usuario: usuarioEditado.numeroFacturas })
                    })
                }
            })
        }else{
            res.status(200).send({
                message: 'Rellene todos los datos necesarios'
            })

        }   
     }else{
        if(req.user.rol != 'ROL_ADMINISTRADOR'){
        return res.status(500).send({ message: 'Solo el administrador tiene esta funcion'})
        }
    }
}

function agregarProducto(req, res) {
    var facturaId = req.params.idFactura
    var params = req.body
    var existe = true

    Factura.findById(facturaId, (err, factura) => {
        if (err) return res.status(500).send({ message: "Error en la peticion" })
        if (!factura) return res.status(404).send({ message: "Error al encontrar la Factura" })
        if (factura) {
            for (var i = 0; i < factura.productos.length; i++) {
                if (!(factura.productos[i].nombreProducto == params.nombre)) {
                    existe = false
                }
            }
            if (existe == true) {
                Factura.findOneAndUpdate(facturaId, { $push: { productos: { nombreProducto: params.nombre, cantidad: params.cantidad } } }, { new: true }, (err, facturaActualizada) => {
                    if (err) return res.status(500).send({ message: "Error en la peticion" })
                    if (!facturaActualizada) return res.status(404).send({ message: "Error al guardar producto" })
                    return res.status(200).send({ factura: facturaActualizada })
                })
            } else {
                return res.status(500).send({ message: "El producto ya existe" })
            }
        }
    })
}

function productoUsuario(req, res) {
    var productoId = req.params.idProducto
    // var usuarioId = req.params.idUsuario  
    var facturaId = req.params.idFactura    
    var params = req.body
    var productoUsuario
    var cantidadUSuario
    var productoFactura
    var agregar = true

    if (params.cantidad) {
        Factura.findById(facturaId, (err, facturaA) => {
            if (err) return res.status(500).send({ message: "Error en la peticion" })
            if (!facturaA) return res.status(404).send({ message: "Error al encontrar Factura" })
            if (facturaA) {
                for (var i = 0; i < facturaA.productos.length; i++) {
                    if (facturaA.productos[i]._id == productoId) {
                        productoUsuario = facturaA.productos[i]._id
                        cantidadUSuario = facturaA.productos[i].cantidad
                        productoFactura = facturaA.productos[i].nombreProducto
                    }
                }
                if (cantidadUSuario == 0 || cantidadUSuario < params.cantidad) {
                    return res.status(500).send({ message: "No se puede realizar la operacion" })
                } else if (cantidadUSuario >= params.cantidad) {

                    Producto.findById(productoId, (err, users) => {
                        if (err) return res.status(500).send({ message: "Error en la peticion" })
                        if (!users) return res.status(404).send({ message: "Error al encontrar Producto" })
                        if (users) {
                            for (var i = 0; i < users.stock.length; i++) {
                                if (users.stock[i] == productoFactura) {
                                    agregar = false
                                }
                            }
                            if (agregar == true) {
                                Producto.findOneAndUpdate({ "_id": productoId }, { $push: { stock: params.cantidad } }, { new: true }, (err, usuarioActualizado) => {
                                    if (err) return res.status(500).send({ message: "Error en la peticion" })
                                    if (!usuarioActualizado) return res.status(404).send({ message: "Error al guardar producto" })
                                    Factura.findOneAndUpdate({ _id: facturaId, "productos._id": productoUsuario }, { $inc: { "productos.$.cantidad": params.cantidad * -1 } }, { new: true }, (err, productoActualizado) => {
                                        if (err) return res.status(500).send({ message: "Error en la peticion" })
                                        if (!productoActualizado) return res.status(404).send({ message: "Error al editar producto" })
                                        return res.status(200).send({ usuario: usuarioActualizado })
                                    })
                                })
                            } else {
                                return res.status(500).send({ message: "Este producto ya existe" })
                            }
                        }
                    })
                }
            }
        })
    }
}

function facturaUsuario(req, res) {
    var usuarioId = req.params.idUsuario;
    var params = req.body;

    Usuarios.findOne({_id: usuarioId, carrito:{ $elemMatch: {producto: params.producto}}},{'carrito.$': 1},(err, detalleCompra)=>{
        if(err) return res.status(500).send({ message: 'Error en la peticion'})

        if(!detalleCompra) return res.status(404).send({ message: 'Error al mostrar detalles de la Factura del Carrito'})
        return res.status(200).send({ detalleCompra })
    }).populate('factura')
}

function agregarCarrito(req, res) {
    var usuarioId= req.params.idUsuario;
    var productoId = req.params.idProducto;
    var params = req.body;
    var usuario = req.user.sub

    if(usuario != req.user.sub){
        return res.status(500).send({message: 'No tiene los permisos para actualizar este usuario'})
    }
    Usuarios.findByIdAndUpdate(usuarioId, { $push: {carrito: {producto: productoId,nombreProducto: params.nombreProducto, cantidad: params.cantidad}} }, {new: true}, (err, agregado)=>{
        if(err) return res.status(500).send({ message: 'Error en la peticion'})

        if(!agregado) return res.status(404).send({ message: 'Error al agregar al Carrito'})
        return res.status(200).send({ agregado })
    }).populate('producto')
}

function editarCarrito(req, res) {
    var usuarioId = req.params.idUsuario;
    var params = req.body;
    var usuario = req.user.sub

    if(usuario != req.user.sub){
        return res.status(500).send({message: 'No tiene los permisos para actualizar este usuario'})
    }

    Sucursal.findByIdAndUpdate(usuarioId, { $push: {carrito: {producto: params.producto, nombreProducto: params.nombreProducto, cantidad: params.cantidad}} }, {new: true}, (err, carritoEditado)=>{
        if(err) return res.status(500).send({ message: 'Error en la peticion'})

        if(!carritoEditado) return res.status(404).send({ message: 'Error al editar el Carrito'})
        return res.status(200).send({ carrito: carritoEditado }) 
    })
}

function eliminarCarrito(req, res) {
    var carritoId = req.params.idCarrito;
    var usuario = req.user.sub

    if(usuario != req.user.sub){
        return res.status(500).send({message: 'No tiene los permisos para actualizar este usuario'})
    }

    Usuarios.findOneAndUpdate({"carrito._id": carritoId},{$pull: { carrito: {_id: carritoId} }},{new: true}, (err, carritoEliminado)=>{
        if(err) return res.status(500).send({ message: 'Error en la peticion'})

        if(!carritoEliminado) return res.status(404).send({ message: 'Error al eliminar el Carrito'})
        return res.status(200).send({ carrito: carritoEliminado }) 
    })
}

/*Usuarios*/
function registrarUsuario(req, res){
    var u = new Usuario(); 
    var params = req.body; 

    u.user = req.user.rol

    if (req.user.rol == 'ROL_ADMINISTRADOR') {
        if(params.nombre && params.email && params.password){
            u.nombre = params.nombre;
            u.usuario = params.usuario;
            u.email = params.email;
            u.rol = 'ROL_CLIENTE';

                    Usuario.find({ $or: [
                        { usuario: u.usuario },
                        { email: u.email }
                    ] }).exec((err, users)=>{
                            if(err) return res.status(500).send({ message: 'Error en la peticion de usuarios' })
    
                            if(users && users.length >= 1){
                                return res.status(500).send({ message: 'El usuario ya existe'})
                            }else{
                                bcrypt.hash(params.password, null, null, (err, hash)=>{
                                    u.password = hash;
                                    
                                    u.save((err, usuarioGuardado)=>{
                                        if(err) return res.status(500).send({ message: 'Error al guardar el Usuario'})
    
                                        if(usuarioGuardado){
                                            res.status(200).send({ user: usuarioGuardado})
                                        }else{
                                            res.status(404).send({ message: 'No se ha podido registrar el usuario'})
                                        }
                                    })
                                })
                            }
                    })
                }else{
                    res.status(200).send({message: 'Rellene todos los datos necesarios'})
                }   
     }else{
        if(req.user.rol != 'ROL_ADMINISTRADOR'){
        return res.status(500).send({ message: 'Solo el administrador tiene esta funcion'})
        }
    }
}

function editarUsuario(req, res){
    var usuarioId = req.params.idUsuario;
    var rolUsuario = req.user.rol;
    var params = req.body
    var usuario = req.user.sub

    delete params.password

    if(rolUsuario === "ROL_ADMINISTRADOR"){
        if(usuario != req.user.sub){
            return res.status(500).send({message: 'No tiene los permisos para actualizar este usuario'})
        }

        Usuario.findByIdAndUpdate(usuarioId, params, { new: true }, (err, usuarioActualizado)=>{
            if(err) return res.status(500).send({ message: 'Error en la peticion' })
            if(!usuarioActualizado) return res.status(404).send({ message: 'No se a podido actualizar los datos del Usuario'})

            return res.status(200).send({ usuario: usuarioActualizado })

        })
    }else{
        res.status(200).send({ message: 'Solo el rol administrador tiene esta funcion'})
    }
}

function eliminarUsuario(req, res){
    var usuarioId = req.params.idUsuario;
    var rolUsuario = req.user.rol;
    var usuario = req.user.sub

    if(rolUsuario === "ROL_ADMINISTRADOR"){
        if(usuario != req.user.sub){
            return res.status(500).send({message: 'No tiene los permisos para actualizar este usuario'})
        }
        Usuario.findByIdAndDelete(usuarioId,(err, eliminarUsuario)=>{
            if(err) return res.status(500).send({ message: 'Error en la peticion'})
            if(!eliminarUsuario) return res.status(404).send({ message: 'No se a podido eliminar el Usuario'})

            return res.status(200).send( { usuario: eliminarUsuario})
        })
    }else{
        res.status(200).send({ message: 'Solo el rol administrador tiene esta funcion'})
    }
}


module.exports = {
    registrarFactura,
    agregarProducto,
    productoUsuario,
    facturaUsuario,
    agregarCarrito, 
    editarCarrito,
    eliminarCarrito,
    registrarUsuario,
    editarUsuario,
    eliminarUsuario

}
