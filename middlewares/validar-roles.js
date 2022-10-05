import { response } from "express";

const validarAdminRole = (req, res = response, next)=>{

    if(!req.usuario){
        return res.status(500).json({
            msg: `Se esta intentado verificar el rol sin proporcionar un token de validación`
        })
    }

    const {rol, nombre} = req.usuario;

    if(rol !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: `SIN AUTORIZACIÓN - El usuario ${nombre} no es Administrador`
        })
    }
    next();
};


const tieneRol = (...roles)=>{
    return (req, res = response, next)=>{
        if(!req.usuario){
            return res.status(500).json({
                msg: `Se esta intentado verificar el rol sin proporcionar un token de validación`
            })
        }   

        const {rol, nombre} = req.usuario;
        if(!roles.includes(rol)){
            return res.status(401).json({
                msg: `El usuario ${nombre} no tiene un rol autorizado. El servicio requiere uno de estos roles: ${roles}`

            })
        }      
        next()
    };
};

export{validarAdminRole, tieneRol};