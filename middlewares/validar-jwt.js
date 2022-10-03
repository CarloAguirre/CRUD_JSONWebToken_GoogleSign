import { request, response } from 'express';
import jwt from 'jsonwebtoken';

//la siguiente funcion permitira validar el JWT proveniente de los headers como parametro para la eliminacion de una cuenta. La usaremos como primera validacion para hacer un 'delete' de cuenta.

const validarJWT = (req = request, res = response, next)=>{

    // el token vive en el key 'Authorization' del 'header' (de la función delete)
    const token = req.header('Authorization');
    if(!token){
        return res.status(401).json({      // <--- 401 = unauthorized/sin autorización
            msg: 'No se ha especificado ningun token de validación'
        })
    }
    
    try {
        //verificaremos si el token enviado es un token valido de la cuenta logueada
        //en helpers/jwt-generator establecimos la constante 'payload = {uid}' en la funcion 'generarJWT', lo que nos permite hacer lo siguiente:
        const {uid} = jwt.verify(token, process.env.JWTOKEN);
        req.uid = uid; 

        next();

    } catch (error) {
        console.log(error)
        res.status(401).json({
            msg: 'toke no valido'
        })
    };
};

export{validarJWT}; 