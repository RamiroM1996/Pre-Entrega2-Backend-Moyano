import fs from "fs";

export default class CartsManager {
	#carts;
	#path;

	constructor(fileName) {
		this.#carts = [];
		this.#path = `./src/data/${fileName}.json`;
	};

	getCarts() {
		// Validar si existe el archivo:
		if (!fs.existsSync(this.#path)) {
			try {
				// Si no existe, crearlo:
				fs.writeFileSync(this.#path, JSON.stringify(this.#carts));
			} catch (err) {
				return `Writing error while getting carts: ${err}`;
			};
		};

		// Leer archivo y convertirlo en objeto:
		try {
			const data = fs.readFileSync(this.#path, "utf8");
			const dataArray = JSON.parse(data);
			return dataArray;
		} catch (err) {
			return `Reading error while getting carts: ${err}`;
		};
	};

	lastId() {
		const carts = this.getCarts();

		// Obtener y devolver último ID:
		if (carts.length > 0) {
			const lastId = carts.reduce((maxId, cart) => {
				return cart.id > maxId ? cart.id : maxId;
			}, 0);
			return lastId;
		};

		// Si el array está vacío, devolver 0:
		return 0;
	};

	addCart() {
		try {
			const carts = this.getCarts();
			const id = this.lastId() + 1;
			const newCart = {
				id: id,
				products: []
			};

			// Agregar carrito y escribir el archivo:
			carts.push(newCart);
			fs.writeFileSync(this.#path, JSON.stringify(carts));
			return `Cart added with ID ${id}`;
		} catch (err) {
			return `Writing error while adding the cart: ${err}`;
		};
	};

	getCartById(id) {
		try {
			const carts = this.getCarts();
			const cart = carts.find(cart => cart.id === id);
	
			// Validar si el carrito existe:
			if (!cart) {
				return `There's no cart with ID ${id}`;
			};
			return cart.products;
		} catch (err) {
			return `Reading error while getting cart ${id}: ${err}`;
		};
	};

	addProductToCart(cartId, productId) {
		try {
			const carts = this.getCarts();
			const cart = carts.find(cart => cart.id === cartId);

			const product = cart.products.find(product => product.product === productId);

			// Validar si el producto ya está agregado:
			if (product) {
				product.quantity += 1;
			} else {
				// Si no, agregarlo:
				const newProduct = {
					product: productId,
					quantity: 1,
				};
				cart.products.push(newProduct);
			};
			fs.writeFileSync(this.#path, JSON.stringify(carts));
			return `Product ${productId} added to cart ${cartId}`;
		} catch (err) {
			return `Writing error while adding the product ${productId} to cart ${cartId}: ${err}`;
		};
	};

	deleteCart(cartId, productId) {
		try {
			const carts = this.getCarts();
			const cart = carts.find(cart => cart.id === cartId);

			// Validar ID de carrito:
			if (!cart) {
				return `There's no cart with ID ${cartId}`;
			};

			const productToDelete = cart.products.find(item => item.product === productId);

			// Validar ID de producto:
			if (!productToDelete) {
				return `There's no product ${productId} in cart ${cartId}`;
			};

			// Si es correcto, filtrar carrito, borrar producto y escribir el archivo:
			const filteredCart = cart.products.filter(item => {
				return (
					item.product !== productToDelete.product ||
					item.quantity !== productToDelete.quantity
				);
			});
			cart.products = filteredCart;
			fs.writeFileSync(this.#path, JSON.stringify(carts));
			return `Product ${productId} deleted from cart ${cartId}.`;
		} catch (err) {
			return `Writing error while deleting the cart ${cartId}: ${err}`;
		};
	};
};