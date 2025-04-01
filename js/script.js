// Obtener elementos del DOM
const cartItemsList = document.getElementById("cart-items");
const totalPriceElement = document.getElementById("total-price");

let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
let totalPrice = JSON.parse(localStorage.getItem("totalPrice")) || 0;

// Función para actualizar el carrito
function updateCart() {
  // Limpiar la lista actual de productos
  cartItemsList.innerHTML = "";

  // Si hay productos en el carrito
  if (cartItems.length > 0) {
    // Agregar productos al carrito
    cartItems.forEach((item) => {
      if (item && item.name && item.price && item.image) {
        // Verificar que el producto esté bien definido
        const li = document.createElement("li");
        li.innerHTML = `
          <img src="${item.image}" alt="${item.name}">
          <div class="product-info">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <span class="price">$${item.price}</span>
          </div>
          <button class="remove-btn" data-name="${item.name}">Eliminar</button>
        `;
        cartItemsList.appendChild(li);
      } else {
        console.error("Producto indefinido en el carrito:", item);
      }
    });
  } else {
    cartItemsList.innerHTML = "<p>Tu carrito está vacío</p>";
  }

  // Actualizar el total
  totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
}

// Función para agregar un producto al carrito
function addProductToCart(product) {
  // Validar que el producto esté correctamente definido antes de agregarlo
  if (product && product.name && product.price && product.image) {
    cartItems.push(product);
    totalPrice += product.price;

    // Guardar los datos en localStorage
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    localStorage.setItem("totalPrice", JSON.stringify(totalPrice));

    // Actualizar la vista del carrito
    updateCart();
  } else {
    console.error("Producto no válido:", product);
  }
}

// Obtener productos de la API
function fetchProducts() {
  fetch("https://api.escuelajs.co/api/v1/products")
    .then((response) => response.json())
    .then((products) => {
      if (products && Array.isArray(products) && products.length > 0) {
        const productListContainer = document.getElementById("product-list");
        products.forEach((product) => {
          const productDiv = document.createElement("div");
          productDiv.classList.add("product");

          productDiv.innerHTML = `
            <img src="${product.images[0]}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <span class="price">$${product.price}</span>
            <button class="add-to-cart-btn" data-id="${product.id}">Añadir al carrito</button>
          `;

          productListContainer.appendChild(productDiv);
        });

        // Agregar funcionalidad al botón de "Añadir al carrito"
        const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
        addToCartButtons.forEach((button) => {
          button.addEventListener("click", (e) => {
            const productId = e.target.dataset.id;
            const product = products.find((p) => p.id == productId);
            if (product) {
              addProductToCart({
                name: product.title,
                description: product.description,
                price: product.price,
                image: product.images[0],
              });
            } else {
              console.error("Producto no encontrado:", productId);
            }
          });
        });
      } else {
        console.error("No se encontraron productos válidos.");
      }
    })
    .catch((error) => console.error("Error al obtener productos:", error));
}

// Eliminar productos del carrito
cartItemsList.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-btn")) {
    const productName = e.target.dataset.name;

    // Eliminar el producto del carrito
    cartItems = cartItems.filter((item) => item.name !== productName);

    // Recalcular el precio total después de eliminar el producto
    totalPrice = cartItems.reduce((total, item) => {
      // Asegurarse de que el precio sea un número válido
      return total + (item.price || 0); // Si item.price es undefined o NaN, se sumará 0
    }, 0);

    // Guardar los datos actualizados en localStorage
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    localStorage.setItem("totalPrice", JSON.stringify(totalPrice));

    // Actualizar la vista del carrito
    updateCart();
  }
});

// Inicializar el carrito cuando la página carga
updateCart();

// Cargar productos desde la API cuando la página carga
fetchProducts();
