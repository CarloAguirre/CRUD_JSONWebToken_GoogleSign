import express from 'express'
import cors from 'cors';
import { router } from '../routes/users.js';
import { authLogin } from '../routes/login-auth.js';
import { dbConnection } from '../database/config.js';


class Server{
    
    constructor(){
        //constantes
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';
        this.authPath     = '/api/auth';

        // Constructores //

        //conectar a la base de datos
        this.conectarDB();
        //middlewares
        this. middlewares();
        //rutas de la aplicacion
        this.routes();
    };
    
    // METODOS //

    async conectarDB(){
        await dbConnection()
    };
    
    middlewares(){
        this.app.use(cors());       // <--- ayuda a controlar el intercambio de recursos HTTP (evita errores cross domain acces)
        this.app.use(express.static('public'))

        //lectura y parseo del body
        this.app.use(express.json())

    };
    
    //rutas
    routes(){
        this.app.use(this.usuariosPath, router)
        //validacion de login
        this.app.use(this.authPath, authLogin)
    };

    listen(){
        this.app.listen(this.port, ()=>{
            console.log(`Listening on port ${this.port}`)
        })
    };

};

export{
    Server
}