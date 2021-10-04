import { User } from "../models/index.js";
import { send } from "../utils/email.js";
import { getToken, getId } from "../utils/jwt.js";
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
      let user = await User.findOne({
        email,
        phone,
        role,
      });
      if (!user) {
        user = new User({
          email,
          phone,
          role,
        });
        user = await user.save();
      }
      await User.updateOne(
        {
          _id: user._doc._id,
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
      let user = await User.findOne({
        email,
        phone,
        role,
      });
      if (!user) {
        user = new User({
          email,
          phone,
          role,
        });
        user = await user.save();
      }
      await User.updateOne(
        {
          _id: user._doc._id,
        },
        {
          otp,
        }
      );
      await send(email, `Your OTP is ${otp}`);
      res.status(STATUS_OK);
      return res.json(user);
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
      const token = getToken(user._doc._id.toString());
      res.status(STATUS_OK);
      return res.json({
        ...user._doc,
        token,
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
      const token = getToken(user._doc._id.toString());
      res.status(STATUS_OK);
      return res.json({
        ...user._doc,
        token,
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
      avatar,
      emergencyContact,
      workExperience,
      vehicleDetails,
      panCard,
      aadharCard,
      drivingLicense,
    } = req.body;
    try {
      const id = getId(req.headers.authorization);
      await User.updateOne(
        {
          _id: id,
        },
        {
          firstName,
          lastName,
          avatar,
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
        }
      );
      res.status(STATUS_OK);
      return res.json(await User.findOne({ _id: id }));
    } catch (e) {
      console.log(e);
      res.status(SERVER_ERROR);
      return res.end(e.toString());
    }
  });
};
