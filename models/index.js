import mongoose from "mongoose";
const { model, Schema } = mongoose;

const UserSchema = new Schema({
	email: String,
	phone: String,
	role: String,
	otp: String,
});

const DriverSchema = new Schema({
    firstName: String,
	lastName: String,
	fatherName: String,
	city: String,
	completeAddress: String,
	language: String,
	date: Date,
	emergencyContact: Number,
	workExperience: Number,
	vehicleDetails: String,
	panCard: String,
	aadharCard: Number,
	drivingLicense: String
})

export const User = model("User", UserSchema);

export const Driver = model("Driver", DriverSchema);
