import { Router } from "express";
import { productModel } from "../dao/mongo/models/product.model.js";

const products = Router();

// Endpoint para obtener todos los productos:
products.get("/", async (req, res) => {
	try {
		const result = await productModel.find();
		return res.status(200).json({ status: "success", payload: result });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

// Endpoint para obtener un producto según ID:
products.get("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const result = await productModel.findById(id);

		if (!result) {
			return res.status(200).send(`There's no product with ID ${id}`);
		};

		return res.status(200).json({ status: "success", payload: result });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

// Endpoint para agregar un producto:
products.post("/", async (req, res) => {
	try {
		const { title, description, code, price, stock, category } = req.body;

		if (
			!title ||
			!description ||
			!code ||
			!price ||
			!stock ||
			!category ||
			!price
		) {
			return res.status(200).send(`Please complete all the fields to create a product`);
		};

		const result = await productModel.create({
			title,
			description,
			code,
			price,
			stock,
			category,
		});

		return res.status(200).json({ status: "success", payload: result });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

// Endpoint para actualizar un producto según ID:
products.put("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { title, description, code, price, stock, category } = req.body;
		const product = await productModel.findById(id);

		if (!product) {
			return res.status(200).send(`There's no product with ID ${id}`);
		};

		if (
			!title ||
			!description ||
			!code ||
			!price ||
			!stock ||
			!category ||
			!price
		) {
			return res.status(200).send(`Please complete all the fields to update a product`);
		};
		
		const newproduct = {
			title,
			description,
			code,
			price,
			stock,
			category,
		};
		await productModel.updateOne({ _id: id }, newproduct);

		const result = await productModel.findById(id);
		return res.status(200).json({ status: "success", payload: result });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

// Endpoint para borrar un producto según ID:
products.delete("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		await productModel.deleteOne({ _id: id });

		const result = await productModel.find();
		return res.status(200).json({ status: "success", payload: result });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

export default products;
