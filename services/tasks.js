import { Task, User } from "../models/index.js";
import { calculateDistance } from "../utils/distance.js";
import { getId } from "../utils/jwt.js";
import { STATUS_OK, SERVER_ERROR } from "../constants/index.js";
const secretKey =
  "sk_test_51JddslSAjlEV7TUaFIQOmzPrZoPp3H9wyLKfKjwG1oaOUCqJR4q9494UOlkz1cj0vdNzjAuNPqORrgbtKTJIG5oP00cw8NehWA";
const publicKey =
  "pk_test_51JddslSAjlEV7TUa9n6qlp5fNdcHx3Lj8MS7sSM7bLIkTlkZYXzgmu0zhXZ93OJ6GIt0skAkxfgFbUMIcJnVJqW100TQ7L9y5f";

const preferredLatLngs = {
  Kormangala: {
    lat: 12.9354922,
    lng: 77.6146828,
  },
  Whitefeild: {
    lat: 12.9646087,
    lng: 77.719023,
  },
  "J P Nagar": {
    lat: 12.8897795,
    lng: 77.5430551,
  },
  Indiranagar: {
    lat: 12.97296,
    lng: 77.6294794,
  },
};
export default (app) => {
  app.get("/tasks", async (req, res) => {
    try {
      const id = getId(req.headers.authorization);
      res.status(STATUS_OK);
      let data = await Task.find({});
      if (id) {
        const {
          _doc: { preferredLocation },
        } = await User.findOne({
          _id: id,
        });
        if (preferredLocation) {
          const { lat, lng } = preferredLatLngs[preferredLocation];
          data = data.filter((item) => {
            const { sender } = item;
            const distance = calculateDistance(sender, {
              latitude: lat,
              longitude: lng,
            });
            return distance < 3;
          });
        }
      }
      data = data.reverse();
      return res.json({
        data,
      });
    } catch (e) {
      console.log(e);
      res.status(SERVER_ERROR);
      return res.end(e.toString());
    }
  });

  app.post("/tasks/create", async (req, res) => {
    function orderNumber() {
      let now = Date.now().toString();
      now += now + Math.floor(Math.random() * 10);
      return [now.slice(0, 4), now.slice(4, 10), now.slice(10, 14)].join("-");
    }
    const {
      sender,
      receiver,
      title,
      description,
      isActive,
      isCancelled,
      isDelieverd,
      isPickedUp,
    } = req.body;
    const price = 10 * Math.ceil(calculateDistance(sender, receiver));
    try {
      const task = new Task({
        sender,
        receiver,
        title,
        description,
        isActive,
        isCancelled,
        isDelieverd,
        isPickedUp,
        orderId: orderNumber(),
        price,
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

  app.post("/tasks/accept", async (req, res) => {
    const { orderId } = req.body;
    try {
      const task = await Task.findOne({
        orderId,
      });
      if (task) {
        await Task.updateOne(
          { orderId: orderId },
          { $set: { isActive: true } }
        );
      }
      res.status(STATUS_OK);
      return res.json({
        orderId: task.orderId,
        isActive: true,
      });
    } catch (e) {
      console.log(e);
      res.status(SERVER_ERROR);
      return res.end(e.toString());
    }
  });

  app.post("/tasks/pickedup", async (req, res) => {
    const { orderId } = req.body;
    try {
      const task = await Task.findOne({
        orderId,
      });
      if (task) {
        await Task.updateOne(
          { orderId: orderId },
          { $set: { isPickedUp: true } }
        );
      }
      res.status(STATUS_OK);
      return res.json({
        orderId: task.orderId,
        isPickedUp: true,
      });
    } catch (e) {
      console.log(e);
      res.status(SERVER_ERROR);
      return res.end(e.toString());
    }
  });

  app.post("/tasks/delivered", async (req, res) => {
    const { orderId } = req.body;
    try {
      const task = await Task.findOne({
        orderId,
      });
      if (task) {
        await Task.updateOne(
          { orderId: orderId },
          { $set: { isDelieverd: true } }
        );
      }
      res.status(STATUS_OK);
      return res.json({
        orderId: task.orderId,
        isDelieverd: true,
      });
    } catch (e) {
      console.log(e);
      res.status(SERVER_ERROR);
      return res.end(e.toString());
    }
  });

  app.post("/tasks/cancel", async (req, res) => {
    const { orderId } = req.body;
    try {
      const task = await Task.findOne({
        orderId,
      });
      if (task) {
        await Task.updateOne(
          { orderId: orderId },
          { $set: { isCancelled: true } }
        );
      }
      res.status(STATUS_OK);
      return res.json({
        orderId: task.orderId,
        isCancelled: true,
      });
    } catch (e) {
      console.log(e);
      res.status(SERVER_ERROR);
      return res.end(e.toString());
    }
  });
  app.post("/tasks/payment/:id", async (req, res) => {
    const { paymentMethod } = req.body;
    const { id } = req.params;
    try {
      await Task.updateOne(
        {
          _id: id,
        },
        {
          paymentMethod,
        }
      );
      return res.json({});
    } catch (e) {
      console.log(e);
      res.status(SERVER_ERROR);
      return res.end(e.toString());
    }
  });
};
