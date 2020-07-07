'use strict'

var Producto = require('../models/producto')
var Factura = require('../models/factura')


function agregarProducto(req, res){
    var producto = new Producto();
    var params = req.body;

    producto.user = req.user.rol

    if (req.user.rol == 'ROL_ADMINISTRADOR') {
        if(params.nombreProducto && params.descripcion){
            producto.nombreProducto = params.nombreProducto;
            producto.descripcion = params.descripcion;
            producto.stock = params.stock;
            producto.factura = params.factura;
            producto.categoria = params.categoria;  

            producto.save((err, productoGuardado)=>{
                if(err) return res.status(500).send({ message: 'Error en la peticion de Producto '})
                if(!productoGuardado) return res.status(404).send({ message: 'Error al agregar el Producto'})

                if (productoGuardado) {
                    Factura.findByIdAndUpdate(params.factura, { $inc: { numeroProductos: 1 } }, { new: true }, (err, facturaEditada) => {
                        if (err) return res.status(500).send({ message: 'Error' })
                        if (!facturaEditada) return res.status(404).send({ message: 'Producto no guardado' })
                        return res.status(200).send({ producto: productoGuardado, factura: facturaEditada.numeroProductos })
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

function editarProducto(req, res){
    var productoId = req.params.idProducto;
    var rolUsuario = req.user.rol;
    var params = req.body

    if(rolUsuario === "ROL_ADMINISTRADOR"){
        Producto.findByIdAndUpdate(productoId, params, { new: true }, (err, productoActualizado)=>{
            if(err) return res.status(500).send({ message: 'Error en la peticion' })
            if(!productoActualizado) return res.status(404).send({ message: 'No se a podido actualizar los datos del Alumno'})

            return res.status(200).send({ producto: productoActualizado })

        }).populate('categoria')
    }else{
        if(rolUsuario != 'ROL_ADMINISTRADOR'){
        return res.status(500).send({ message: 'Solo el administrador tiene esta funcion'})
        }
    }
}

function eliminarProducto(req, res){
    var productoId = req.params.idProducto;
    var rolUsuario = req.user.rol;

    if(rolUsuario === "ROL_ADMINISTRADOR"){
        Producto.findByIdAndDelete(productoId,(err, eliminarProducto)=>{
            if(err) return res.status(500).send({ message: 'Error en la peticion'})
            if(!eliminarProducto) return res.status(404).send({ message: 'No se a podido eliminar el Producto'})

            return res.status(200).send( { producto: eliminarProducto})
        }).populate('categoria')
    }else{
        if(rolUsuario != 'ROL_ADMINISTRADOR'){
        return res.status(500).send({ message: 'Solo el administrador tiene esta funcion'})
        }
    }
}

function mostrarProductoId(req, res){
    var productoId = req.params.idProducto;
    var rolUsuario = req.user.rol;

    if(rolUsuario === "ROL_ADMINISTRADOR"){
        Producto.findById(productoId,(err, verId)=>{
            if(err) return res.status(500).send({ message: 'Error en la peticion'})
            if(!verId) return res.status(404).send({ message: 'No se a podido mostrar el Producto'})

            return res.status(200).send({ producto: verId})
        }).populate('categoria')
    }else{
        if(rolUsuario != 'ROL_ADMINISTRADOR'){
        return res.status(500).send({ message: 'Solo el administrador tiene esta funcion'})
        }
    }
}

function mostrarTodos(req, res){
    var rolUsuario = req.user.rol;

    if(rolUsuario === "ROL_ADMINISTRADOR"){
        Producto.find((err, verTodos)=>{
            if(err) return res.status(500).send({ message: 'Error en la peticion'})
            if(!verTodos) return res.status(404).send({ message: 'No se a podido mostrar todas los Productos'})
    
            return res.status(200).send( { productos: verTodos})
        }).populate('categoria')
    }else{
        if(rolUsuario != 'ROL_ADMINISTRADOR'){
        return res.status(500).send({ message: 'Solo el administrador tiene esta funcion'})
        }
    }
}

function controlProducto(req,res) {
    var productoId = req.params.idProducto;
    var rolUsuario = req.user.rol;
    
     if(rolUsuario === "ROL_ADMINISTRADOR"){
        Producto.findById(productoId,{"stock": 1},(err,contador)=>{
             if(err) return res.status(500).send({message:'Error en la peticion '})
             if(!contador) return res.status(404).send({message:'Error en la peticion del control'})
             
             return res.status(500).send({contador})
        }).populate('categoria')
    }else{
         if(rolUsuario != 'ROL_ADMINISTRADOR'){
         return res.status(500).send({ message: 'Solo el administrador tiene esta funcion'})
         }
    }
}

function productoCliente(req,res) {
    var productoNombre = req.params.nombreProducto;
    var rolUsuario = req.user.rol;
    
     if(rolUsuario === "ROL_CLIENTE"){
        Producto.find({nombreProducto:{$regex: productoNombre}},(err, verProductoN)=>{
            if(err) return res.status(500).send({ message: 'Error en la peticion'})
            if(!verProductoN) return res.status(404).send({ message: 'No se a podido mostrar el Nombre del Producto'})

            return res.status(200).send({ producto: verProductoN})
        }).populate('categoria')
    }else{
         return res.status(500).send({ message: 'Necesita ser un Cliente registrado'})
    }
}



module.exports = {
    agregarProducto,
    editarProducto,
    eliminarProducto,
    mostrarProductoId,
    mostrarTodos,
    controlProducto,
    productoCliente
}