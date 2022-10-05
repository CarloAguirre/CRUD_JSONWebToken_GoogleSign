import jwt from 'jsonwebtoken';

const generarJWT = (uid = '')=>{

    return new Promise((resolve, reject)=>{
        
        //en el modelo "user" cambiamos '_id' por 'uid'
        const payload = {uid};
        
        //la firma funciona en base a una promesa con callback
        jwt.sign(payload, process.env.JWTOKEN, {
            expiresIn: '4h'
        }, (err, token)=>{
            if(err){
                console.log(err)
                reject('No fue posible generar el Token');
            }else{
                resolve(token);
            };
        });
    });
};


export{
    generarJWT
}