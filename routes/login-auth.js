import { Router } from "express";
import { check } from "express-validator";
import { login } from "../controllers/login-auth.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const authLogin = Router();

authLogin.post('/login',[
    check('correo', 'El correo es obligatorio').isEmail(),
    check("password", "La contraseña es obligatoria").not().isEmpty()
], validarCampos, login)

export{authLogin}