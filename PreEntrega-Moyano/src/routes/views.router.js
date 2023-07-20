// Express
import { Router } from "express";
const views = Router();

// Data
import products from "../data/products.json" assert { type: "json" };

// Endpoint para renderizar el home:
views.get("/", (req, res) => {
	try {
		res.render("home", {
			style: "styles.css",
			documentTitle: "Home",
			products,
		});
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

// Endpoint para renderizar productos con socket:
views.get("/realtimeproducts", (req, res) => {
	try {
		res.render("realTimeProducts", {
			style: "styles.css",
			documentTitle: "Socket",
		});
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

// Endpoint para renderizar chat con socket:
views.get("/chat", (req, res) => {
	try {
		res.render("chat", {
			style: "styles.css",
			documentTitle: "Chat",
		});
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

export default views;