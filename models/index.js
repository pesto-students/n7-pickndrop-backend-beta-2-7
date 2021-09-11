import mongoose  from "mongoose";
const {model,Schema}=mongoose;
const UserSchema=new Schema({
    email:String,
    phone:String,
    role:String,
    otp:String,
    firstName:String,
			lastName:String,
			fatherName:String,
			city:String,
			completeAddress:String,
			language:String,
			date:String,
			emergencyContact:String,
			workExperience:String,
			vehicleDetails:String,
			panCard:String,
			aadharCard:String,
			drivingLicense:String,
});
export const User=model("User",UserSchema)