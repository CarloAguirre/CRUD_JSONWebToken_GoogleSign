import { request, response } from 'express';
import jwt from 'jsonwebtoken';
import { Usuario } from '../models/usuario.js';

//la siguiente funcion permitira validar el JWT proveniente de los headers como parametro para la eliminacion de una cuenta. La usaremos como primera validacion para hacer un usuario pueda hacer un 'delete' de cuenta.

const validarJWT = async(req = request, res = response, next)=>{

    // el token vive en el key 'Authorization' del 'header' (de la función delete)
    const token = req.header('Authorization');
    if(!token){
        return res.status(401).json({      // <--- 401 = unauthorized/sin autorización
            msg: 'No se ha especificado ningun token de validación'
        })
    }
    
    try {
        //verificaremos si el token enviado es un token valido
        //en helpers/jwt-generator establecimos la constante 'payload = {uid}' en la funcion 'generarJWT', lo que nos permite hacer lo siguiente:
        const {uid} = jwt.verify(token, process.env.JWTOKEN);

        //leer usuario autenticado (el que esta realizando la utilizacion del token y la eliminacion)
        const usuario = await Usuario.findById(uid)

        //verificar si el usuario existe
        if(!usuario){
            return res.status(401).json({
                msg: 'El usuario no existe'
            })
        }
        
        //verificar si el uid tiene 'estado: true' en mongo
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Este usuario no existe en la base de datos, no es posible procesar la solicitud'
            })
        }

        req.usuario = usuario;

        next();

    } catch (error) {
        console.log(error)
        res.status(401).json({
            msg: 'token no valido'
        })
    };
};

export{validarJWT}; 