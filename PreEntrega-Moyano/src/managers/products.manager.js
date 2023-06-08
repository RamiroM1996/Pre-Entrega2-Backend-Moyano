import fs from "fs";

export default class ProductsManager {
	#products;
	#path;

	constructor(fileName) {
		this.#products = [];
		this.#path = `./src/${fileName}.json`;
	};

	getProducts() {

		if (!fs.existsSync(this.#path)) {
			try {
				
				fs.writeFileSync(this.#path, JSON.stringify(this.#products));
			} catch (err) {
				return `Writing error while getting products: ${err}`;
			};
		};

		
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

		
		if (products.length > 0) {
			const lastId = products.reduce((maxId, product) => {
				return product.id > maxId ? product.id : maxId;
			}, 0);
			return lastId;
		};

		
		return 0;
	};

	addProduct(newProduct) {
		try {
			const products = this.getProducts();
			
			
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
		
			
			if (products.some(product => product.code == newProduct.code)) {
				return `The code ${newProduct.code} already exists`;
			};
		
			
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

			
			if (!product) {
				return `There's no product with ID ${id}`;
			};

			
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

			
			if (productIndex === -1) {
				return `There's no product with ID ${id}`;
			};

			
			products.splice(productIndex, 1);
			fs.writeFileSync(this.#path, JSON.stringify(products));
			return `Cart ${id} deleted`;
		} catch (err) {
			return `Writing error while deleting the product ${id}: ${err}`;
		};
	};
};