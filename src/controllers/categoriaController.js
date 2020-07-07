'use strict'

var Categoria = require('../models/categoria')


function agregarCategoria(req, res){
    var categoria = new Categoria();
    var params = req.body;

    categoria.user = req.user.rol

    if (req.user.rol == 'ROL_ADMINISTRADOR') {
        if(params.nombreCategoria && params.descripcion){
            categoria.nombreCategoria = params.nombreCategoria;
            categoria.descripcion = params.descripcion;
            categoria.producto = params.producto;

            categoria.save((err, categoriaGuardada)=>{
                if(err) return res.status(500).send({ message: 'Error en la peticion '})
                if(!categoriaGuardada) return res.status(404).send({ message: 'Error al agregar la Categoria'})    
                return res.status(200).send({ categoria: categoriaGuardada})
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

function editarCategoria(req, res){
    var categoriaId = req.params.idCategoria;
    var rolUsuario = req.user.rol;
    var params = req.body

    if(rolUsuario === "ROL_ADMINISTRADOR"){
        Categoria.findByIdAndUpdate(categoriaId, params, { new: true }, (err, categoriaGuardada)=>{
            if(err) return res.status(500).send({ message: 'Error en la peticion' })
            if(!categoriaGuardada) return res.status(404).send({ message: 'No se a podido actualizar los datos de la Categoria'})

            return res.status(200).send({ categoria: categoriaGuardada })
        })
    }else{
        if(rolUsuario != 'ROL_ADMINISTRADOR'){
        return res.status(500).send({ message: 'Solo el administrador tiene esta funcion'})
        }
    }

}

function eliminarCategoria(req, res){
    var categoriaId = req.params.idCategoria;
    var rolUsuario = req.user.rol;

    if(rolUsuario === "ROL_ADMINISTRADOR"){
        Categoria.findByIdAndDelete(categoriaId,(err, eliminarCategoria)=>{
            if(err) return res.status(500).send({ message: 'Error en la peticion'})
            if(!eliminarCategoria) return res.status(404).send({ message: 'No se a podido eliminar la Categoria'})
            
            return res.status(200).send( { categoria: eliminarCategoria})

        })
    }else{
        if(rolUsuario != 'ROL_ADMINISTRADOR'){
        return res.status(500).send({ message: 'Solo el administrador tiene esta funcion'})
        }
    }
}

function mostrarTodos(req, res){
    var rolUsuario = req.user.rol;

    if(rolUsuario === "ROL_ADMINISTRADOR"){
        Categoria.find((err, verTodos)=>{
            if(err) return res.status(500).send({ message: 'Error en la peticion'})
            if(!verTodos) return res.status(404).send({ message: 'No se a podido mostrar todas las Categorias'})
    
            return res.status(200).send( { categoria: verTodos})
        })
    }else{
        if(rolUsuario != 'ROL_ADMINISTRADOR'){
        return res.status(500).send({ message: 'Solo el administrador tiene esta funcion'})
        }
    }
}

function categoriaProducto(req, res) {
    var rolUsuario = req.user.rol;
    
    if(rolUsuario === "ROL_CLIENTE"){
        Categoria.find({},{nombreCategoria: 1, producto: 1}, (err, busqueda)=>{
            if(err) return res.status(500).send({message: 'Error en la peticion'})
            if(!busqueda) return res.status(404).send({ message: 'No se a podido mostrar la busqueda'})
    
            return res.status(200).send({categoria: busqueda})
        }).populate('producto','nombreProducto')
   }else{
        return res.status(500).send({ message: 'Necesita ser un Cliente registrado'})
   }
}


module.exports = {
    agregarCategoria,
    editarCategoria,
    eliminarCategoria,
    mostrarTodos,
    categoriaProducto
}