import {json, response} from 'express';
import bcryptjs from 'bcryptjs';
import { Usuario } from '../models/usuario.js';
import { generarJWT } from '../helpers/jwt-generator.js';
import { googleVerify } from '../helpers/google-verify.js';

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

        //verificar la contraseña/password hasheado
        const validacionPassword = bcryptjs.compareSync(password, usuario.password)
        if(!validacionPassword){
            return res.status(400).json({
                msg: `el password no coincide con el usuario`
            });
        };

        //generar el json web token (JWT) en base al id del usuario
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


// Google Sign In

const googleSignIn = async(req, res = response)=>{
    const {id_token} = req.body
    
    try {
        //en helpers/google-verify.js desectructuramos y renombramos los valores de name, picture y email
        const {nombre, img, correo} = await googleVerify(id_token)

        //Si el usuario no existe, crearemos uno:
        let usuario = await Usuario.findOne({correo});

        if(!usuario){
            const data = {
                correo,
                img,
                nombre,
                password: 'algo',
                google: true,
            }

            usuario = new Usuario(data);
            await usuario.save();
        }

        //si el usuario en base de datos esta en 'estado = false'/borrado
        
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'El usuario ha sido borrado/bloqeado. Si considera que es un error comuniquese con el administrador del sitio'
            })
        }

        //Generar el JWT
        const token = await generarJWT(usuario.id)

        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        res.status(400).json({
            msg: "El token de google no se pudo procesar"
        });
    }
}

export{login, googleSignIn}