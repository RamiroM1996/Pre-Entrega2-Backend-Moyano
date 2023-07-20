import { Router } from "express";
import cookieParser from "cookie-parser";

const cookies = Router();
cookies.use(cookieParser("CoderS3cR3tC0D3"));

// Endpoint para crear una cookie:
cookies.get("/set", (req, res) => {
	try {
		res.cookie("New cookie", "This is a cookie", {
			maxAge: 5000,
			signed: true,
		});
		return res.status(200).send(`Cookie setted`);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

// Endpoint para obtener una cookie:
cookies.get("/get", (req, res) => {
	try {
		return res.status(200).send(req.signedCookies);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

// Endpoint para borrar una cookie:
cookies.get("/delete", (req, res) => {
	try {
		res.clearCookie("New cookie");
		return res.status(200).send(`Cookie removed`);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

export default cookies;