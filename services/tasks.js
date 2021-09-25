import { Task } from "../models/index.js";
import geolib from "geolib";
import { STATUS_OK, SERVER_ERROR } from "../constants/index.js";
const secretKey =
  "sk_test_51JddslSAjlEV7TUaFIQOmzPrZoPp3H9wyLKfKjwG1oaOUCqJR4q9494UOlkz1cj0vdNzjAuNPqORrgbtKTJIG5oP00cw8NehWA";
const publicKey =
  "pk_test_51JddslSAjlEV7TUa9n6qlp5fNdcHx3Lj8MS7sSM7bLIkTlkZYXzgmu0zhXZ93OJ6GIt0skAkxfgFbUMIcJnVJqW100TQ7L9y5f";
const { getDistance, convertDistance } = geolib;
export default (app) => {
  app.get("/tasks", async (req, res) => {
    try {
      res.status(STATUS_OK);
      return res.json({
        data: await Task.find({}),
      });
    } catch (e) {
      console.log(e);
      res.status(SERVER_ERROR);
      return res.end(e.toString());
    }
  });
  app.post("/tasks/create", async (req, res) => {
    const { sender, receiver, title, description } = req.body;
    try {
      const task = new Task({
        sender,
        receiver,
        title,
        description,
        price:
          convertDistance(
            getDistance(
              {
                lat: sender.latitude,
                lng: sender.longitude,
              },
              {
                lat: receiver.latitude,
                lng: receiver.longitude,
              },
              1
            ),
            "km"
          ) * 10,
      });
      await task.save();
      res.status(STATUS_OK);
      return res.json({});
    } catch (e) {
      console.log(e);
      res.status(SERVER_ERROR);
      return res.end(e.toString());
    }
  });
  app.post("/tasks/payment/:id", async (req, res) => {
    const { id } = req.params;
    const { paymentMethod } = req.body;
    try {
      await Task.updateOne(
        {
          id,
        },
        {
          paymentMethod,
        }
      );
      res.status(STATUS_OK);
      return res.json({});
    } catch (e) {
      console.log(e);
      res.status(SERVER_ERROR);
      return res.end(e.toString());
    }
  });
};
