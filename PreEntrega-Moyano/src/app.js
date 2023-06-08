import express from "express";
import carts from "./routes/carts.router.js";
import products from "./routes/products.router.js";

const app = express();
const port = 8080;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/static", express.static("../public"));
app.use("/api/products", products);
app.use("/api/carts", carts);

app.get("/", (req, res) => {
	res.send("Bienvenido");
});

app.listen(port, () => {
	console.log(`Server listening on http://localhost:${port}`);
});