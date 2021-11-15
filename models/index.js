import mongoose from "mongoose";
const { model, Schema } = mongoose;

const UserSchema = new Schema({
  email: String,
  phone: String,
  role: String,
  otp: String,
  firstName: String,
  lastName: String,
  fatherName: String,
  city: String,
  preferredLocation: String,
  completeAddress: String,
  language: String,
  date: Date,
  emergencyContact: Number,
  workExperience: Number,
  vehicleDetails: String,
  avatar: String,
  userId: String,
  panCard: String,
  aadharCard: Number,
  drivingLicense: String,
});

const TaskSchema = new Schema({
  sender: {
    address: String,
    phoneNo: String,
    latitude: Number,
    longitude: Number,
    name: String,
  },
  receiver: {
    address: String,
    phoneNo: String,
    latitude: Number,
    longitude: Number,
    name: String,
  },
  title: String,
  description: String,
  price: Number,
  orderId: String,
  isActive: Boolean,
  isCancelled: Boolean,
  isPickedUp: Boolean,
  isDelieverd: Boolean,
  paymentMethod: Object,
});

export const Task = model("Task", TaskSchema);
export const User = model("User", UserSchema);
