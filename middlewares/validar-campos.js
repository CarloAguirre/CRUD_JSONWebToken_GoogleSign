import { validationResult } from 'express-validator';

// Validara primero si los check(), enviado como middleware en routes/user envia o no errores.
const validarCampos = (req, res, next)=>{

    const errors = validationResult(req);
    if( !errors.isEmpty()){
        return res.status(400).json(errors)
    }

    //Se utiliza next como tercer argumento para proceder con lo quye continua
    next();
}

export{ 
    validarCampos 
};