import { Task } from "../models/index.js";
import geolib from "geolib";
import { STATUS_OK, SERVER_ERROR } from "../constants/index.js";
const { getDistance } = geolib;
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
};
