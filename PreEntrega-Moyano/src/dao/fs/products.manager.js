import fs from "fs";

export default class ProductsManager {
	#products;
	#path;

	constructor(fileName) {
		this.#products = [];
		this.#path = `./src/data/${fileName}.json`;
	};

	getProducts() {
		// Validar si existe el archivo:
		if (!fs.existsSync(this.#path)) {
			try {
				// Si no existe, crearlo:
				fs.writeFileSync(this.#path, JSON.stringify(this.#products));
			} catch (err) {
				return `Writing error while getting products: ${err}`;
			};
		};

		// Leer archivo y convertirlo en objeto:
		try {
			const data = fs.readFileSync(this.#path, "utf8");
			const dataArray = JSON.parse(data);
			return dataArray;
		} catch (err) {
			return `Reading error while getting products: ${err}`;
		};
	};

	lastId() {
		const products = this.getProducts();

		// Obtener y devolver último ID:
		if (products.length > 0) {
			const lastId = products.reduce((maxId, product) => {
				return product.id > maxId ? product.id : maxId;
			}, 0);
			return lastId;
		};

		// Si el array está vacío, devolver 0:
		return 0;
	};

	addProduct(newProduct) {
		try {
			const products = this.getProducts();
			
			// Validar campos incompletos:
			if (
				!newProduct.title ||
				!newProduct.description ||
				!newProduct.code ||
				!newProduct.price ||
				!newProduct.status ||
				!newProduct.stock ||
				!newProduct.category
			) {
				return `Please fill all the required fields to add a product`;
			};
		
			// Validar si el código existe:
			if (products.some(product => product.code == newProduct.code)) {
				return `The code ${newProduct.code} already exists`;
			};
		
			// Si es correcto, agregar producto con ID y escribir el archivo:
			const id = this.lastId() + 1;
			newProduct.id = id;
			const product = newProduct;
			products.push(product);
			fs.writeFileSync(this.#path, JSON.stringify(products));
			return `Product ${newProduct.id} added`;
		} catch (err) {
			return `Writing error while adding the product: ${err}`;
		};
	};

	getProductById(id) {
		try {
		const products = this.getProducts();
		const product = products.find(product => product.id === id);

		// Validar si el producto existe:
		if (!product) {
			return `There's no product with ID ${id}`;
		}
		return product;
		} catch (err) {
			return `Reading error while getting the product ${id}: ${err}`;
		};
	};

	updateProduct(id, updatedFields) {
		try {
			const products = this.getProducts();
			const product = products.find(product => product.id === id);

			// Validar ID:
			if (!product) {
				return `There's no product with ID ${id}`;
			};

			// Si es correcto, actualizar fields y escribir el archivo:
			for (const key in updatedFields) {
				if (key.toLowerCase() === "id") {
					return `You can't update the ID field`;
				};

				if (!product.hasOwnProperty(key)) {
					return `Some field/s doesn't exist/s`;
				};

				product[key] = updatedFields[key];
			};
			fs.writeFileSync(this.#path, JSON.stringify(products));
			return `Product ${id} updated`;
		} catch (err) {
			return `Writing error while updating the product ${id}: ${err}`;
		};
	};

	deleteProduct(id) {
		try {
			const products = this.getProducts();
			const productIndex = products.findIndex(product => product.id === id);

			// Validar ID:
			if (productIndex === -1) {
				return `There's no product with ID ${id}`;
			};

			// Si es correcto, borrar producto y escribir el archivo:
			products.splice(productIndex, 1);
			fs.writeFileSync(this.#path, JSON.stringify(products));
			return `Product ${id} deleted`;
		} catch (err) {
			return `Writing error while deleting the product ${id}: ${err}`;
		};
	};
};