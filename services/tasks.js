import { Task } from "../models/index.js";
import { send } from "../utils/email.js";
import { STATUS_OK, SERVER_ERROR } from "../constants/index.js";
export default (app) => {
  app.post("/tasks/create", async (req, res) => {
    const { sender, receiver, title, description } = req.body;
    try {
      const task = new Task({
        sender,
        receiver,
        title,
        description,
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
