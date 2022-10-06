
import { Schema, model } from "mongoose";


const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatorio']
    },
    img:{
        type: String
    },
    rol: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        enum: ['ADMIN_ROLE', 'USER_ROLE']
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
})

/* Schema de mongoose, transforma nuestra constante (UsuarioSchema) en un JSON por default mediante un metodo 
interno llamado .toJSON. 
Lo que haremos a continuacioin es sobre-escribir este metodo a fin de obviar los valores '__v,' y 'password' */

UsuarioSchema.methods.toJSON = function(){ // <--- debemos utilizar una funcion normal para que 'this' apunte dentro del scope
    //extraeremos todos los valores de usuario excepto '__v,' y 'password'. Ademas, renombraremos '_id' por 'uid'
    //toObject() transformara la informacion en un objeto literal de JS
    const {__v, password, _id,...usuario} = this.toObject(); 
    usuario.uid = _id;
    return usuario;
};

const Usuario = model('Usuario', UsuarioSchema) // <--- el nombre de la coleccion debe comenzar con mayuscula

export{
    Usuario
}

