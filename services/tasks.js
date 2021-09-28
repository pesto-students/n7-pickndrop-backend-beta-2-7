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
		function orderNumber() {
			let now = Date.now().toString();
			now += now + Math.floor(Math.random() * 10);
			return [now.slice(0, 4), now.slice(4, 10), now.slice(10, 14)].join("-");
		}
		const { sender, receiver, title, description, isActive, isCancelled, isDelieverd, isPickedUp } = req.body;
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

	app.post("/tasks/accept", async (req, res) => {
		const { orderId } = req.body;
		try {
			const task = await Task.findOne({
				orderId,
			});
			if (task) {
				await Task.updateOne({ orderId: orderId }, { $set: { isActive: true } });
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
				await Task.updateOne({ orderId: orderId }, { $set: { isPickedUp: true } });
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
				await Task.updateOne({ orderId: orderId }, { $set: { isDelieverd: true } });
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
				await Task.updateOne({ orderId: orderId }, { $set: { isCancelled: true } });
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
};
