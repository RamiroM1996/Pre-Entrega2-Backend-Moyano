import { Router } from "express";
import { messageModel } from "../dao/mongo/models/messages.model.js";

const messages = Router();

// Endpoint para crear una cookie:
messages.get("/", async (req, res) => {
	try {
		const result = await messageModel.find();
		return res.status(200).json({ status: "success", payload: result });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

// Endpoint para obtener una cookie:
messages.delete("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		await messageModel.deleteOne({ _id: id });

		const result = await messageModel.find();
		return res.status(200).json({ status: "success", payload: result });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

export default messages;