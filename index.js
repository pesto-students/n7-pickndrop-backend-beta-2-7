import express from "express";
import mongoose from "mongoose";
import users from './services/users.js'
import bodyParser from 'body-parser'
const url="mongodb+srv://dbUser:dbUserPassword@cluster0.xdwsy.mongodb.net/dbName?retryWrites=true&w=majority";
const startServer=async ()=>{
    try{
        await mongoose.connect(url);
        const app=express();
        app.use(bodyParser.json());
        users(app);
        app.listen(4000);
    }catch(e){
        console.log(e);
    }
}
startServer();