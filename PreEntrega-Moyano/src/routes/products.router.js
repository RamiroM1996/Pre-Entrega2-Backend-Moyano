import { Router } from "express";
import ProductsManager from "../managers/products.manager.js";

const productsManager = new ProductsManager("products");
const products = Router();


products.get("/", async (req, res) => {
	try {
		const { limit } = req.query;
		const products = await productsManager.getProducts();
		if (limit) {
			
			const limitedProducts = products.slice(0, limit);
			return res.status(200).json(limitedProducts);
		};
		
		return res.status(200).json(products);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});


products.get("/:pid", async (req, res) => {
	try {
		
		const { pid } = req.params;
		const productId = parseInt(pid);
		const product = await productsManager.getProductById(productId);
		return res.status(200).json(product);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});


products.post("/", async (req, res) => {
	try {
		
		const newProduct = req.body;
		const postResponse = productsManager.addProduct(newProduct);

		
		return res.status(200).json(postResponse);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});


products.put("/:pid", async (req, res) => {
	try {
		
		const { pid } = req.params;
		const productId = parseInt(pid);
		const updatedFields = req.body;
		const putResponse = productsManager.updateProduct(productId, updatedFields);

		
		return res.status(200).json(putResponse);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});


products.delete("/:pid", async (req, res) => {
	try {
		
		const { pid } = req.params;
		const productId = parseInt(pid);
		const deleteResponse = productsManager.deleteProduct(productId);

		
		return res.status(200).json(deleteResponse);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

export default products;