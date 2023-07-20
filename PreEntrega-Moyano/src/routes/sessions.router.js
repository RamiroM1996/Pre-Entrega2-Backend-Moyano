import { Router } from "express";
import session from "express-session";

const sessions = Router();

sessions.use(
	session({
		secret: "secretCoder",
		resave: true,
		saveUninitialized: true,
	})
);

// Funcion para validar usuarios:
function auth(req, res, next) {
	if (req.session?.user === "User" && req.session?.admin) {
		return next();
	};

	return res.status(401).send("Only admins can see this site")
};

// Endpoint para mostrar cuantas veces se visitó:
sessions.get("/", (req, res) => {
	try {
		if (!req.session.counter) {
			req.session.counter = 1;
			return res.status(200).send(`It's your first time`);
		}

		req.session.counter++;
		return res
			.status(200)
			.send(`You visit ${req.session.counter} times this site`);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

// Endpoint para loguearse:
sessions.get("/login", (req, res) => {
	try {
		const { user, password } = req.query;

		if (user !== "User" || password !== "Pass") {
			return res.status(500).send(`Wrong credentials`);
		};

		req.session.user = user;
		req.session.admin = true;

		return res.status(200).send(`Welcome`);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

// Endpoint privado, solo para admins:
sessions.get("/private", auth, (req, res) => {
	try {
		return res.status(200).send(`If you see this, you are admin`);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

// Endpoint para desloguearse:
sessions.get("/logout", (req, res) => {
	try {
		req.session.destroy((err) => {

			if (!err) {
				return res.status(200).send(`Logout done`);
			};

			return res.status(500).send({ status: `Logout error`, payload: err });
		});
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

export default sessions;