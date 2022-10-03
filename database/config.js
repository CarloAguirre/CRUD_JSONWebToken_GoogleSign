import mongoose from "mongoose";

const dbConnection = async()=>{
    //haremos todo dentro de un try y catch por posible error

    try {

        await mongoose.connect(process.env.MONGODB);

        console.log('base de datos online')
        
        
    } catch (error) {

        console.log(error)
        throw new Error('Error en la base de datos');
        
    }
}


export{
    dbConnection
}