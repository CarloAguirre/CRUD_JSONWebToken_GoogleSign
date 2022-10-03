import {response} from 'express';
import bcryptjs from 'bcryptjs';
import { Usuario } from '../models/usuario.js';
import { generarJWT } from '../helpers/jwt-generator.js';

const login = async(req, res = response)=>{

    const {password, correo}= req.body
    try {

        //verificar si el correo existe
        const usuario = await Usuario.findOne({correo})
        if(!usuario){
            return res.status(400).json({
                msg: `el correo ${correo} no se encuentra registrado`
            })
        };

        //verificar si el usuario esta activo
        if(!usuario.estado){
            return res.status(400).json({
                msg: `el usuario no existe o ha sido eliminado`
            })
        };

        //verificar la contraseña/password
        const validacionPassword = bcryptjs.compareSync(password, usuario.password)
        if(!validacionPassword){
            return res.status(400).json({
                msg: `el password no coincide con el usuario`
            });
        };

        //generar el json web toke (JWT) en base al id del usuario
        const token = await generarJWT(usuario.id)
        
        res.json({
            msg: "auth ok",
            usuario, 
            token
        });
        
    } catch (error) {
        console.log(error);
        return res.json({
            mesg: "Por favor comuniquese con el administrador del sitio"
        })
    };
};

export{login}