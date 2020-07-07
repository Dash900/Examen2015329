'user strict'

//IMPORTS
var bcrypt = require("bcrypt-nodejs")
var Usuario = require('../models/admin')
var Usuarios = require('../models/usuarios')
var jwt = require("../services/jwt")

function registrar(req, res){
    var user = new Usuario(); 
    var params = req.body; 

    if(params.nombre && params.email && params.password){
        user.nombre = params.nombre;
        user.usuario = params.usuario;
        user.email = params.email;
        user.rol = 'ROL_ADMINISTRADOR';

                Usuario.find({ $or: [
                    { usuario: user.usuario },
                    { email: user.email }
                ] }).exec((err, users)=>{
                        if(err) return res.status(500).send({ message: 'Error en la peticion de usuarios' })

                        if(users && users.length >= 1){
                            return res.status(500).send({ message: 'El usuario ya existe'})
                        }else{
                            bcrypt.hash(params.password, null, null, (err, hash)=>{
                                user.password = hash;
                                
                                user.save((err, usuarioGuardado)=>{
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
            }
}

function login(req, res){
    var params = req.body;

        Usuario.findOne({email:params.email}, (err, usuario)=>{
            if(err) return res.status(500).send({ message: 'Error en la peticion'})

            if(usuario){
                bcrypt.compare(params.password, usuario.password, (err, check)=>{
                    if(check){
                        if(params.gettoken){
                            return res.status(200).send({
                                token: jwt.createToken(usuario)
                            })
                        }else{
                            usuario.password = undefined;
                            return res.status(200).send({ usuario })
                        }
                    }else{
                        return res.status(404).send({ message: 'El usuario no se a podido identificar'})
                    }
                })
            }else{
                if(usuario){
                return res.status(404).send({ message: 'El usuario no se a podido logear'})
                }else{
                    Usuarios.findOne({email:params.email}, (err, usuario)=>{
                        if(err) return res.status(500).send({ message: 'Error en la peticion'})
                        if(usuario){
                            bcrypt.compare(params.password, usuario.password, (err, check)=>{
                                if(check){
                                    if(params.gettoken){
                                        return res.status(200).send({
                                            token: jwt.createToken(usuario)
                                        })
                                    }else{
                                        usuario.password = undefined;
                                        return res.status(200).send({ usuario })
                                    }
                                }else{
                                    return res.status(404).send({ message: 'El usuario no se a podido identificar'})
                                }
                            })
                        }else{
                            return res.status(404).send({ message: 'El usuario no se a podido logear'})
                        }
                    })
                }
            }
        })
}

module.exports = {
    registrar,
    login
}