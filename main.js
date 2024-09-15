const btnCart = document.querySelector('.container-cart-icon');
const containerCartProducts = document.querySelector('.container-cart-products');

let allProducts = [];


document.addEventListener('DOMContentLoaded', () => {
    allProducts = JSON.parse(localStorage.getItem('allProducts')) || [];
    fetchProducts();
    showHTML();
});

btnCart.addEventListener('click', () => {
    containerCartProducts.classList.toggle('hidden-cart');
});

const cartInfo = document.querySelector('.cart-product');
const rowProduct = document.querySelector('.row-product');


const productsList = document.querySelector('.container-items');

const valorTotal = document.querySelector('.total-pagar');
const countProducts = document.querySelector('#contador-productos');

const cartEmpty = document.querySelector('.cart-empty');
const cartTotal = document.querySelector('.cart-total');

productsList.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-add-cart')) {
        const product = e.target.parentElement;

        const infoProduct = {
            quantity: 1,
            title: product.querySelector('h2').textContent,
            price: product.querySelector('p').textContent,
            
        };

        const exists = allProducts.some(product => product.title === infoProduct.title);

        if (exists) {
            const products = allProducts.map( (product) => {
                if (product.title === infoProduct.title) {
                    product.quantity++;
                    return product;
                } else {
                    return product;
                }
            });
            allProducts = [...products];
        } else {
            allProducts = [...allProducts, infoProduct];
        }

        showHTML();
    }
});

rowProduct.addEventListener('click', (e) => {
    if (e.target.classList.contains('icon-close')) {
        const product = e.target.parentElement;
        const title = product.querySelector('p').textContent;

        allProducts = allProducts.filter((product) => product.title !== title);
		console.log(allProducts);
        showHTML();
    }
});

function fetchProducts() {
    fetch('https://semana16.vercel.app/burger')
        .then(response => response.json())
        .then(data => {
            data.forEach(product => {
                const productHTML = `
                    <div class="item">
						<figure>
							<img src="${product.img}" alt="${product.name}">
						</figure>
						<div class="info-product">
							<h2>${product.name}</h2>
							<p>$${product.price}</p>
							<button class="btn-add-cart">Añadir al carrito</button>
						</div>
					</div>
                `;
                productsList.innerHTML += productHTML;
            });
        });
}

// Función para mostrar productos en el carrito
function showHTML() {
    if (!allProducts.length) {
        cartEmpty.classList.remove('hidden');
        rowProduct.classList.add('hidden');
        cartTotal.classList.add('hidden');
    } else {
        cartEmpty.classList.add('hidden');
        rowProduct.classList.remove('hidden');
        cartTotal.classList.remove('hidden');
    }

    rowProduct.innerHTML = '';

    let total = 0;
    let totalOfProducts = 0;
	let containerProduct = '';

    allProducts.forEach((product) => {
		containerProduct += `
					<div class="cart-product">
            <div class="info-cart-product">
                <span class="cantidad-producto-carrito">${product.quantity}</span>
                <p class="titulo-producto-carrito">${product.title}</p>
                <span class="precio-producto-carrito">${product.price}</span>
            </div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="icon-close"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
					</div>	
        `;
        rowProduct.innerHTML = containerProduct;

		total = total + parseInt(product.quantity * product.price.slice(1));
		totalOfProducts = totalOfProducts + product.quantity;
	});

    valorTotal.innerText = `$${total}`;
    countProducts.innerText = totalOfProducts;
    saveAllProducts();
}

function saveAllProducts() {
    localStorage.setItem('allProducts', JSON.stringify(allProducts));
}
