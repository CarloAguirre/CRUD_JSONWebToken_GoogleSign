// Este archivo suele tener elo mismo nombre que la coleccion de la base de datos pero sin la 's'

import { Schema, model } from "mongoose";

const RoleSchema = Schema({
    rol:{
        type: String,
        required: [true, 'El rol es obligatorio']
    }
});

const Role = model('Role', RoleSchema);

export{ Role };
