import fs from "fs";

export default class CartsManager {
	#carts;
	#path;

	constructor(fileName) {
		this.#carts = [];
		this.#path = `./src/${fileName}.json`;
	};

	getCarts() {
		
		if (!fs.existsSync(this.#path)) {
			try {
				
				fs.writeFileSync(this.#path, JSON.stringify(this.#carts));
			} catch (err) {
				return `Writing error while getting carts: ${err}`;
			};
		};

		
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

		
		if (carts.length > 0) {
			const lastId = carts.reduce((maxId, cart) => {
				return cart.id > maxId ? cart.id : maxId;
			}, 0);
			return lastId;
		};

		
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

			
			if (product) {
				product.quantity += 1;
			} else {
				
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

	deleteCart(id) {
		try {
			const carts = this.getCarts();
			const cartIndex = carts.findIndex(cart => cart.id === id);

			
			if (cartIndex === -1) {
				return `There's no cart with ID ${id}`;
			};

			
			carts.splice(cartIndex, 1);
			fs.writeFileSync(this.#path, JSON.stringify(carts));
			return `Cart deleted`;
		} catch (err) {
			return `Writing error while deleting the cart ${id}: ${err}`;
		};
	};
};