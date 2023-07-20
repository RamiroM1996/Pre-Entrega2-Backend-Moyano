import { Router } from "express";
import { cartModel } from "../dao/mongo/models/cart.model.js";
import { productModel } from "../dao/mongo/models/product.model.js";

const carts = Router();

// Endpoint para obtener todos los carritos:
carts.get("/", async (req, res) => {
	try {
		let result = await cartModel.find();
		return res.status(200).json({ status: "success", payload: result });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

// Endpoint para obtener un carrito según ID:
carts.get("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		let result = await cartModel.findById(id);

		if (!result) {
			return res.status(200).send(`There's no cart with ID ${id}`);
		};

		return res.status(200).json({ status: "success", payload: result });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

// Endpoint para agregar un carrito:
carts.post("/", async (req, res) => {
	try {
		const result = await cartModel.create({
			products: [],
		});

		return res.status(200).json({ status: "success", payload: result });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

// Endpoint para agregar un producto a un carrito segun IDs:
carts.post("/:cid/product/:pid", async (req, res) => {
	try {
		const { cid, pid } = req.params;
		const newProduct = await productModel.findById(pid);
		const cart = await cartModel.findById(cid);

		// Validar si el producto existe en el carrito:
		const productInCart = await cart.products.find(product => product.code === newProduct.code);

		// Si no existe, crearlo:
		if (!productInCart) {
			const create = {
				$push: { products: { code: newProduct.code, quantity: 1 } },
			};
			await cartModel.findByIdAndUpdate({ _id: cid }, create);

			const result = await cartModel.findById(cid);
			return res.status(200).json({ status: "success", payload: result });
		};

		// Si existe, aumentar la cantidad en una unidad:
		await cartModel.findByIdAndUpdate(
			{ _id: cid },
			{ $inc: { "products.$[elem].quantity": 1 } },
			{ arrayFilters: [{ "elem.code": newProduct.code }] }
		);

		const result = await cartModel.findById(cid);
		return res.status(200).json({ status: "success", payload: result });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

// Endpoint para borrar un carrito según ID:
carts.delete("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		await cartModel.deleteOne({ _id: id });
		const result = await cartModel.find();
		return res.status(200).json({ status: "success", payload: result });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

export default carts;
