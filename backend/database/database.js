import mongoose from "mongoose";
export async function connectDB(){
    try{
        await mongoose.connect(`${process.env.MONGO_URI}MalikPetShop`)
        console.log("Database connected");
    }catch(error){
        console.log("Problem with the database")
        console.log(error)
    }
}