import {response} from 'express';
//bcryptjs nos permite 'hashear' o encriptar el password
import bcryptjs from 'bcryptjs';
import {Usuario} from '../models/usuario.js';


//El método GET envía la información en la propia URL
const getUsuario = async(req, res = response) => {    // igualamos 'res' a 'response'para tener sus propiedades (render, json, etc..)

    //const{nombre, apkey, page = 1} = req.query; <--- los params del query viven en "req.query" (podemos definir valores por defecto)

    //Paginacion: del req extraeremos "limite" el cual sera igual al "limit" (numero de resultados), asi como otros params
    const {limite = 5, desde=0} = req.query;

    /* 
    const usuarios = await Usuario.find({estado: true})
        .limit(Number(limite))
        .skip(Number(desde))
   
    const total = await Usuario.countDocuments({estado: true})
    */
   
   //Podemos reducir el tiempo de ejecusion de las 2 promesas anteriores enviandolas como una coleccion de promesas:
   const [total, usuarios] = await Promise.all([
       //podemos extraer el total de registros de la instancia/modelo Usuario, excepto aquellos cuyo estado sea 'false'
       Usuario.countDocuments({estado: true}),
       Usuario.find({estado: true})
       //parsearemos los params a "Number" ya que al recibirlo del req.query PODRIA venir como un "String", y DEBE SER NUMERICO
            .limit(Number(limite))
            .skip(Number(desde))
       
    ]);

    res.json({                                  
        total,
        usuarios
    });
};

// El método PUT se usa para crear un recurso con un URI conocido o para reemplazar completamente un recurso conocido
const putUsuario = async(req, res = response)=> { 
    
    const {id} = req.params;             // el 'id' dinamico de la ruta vive en los "req.params.id"
    const {password, google,_id, ...resto} = req.body;

    if(password){
        //encriptamos la contraseña
        var salt = bcryptjs.genSaltSync(10);
        resto.password = bcryptjs.hashSync(password, salt); 
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto, {new: true}) // <--- el primer parametro es el id, y el segundo son los argumentos que vamos actualizar
    
    res.status(500).json({                               
        msg: 'put API',
        resto
    })
};

// El método POST se utiliza para crear una nueva entidad, DEBE SER UNA FUNCION ASYNC
const postUsuario =  async(req, res = response)=> { 

    const {nombre, correo, password, rol}= req.body;      // lo que se envie como .json desde el body vive en "req.body"
    const usuario = new Usuario({nombre, correo, password, rol});


    //encriptamos la contraseña
    var salt = bcryptjs.genSaltSync(10);
    usuario.password = bcryptjs.hashSync(password, salt);

    //debemos guardar la nueva instancia de "Usuario" en la Base de Datos
    await usuario.save();
    
    res.json(usuario);
};

// Es un complemento del método PUT. Se utiliza para actualizar los recursos conocidos localmente
const patchUsuario=  (req, res = response)=> {    
    res.json({                                
        msg: 'patch API'
    })
}

const deleteUsuario =  async(req, res = response)=> { 
    
    const {id} = req.params;
    // borrar fisicamente (no aconsejable):
    //const usuario = await Usuario.findByIdAndDelete(id)

    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false})

    res.json({                                
        usuario
    })
};

export{
    getUsuario,
    putUsuario,
    postUsuario,
    patchUsuario,
    deleteUsuario
}