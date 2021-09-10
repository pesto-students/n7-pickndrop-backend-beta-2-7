import mongoose  from "mongoose";
const {model,Schema}=mongoose;
const UserSchema=new Schema({
    email:String,
    phone:String,
    role:String,
    otp:String
});
export const User=model("User",UserSchema)