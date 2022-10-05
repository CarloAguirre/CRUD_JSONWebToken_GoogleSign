// esta funcionalidad de express nos permitira "enrutar"
import { Router } from "express";
import { check } from "express-validator";

import { deleteUsuario, getUsuario, patchUsuario, postUsuario, putUsuario } from "../controllers/users.js";
import { validarCorreo, validarUsuarioPorId } from "../helpers/db-validators.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRol, validarAdminRole } from "../middlewares/validar-roles.js";


const router = Router()

router.get('/', getUsuario);  

router.put('/:id',[      //<--- : nos permite crear un endpoint dinamico, el cual desestructuraremos en "controllers/users put"
    //validaremos el que el formato del id sea un formato de mongo id
    check('id', 'No es un ID valido').isMongoId(),
    //validaremos que el id enviado existe en la base de datos
    check('id').custom(id => validarUsuarioPorId(id)),
    //check('rol').custom(rol => validarRol(rol)),   <-- podriamos validar el rol si es necesario
    validarCampos
], putUsuario);     

//podemos enviar los middlewares como un segundo argumento (en forma de arreglo). Utilizaremos check() de express-validator
router.post('/',[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe tener al menos 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es valido').isEmail(), 
    check('correo').custom(correo => validarCorreo(correo)),
    //check('rol', 'El rol no es válido').isIn(['ADMIN_ROLE', "USER_ROLE"]), <--- Esta linea esta optimizada en la linea siguiente
    check('rol').custom(rol => validarRol(rol)),
    // Validaremos primero si los check(), enviado como middleware envian o no errores.
    validarCampos
], postUsuario);

router.patch('/', patchUsuario);

router.delete('/:id', [
    validarJWT,
    //validarAdminRole,
    tieneRol('ADMIN_ROLE', 'USER_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(id => validarUsuarioPorId(id)),
    validarCampos
],deleteUsuario);



export{
    router
}