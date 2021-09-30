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
});

const ImageSchema = new Schema({
    img:
    {
        data: Buffer,
        contentType: String
    }
})

export const Task = model("Task", TaskSchema);
export const User = model("User", UserSchema);
export const Driver = model("Driver", DriverSchema);
export const Image = model("Image", ImageSchema);
