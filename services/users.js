import { Driver, User } from "../models/index.js";
import { send } from "../utils/email.js";
import { STATUS_OK, SERVER_ERROR } from "../constants/index.js";
import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage }).single("file");

export default (app) => {
  app.post("/upload", async (req, res) => {
    upload(req, res, (err) => {
      if (err) {
        res.status(500);
        return res.end(err.toString());
      }
      return res.end(
        `${req.protocol}://${req.get("host")}/download/${req.file.filename}`
      );
    });
  });
  app.get("/download/:id", async (req, res) => {
    const { id } = req.params;
    try {
      res.status(200);
      return res.end(fs.readFileSync(`${process.cwd()}/public/${id}`));
    } catch (e) {
      res.status(500);
      return res.end(e.toString());
    }
  });
  app.post("/users/authenticate", async (req, res) => {
    const { email, phone } = req.body;
    const role = "user";
    const otp = Math.floor(Math.random() * 10e5);
    try {
      const user = await User.findOne({
        email,
        phone,
        role,
      });
      if (!user) {
        const user = new User({
          email,
          phone,
          role,
        });
        await user.save();
      }
      await User.updateOne(
        {
          email,
          phone,
          role,
        },
        {
          otp,
        }
      );
      await send(email, `Your OTP is ${otp}`);
      res.status(STATUS_OK);
      return res.json({
        email,
        phone,
        role,
      });
    } catch (e) {
      console.log(e);
      res.status(SERVER_ERROR);
      return res.end(e.toString());
    }
  });
  app.post("/driver/authenticate", async (req, res) => {
    const { email, phone } = req.body;
    const role = "driver";
    const otp = Math.floor(Math.random() * 10e5);
    try {
      const user = await User.findOne({
        email,
        phone,
        role,
      });
      if (!user) {
        const user = new User({
          email,
          phone,
          role,
        });
        await user.save();
      }
      await User.updateOne(
        {
          email,
          phone,
          role,
        },
        {
          otp,
        }
      );
      await send(email, `Your OTP is ${otp}`);
      res.status(STATUS_OK);
      return res.json({
        email,
        phone,
        role,
      });
    } catch (e) {
      console.log(e);
      res.status(SERVER_ERROR);
      return res.end(e.toString());
    }
  });
  app.post("/driver/checkRegistration", async (req, res) => {
    const { email, phone } = req.body;
    const role = "driver";
    try {
      const user = await User.findOne({
        email,
        phone,
        role,
      });
      if (user) {
        throw "already Registered";
      }
    } catch (e) {
      console.log(e);
      res.status(SERVER_ERROR);
      return res.end(e.toString());
    }
  });
  app.post("/user/otp/authenticate", async (req, res) => {
    const { otp, email, phone } = req.body;
    try {
      const user = await User.findOne({
        email,
        phone,
        otp,
      });
      if (!user) {
        throw "Wrong OTP";
      }
      res.status(STATUS_OK);
      return res.json({
        email: user.email,
        phone: user.phone,
        role: user.role,
      });
    } catch (e) {
      console.log(e);
      res.status(SERVER_ERROR);
      return res.end(e.toString());
    }
  });

  app.post("/driver/otp/authenticate", async (req, res) => {
    const { otp, email, phone } = req.body;
    try {
      const user = await User.findOne({
        email,
        phone,
        otp,
      });
      if (!user) {
        throw "Wrong OTP";
      }
      res.status(STATUS_OK);
      return res.json({
        email: user.email,
        phone: user.phone,
        role: user.role,
      });
    } catch (e) {
      console.log(e);
      res.status(SERVER_ERROR);
      return res.end(e.toString());
    }
  });
  app.post("/driver/register", async (req, res) => {
    const {
      firstName,
      lastName,
      fatherName,
      city,
      preferredLocation,
      completeAddress,
      language,
      date,
      emergencyContact,
      workExperience,
      vehicleDetails,
      panCard,
      aadharCard,
      drivingLicense,
    } = req.body;
    try {
      const driver = new Driver({
        firstName,
        lastName,
        fatherName,
        city,
        preferredLocation,
        completeAddress,
        language,
        date,
        emergencyContact,
        workExperience,
        vehicleDetails,
        panCard,
        aadharCard,
        drivingLicense,
      });
      res.status(STATUS_OK);
      return res.json(await driver.save());
    } catch (e) {
      console.log(e);
      res.status(SERVER_ERROR);
      return res.end(e.toString());
    }
  });
};
