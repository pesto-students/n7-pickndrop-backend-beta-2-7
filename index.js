import express from "express";
import mongoose from "mongoose";
import users from "./services/users.js";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const startServer = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URL);
		const app = express();
		app.use(bodyParser.json());
		app.use(cors());
		app.use(express.static("public"));
		users(app);
		app.listen(process.env.PORT || 4000);
	} catch (e) {
		console.log(e);
	}
};
startServer();
